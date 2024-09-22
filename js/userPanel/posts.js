import { pagination } from "../funcs/util.js";
import { getUserPosts,showUserPosts } from "./funcs/postsfunc.js";

window.addEventListener('load',()=>{
 
getUserPosts().then((posts)=>{
    console.log(posts);
    
    showUserPosts(posts.posts)
    pagination("/pages/userPanel/posts.html",posts.pagination.totalPosts,2)
    
})
})