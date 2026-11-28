import { Link } from 'react-router-dom';
import './Header.css';
function Header(){
    return(
        <header className="mainHead">
        <h1> <Link to="/">MakeDo Kitchen </Link></h1>
        <nav>
            <ul>
            <li> <Link to="/daily">Recipe of the Day</Link></li>
            <li> < Link to="/custom-recipe">Find a Recipe</Link></li>
            
        </ul>
        </nav>
    </header>
    ); 
    
}
export default Header
