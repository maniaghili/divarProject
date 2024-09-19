import { getUrlParam } from "./funcs/util.js";
import { getPostDetales,showPostDetales } from "./funcs/postDetalesfuncs.js";

const loadingContainer = document.querySelector('#loading-container')


window.addEventListener('load',()=>{
let postID = getUrlParam('id')
getPostDetales(postID).then((res)=>{

    showPostDetales(res.data.post)
})

loadingContainer.style.display = 'none'
})