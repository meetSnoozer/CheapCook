import { useLocation } from "react-router-dom";
export default function steps(){
    const {state} = useLocation();
    return(
        <div>
            Chosen recipe: {state.recipe?? "null"}
            <img src={state.img}/>
        </div>
    );
}