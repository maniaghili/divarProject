import { getUrlParam } from "../../funcs/util.js";
import { getToken } from "../../funcs/share.js";
import { realTime } from "../../funcs/postsfuncs.js";


const getUserPosts = async () => {
    let page = getUrlParam('page');
    !page?page = 1 : null

    let token = getToken()

    const res = await fetch(`https://divarapi.liara.run/v1/user/posts?page=${page}&limit=2`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      });
    
      const response = await res.json();
       return response.data
      
    
}

const showUserPosts = (posts) => {

    const postsContainer = document.querySelector("#posts-container");
    const emptyContainer = document.querySelector(".empty");
    const paginationContainer = document.querySelector(".pagination-items")
if(posts.length){
    posts.map((post) => {
        const date = realTime(post.createdAt);
  
        postsContainer.insertAdjacentHTML(
          "beforeend",
          `
          ${
            post.status === "pending" || post.status === "rejected"? `
            <a class="post" href="/pages/userpanel/posts/preview.html?id=${post._id}">
            `:`<a class="post" href="/pages/post.html?id=${post._id}">`}
              
                  <div class="post-info">
                  ${
                    post.pics.length
                      ? `<img src="https://divarapi.liara.run/${post.pics[0].path}" />`
                      : `<img src="../images/main/noPicture.PNG" />`
                  }
                  <div>
                      <p class="title">${post.title}</p>
                      <p class="price">${post.price} تومان</p>
                      <p class="location">${date} در ${post.city.name}</p>
                  </div>
                  </div>
                  <div class="post-status">
                  <div>
                      <p>وضعیت آگهی:</p>
                      ${
                        post.status === "published"
                          ? `<p class="publish">منتشر شده</p>`
                          : ""
                      }
                      ${
                        post.status === "rejected"
                          ? `<p class="reject">رد شده</p>`
                          : ""
                      }
                      ${
                        post.status === "pending"
                          ? `<p class="pending">در صف انتشار</p>`
                          : ""
                      }
                      
                  </div>
                  <button class="controll-btn"> <a href="/divarProject/pages/userPanel/posts/preview.html">مدیریت آگهی</a></button>
                  </div>
              </a>      
          `
        );
      });
    }else{
      emptyContainer.style.display = "flex";
    }
}


export{getUserPosts,showUserPosts}