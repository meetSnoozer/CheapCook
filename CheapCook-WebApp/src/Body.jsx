import adb from './assets/adb.jpg';
import alm from './assets/alm.jpg';
import bang from './assets/bang.jpg';
import bistek from './assets/bistek.jpg';
import klb from './assets/klb.jpg';
import mng from './assets/mng.jpg';
import pks from './assets/pks.jpg';
import sngang from './assets/alm.jpg';
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
import './Body.css'

function Body(){
    const imgList = [adb,alm,bang,bistek,klb,mng,pks,sngang,ssg,tinola];
    const [index,setIndex] = useState(0);
    const containerRef = useRef(null);

    // Fade-in on scroll: set up once, after the cards exist in the DOM
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // animate once
                }
            });
        }, { threshold: 0.2 });

        if (containerRef.current) {
            containerRef.current
                .querySelectorAll('.card')
                .forEach(card => observer.observe(card));
        }

        return () => observer.disconnect();
    }, []);

    // Hero image carousel
    useEffect(()=>{
        const cd = setInterval(()=>{
            setIndex(i=>(i+1)%imgList.length);
        },7500);
        return()=>clearInterval(cd);
    },[]);

    return(

    <div className="my-scoped-root" ref={containerRef}>
      <style>{`
        .my-scoped-root {
          --text: #6b6375;
          --text-h: #08060d;
          --bg: #fff;
          --border: #e5e4e7;
          --code-bg: #f4f3ec;
          --accent: #aa3bff;
          --accent-bg: rgba(170, 59, 255, 0.1);
          --accent-border: rgba(170, 59, 255, 0.5);
          --social-bg: rgba(244, 243, 236, 0.5);
          --shadow: rgba(0, 0, 0, 0.1) 0 10px 15px -3px, rgba(0, 0, 0, 0.05) 0 4px 6px -2px;
          --sans: system-ui, 'Segoe UI', Roboto, sans-serif;
          --heading: system-ui, 'Segoe UI', Roboto, sans-serif;
          --mono: ui-monospace, Consolas, monospace;

          font: 18px/145% var(--sans);
          letter-spacing: 0.18px;
          color: var(--text);
          background: var(--bg);
          max-width: 1326px;
          width: 100%;
          margin: 0 auto;
          text-align: center;

          min-height: 100svh;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .my-scoped-root h1 {
          font-size: 56px;
          letter-spacing: -1.68px;
          margin: 32px 0;
          color: var(--text-h);
        }

        @media (prefers-color-scheme: dark) {
          .my-scoped-root {
            --text: #9ca3af;
            --text-h: #f3f4f6;
            --bg: #16171d;

            --code-bg: #1f2028;
            --accent: #c084fc;
          }
        }
      `}</style>
    <div className='imgcard'>
        <img src={imgList[index]} key={index} className='foodImg'/>

        <div className='cardOverlay'>
            <button className='tryButton'>TRY IT NOW!</button>
            <h1 style={{
                color: "whitesmoke",
                position: "absolute",
                bottom: "2rem",
                left: "2rem",
                }}>Eat and save money at the same time</h1>
        </div>
    </div>
    <div className='siteInfo'>
        <div className='label'>
          <h1>WHAT TO EXPECT:</h1>
        </div>

        <div className='cardContainer'>
            <div className='card r1'>
                <img src={fridge} className='cardImg'/>
                <div className='cardTxt'>
                  <h2><strong>Resourcefulness</strong></h2>
                  <p>Enter the ingredients already sitting in your fridge and pantry, and instantly discover authentic Filipino recipes designed around your kitchen. No extra grocery trips or wasted food—just smart, budget-friendly meals made from what you have on hand.</p>
                </div>

            </div>
            <div className='card r2'>

                <div className='cardTxt'>
                  <h2><strong>Trusty Guide</strong></h2>
                <p>Cooking doesn’t have to be guesswork. We give you the complete, step-by-step recipe you need to cook with total confidence, walking you through every chop, simmer, and seasoning along the way. No missing details or confusing shortcuts—just clear, reliable instructions you can trust every single time.</p>
                </div>
                <img src={recipe} className='cardImg'/>
            </div>
            <div className='card r1'>
                <img src={cook} className='cardImg'/>
                <div className='cardTxt'>
                  <h2><strong>Let's Cook!</strong></h2>
                <p> Your next great meal is just a few steps away. Turn simple ingredients into something unforgettable—no culinary degree or fancy equipment required. Whether you're cooking for yourself or sharing with family, jump right in and enjoy the satisfaction of making a hearty meal from scratch.</p>
                </div>
            </div>
        </div>
    </div>

    <div className='offered'>
        <div className='label'>
          <h1>WHAT WE OFFER:</h1>
        </div>

        <div className='cardContainer'>
            <div className='card r1 offerCard'>
                <h1>Custom Recipes</h1>
                <div className='miniHandler'>
                  <div className='miniCard'>
                    <img src={portion} className='cardImg'/>
                      <div className='cardTxt'>
                        <h2><strong>Portioned Recipe</strong></h2>
                        <p>Recipes are adjusted based on the current portion available for each ingredients.</p>
                      </div>
                  </div>
                  <div className='miniCard'>
                    <img src={shopping} className='cardImg'/>
                      <div className='cardTxt'>
                        <h2><strong>Lowest Cost</strong></h2>
                        <p>Prioritizes recipes with the least amount of additional ingredients to lower cost.</p>
                      </div>
                  </div>
                  <div className='miniCard'>
                    <img src={selectRecipe} className='cardImg'/>
                      <div className='cardTxt'>
                        <h2><strong>Multiple Options</strong></h2>
                        <p>Provides multiple recipe option for your current situation.</p>
                      </div>
                  </div>
                </div>
            </div>
            <div className='card r1 offerCard'>
                <h1>Daily Recommendations</h1>
                <div className='miniHandler'>
                  <div className='miniCard'>
                    <img src={reco} className='cardImg'/>
                      <div className='cardTxt'>
                        <h2><strong>Recipe of the Day</strong></h2>
                        <p>Aside from custom recipes, you can also rely on a daily recipe recommendations for reference.</p>
                      </div>
                  </div>
                  <div className='miniCard'>
                    <img src={decision} className='cardImg'/>
                      <div className='cardTxt'>
                        <h2><strong>No More Decision Fatigue</strong></h2>
                        <p>Stop spending all your brain cells deciding what to cook and get in action real quick.</p>
                      </div>
                  </div>
                  <div className='miniCard'>
                    <img src={ffatigue} className='cardImg'/>
                      <div className='cardTxt'>
                        <h2><strong>No More Food Fatigue</strong></h2>
                        <p>The variety of food on the daily recommendations prevents fatigue on a single dish.</p>
                      </div>
                  </div>
                </div>
            </div>
            <div className='card r1 offerCard'>
                <h1>Active Cook Mode</h1>
                <div className='miniHandler'>
                  <div className='miniCard'>
                    <img src={followRecipe} className='cardImg'/>
                      <div className='cardTxt'>
                        <h2><strong>Step-by-Step Guide</strong></h2>
                        <p>Follow well described recipe from well experienced chefs and cooks around the world.</p>
                      </div>
                  </div>
                  <div className='miniCard'>
                    <img src={kidCook} className='cardImg'/>
                      <div className='cardTxt'>
                        <h2><strong>Make Cooking Easier</strong></h2>
                        <p>Check the steps, proceed to the next stages and enjoy the process of cooking.</p>
                      </div>
                  </div>
                  <div className='miniCard'>
                    <img src={serve} className='cardImg'/>
                      <div className='cardTxt'>
                        <h2><strong>Help You Serve The Family</strong></h2>
                        <p>The end goal of cooking is not just eating, but also sharing the warmth of the food with people you love.</p>
                      </div>
                  </div>
                </div>
            </div>
        </div>
    </div>
    
    <div className='tryCard'>
        
        <div className='tryOption'>
          <div className='tryTxt'>
                <h1>A journey always start somewhere.</h1>
                <h2>Choose an option below and find a recipe that suits you best. You can always choose what you want to cook, its your life anyways.</h2>
          </div>
          <div className='tryButtons'>
                <button>Daily Recommendation</button>
                <button>Custom Recipe</button>
          </div>
          
        </div>
    </div>

    </div>
    );
}
export default Body;