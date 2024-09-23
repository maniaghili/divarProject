import { realTime } from "./postsfuncs.js"
import { getLocalStorage, getUrlParam, setLocalStorage } from "./util.js"


const postTitle = document.querySelector("#post-title");
const postDescription = document.querySelector("#post-description");
const postLocation = document.querySelector("#post-location");
const postBreadcrumb = document.querySelector("#breadcrumb");
const shareIcon = document.querySelector('#share-icon')
const postPreview = document.querySelector("#post-preview");
const mainSlider = document.querySelector("#main-slider-wrapper");
const secendSlider = document.querySelector("#secend-slider-wrapper");
const noteTextarea = document.querySelector("#note-textarea");
const postFeedbackIcons = document.querySelectorAll(".post_feedback_icon");
const postInfos = document.querySelector("#post-infoes-list");
const phoneInfoBtn = document.querySelector('#phone-info-btn')
const loginModal = document.querySelector('#login-modal')
const noteTrashIcon = document.querySelector('#note-trash-icon')
const bookmarkIconBtn = document.querySelector('#bookmark-icon-btn')
const postBtnIcon = document.querySelector('.post__btn-icon ')
const postInfoesList = document.querySelector('#post-infoes-list') 

const isLoginn = async () => {

  let getLocal =await getLocalStorage('divar')
  
  const fetchUserToken = await fetch(`https://divarapi.liara.run/v1/auth/me`,{
    headers:{
      "Authorization" : `Bearer ${getLocal}`
    }
  })

  if(fetchUserToken.status == 200){
    return fetchUserToken.json()
  }else{
   return false
  }
}


const getPostDetales =async (id)=>{

    const fetchPostDetales = await fetch(`https://divarapi.liara.run/v1/post/${id}`)
    const fetchPostDetalesres = await fetchPostDetales.json()
    return fetchPostDetalesres
}
let userToken = getLocalStorage('divar')
const getPostAndNoteDetales =async (id) =>{
  const fetchPostDetales = await fetch(`https://divarapi.liara.run/v1/post/${id}`,{
    headers:{
      "Authorization" : `Bearer ${userToken?userToken:null}`
    }
  })
  return await fetchPostDetales.json()
  
}

const showPostDetales = (post)=>{
  let userToken = getLocalStorage('divar')
  let notes = null
  let bookMark = null

  
  getPostAndNoteDetales(post._id).then((note)=>{
    
    
    if(note.data.post.bookmarked){
      bookMark = 'red'
      postBtnIcon.style.color = 'red'
    }
    
  if(note.data.post.note){
    notes = note.data.post.note._id
    noteTextarea.value = note.data.post.note.content
    noteTrashIcon.style.display = 'block'
  }
  
 
  })

 
  bookmarkIconBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    isLoginn().then((islogin)=>{
      if(islogin){
        let urlP = getUrlParam('id')
      if(bookMark){
        postBtnIcon.style.color = ''
        bookMark = null
        delBookmark(urlP)
      }else{
        bookMark = 'red'
        postBtnIcon.style.color = 'red'
        
         getBookmark(urlP)
      }
      }else{
        loginModal.classList.add('login-modal--active')
      }
    })
  })
 

    noteTextarea.addEventListener('blur',async (e)=>{
  
      if(notes){

        await fetch(`https://divarapi.liara.run/v1/note/${notes}`,{
          method:'PUT',
          headers:{
            "Authorization" : `Bearer ${userToken}`,
           "content-type" : "application/json"
          },
          body:JSON.stringify({
            "content": e.target.value})
        })
        
        
      }else{
        await fetch(`https://divarapi.liara.run/v1/note`,{
          method:'POST',
          headers:{
            "Authorization" : `Bearer ${userToken}`,
           "content-type" : "application/json"
          },
          body:JSON.stringify({ "postId": post._id,
            "content": e.target.value})
        })
      }
      

      
 
    })
    
    noteTrashIcon.addEventListener('click',(e)=>{
      e.preventDefault()
      noteTextarea.value = ''
    })

    postInfoesList.insertAdjacentHTML(
      "beforeend",
      `
        <li class="post__info-item">
          <span class="post__info-key">قیمت</span>
          <span class="post__info-value">${post.price.toLocaleString()} تومان</span>
        </li>
      `
    );


    post.dynamicFields.forEach((field)=>{
      postInfoesList.insertAdjacentHTML('beforeend',`
         <li class="post__info-item">
            <span class="post__info-key">${field.name}</span>
            <span class="post__info-value">${typeof(field.data) == "boolean"?(field.data?`دارد`:`ندارد`):field.data}</span>
          </li>
        `)
    })
    
    if (post.pics.length) {
      post.pics.map((pic) => {
        mainSlider.insertAdjacentHTML(
          "beforeend",
          `
            <div class="swiper-slide">
              <img src="https://divarapi.liara.run/${pic.path}" />
            </div>
          `
        );

        secendSlider.insertAdjacentHTML(
          "beforeend",
          `
            <div class="swiper-slide">
              <img src="https://divarapi.liara.run/${pic.path}" />
            </div>
          `
        );
      });
    } else {
      postPreview.style.display = "none";
    }

    const mainSliderConfigs = new Swiper(".mySwiper", {
      spaceBetween: 10,
      rewind: true,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    });

    const secondSliderConfigs = new Swiper(".mySwiper2", {
      spaceBetween: 10,
      rewind: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },

      thumbs: {
        swiper: mainSliderConfigs,
      },
    });







   noteTextarea.addEventListener('keyup',(e)=>{

    if(e.target.value.trim()){
      noteTrashIcon.style.display = 'block'
    }else{
      noteTrashIcon.style.display = 'none'
    }
   })


    noteTextarea.addEventListener('focus',(e)=>{
    e.preventDefault()
     isLoginn().then((isLogin)=>{
      if(!isLogin){
        loginModal.classList.add('login-modal--active')
        }

     })
   
    
  ////////////////////////////////////////////////////////////////////
  // have to you fix this code
   
    })

    phoneInfoBtn.addEventListener('click',(e)=>{
      e.preventDefault()
      alert(post.creator.phone)
    })

    postFeedbackIcons.forEach((icon)=>{
      icon.addEventListener('click',(e)=>{
       postFeedbackIcons.forEach((icon)=>{ icon.classList.remove('active')})
        e.target.classList.add('active')
      })
    })

    
    shareIcon.addEventListener('click',(e)=>{
      e.preventDefault()
      navigator.share(location.href)
    })

    postTitle.innerHTML = post.title;
    postDescription.innerHTML = post.description;

    const date = realTime(post.createdAt);
    postLocation.innerHTML = `${date} در ${post.city.name}، ${
      post.neighborhood ? post?.neighborhood?.name : ""
    }`;

    postBreadcrumb.insertAdjacentHTML(
      "beforeend",
      `
        <li class="main__breadcrumb-item">
          <a href='./posts.html?categoryID=${post.breadcrumbs.category._id}' id="category-breadcrumb">${post.breadcrumbs.category.title}</a>
          <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
        </li>
        <li class="main__breadcrumb-item">
          <a href='./posts.html?categoryID=${post.breadcrumbs.subCategory._id}' id="category-breadcrumb">${post.breadcrumbs.subCategory.title}</a>
          <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
        </li>
        <li class="main__breadcrumb-item">
          <a href='./posts.html?categoryID=${post.breadcrumbs.subSubCategory._id}' id="category-breadcrumb">${post.breadcrumbs.subSubCategory.title}</a>
          <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
        </li>
        <li class="main__breadcrumb-item">${post.title}</li>    
      `
    );
}

const getBookmark =async (id)=>{
  let userToken = getLocalStorage('divar')
 await fetch(`https://divarapi.liara.run/v1/bookmark/${id}`,{
    method:'POST',
    headers:{
      "Authorization" : `Bearer ${userToken}`,
      "Content-type" : "application/json"

    }
  })
 
  
}

const delBookmark = async (id)=>{
  let userToken = getLocalStorage('divar')

 await fetch(`https://divarapi.liara.run/v1/bookmark/${id}`,{
    method:'DELETE',
    headers:{
      "Authorization" : `Bearer ${userToken}`,
      "Content-type" : "application/json"

    }
  })
  
  
}

const saveRecentSeen = (pos) => {
  
  const recentSeens = getLocalStorage('recent-seen')
  console.log(recentSeens);
  
  let findPost = recentSeens?.some(post => post === pos._id)
  if(recentSeens && !findPost){
    setLocalStorage('recent-seen',[...recentSeens,pos._id])
  }else{
    if(!recentSeens) {
    setLocalStorage('recent-seen',[pos._id])
    }
  }
}
export{getPostDetales,showPostDetales,isLoginn,saveRecentSeen}