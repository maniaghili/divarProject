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

    posts.map((post) => {
        const date = realTime(post.createdAt);
  
        postsContainer.insertAdjacentHTML(
          "beforeend",
          `
              <a class="post" href="/pages/post.html?id=${post._id}">
                  <div class="post-info">
                  ${
                    post.pics.length
                      ? `<img src="https://divarapi.liara.run/${post.pics[0].path}" />`
                      : `<img src="/public/images/main/noPicture.PNG" />`
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
                  <button class="controll-btn">مدیریت اگهی</button>
                  </div>
              </a>      
          `
        );
      });
}


export{getUserPosts,showUserPosts}