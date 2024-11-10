 import { globalSearchInfos ,
    showCityNameOnHeader,
    showModalOfCities,
    ApplyCityChanges,
    cancelModalbuttons,
    getModalCities,
    searchedCities,
    showPanelLinks,
    getToken
    } from "./funcs/share.js";
import { showModal,hideModal, getLocalStorage,setUrlParam, logOut } from "./funcs/util.js";
import { getPostCategories ,removeParamFromUrl} from "./funcs/postsfuncs.js";
import { sendUserPhone,loginUser,sendNewCode} from "./funcs/auth.js";


let $ = document
const globalSearchInput = $.querySelector('#global_search_input')
const removeSearchIcon = $.querySelector('#remove-search-value-icon')
const searchbarModalOverlay = $.querySelector('.searchbar__modal-overlay')
const cityModalAccept = $.querySelector('#city-modal__accept')
const cityModalClose = $.querySelector('.city-modal__close')
const cityModalSearchInput = $.querySelector('#city-modal-search-input')
const cityModalList = $.querySelector('#city_modal_list')
const headerCategoryBtn = $.querySelector('.header__category-btn')
const categoryModalOverlay = $.querySelector('.category_modal_overlay')
const headerCategoryMenu = $.querySelector('.header__category-menu')
const allCategoriesPosts = $.querySelector('#all-categories-posts')
const haederCategoryMenuList = $.querySelector('.haeder__category-menu-list')
const categoryResults = $.querySelector("#category-results");
const submitPhoneNumberBtn = $.querySelector('.submit_phone_number_btn')
const loginModalIcon = $.querySelector('.login-modal__icon')
const loginModal = document.querySelector('#login-modal')
const loginBtn = document.querySelector('.login_btn')
const reqNewCodeBtn = document.querySelector(".req_new_code_btn");
const createPostBtn = document.querySelector('.create_post_btn');


createPostBtn?.addEventListener('click',(e)=>{
  e.preventDefault()
  let token = getToken()
  if(token){
    location.href = '/divarProject/pages/new.html'
  }else{
    loginModal.classList.add('login-modal--active')
  }
})



reqNewCodeBtn?.addEventListener('click',(e)=>{
  e.preventDefault()
  sendNewCode()
 
})




loginBtn?.addEventListener('click',(e)=>{
  e.preventDefault()
  loginUser()
})

loginModalIcon?.addEventListener('click',()=>{
  loginModal.classList.remove('login-modal--active')

})
   
   submitPhoneNumberBtn?.addEventListener('click',(e)=>{
    e.preventDefault()

    sendUserPhone()
   })


showCityNameOnHeader()
window.addEventListener('load',()=>{



  showPanelLinks();
  


    getPostCategories().then((s)=>{
       let mainCateories = s.data.categories
      
       mainCateories.forEach((cat)=>{
        haederCategoryMenuList?.insertAdjacentHTML('beforeend',`
             <li class="header__category-menu-item" onmouseenter="showActiveCategorySubs('${cat._id}')">
            <div class="header__category-menu-link">
              <div class="header__category-menu-link-right">
                <i class="header__category-menu-icon bi bi-house"></i>
                ${cat.title}
              </div>
              <div class="header__category-menu-link-left">
                <i class="header__category-menu-arrow-icon bi bi-chevron-left"></i>
              </div>
            </div>
          </li>
            `)
       })

       window.showActiveCategorySubs = (id)=>{
       let catID = mainCateories.find(cat => cat._id == id)
       categoryResults?categoryResults.innerHTML = '':null
       catID.subCategories.forEach((subCategory)=>{
        categoryResults?.insertAdjacentHTML('beforeend',`
        <div>
              <ul class="header__category-dropdown-list">
                <div class="header__category-dropdown-title" onclick="setUrlParam('categoryID','${subCategory._id}')">${
                  subCategory.title
                }</div>
                ${subCategory.subCategories
                  .map(
                    (subSubCategory) => `
                    <li class="header__category-dropdown-item" onclick="setUrlParam('categoryID','${subSubCategory._id}')">
                      <div class="header__category-dropdown-link">${subSubCategory.title}</div>
                    </li>
                  `
                  )
                  .join("")}
              </ul>
            </div>
            `)
       })
       } 
       showActiveCategorySubs(mainCateories[0]._id)
window.setUrlParam = setUrlParam
    })
     
    
    headerCategoryBtn?.addEventListener('click',(e)=>{
        e.preventDefault()

        headerCategoryMenu.classList.add('header__category-menu--active')
        allCategoriesPosts.addEventListener('click',(e)=>{
            e.preventDefault()
            removeParamFromUrl('categoryID')
        })
    })
        categoryModalOverlay?.addEventListener('click',(e)=>{
            e.preventDefault()
            headerCategoryMenu.classList.remove('header__category-menu--active')
        })
    

    showModalOfCities()
     
    let selectedCities = getLocalStorage('cities')
    if(selectedCities.length == 1){
        document.title =`آگهی های  ${selectedCities[0].name} `
    }else{
        document.title =`آگهی های  ${selectedCities.length} شهر`
    }

  getModalCities().then((all)=>{
  
    let allCities = all.cities
    cityModalSearchInput?.addEventListener('keyup',(event)=>{
    
    
    let ss = searchedCities(allCities,event.target.value.trim())
    cityModalList.innerHTML=''
     ss.forEach((city)=>{
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
     })
    
  })

   
 

})

globalSearchInput?.addEventListener('keyup',(event)=>{
      
    hideOrShowHiddenIcon()
   
    if(event.keyCode == 13){
        globalSearchInfos(event.target.value)
    }

    removeSearchIcon?.addEventListener('click',()=>{
        globalSearchInput.value = ''
        hideOrShowHiddenIcon()
    },)

})
const manySearchesArray = ['تبلت','کیف','ماشین','ساعت','گوشی']

globalSearchInput?.addEventListener('click',()=>{
  showModal('header__searchbar-dropdown',
    `header__searchbar-dropdown--active`
  )

  

  const dropDownUL = document.querySelector('.header__searchbar-dropdown-list')
  dropDownUL.innerHTML = ''
  manySearchesArray.forEach((word)=>{
    dropDownUL.insertAdjacentHTML('beforeend',`<li class="header__searchbar-dropdown-item">
      <a onclick="mostSearchClickHandler('${word}')" class="header__searchbar-dropdown-link">
        ${word}
      </a>
    </li>
        `)
  })
},)

searchbarModalOverlay?.addEventListener('click',()=>{
    hideModal('header__searchbar-dropdown',
        `header__searchbar-dropdown--active`
      )
})


const hideOrShowHiddenIcon = () =>{
    if(globalSearchInput.value){
        removeSearchIcon.style.display = 'inline'
        
     }else{
         removeSearchIcon.style.display = 'none'
     }
}

//selectCitiesModalButtons func

cityModalAccept?.addEventListener('click',(e)=> {
    e.preventDefault()
    ApplyCityChanges()
})

cityModalClose?.addEventListener('click',(e)=>{
    e.preventDefault()
    cancelModalbuttons()

})

const mostSearchClickHandler = (word) => {
  setUrlParam('search',word)
}

window.mostSearchClickHandler = mostSearchClickHandler