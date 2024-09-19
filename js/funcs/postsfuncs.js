import { setUrlParam ,getUrlParam} from "./util.js"


const getPosts = async (id) => {
    const urlID = getUrlParam('categoryID')
    const searchParam = getUrlParam('search')
    let url = `https://divarapi.liara.run/v1/post/?city=${id}`
  if(urlID){
    url += `&categoryId=${urlID}`
  }
  if(searchParam){
    url += `&search=${searchParam}`
  }

    const fetchPosts =await fetch(url)
    const fetchPostsres = await fetchPosts.json()

     return fetchPostsres
    

}

const showPosts = (posts) => {
  const postsContainer = document.querySelector("#posts-container");
  postsContainer.innerHTML = ''
 let pastTime = 0
  if(posts.length){
    posts.forEach((post)=>{
     pastTime = realTime(post.createdAt)
      
        postsContainer.insertAdjacentHTML('beforeend',
            `
            <div class="col-4">
                  <a href="post.html?id=${post._id}" class="product-card">
                    <div class="product-card__right">
                      <div class="product-card__right-top">
                        <p class="product-card__link">${post.title}</p>
                      </div>
                      <div class="product-card__right-bottom">
                        <span class="product-card__condition">${
                          post.dynamicFields?post.dynamicFields[0].data:``
                        }</span>
                        <span class="product-card__price">
                          ${
                            post.price == false
                              ? "توافقی"
                              : post.price + " تومان"
                          }
                        </span>
                        <span class="product-card__time">${pastTime}</span>
                      </div>
                    </div>
                    <div class="product-card__left">
                    ${
                      post.pics
                        ? `
                          <img
                            class="product-card__img img-fluid"
                            src="https://divarapi.liara.run/${post.pics[0].path}"
                          />`
                        : `
                          <img
                            class="product-card__img img-fluid"
                            src="/public/images/main/noPicture.PNG"
                          />`
                    }
                      
                    </div>
                  </a>
                </div>
            `
                )
    })
    
    
  }else{
    postsContainer.insertAdjacentHTML('beforeend',`
        <p class="empty">آگهی یافت نشد</p>
        `)
  }

}

const getPostCategories = async () => {
  
  const fetchPostCategories = await fetch(`https://divarapi.liara.run/v1/category/`)
  const fetchPostCategoriesres = await fetchPostCategories.json()
 
  return fetchPostCategoriesres
  
}

const showPostCategories = (categories) => {
  
  const categoriesContainer = document.querySelector("#categories-container");
  categoriesContainer.innerHTML = "";
    let urlID = getUrlParam('categoryID')

  if(urlID){
    let selectedCat = categories.filter((cat)=>{
      return cat._id == urlID
    })

    if(selectedCat.length){
      selectedCat.forEach((cat)=>{
      
        categoriesContainer.insertAdjacentHTML('beforeend',`
          <h5 onclick="backToFristPosts()">برگشت به همه آگهی ها</h5>
          <h4 class="font-b" onclick="addUrlParam('${cat._id}')">${cat.title}</h4>
          `)
        cat.subCategories.forEach((sub)=>{

          categoriesContainer.insertAdjacentHTML('beforeend',`
              
            <p onclick="addUrlParam('${sub._id}')">${sub.title}</p>
            `)
        })
      })
    }else{
     
      let selectedSubCat = selectedSubCatID (categories,urlID)

       let subCat = selectedSubCat.flatMap((sub)=>{
        return sub.filters
       })

       if(subCat.length){
       generateCategoryFilters(subCat)
       }
        if(selectedSubCat.length){
          selectedSubCat.forEach((cat)=>{
            categoriesContainer.insertAdjacentHTML('beforeend',`
              <h5 onclick="backToFristPosts()">برگشت به همه آگهی ها</h5>
              <h4 class="font-b" onclick="addUrlParam('${cat._id}')">${cat.title}</h4>
              `)
             cat.subCategories.forEach((sub)=>{
              categoriesContainer.insertAdjacentHTML('beforeend',`
              
                <p onclick="addUrlParam('${sub._id}')">${sub.title}</p>
                `)
             })
          })
          
        }else{
        let selectedSubsubCat = selectedSubsubCatID (categories,urlID)
        let selectedSubCat = selectedSubCatID (categories,selectedSubsubCat[0].parent)

        if(selectedSubCat.length&&selectedSubCat.length){

          selectedSubCat.forEach((cat)=>{
            categoriesContainer.insertAdjacentHTML('beforeend',`
              <h5 onclick="backToFristPosts()">برگشت به همه آگهی ها</h5>
              <h4 class="font-b" onclick="addUrlParam('${cat._id}')">${cat.title}</h4>
              `)
             cat.subCategories.forEach((sub)=>{
              categoriesContainer.insertAdjacentHTML('beforeend',`
              ${sub._id == selectedSubsubCat[0]._id?`
                 <p onclick="addUrlParam('${sub._id}')" class="text-danger">${sub.title}</p>
                `:`
                 <p onclick="addUrlParam('${sub._id}')">${sub.title}</p>
                `}
               

                `)
             })
          })

        }  
    }
  }
  }else{
    categories.forEach((category) => {
      categoriesContainer.insertAdjacentHTML(
        "beforeend",
        `
          <div class="sidebar__category-link" id="category-${category._id}">
            <div class="sidebar__category-link_details" onclick="addUrlParam('${category._id}')">
              <i class="sidebar__category-icon bi bi-house"></i>
              <p>${category.title}</p>
            </div>
          </div>
        `
      );
    });
  }
  
  
} 

window.addUrlParam = (id) =>{
  setUrlParam('categoryID',id)
}

window.backToFristPosts = () => {

  removeParamFromUrl('categoryID')
}

const realTime = (create) =>{
  let cratedTime = new Date(create) 
  let emroz = new Date()
  
  let moha = emroz - cratedTime
  let hours = Math.floor(moha/(60 * 60 *1000))
  let minte = Math.floor(hours*60)
  let Days = Math.floor(hours/24)
  
  if(hours < 24){
    return `${hours}ساعت قبل`
  }else if(hours<1){
    return `دقایقی پیش`
  }
  else{
    return `${Days}روز قبل`
  }
  
  
}

const selectedSubCatID = (categories,urlID) => {
 
  let subOne = categories.flatMap(sub=>sub.subCategories)
  let demo = subOne.filter(subCat=> subCat._id == urlID)
   return demo
}

const selectedSubsubCatID = (categories,urlID) => {
  let subOne = categories.flatMap(sub=>sub.subCategories)
 let subTwo = subOne.flatMap(sub=> sub.subCategories)

  let demo = subTwo.filter(subCat=> subCat._id == urlID)
   return demo
 
}

const removeParamFromUrl = (param) => {
  const url = new URL(location.href)

  url.searchParams.delete(param)
  location.href = url
 // history.replaceState(null,null,url)
 
}

const generateCategoryFilters = (cat) => {
  
  const sidebarFiltersContainer = document.querySelector("#sidebar-filters");
  
  
  cat.map((filter)=>{
    if(filter.type == 'selectbox'){
      sidebarFiltersContainer.insertAdjacentHTML('beforebegin',`
        <div class="accordion accordion-flush" id="accordionFlushExample">
                  <div class="accordion-item">
                    <h2 class="accordion-header">
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#accordion-${filter.slug}"
                        aria-expanded="false"
                        aria-controls="accordion-${filter.name}"
                      >
                        <span class="sidebar__filter-title">${
                          filter.name
                        }</span>
                      </button>
                    </h2>
                    <div
                      id="accordion-${filter.slug}"
                      class="accordion-collapse collapse"
                      aria-labelledby="accordion-${filter.name}"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div class="accordion-body">
                        <select class="selectbox" onchange="sortByDynamicFilters(event.target.value,'${filter.slug}')">
                          ${filter.options
                            .sort((a, b) => b - a)
                            .map(
                              (option) =>
                                `<option value='${option}'>${option}</option>`
                            )}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
        `)
      
    }else{
      sidebarFiltersContainer.insertAdjacentHTML('beforebegin',`
        <div class="sidebar__filter">
                  <label class="switch">
                    <input id="exchange_controll" class="icon-controll" type="checkbox" />
                    <span class="slider round"></span>
                  </label>
                  <p>${filter.name}</p>
                </div>
        `)
    }
    
  })
  
} 


export{getPosts,showPosts,getPostCategories,showPostCategories,removeParamFromUrl,realTime}