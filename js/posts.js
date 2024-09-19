import { getPosts,showPosts,getPostCategories,showPostCategories } from "./funcs/postsfuncs.js";
import { getLocalStorage } from "./funcs/util.js";

window.addEventListener('load',()=>{
    // loadingContainer is disabled in the end this scope 
    const loadingContainer = document.querySelector('#loading-container')
    const exchangeControll = document.querySelector('#exchange_controll')
    const justPhotoControll = document.querySelector('#just_photo_controll')
    const minPriceSelectBox = document.querySelector('#min-price-selectbox')
    const maxPriceSelectBox = document.querySelector('#max-price-selectbox')

    let cityName = getLocalStorage('cities')
     let posts = ''
     let newPosts = []
     let minPrice = 'default'
     let maxPrice = 'default'
     let filtersObject = {} 
     let modelFilter = []
   if(cityName.length == 1){
    getPosts(cityName[0].id).then((allPosts)=>{
      allPosts.data.posts.map((post)=>{

        modelFilter.push(post)
        
      })
      
      posts = allPosts.data.posts
      showPosts([...posts])
  })
   }else{
   
    
    getPosts(cityName.map((city)=>city.id).join('|')).then((allPosts)=>{
      allPosts.data.posts.map((post)=>{

        modelFilter.push(post)
        
      })
      
      posts = allPosts.data.posts
      showPosts([...posts])
  })
   }

    getPostCategories().then((cat)=>{
        showPostCategories(cat.data.categories)
    })
    
    exchangeControll?.addEventListener('change',()=>{ 
         newPosts = showPostsWithFilter(posts)
         if(newPosts){
            showPosts(newPosts)
         }
    })

    justPhotoControll?.addEventListener('change',()=>{
           newPosts = showPostsWithFilter(posts)
           if(newPosts){
          
            showPosts(newPosts)
           }     
    })

   minPriceSelectBox?.addEventListener('change',(event)=>{
    minPrice = event.target.value
   let ll = showPostsWithPriceFilter()
   showPosts(ll)
   })

   maxPriceSelectBox?.addEventListener('change',(event)=>{
    maxPrice = event.target.value
    let ll = showPostsWithPriceFilter()
   showPosts(ll)
   })

   const showPostsWithFilter = (posts) => {
//console.log(posts);

    if(justPhotoControll.checked){
      let postMan = posts.filter((post)=> post.pics.length)
      console.log(postMan);
      
        return postMan
      }
      if(exchangeControll.checked){
        let postMan = posts.filter((post)=> post.exchange)
  
        return postMan
        }
  }

  const showPostsWithPriceFilter = () => {

   let priceFilter = [] 
   
    if(maxPrice != 'default'){
        if(minPrice!= 'default'){
          priceFilter = posts.filter(post=>post.price>minPrice&&post.price<maxPrice)

          return priceFilter
        }else{
           priceFilter = posts.filter(post=>post.price<maxPrice)
           return priceFilter
        }
    }else{
       priceFilter = posts.filter(post=>post.price>minPrice)
       console.log(priceFilter);
       
       return priceFilter
    }

    
    
  }

  
window.sortByDynamicFilters = (event,key) => {
 let okPosts = []
  filtersObject[key] = event
  modelFilter.filter((fil)=>{
  fil.dynamicFields.map((l)=>{
  if(l.data == filtersObject.model){
    okPosts.push(fil)
    
    
  }
 })
 })

 showPosts(okPosts)
}

loadingContainer.style.display = 'none'
})



