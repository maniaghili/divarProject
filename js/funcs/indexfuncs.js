import { getLocalStorage,setLocalStorage } from "./util.js"

let gCity = ''

const getPopularCities = async () => {

    let popularCities = ''
   
    const fetchCitiesName = await fetch(`https://divarapi.liara.run/v1/location/`)
    const fetchCitiesNameres = await fetchCitiesName.json()
    let allCities = fetchCitiesNameres.data.cities
    popularCities = allCities.filter((city)=>{
       return city.popular == true
    })

    showPopularCities(popularCities)
    
}

const showPopularCities = (cities) => {
const citiesParent = document.querySelector('.main__cities-list')

  cities.forEach((city)=>{
    citiesParent.insertAdjacentHTML('beforeend',`
        <div class="col-2 d-flex justify-content-center">
                <li class="main__cities-item" onclick="redirectUsersToTheirCity('${city.name}','${city.id}')">
                  <p class="main__cities-link">${city.name}</p>
                </li>
              </div>
        `)

  })
}

window.redirectUsersToTheirCity = (cityName,cityId) =>{
   
  location.href = `/divarProject/pages/posts.html`
  setLocalStorage('cities',JSON.stringify([{name:cityName,id:cityId}]))
  
}

const redirectUserAccordingToCookie = () => {
    //const cookieCityName = getCityCookie()
  const cookieCityName = getLocalStorage('cities')
  if(cookieCityName){
    location.href = `/divarProject/pages/posts.html`
  }

  
  
}

const getAllCities = async () => {

  const fetchAllCities = await fetch(`https://divarapi.liara.run/v1/location/`)
  const fetchAllCitiesres = await fetchAllCities.json()

    
   gCity = fetchAllCitiesres.data.cities
  return gCity
  

}

const showCitiesInInput = (inputValue) => {
  
  const searchResultCities = document.querySelector('.search-result-cities')
 
  searchResultCities.innerHTML = ''

  if(inputValue){
    searchResultCities.classList.add('active')

    let allCities = gCity.filter((city)=>{
     
      return city.name.startsWith(inputValue)
    })
    
    if(allCities.length){
      allCities.forEach((city)=>{
        
        searchResultCities.insertAdjacentHTML('beforeend',`
          <li onclick="redirectUsersToTheirCity('${city.name}','${city.id}')">${city.name}</li>
          `)
      })
      
    }else{
      searchResultCities.insertAdjacentHTML('beforeend',`
        <li>شهری برای نمایش وجود ندارد</li>
        `)
    }

  }else{
    searchResultCities.classList.remove('active')
  }
   

}



export {getPopularCities,redirectUserAccordingToCookie,getAllCities,showCitiesInInput}