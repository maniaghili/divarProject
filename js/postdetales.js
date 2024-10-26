import { getUrlParam } from "./funcs/util.js";
import { getPostDetales,showPostDetales,saveRecentSeen } from "./funcs/postDetalesfuncs.js";

const loadingContainer = document.querySelector('#loading-container')

window.addEventListener('load',()=>{
let postID = getUrlParam('id')
getPostDetales(postID).then((res)=>{
    saveRecentSeen(res.data.post)
    showPostDetales(res.data.post)
})

loadingContainer.style.display = 'none'
})