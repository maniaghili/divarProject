import { getSupportArticles } from "./funcs/supportfuncs.js";

window.addEventListener('load',()=>{
const loading = document.querySelector('#loading-container')
const popularArticlesElement = document.querySelector("#popular-articles");
const categoriesContainerElement = document.querySelector("#categories-container");
const searchInput = document.querySelector('#search-input')
const searchResult = document.querySelector('#search-result')
const removeIcon = document.querySelector('#remove-icon')

let articlesArray = []

getSupportArticles().then((articles)=>{
   
  searchInput.addEventListener('keyup',(event)=>{
   let inputValue = event.target.value.trim()
   if(inputValue.length){
    removeIcon.classList.add('active')
    searchResult.classList.add('active')

    searchResult.innerHTML = `
    <a href="Test">
      <i class="bi bi-search"></i>
      ${event.target.value.trim()}
    </a>
  `;

  
    let ss = articles.flatMap((arti)=>arti.articles)
    articlesArray.push(ss)
    articlesArray[0].forEach((article)=>{
      if(article.title.includes(inputValue)){
        searchResult.insertAdjacentHTML('beforeend',`
          <a href="/frontend/pages/support/article.html?id=${article._id}">
                    <i class="bi bi-card-text"></i>
                    ${article.title}
                  </a>
          `)
      }else{
        searchResult.innerHTML = `
    <a href="Test">
      <i class="bi bi-search"></i>
      ${event.target.value.trim()}
    </a>
  `;
      }
      
      
    })
   }else{
    removeIcon.classList.remove('active')
    searchResult.classList.remove('active')
   }
   
   
   removeIcon.addEventListener('click',()=>{
    searchInput.value = ''
    removeIcon.classList.remove('active')
    searchResult.classList.remove('active')
   })
  })
  
  const popularArticles = articles.find((arti)=>arti.shortName == 'popular_articles')
    
    popularArticles.articles.map((article) => {
        popularArticlesElement.insertAdjacentHTML(
          "beforeend",
          `
              <a href="./support/article.html?id=${
                article._id
              }" class="article">
                  <p>${article.title}</p>
                  <span>${article.body.slice(0, 180)} ...</span>
                  <div>
                  <i class="bi bi-arrow-left"></i>
                  <p>ادامه مقاله</p>
                  </div>
              </a>
          `
        );
      });


      articles.map((category) => {
        categoriesContainerElement.insertAdjacentHTML(
          "beforeend",
          `
              <a href="./support/articles.html?id=${category._id}">
                  <img src="https://divarapi.liara.run/${category.pic.path}" width="64" height="64" alt="" />
                  <div>
                  <p>${category.name}</p>
                  <span>نحوه انجام پرداخت، استفاده از کیف پول، افزایش بازدید، استفاده از
                  </span>
                  </div>
                  <i class="bi bi-chevron-left"></i>
              </a>
          `
        );
      });

    
})



loading.style.display = 'none'
})