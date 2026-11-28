import { useEffect, useState,cache } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./steps.css";

// URL of your Cloudflare Worker that talks to Gemini.
const PROXY_URL = "https://fragrant-voice-29db.hahahatdug711.workers.dev/";

const prettify = (s) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// What we ask Gemini for. It must come back in the shape the page renders.
const buildPrompt = (recipe) =>
  `Write cooking instructions for the Filipino dish "${recipe.name}".
Main ingredients: ${(recipe.main_ingredients ?? []).join(", ")}.
Cooking method: ${(recipe.cooking_method ?? []).join(", ")}.
Return ONLY JSON in this exact shape, with 3 to 6 steps and 2 to 5 short sub-instructions per step:
[{"index":1,"step":"Short step title","sub":["Detailed instruction"]}]`;

// Turn Gemini's text reply into the steps array the page uses.
const parseSteps = (text) => {
  const cleaned = text.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
  const data = JSON.parse(cleaned);
  const list = Array.isArray(data) ? data : data.steps;
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error("No steps were returned");
  }
  return list.map((s, i) => ({
    index: s.index ?? i + 1,
    step: String(s.step ?? ""),
    sub: Array.isArray(s.sub) ? s.sub.map(String) : [],
  }));
};

export default function Steps() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const recipe = state?.recipe ?? null;

  // Cooking steps fetched from the API.
  const [generatedSteps, setGeneratedSteps] = useState([]);
  const [stepsLoading, setStepsLoading] = useState(false);
  const [stepsError, setStepsError] = useState(null);
  const [attempt, setAttempt] = useState(0); // bump to retry

  // Which sub-instructions / ingredients the cook has ticked off.
  const [doneTasks, setDoneTasks] = useState({});
  const [haveIngredients, setHaveIngredients] = useState({});

  // Runs automatically when this page opens (and again when "Try again" is pressed).
  useEffect(() => {
    if (!recipe) return;
    if (Array.isArray(recipe.steps) && recipe.steps.length > 0) return; // already has steps

    // Reuse steps fetched earlier in this browser session instead of calling the API again.
    const cacheKey = `cb-steps:${recipe.id ?? recipe.name}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setGeneratedSteps(JSON.parse(cached));
        return;
      }
    } catch {
      /* storage unavailable or bad cache: just fetch */
    }

    let cancelled = false;
    setStepsLoading(true);
    setStepsError(null);

    (async () => {
      try {
        const res = await fetch(PROXY_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: buildPrompt(recipe), json: true }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);

        const parsed = parseSteps(data.text);
        if (cancelled) return;
        setGeneratedSteps(parsed);
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(parsed));
        } catch {
          /* ignore */
        }
      } catch (err) {
        if (!cancelled) setStepsError(err.message || "Something went wrong");
      } finally {
        if (!cancelled) setStepsLoading(false);
      }
    })();

    // If the user leaves the page mid-request, ignore the late response.
    return () => {
      cancelled = true;
    };
  }, [recipe, attempt]);

  const toggle = (setter, key) =>
    setter((prev) => ({ ...prev, [key]: !prev[key] }));

  if (!recipe) {
    return (
      <div className="cb-page">
        <div className="cb-empty">
          <p>No recipe selected.</p>
          <button type="button" className="cb-btn" onClick={() => navigate(-1)}>
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  const steps =
    Array.isArray(recipe.steps) && recipe.steps.length > 0
      ? recipe.steps
      : generatedSteps;

  const totalTasks = steps.reduce((n, s) => n + (s.sub?.length ?? 0), 0);
  const doneCount = Object.values(doneTasks).filter(Boolean).length;
  const percent = totalTasks ? Math.round((doneCount / totalTasks) * 100) : 0;

  const facts = [
    { label: "Flavor", value: (recipe.flavor_profile ?? []).map(prettify).join(", ") },
    { label: "Occasion", value: (recipe.occasion ?? []).map(prettify).join(", ") },
    { label: "Method", value: (recipe.cooking_method ?? []).map(prettify).join(", ") },
    { label: "Serves", value: recipe.servings ? String(recipe.servings) : "" },
  ].filter((f) => f.value);

  const ingredients = recipe.main_ingredients ?? [];

  return (
    <div className="cb-page">
      {/* ---------- Top bar ---------- */}
      <nav className="cb-topbar cb-noprint">
        <button type="button" className="cb-link" onClick={() => navigate(-1)}>
          ← Back to recipes
        </button>
        <button type="button" className="cb-link" onClick={() => window.print()}>
          Print recipe
        </button>
      </nav>

      {/* ---------- Hero / dish introduction ---------- */}
      <header className="cb-hero">
        <div className="cb-hero-text">
          <p className="cb-eyebrow">
            {(recipe.type ?? []).map(prettify).join(" · ") || "Recipe"}
          </p>
          <h1 className="cb-title">{recipe.name}</h1>
          <p className="cb-lede">{recipe.description}</p>

          {(recipe.tags ?? []).length > 0 && (
            <ul className="cb-tags">
              {recipe.tags.map((t) => (
                <li key={t}>#{t.replace(/\s+/g, "")}</li>
              ))}
            </ul>
          )}
        </div>

        <figure className="cb-figure">
          <img className="cb-img" src={recipe.image_url} alt={recipe.name} />
          {recipe.image_credit && (
            <figcaption className="cb-credit">{recipe.image_credit}</figcaption>
          )}
        </figure>
      </header>

      {/* ---------- At a glance ---------- */}
      {facts.length > 0 && (
        <dl className="cb-facts">
          {facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {/* ---------- Ingredients + Method ---------- */}
      <div className="cb-body">
        <aside className="cb-ingredients">
          <h2 className="cb-h2">Ingredients</h2>
          <p className="cb-hint cb-noprint">Tick off what you have on hand.</p>
          <ul className="cb-checklist">
            {ingredients.map((ing) => (
              <li key={ing}>
                <label className={`cb-task ${haveIngredients[ing] ? "is-done" : ""}`}>
                  <input
                    type="checkbox"
                    checked={!!haveIngredients[ing]}
                    onChange={() => toggle(setHaveIngredients, ing)}
                  />
                  <span className="cb-box" aria-hidden="true" />
                  <span className="cb-task-text">{ing}</span>
                </label>
              </li>
            ))}
          </ul>
        </aside>

        <section className="cb-method" aria-labelledby="cb-method-title" aria-live="polite">
          <div className="cb-method-head">
            <h2 className="cb-h2" id="cb-method-title">
              Method
            </h2>
            {steps.length > 0 && (
              <div className="cb-progress cb-noprint">
                <div
                  className="cb-bar"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percent}
                  aria-label="Cooking progress"
                >
                  <span style={{ width: `${percent}%` }} />
                </div>
                <span className="cb-progress-text">
                  {doneCount} of {totalTasks} done
                </span>
                {doneCount > 0 && (
                  <button
                    type="button"
                    className="cb-link"
                    onClick={() => setDoneTasks({})}
                  >
                    Reset
                  </button>
                )}
              </div>
            )}
          </div>

          {stepsLoading && (
            <p className="cb-status">Writing your cooking steps...</p>
          )}

          {!stepsLoading && stepsError && (
            <div className="cb-status">
              <p>Couldn't load the steps. {stepsError}</p>
              <button
                type="button"
                className="cb-btn"
                onClick={() => setAttempt((n) => n + 1)}
              >
                Try again
              </button>
            </div>
          )}

          {steps.length > 0 && (
            <ol className="cb-steps">
              {steps.map((s, i) => {
                const base = s.index ?? i + 1;
                const subs = s.sub ?? [];
                const allDone =
                  subs.length > 0 && subs.every((_, j) => doneTasks[`${base}-${j}`]);

                return (
                  <li className={`cb-step ${allDone ? "is-done" : ""}`} key={base}>
                    <span className="cb-num" aria-hidden="true">
                      {String(base).padStart(2, "0")}
                    </span>
                    <div className="cb-step-body">
                      <h3 className="cb-step-title">{s.step}</h3>
                      <ul className="cb-checklist">
                        {subs.map((text, j) => {
                          const key = `${base}-${j}`;
                          return (
                            <li key={key}>
                              <label
                                className={`cb-task ${doneTasks[key] ? "is-done" : ""}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={!!doneTasks[key]}
                                  onChange={() => toggle(setDoneTasks, key)}
                                />
                                <span className="cb-box" aria-hidden="true" />
                                <span className="cb-task-text">{text}</span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          {percent === 100 && (
            <p className="cb-finish cb-noprint">
              That's everything. Enjoy your {recipe.name}!
            </p>
          )}
        </section>
      </div>
    </div>
  );
}