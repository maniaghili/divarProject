import { showPosts,getPosts } from "./postsfuncs.js";
import { setUrlParam ,getLocalStorage,setLocalStorage,logOut} from "./util.js";
import { isLoginn } from "./postDetalesfuncs.js";
const globalSearchInfos = (value) => {

setUrlParam('search',value)
  
}

const showCityNameOnHeader = () => {
    const headerCityTitle = document.querySelector('#header-city-title')
    let cities = getLocalStorage('cities')
    if(!cities){
   setLocalStorage('cities',[{name:'تهران',id:301}])
   let cities = getLocalStorage('cities')
   headerCityTitle?headerCityTitle.innerHTML = cities[0].name:null
    }else{
    if(cities.length == 1){
        headerCityTitle?headerCityTitle.innerHTML = cities[0].name:null
    }else{
      headerCityTitle?headerCityTitle.innerHTML = `${cities.length}مورد`:null
    }
    }

}       

let selectedCities = getLocalStorage('cities')

const showModalOfCities = () => {
    const headerCity = document.querySelector('.header__city')
    const cityModal = document.querySelector('#city-modal')
   const cityModalOverlay = document.querySelector('.city-modal__overlay')
   const cityModalCities = document.querySelector('.city-modal__cities')
   cityModalOverlay?.addEventListener('click',()=>{
    cityModal.style.visibility = 'none'
    cityModal.style.opacity = '0'
    cityModalOverlay.style.display = 'none'
   })

    headerCity?.addEventListener('click',(e)=>{
      cityModalOverlay.style.display = 'block'
        e.preventDefault()
        getModalCities().then((res)=>{
          showCitiesInModal(res.provinces)
          cityModalCities.scrollTo(0,0)
      })
      showSelectedCities(selectedCities)
        updateModalbuttons(selectedCities)
        cityModal.style.visibility = 'visible'
        cityModal.style.opacity = '100'
        
    })
}

const getModalCities = async () => {
    const fetchAll = await fetch(`https://divarapi.liara.run/v1/location/`)
    const fetchAllres =await fetchAll.json()
    return fetchAllres.data
}

const showCitiesInModal =async (array) => {
    const cityModalList = document.querySelector('#city_modal_list')
  cityModalList.innerHTML = ''
    array.forEach((province)=>{

        cityModalList.insertAdjacentHTML('beforeend',`
          <li onclick="getProvinceCities('${province.id}','${province.name}')" class="city-modal__cities-item province-item"
            data-province-id="${province.id}">
            <span>${province.name}</span>
            <i class="city-modal__cities-icon bi bi-chevron-left"></i>
          </li>
            `)
    })
    
    
    
}

const getProvinceCities =async (id,name) => {
    let allData =await getModalCities()
    let citiesOfProvince  = allData.cities.filter((city)=>city.province_id == id)
  const cityModalList = document.querySelector('#city_modal_list')
  cityModalList.innerHTML = ''

   cityModalList.insertAdjacentHTML('beforeend',`
           <li id="city_modal_all_province" class="city_modal_all_province">
              <span>همه شهر ها</span>
              <i class="bi bi-arrow-right-short"></i>
            </li>
            <li class="city-modal__cities-item select-all-city city-item">
               <span>همه شهر های ${name} </span>
              <div id="checkboxShape"></div>
              <input type="checkbox" />
            </li>
  `)

  citiesOfProvince.forEach((city)=>{
    let isSelect = selectedCities.some((cities)=>
        cities.name == city.name
    )

    cityModalList.insertAdjacentHTML('beforeend',`
         <li class="city-modal__cities-item city-item" id="city-${city.id}" >
           <span>${city.name}</span>
           <div id="checkboxShape" class="${isSelect?`active`:''}"></div>
           <input id="city-item-checkbox" type="checkbox" onchange="selectNewCityFromModal('${city.id}')">
         </li>
        `)
  })
   
   
}
window.getProvinceCities = getProvinceCities

const removeCityFromModal = (id)=>{

//   const cityID = document.querySelector(`#city-${id}`)
//   const checkboxShape = cityID.querySelector('div');
// console.log(checkboxShape);


for (let i=0;i<selectedCities.length;i++){
  
  let ss = selectedCities[i].id
  if(ss == id){
    selectedCities.splice(i,1)
    showSelectedCities(selectedCities)
    
    //checkboxShape.classList.remove('active')
  }
  
}
updateModalbuttons(selectedCities)
}
window.removeCityFromModal = removeCityFromModal

const selectNewCityFromModal = (id) => {
  let cityID = document.querySelector(`#city-${id}`)
  const checkboxSpan = cityID.children[0].innerHTML
  const checkboxShape = cityID.children[1]
  const checkboxShapeInput = cityID.children[2]

let ss = selectedCities.some((city)=> {
  return city.name == checkboxSpan
 })
 
 if(!ss){
  selectedCities.push({name:checkboxSpan,id:id})
  checkboxShape.classList.add('active')
  checkboxShapeInput.checked = true

  showSelectedCities(selectedCities)
 }else{
  checkboxShapeInput.checked = false
  checkboxShape.classList.remove('active')
  removeCityFromModal(id)
 }
 updateModalbuttons(selectedCities)
}
window.selectNewCityFromModal = selectNewCityFromModal

const showSelectedCities = (allCities)=> {
  const citySelected = document.querySelector('#city-selected')
  citySelected.innerHTML = ''
  
  allCities.forEach((city)=>{
    citySelected.insertAdjacentHTML('beforeend',`
       <div class="city-modal__selected-item">
           <span class="city-modal__selected-text">${city.name}</span>
           <button class="city-modal__selected-btn" onclick="removeCityFromModal('${city.id}')">
             <i class="city-modal__selected-icon bi bi-x"></i>
           </button>
         </div>
       `)
   })

}

const updateModalbuttons = (allCities) => {
    const cityModalAccept = document.querySelector('#city-modal__accept')
    const deleteAllCities = document.querySelector('#delete-all-cities')
    const cityModalError = document.querySelector('#city_modal_error')
  
  if(selectedCities.length){
    deleteAllCities.addEventListener('click',(e)=>{
    e.preventDefault()
    selectedCities = ''
    updateModalbuttons(selectedCities)
    getModalCities().then((city)=>{
    showCitiesInModal(city.provinces)
  })
    setLocalStorage('cities',selectedCities)
    showSelectedCities(selectedCities)
    showCityNameOnHeader()
    
    
  })
  }
  if(allCities.length){
    cityModalAccept.classList.replace('city-modal__accept','city-modal__accept--active')
    deleteAllCities.style.display = 'inline'
    cityModalError.style.display = 'none'
    }else{
    cityModalError.style.display = 'inline'
    cityModalAccept.classList.replace('city-modal__accept--active','city-modal__accept')
    deleteAllCities.style.display = 'none'
    }
}

const cancelModalbuttons = () => {
  const cityModalAccept = document.querySelector('#city-modal__accept')
  const cityModal = document.querySelector('#city-modal')
  cityModal.style.visibility = 'hidden'
  cityModal.style.opacity = '0'
  cityModalAccept.classList.replace('city-modal__accept--active','city-modal__accept')
  selectedCities = getLocalStorage('cities')
}

const ApplyCityChanges = () => {
const cityModal = document.querySelector('#city-modal')
cityModal.style.visibility = 'hidden'
cityModal.style.opacity = '0'
let aa = selectedCities.map((city)=>city.id).join('|')
//setUrlParam('cities',aa)
setLocalStorage('cities',selectedCities)
showCityNameOnHeader()


getPosts(aa).then((post)=>{

  showPosts(post.data.posts)
})

}

const searchedCities = (all,value)=>{

let searched = all.filter(city=>city.name.includes(value))
  return searched
}

const getToken = () => {
 let token = localStorage.getItem('divar');
 if (token){
  return token
 }else{
  return false
 }


}

const showPanelLinks = async () => {
  const dropDown = document.querySelector(".header_dropdown_menu");
  const userLogin = await isLoginn();
  const loginModal = document.querySelector('#login-modal')
  dropDown?dropDown.innerHTML = "":''

  if (dropDown) {
    if (userLogin) {
      isLoginn().then((user) => {
        
        dropDown.insertAdjacentHTML(
          "beforeend",
          `
              <li class="header__left-dropdown-item header_dropdown-item_account">
                <a
                  href="/pages/userPanel/posts.html"
                  class="header__left-dropdown-link login_dropdown_link"
                >
                  <i class="header__left-dropdown-icon bi bi-box-arrow-in-left"></i>
                  <div>
                    <span>کاربر دیوار </span>
                    <p>تلفن ${user.data.user.phone}</p>
                  </div>
                </a>
              </li>
              <li class="header__left-dropdown-item">
                <a class="header__left-dropdown-link" href="/pages/userPanel/verify.html">
                  <i class="header__left-dropdown-icon bi bi-bookmark"></i>
                  تایید هویت
                </a>
              </li>
              <li class="header__left-dropdown-item">
                <a class="header__left-dropdown-link" href="/pages/userPanel/bookmarks.html">
                  <i class="header__left-dropdown-icon bi bi-bookmark"></i>
                  نشان ها
                </a>
              </li>
              <li class="header__left-dropdown-item">
                <a class="header__left-dropdown-link" href="/pages/userPanel/notes.html">
                  <i class="header__left-dropdown-icon bi bi-journal"></i>
                  یادداشت ها
                </a>
              </li>
              <li class="header__left-dropdown-item logout-link" id="login_btn">
                <p class="header__left-dropdown-link" href="#">
                  <i class="header__left-dropdown-icon bi bi-shop"></i>
                  خروج
                </p>
              </li>
          `
        );
        const logoutLink = document.querySelector('#login_btn');
  logoutLink.addEventListener('click',()=>{
 
    logOut()
  })
      });
    } else {

      dropDown.insertAdjacentHTML(
        "beforeend",
        `
          <li class="header__left-dropdown-item">
            <span id="login-btn" class="header__left-dropdown-link login_dropdown_link">
              <i class="header__left-dropdown-icon bi bi-box-arrow-in-left"></i>
              ورود
            </span>
          </li>
          <li class="header__left-dropdown-item">
            <div class="header__left-dropdown-link">
              <i class="header__left-dropdown-icon bi bi-bookmark"></i>
              نشان ها
            </div>
          </li>
          <li class="header__left-dropdown-item">
            <div class="header__left-dropdown-link">
              <i class="header__left-dropdown-icon bi bi-journal"></i>
              یادداشت ها
            </div>
          </li>
          <li class="header__left-dropdown-item">
            <div class="header__left-dropdown-link">
              <i class="header__left-dropdown-icon bi bi-clock-history"></i>
              بازدید های اخیر
            </div>
          </li>
        `
    )
    dropDown.addEventListener('click',()=>{
      loginModal.classList.add('login-modal--active')
    })
    
  }
 
}}


export {globalSearchInfos,
  showCityNameOnHeader,
  showModalOfCities,
  ApplyCityChanges,
  cancelModalbuttons,
  getModalCities,
  searchedCities,
  showPanelLinks,
  getToken}