import './Header.css'
function Header(){
    return(
        <header className="mainHead">
        <h1><a href="#">CheapCook</a></h1>
        <nav>
            <ul>
            <li><a href="#">Recipe of the Day</a></li>
            <li><a href="#">Find a Recipe</a></li>
            <li><a href="#">Create A Recipe</a></li>
            <li><a href="#">FAQ</a></li>
        </ul>
        </nav>
    </header>
    ); 
    
}
export default Header