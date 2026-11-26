import adb from './assets/adb.jpg';
import alm from './assets/alm.jpg';
import bang from './assets/bang.jpg';
import bistek from './assets/bistek.jpg';
import klb from './assets/klb.jpg';
import mng from './assets/mng.jpg';
import pks from './assets/pks.jpg';
import sngang from './assets/alm.jpg'; // NOTE: this points at alm.jpg, same as `alm` above. Change it if sngang has its own file.
import ssg from './assets/ssg.jpg';
import tinola from './assets/tinola.jpg';
import fridge from './assets/fridge.jpg';
import recipe from './assets/recipe.jpg';
import cook from './assets/homeCook.jpg';

import portion from './assets/portionImg.jpg';
import selectRecipe from './assets/selectRecipe.jpg';
import shopping from './assets/shopping.jpg';
import ffatigue from './assets/ffatigue.jpg';
import reco from './assets/reco.jpg';
import decision from './assets/decision.jpg';
import followRecipe from './assets/followRecipe.jpg';
import kidCook from './assets/kidCook.jpg';
import serve from './assets/serve.jpg';

import { useState, useEffect, useRef } from 'react';
import './Body.css';
import { Link } from 'react-router-dom';

const HERO_IMAGES = [adb, alm, bang, bistek, klb, mng, pks, sngang, ssg, tinola];

// Rows in "What to expect". Every second row is flipped (image on the right).
const FEATURES = [
  {
    img: fridge,
    title: 'Resourcefulness',
    text: 'Enter the ingredients already sitting in your fridge and pantry, and instantly discover authentic Filipino recipes designed around your kitchen. No extra grocery trips or wasted food—just smart, budget-friendly meals made from what you have on hand.',
  },
  {
    img: recipe,
    title: 'Trusty guide',
    text: 'Cooking doesn’t have to be guesswork. We give you the complete, step-by-step recipe you need to cook with total confidence, walking you through every chop, simmer, and seasoning along the way. No missing details or confusing shortcuts—just clear, reliable instructions you can trust every single time.',
  },
  {
    img: cook,
    title: 'Let’s cook!',
    text: 'Your next great meal is just a few steps away. Turn simple ingredients into something unforgettable—no culinary degree or fancy equipment required. Whether you’re cooking for yourself or sharing with family, jump right in and enjoy the satisfaction of making a hearty meal from scratch.',
  },
];

// "What we offer": three groups of three. `tone` picks the colour of the top bar.
const OFFERS = [
  {
    title: 'Custom recipes',
    tone: 'ube',
    items: [
      {
        img: portion,
        title: 'Portioned recipes',
        text: 'Recipes are adjusted based on the portion you have of each ingredient.',
      },
      {
        img: shopping,
        title: 'Lowest cost',
        text: 'Prioritizes recipes with the fewest additional ingredients to lower your cost.',
      },
      {
        img: selectRecipe,
        title: 'Multiple options',
        text: 'Provides multiple recipe options for your current situation.',
      },
    ],
  },
  {
    title: 'Daily recommendations',
    tone: 'leaf',
    items: [
      {
        img: reco,
        title: 'Recipe of the day',
        text: 'Aside from custom recipes, you can also rely on a daily recipe recommendation for reference.',
      },
      {
        img: decision,
        title: 'No more decision fatigue',
        text: 'Stop spending all your brain cells deciding what to cook and get into action real quick.',
      },
      {
        img: ffatigue,
        title: 'No more food fatigue',
        text: 'The variety in the daily recommendations keeps you from getting tired of a single dish.',
      },
    ],
  },
  {
    title: 'Active cook mode',
    tone: 'lime',
    items: [
      {
        img: followRecipe,
        title: 'Step-by-step guide',
        text: 'Follow well-described recipes from experienced chefs and cooks around the world.',
      },
      {
        img: kidCook,
        title: 'Make cooking easier',
        text: 'Check the steps, proceed to the next stages and enjoy the process of cooking.',
      },
      {
        img: serve,
        title: 'Help you serve the family',
        text: 'The end goal of cooking is not just eating, but also sharing the warmth of the food with people you love.',
      },
    ],
  },
];

function Body() {
  const [index, setIndex] = useState(0);
  const rootRef = useRef(null);

  // Reveal sections once as they scroll into view
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = root.querySelectorAll('.lp-reveal');

    if (!('IntersectionObserver' in window)) {
      targets.forEach((t) => t.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.1 }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  // Hero image carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 7500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="lp" ref={rootRef}>
      {/* ---------- Hero ---------- */}
      <section className="lp-hero">
        <img
          className="lp-hero-img"
          src={HERO_IMAGES[index]}
          key={index}
          alt=""
        />
        <div className="lp-hero-overlay">
          <h1 className="lp-hero-title">Eat and save money at the same time</h1>
          <Link to="/custom-recipe"> 
          <button type="button" className="lp-btn lp-btn-lg">
            
              Try it now
            
            
          </button>
          </Link>
        </div>
      </section>

      {/* ---------- What to expect ---------- */}
      <section className="lp-section">
        <h2 className="lp-label">What to expect</h2>

        <div className="lp-features">
          {FEATURES.map((f, i) => (
            <article
              className={`lp-feature lp-reveal${i % 2 === 1 ? ' lp-feature-flip' : ''}`}
              key={f.title}
            >
              <img className="lp-feature-img" src={f.img} alt="" loading="lazy" />
              <div>
                <h3 className="lp-feature-title">{f.title}</h3>
                <p className="lp-feature-text">{f.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- What we offer ---------- */}
      <section className="lp-section">
        <h2 className="lp-label">What we offer</h2>

        <div className="lp-offers">
          {OFFERS.map((group) => (
            <article
              className={`lp-offer lp-offer-${group.tone} lp-reveal`}
              key={group.title}
            >
              <h3 className="lp-offer-title">{group.title}</h3>
              <div className="lp-items">
                {group.items.map((item) => (
                  <div className="lp-item" key={item.title}>
                    <img
                      className="lp-item-img"
                      src={item.img}
                      alt=""
                      loading="lazy"
                    />
                    <h4 className="lp-item-title">{item.title}</h4>
                    <p className="lp-item-text">{item.text}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- Call to action ---------- */}
      <section className="lp-cta lp-reveal">
        <h2 className="lp-cta-title">A journey always starts somewhere.</h2>
        <p className="lp-cta-text">
          Choose an option below and find a recipe that suits you best. You can
          always choose what you want to cook, it’s your life anyway.
        </p>
        <div className="lp-cta-actions">
          <Link to="/daily">
            <button type="button" className="lp-btn">
              Daily recommendation
            </button>
          </Link>
          <Link to="/custom-recipe">
            <button type="button" className="lp-btn lp-btn-ghost">
              Custom recipe
            </button>
          </Link>
          
        </div>
      </section>
    </div>
  );
}

export default Body;