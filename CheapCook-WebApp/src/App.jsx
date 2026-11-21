import { Route, Routes } from 'react-router-dom';
import Body from './Body.jsx';
import Footer from './Footer.jsx';
import Header from './Header.jsx';
import CustomRecipe from './pages/customRecipe.jsx';
import Recommendation from './pages/dailyRecommendedPage.jsx';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="/daily" element={<Recommendation />} />
        <Route path="/custom-recipe" element={<CustomRecipe/>}></Route>
       
      </Routes>
      <Footer />
    </>
  );
}

export default App;