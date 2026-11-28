import { useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import "./DailyRecipe.css";

const API_URL = "https://filipino-food-api.ryodgie.workers.dev/v1/dishes";

const prettify = (s) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// The API may return a bare array or wrap it in an object. Same helper as RecipeFinder.
const extractList = (data) => {
  if (Array.isArray(data)) return data;
  return data?.dishes ?? data?.data ?? data?.results ?? [];
};

// Whole days since 1970 for the user's LOCAL date, so the pick changes at
// the user's midnight rather than at UTC midnight.
const localDayNumber = (d = new Date()) =>
  Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);

// Same recipe all day, a different one tomorrow. Sorting by id first keeps the
// order stable even if the API returns recipes in a different order. Recipes
// rotate one per day and none repeats until every recipe has been shown.
const pickDaily = (list) => {
  if (!list.length) return null;
  const sorted = [...list].sort((a, b) =>
    String(a.id).localeCompare(String(b.id))
  );
  return sorted[localDayNumber() % sorted.length];
};

export default function DailyRecipe() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0); // bump to retry
  const navigator = useNavigate();
  const rdr = () =>{
    navigator("/steps",
      {
        state: {recipe:recipe}
      }
    );

  }
  useEffect(() => {
    const controller = new AbortController();
    const datedKey = localDayNumber().toString();
    console.log(datedKey);
    try{
      const cached = sessionStorage.getItem(datedKey);
      if(cached) 
      {
        const parsed = JSON.parse(cached);
        if(parsed){
        setRecipe(JSON.parse(cached));
        setLoading(false)
        setError(null)
        console.log(cached)
        //console.log(cached.id)
        return;
        }
        
      }
        
    }
    catch{
      console.log("nothing Cached for the meantime")
    }
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        const data = await response.json();
        const pickedRecipe = pickDaily(extractList(data));
        setRecipe(pickedRecipe);
        //setRecipe(pickDaily(extractList(data)));
        if(pickedRecipe){
          try{
          sessionStorage.setItem(datedKey,JSON.stringify(pickedRecipe))
        }
        catch(err){
          console.log(err)
        }
        }
        
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message || "Something went wrong");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
        
      }
    })();

    return () => controller.abort();
  }, [attempt]);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="dr-page">
      <header className="dr-header">
        <h1 className="dr-page-title">Today's recipe</h1>
        <p className="dr-date">{today}</p>
      </header>

      <main aria-live="polite">
        {loading && <p className="dr-status">Picking today's recipe...</p>}

        {!loading && error && (
          <div className="dr-status">
            <p>Couldn't load today's recipe: {error}</p>
            <button
              type="button"
              className="dr-btn"
              onClick={() => setAttempt((n) => n + 1)}
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && !recipe && (
          <p className="dr-status">No recipes are available right now.</p>
        )}

        {!loading && !error && recipe && (
          <article className="dr-card">
            <img className="dr-img" src={recipe.image_url} alt={recipe.name} />

            <div className="dr-body">
              <div className="dr-tags">
                {(recipe.type ?? []).map((t) => (
                  <span className="dr-tag dr-tag-type" key={t}>
                    {prettify(t)}
                  </span>
                ))}
                {(recipe.cooking_method ?? []).map((m) => (
                  <span className="dr-tag" key={m}>
                    {prettify(m)}
                  </span>
                ))}
              </div>

              <h2 className="dr-name">{recipe.name}</h2>
              <p className="dr-desc">{recipe.description}</p>

              {(recipe.main_ingredients ?? []).length > 0 && (
                <section>
                  <h3 className="dr-sub">Main ingredients</h3>
                  <ul className="dr-ingredients">
                    {recipe.main_ingredients.map((ing) => (
                      <li key={ing}>{ing}</li>
                    ))}
                  </ul>
                </section>
              )}

              <dl className="dr-meta">
                {(recipe.flavor_profile ?? []).length > 0 && (
                  <div>
                    <dt>Flavor</dt>
                    <dd>{recipe.flavor_profile.map(prettify).join(", ")}</dd>
                  </div>
                )}
                {(recipe.occasion ?? []).length > 0 && (
                  <div>
                    <dt>Occasion</dt>
                    <dd>{recipe.occasion.map(prettify).join(", ")}</dd>
                  </div>
                )}
              </dl>
              <button className="cookButton" onClick={rdr}>Use Recipe</button>
              
              
            </div>
          </article>
        )}
      </main>
    </div>
  );
}