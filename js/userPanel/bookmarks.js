
import { getBookmarks,generatePost,removeBookmark } from "./funcs/bookmarkfuncs.js";

window.addEventListener('load',async()=>{

   getBookmarks().then((posts)=>{
    generatePost(posts)
})
   
window.removeBookmark = removeBookmark
window.sharePost = async () => {
    await navigator.share();
  };
})
