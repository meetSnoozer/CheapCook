import { useMemo, useState,useRef, useEffect } from "react";
import appetizer from '../assets/appetizer.jpg';
import bev from '../assets/bev.jpg';
import bread from '../assets/bread.jpg';
import breakfast from '../assets/breakfast.jpg';
import condiment from '../assets/condiment.jpg';
import desser from '../assets/desser.jpg';
import kakanin from '../assets/kakanin.jpg';
import main from '../assets/main.jpg';
import noodle from '../assets/noodle.jpg';
import rice from '../assets/rice.jpg';
import side from '../assets/side.jpg';  
import snack from '../assets/snack.jpg';
import soup from '../assets/soup.jpg';
import streetfood from '../assets/streetfood.jpg';
import { useNavigate } from "react-router-dom";
import "./RecipeFinder.css";

const API_URL = "https://filipino-food-api.ryodgie.workers.dev/v1/dishes";

const MEAL_TYPES = [
  { label: "Main Dish", value: "main_dish",img:main },
  { label: "Soup", value: "soup",img:soup },
  { label: "Dessert", value: "dessert",img:desser },
  { label: "Snack", value: "snack",img:snack },
  { label: "Appetizer", value: "appetizer",img:appetizer },
  { label: "Breakfast", value: "breakfast",img:breakfast },
  { label: "Rice Dish", value: "rice_dish",img:rice },
  { label: "Noodle Dish", value: "noodle_dish",img:noodle },
  { label: "Kakanin", value: "kakanin",img:kakanin },
  { label: "Bread Pastry", value: "bread_pastry",img:bread },
  { label: "Side Dish", value: "side_dish",img:side },
  { label: "Condiment", value: "condiment",img:condiment },
  { label: "Beverage", value: "beverage",img:bev },
  { label: "Street Food", value: "street_food",img:streetfood},
];
const UNITS = ["pcs", "g", "kg", "cup", "tbsp", "tsp", "ml", "L", "slices", "cloves"];

const newRow = () => ({
  id: crypto.randomUUID(),
  name: "",
  amount: "",
  unit: "pcs",
});

const norm = (s) => s.trim().toLowerCase();

// "soy sauce" matches "soy sauce", "pork" matches "pork belly", etc.
const ingredientsMatch = (a, b) => a.includes(b) || b.includes(a);

const prettify = (s) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// The API may return a bare array or wrap it in an object. Adjust if yours differs.
const extractList = (data) => {
  if (Array.isArray(data)) return data;
  return data?.dishes ?? data?.data ?? data?.results ?? [];
};

export default function RecipeFinder() {
  
  const [rows, setRows] = useState([newRow()]);
  const [mealType, setMealType] = useState("");
  const [filterByIngredients, setFilterByIngredients] = useState(false);
  const [searched, setSearched] = useState(false);

  // Fetched recipes live in the component, so the cards below can see them.
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateRow = (id, field, value) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  const addRow = () => setRows((prev) => [...prev, newRow()]);

  const removeRow = (id) =>
    setRows((prev) => (prev.length === 1 ? [newRow()] : prev.filter((r) => r.id !== id)));

  const reset = () => {
    setRows([newRow()]);
    setMealType("");
    setFilterByIngredients(true);
    setSearched(false);
    setRecipes([]);
    setError(null);
  };
  const nav = useNavigate();
  const startCook=(recipe)=>{
    console.log(recipe?.name);
    //console.log(recipe);
    nav("/steps",{
      state:{recipe:recipe}
    });
  }
  const recipesRef = useRef(null);
  {/**
    const scroll2Recipes = (type) =>{
    setMealType(type);
    recipesRef.current?.scrollIntoView({behavior:"smooth",block:"start"});
  }
    
    */}
  
 
  // A normal async function (not a hook), so it can be called from an event handler.
  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = mealType
        ? `${API_URL}?type=${encodeURIComponent(mealType)}`
        : API_URL;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Request failed (${response.status})`);

      const data = await response.json(); // json() is a method: needs ()
      setRecipes(extractList(data));
    } catch (err) {
      setError(err.message || "Something went wrong");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const results = useMemo(() => {
    if (!searched) return [];

    const userIngredients = rows
      .filter((r) => r.name.trim())
      .map((r) => ({ ...r, key: norm(r.name) }));

    return recipes
      .filter((recipe) => !mealType || recipe.type?.includes(mealType))
      .map((recipe) => {
        const matched = [];
        const missing = [];

        (recipe.main_ingredients ?? []).forEach((ing) => {
          const hit = userIngredients.find((u) => ingredientsMatch(norm(ing), u.key));
          if (hit) matched.push({ name: ing, user: hit });
          else missing.push(ing);
        });

        return { recipe, matched, missing };
      })
      // Filter ON: only show recipes that use at least one of the user's
      // ingredients (or every recipe of the type if none were entered).
      // Filter OFF: show every recipe of the chosen type.
      .filter((r) => !filterByIngredients || r.matched.length > 0)
      .sort(
        (a, b) =>
          b.matched.length / (b.recipe.main_ingredients?.length || 1) -
          a.matched.length / (a.recipe.main_ingredients?.length || 1)
      );
  }, [searched, rows, mealType, filterByIngredients, recipes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearched(true);
    fetchRecipes();
  };
   useEffect(()=>{
    
    recipesRef.current?.scrollIntoView({behavior:"smooth",block:"start"});
    //console.log(mealType)
  },[results])

  return (
    <div className="rf-page">
      <h1 className="rf-title">What can I cook?</h1>
      <p className="rf-subtitle">
        Tell us what you have and what kind of meal you want.
      </p>

      <form className="rf-form" onSubmit={handleSubmit}>
        <h2 className="rf-section">Your ingredients</h2>

        {rows.map((row) => (
          <div className="rf-row" key={row.id}>
            <input
              className="rf-input rf-name"
              type="text"
              placeholder="Ingredient (e.g. pork)"
              value={row.name}
              onChange={(e) => updateRow(row.id, "name", e.target.value)}
              aria-label="Ingredient name"
            />
            <input
              className="rf-input rf-amount"
              type="number"
              min="0"
              step="any"
              placeholder="Portion"
              value={row.amount}
              onChange={(e) => updateRow(row.id, "amount", e.target.value)}
              aria-label="Portion amount"
            />
            <select
              className="rf-input rf-unit"
              value={row.unit}
              onChange={(e) => updateRow(row.id, "unit", e.target.value)}
              aria-label="Portion unit"
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="rf-icon-btn"
              onClick={() => removeRow(row.id)}
              aria-label="Remove ingredient"
            >
              ✕
            </button>
          </div>
        ))}

        <button type="button" className="rf-link-btn" onClick={addRow}>
          + Add another ingredient
        </button>

        <h2 className="rf-section">Type of meal</h2>

        {/* ... 
        <select
          className="rf-input rf-meal"
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          aria-label="Meal type"
        >
          <option value="">Any meal type</option>
          {MEAL_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        */}
        <div className="TypeSelection">
          {MEAL_TYPES.map((mType)=>(
            <button className={`mealTypeBtn ${mealType===mType.value ? "is-selected" : ""}`} onClick={()=>setMealType(mType.value)} key={mType.value}>
              
              
            <div>
              <h3 className="rf-card-title mTxt">{mType.label}</h3>
              <p className="rf-desc mTxt1">recipe.description</p>
              <img src={mType.img} />
            </div>
            </button>
          ))}
            
        </div>

        <div className="rf-actions">
          <button type="submit" className="rf-btn rf-primary" disabled={loading}>
            {loading ? "Searching..." : "Find recipes"}
          </button>
          <button type="button" className="rf-btn" onClick={reset}>
            Reset
          </button>
        </div>
      </form>

      <section className="rf-results" aria-live="polite">
        <label className="rf-toggle">
          <input
            type="checkbox"
            role="switch"
            checked={filterByIngredients}
            onChange={(e) => setFilterByIngredients(e.target.checked)}
          />
          <span className="rf-switch" aria-hidden="true" />
          <span className="rf-toggle-text">
            Filter by my ingredients
            <small>
              {filterByIngredients
                ? "Showing only recipes that use what you have"
                : "Showing all available recipes"}
            </small>
          </span>
        </label>

        {!searched && (
          <p className="rf-empty">Your recipe suggestions will show up here.</p>
        )}

        {searched && loading && <p className="rf-empty">Loading recipes...</p>}

        {searched && error && (
          <p className="rf-empty">Couldn't load recipes: {error}</p>
        )}

        {searched && !loading && !error && results.length === 0 && (
          <p className="rf-empty">
            No recipes matched. Try different ingredients or another meal type.
          </p>
        )}

        {!loading && results.length > 0 && (
          <>
            <h2 className="rf-section">
              {results.length} recipe{results.length > 1 ? "s" : ""} found
            </h2>
            <div className="rf-grid" ref={recipesRef} >
              {results.map(({ recipe, matched, missing }) => (
                <article className="rf-card" key={recipe.id} onClick={()=>startCook(recipe)}>
                  <img
                    className="rf-img"
                    src={recipe.image_url}
                    alt={recipe.name}
                    width={recipe.image_width}
                    height={recipe.image_height/4}
                    loading="lazy"
                  />
                  <div className="rf-body">
                    <div className="rf-badges">
                      {(recipe.type ?? []).map((t) => (
                        <span className="rf-badge rf-badge-type" key={t}>
                          {prettify(t)}
                        </span>
                      ))}
                      {(recipe.cooking_method ?? []).map((m) => (
                        <span className="rf-badge" key={m}>
                          {prettify(m)}
                        </span>
                      ))}
                    </div>

                    <h3 className="rf-card-title">{recipe.name}</h3>
                    <p className="rf-desc">{recipe.description}</p>

                    <p className="rf-match">
                      You have {matched.length} of{" "}
                      {recipe.main_ingredients?.length ?? 0} main ingredients
                    </p>

                    <ul className="rf-ing-list">
                      {matched.map((m) => (
                        <li className="rf-have" key={m.name}>
                          ✓ {m.name}
                          {m.user.amount && (
                            <span className="rf-portion">
                              {" "}
                              ({m.user.amount} {m.user.unit})
                            </span>
                          )}
                        </li>
                      ))}
                      {missing.map((m) => (
                        <li className="rf-need" key={m}>
                          ✗ {m}
                        </li>
                      ))}
                    </ul>

                    <div className="rf-meta">
                      <span>
                        <strong>Flavor:</strong>{" "}
                        {(recipe.flavor_profile ?? []).map(prettify).join(", ")}
                      </span>
                      <span>
                        <strong>Occasion:</strong>{" "}
                        {(recipe.occasion ?? []).map(prettify).join(", ")}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}