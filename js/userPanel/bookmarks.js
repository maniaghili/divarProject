
import { getBookmarks,generatePost,removeBookmark } from "./funcs/bookmarkfuncs.js";
import { pagination } from "../funcs/util.js";
window.addEventListener('load',async()=>{

   getBookmarks().then((posts)=>{
    console.log(posts);
    pagination("/pages/userPanel/bookmarks.html",posts.pagination.totalPosts,2)
    generatePost(posts.posts)

})
   
window.removeBookmark = removeBookmark
window.sharePost = async () => {
    await navigator.share();
  };
})
