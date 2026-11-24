import { Route, Routes } from 'react-router-dom';
import Body from './Body.jsx';
import Footer from './Footer.jsx';
import Header from './Header.jsx';
import RecipeFinder from './pages/customRecipe.jsx';
import DailyRecipe from './pages/dailyRecommendedPage.jsx';
import FAQ from './pages/FAQ.jsx';
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="/daily" element={<DailyRecipe />} />
        <Route path="/custom-recipe" element={<RecipeFinder/>}></Route>
        <Route path='/FAQ' element={<FAQ/>}></Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;