
import { getBookmarks,generatePost,removeBookmark } from "./funcs/bookmarkfuncs.js";
import { pagination } from "../funcs/util.js";
window.addEventListener('load',async()=>{

   getBookmarks().then((posts)=>{

    pagination("/pages/userPanel/bookmarks.html",posts.pagination.totalPosts,2)
    generatePost(posts.posts)

})
   

window.sharePost = async () => {
    await navigator.share();
  };
})
