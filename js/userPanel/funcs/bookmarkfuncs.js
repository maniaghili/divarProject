import { getToken } from "../../funcs/share.js";
import { realTime } from "../../funcs/postsfuncs.js";
import { getUrlParam } from "../../funcs/util.js";
const token = getToken()
let posts = null
const getBookmarks = async () => {
  let page = getUrlParam('page')
  !page ? page = 1 : ''
      
    const res = await fetch(`https://divarapi.liara.run/v1/user/bookmarks?page=${page}&limit=2`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      });
      const response = await res.json();
     posts = response.data;
    return posts
}

const removeBookmark = (postID) => {
    let allPosts = posts
    const postsContainer = document.querySelector("#posts-container");
   fetch(`https://divarapi.liara.run/v1/bookmark/${postID}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${JSON.parse(token)}`},
      }).then((res) => {
        
        if (res.status === 200) {
         let posts = allPosts.filter((post) => post._id !== postID);
          postsContainer.innerHTML = "";
          if (posts.length) {
           generatePost(posts)
          } else {
            
            const emptyContainer = document.querySelector(".empty");
            emptyContainer.style.display = "flex";
          }
        }
      });
}

const generatePost = (posts)=>{
    const postsContainer = document.querySelector("#posts-container");
    const emptyContainer = document.querySelector(".empty");
    if(posts.length){
    posts.forEach((post)=>{
        let date = realTime(post.createdAt)
          postsContainer.insertAdjacentHTML(
              "beforeend",
              `
                <div class="post">
                    <div>
                        <div>
                        <a class="title" href="/pages/post.html?id=${post._id}">${
                post.title
              }</a>
                        <div>
                            <p>${post.price} تومان</p>
                            <p>${date} در ${post.neighborhood.name}</p>
                        </div>
                        </div>
                        ${
                          post.pics.length
                            ? `<img src="https://divarapi.liara.run/${post.pics[0].path}" />`
                            : `<img src="/public/images/main/noPicture.PNG" />`
                        }
                        
                    </div>
                    <div>
                        <button onclick="sharePost('${post._id}', '${post.title}')">
                        اشتراک گذاری
                        <i class="bi bi-share"></i>
                        </button>
                        <button onclick="removeBookmark('${post._id}')">
                        حذف نشان
                        <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>    
              `
                )
         })
        }else{
          emptyContainer.style.display = "flex";
        }
}

export {getBookmarks,removeBookmark,generatePost}