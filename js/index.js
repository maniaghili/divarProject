import { getPopularCities ,redirectUserAccordingToCookie,getAllCities,showCitiesInInput} from "./funcs/indexfuncs.js";

const mainInput = document.querySelector('.main__input')

window.addEventListener('load',()=>{
    redirectUserAccordingToCookie()
    // Other functions are used inside (getPopularCities)
    getPopularCities()
    getAllCities()
})

mainInput.addEventListener('keyup',(event)=>{

showCitiesInInput(event.target.value)   
})
