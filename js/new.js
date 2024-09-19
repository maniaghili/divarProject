import { getToken } from "./funcs/share.js"
import { getCategories, } from "./funcs/newfuncs.js"


window.addEventListener('load',()=>{
const searchInput = document.querySelector('#search-input')
const removeIcon = document.querySelector('#remove-icon')
removeIcon.style.display = 'none'

if(!getToken()){
 location.href = '/frontend/pages/posts.html'
}
const guideContainer = document.querySelector('#guide-container')
guideContainer.style.display = 'none'
const showCategoies = document.querySelector('#show-categoies')
const categoriesElem = document.querySelector('#categories')
const descriptionCheckbox = document.querySelector('#description-checkbox')
const resultContainer = document.querySelector('#result-container')


var alll = null
let allSubs = null
getCategories().then((categoies)=>{
    alll = categoies
allSubs = categoies.flatMap(cat=>cat.subCategories)

searchInput,addEventListener('keyup',(e)=>{
let value = e.target.value.trim()
if(value.length){
    removeIcon.style.display = 'inline'
  let allSubsubs = allSubs.flatMap((sub)=>sub.subCategories)
   let result = allSubsubs.filter((sub)=>sub.title.includes(value))
    if(result.length){
        resultContainer.innerHTML = ''
        resultContainer.classList.add('active')
       result.map((res)=>{
        resultContainer.insertAdjacentHTML('beforeend',`
            <a href="/frontend/pages/new/registerPost.html?subCategoryID=${res._id} class="search-result">
            <p>${res.title}</p>
            </a>
            `)
       })
    }else{
        resultContainer.innerHTML = ''
        resultContainer.insertAdjacentHTML('beforeend',`
            <p>چیزی یافت نشد</p>
            `)

    }
    
}else{
    resultContainer.classList.remove('active')
     removeIcon.style.display = 'none'
}
})

showCategoies.addEventListener('click',()=>{
    guideContainer.style.display = 'flex'
    showCategoies.style.display = 'none'

    showCategories(categoies)
 
       descriptionCheckbox.addEventListener('change',()=>{
            showCategories(categoies)
        })
    
})

   })

const nextCategory = (id) => {
    let allCat = alll.find(cat=>cat._id == id)

   if(allCat){
    showCategories(allCat.subCategories,allCat.title)
    descriptionCheckbox.addEventListener('change',()=>{
        showCategories(allCat.subCategories,allCat.title)
    })
   }else{

    let allSub = allSubs.flatMap(cat=>cat.subCategories)
    let allSubsub = allSub.filter(sub=>sub.parent == id)
    let subCategory = allSubsub.map(sub=>sub.parent)

        const subCategoryParent = allSubs.find((category) => category._id === subCategory[0])
  if(subCategoryParent){
        showCategories(allSubsub,subCategoryParent.title,subCategoryParent._id)
        descriptionCheckbox.addEventListener('change',()=>{
            showCategories(allSubsub,subCategoryParent.title,subCategoryParent._id)
        })
  }else{
    location.href = `new/registerPost.html?subCategoryID=${id}`
  }
   }
    
        
}
window.nextCategory = nextCategory

const showCategories = (cat,title,id)=>{
console.log(categoriesElem);

 categoriesElem.innerHTML = ''
 categoriesElem.innerText = ''
    if(title){
        guideContainer.style.display = 'flex'
    showCategoies.style.display = 'none'
   
     categoriesElem.insertAdjacentHTML('afterbegin',`
          
         <div class="back" onclick="${id?`backToBeforeCat('${id}')`:'backToBeforeCat()'}">
     <i class="bi bi-arrow-right"></i>
 <p>بازگشت به ${title}</p>
 </div>
       `)
    }
   console.log(categoriesElem);
   

         cat.map((cat)=>{
             categoriesElem.insertAdjacentHTML('beforeend',`
                 
             <div class="box" onclick="nextCategory('${cat._id}')">
                 <div class="details">
                 <div>
                     <i class="bi bi-house-door"></i>
                     <p>${cat.title}</p>
                 </div>
             
                 ${
                   descriptionCheckbox.checked
                     ? `<span>${cat.description}</span>`
                     : ""
                 }
                 
                 </div>
                 <i class="bi bi-chevron-left"></i>
             </div>
                 `)
         })
     
 }
 window.showCategories = showCategories

 window.backToBeforeCat = (id) => {

    if(id){
 
      let ff =allSubs.filter(sub=>sub._id == id)
     let kar = allSubs.filter(subb=>subb.parent == ff[0].parent)
     descriptionCheckbox.addEventListener('change',()=>{
        showCategories(kar,'همه دسته ها',null)
    })
     showCategories(kar,'همه دسته ها',null)
     
      
    }else{
        descriptionCheckbox.addEventListener('change',()=>{
            showCategories(alll,null,null)
        })
      showCategories(alll,null,null)
    }
}


})






