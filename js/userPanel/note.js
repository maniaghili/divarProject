import { getToken } from '../funcs/share.js';
import { getNotes ,postGenerator } from './funcs/notefuncs.js';


window.addEventListener('load',async()=>{

    const postsContainer = document.querySelector("#posts-container");
  const emptyContainer = document.querySelector(".empty");

  const token =JSON.parse(getToken())
  let allPosts = [];

  await getNotes().then((posts)=>{
 
    allPosts = posts
  })

  if (allPosts.length) {
    allPosts.map((post) => postGenerator(post));
  } else {
    emptyContainer.style.display = "flex";
  }

  window.removeNote = async (noteID) => {
 
          fetch(`https://divarapi.liara.run/v1/note/${noteID}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => {
            if (res.status === 200) {
              allPosts = allPosts.filter((post) => post.note._id !== noteID);
              postsContainer.innerHTML = "";
              if (allPosts.length) {
                allPosts.map((post) => postGenerator(post));
              } else {
                emptyContainer.style.display = "flex";
              }
            }
          });
        }
      }
    );
  

