import { pagination } from "../funcs/util.js";
import { getUserPosts,showUserPosts } from "./funcs/postsfunc.js";

window.addEventListener('load',()=>{
 
getUserPosts().then((posts)=>{
  
    showUserPosts(posts.posts)
    pagination("/divarProject/pages/userPanel/posts.html",posts.pagination.totalPosts,2)
    
})
})