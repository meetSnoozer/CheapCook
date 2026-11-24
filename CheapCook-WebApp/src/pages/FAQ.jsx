import "./FAQ.css";

// Edit this list to add, remove or reword questions. Answers are plain strings
// or JSX, so you can add links if you need them.
const FAQS = [
  {
    q: "How do I find recipes with what I have?",
    a: "Type each ingredient you have into its own row on the finder page. Use “Add another ingredient” for more rows, optionally pick a meal type, then press “Find recipes”.",
  },
  {
    q: "What does “Filter by my ingredients” do?",
    a: "When it's on, you only see recipes that use at least one ingredient you entered. When it's off, you see every recipe of the meal type you chose, whether or not you have the ingredients. With the filter on and no ingredients entered, no recipes will show, so add an ingredient or turn the filter off.",
  },
  {
    q: "How are my ingredients matched to recipes?",
    a: "Matching works on partial names in both directions, so “pork” matches “pork belly” and “soy sauce” matches “soy sauce”. Spelling still matters. If a recipe you expect doesn't appear, check for typos or try a simpler word.",
  },
  {
    q: "Do the portion amounts change the results?",
    a: "No. The amount and unit you enter are shown next to the ingredients you have in each recipe card, but they don't affect which recipes appear or how they're ranked.",
  },
  {
    q: "What do the ✓ and ✗ marks mean on a recipe card?",
    a: "A ✓ is a main ingredient you told us you have. A ✗ is a main ingredient you didn't enter. The list only covers each dish's main ingredients, so a recipe may call for other items too.",
  },
  {
    q: "In what order are recipes shown?",
    a: "Recipes where you have the biggest share of the main ingredients come first.",
  },
  {
    q: "How does today's recipe work?",
    a: "You get one recipe per day, and it stays the same until midnight your time. Tomorrow it changes, and the recipes rotate so none repeats until every recipe has been shown once.",
  },
  {
    q: "Why does it say it couldn't load recipes?",
    a: "The recipe list couldn't be fetched, usually because of a weak connection or a temporary problem on our side. Check your connection and try again. On the daily recipe page there's a “Try again” button, and on the finder page you can press “Find recipes” again.",
  },
  {
    q: "How do I clear everything and start over?",
    a: "Press “Reset” on the finder page. It clears your ingredients, the meal type and the results, and turns the filter back on.",
  },
];

export default function FAQ() {
  return (
    <div className="faq-page">
      <header className="faq-header">
        <h1 className="faq-title">Frequently asked questions</h1>
        <p className="faq-intro">
          How finding recipes and the daily recipe work.
        </p>
      </header>

      <div className="faq-list">
        {FAQS.map(({ q, a }) => (
          <details className="faq-item" key={q}>
            <summary className="faq-q">
              <span>{q}</span>
              <span className="faq-icon" aria-hidden="true" />
            </summary>
            <p className="faq-a">{a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}