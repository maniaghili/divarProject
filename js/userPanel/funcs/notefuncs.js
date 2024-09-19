import { realTime } from '../../funcs/postsfuncs.js'
import { getToken } from '../../funcs/share.js';
const getNotes = async () => {
    const token = getToken()
 
    const res = await fetch(`https://divarapi.liara.run/v1/user/notes`, {
        headers: {
          "Authorization": `Bearer ${JSON.parse(token)}`,
        },
      });
      const response = await res.json();
      return response.data.posts;
}

const postGenerator = (post) => {
    const postsContainer = document.querySelector("#posts-container");
    postsContainer.insertAdjacentHTML(
      "beforeend",
      `
        <div class="post">
            <div>
                ${
                  post.pics.length
                    ? `<img src="https://divarapi.liara.run/${post.pics[0].path}" />`
                    : `<img src="/public/images/main/noPicture.PNG" />`
                }
                
                <div>
                <a class="title" href="/pages/post.html?id=${post._id}">${
        post.title
      }</a>
                <p>${realTime(post.createdAt)} در ${post.neighborhood.name}</p>
                <p>${post.note.content}</p>
                </div>
            </div>
            <i class="bi bi-trash" onclick=removeNote('${post.note._id}')></i>
        </div>    
      `
    );
  };


  export {postGenerator,getNotes}