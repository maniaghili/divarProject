import { getUrlParam } from "../funcs/util.js";

window.addEventListener('load',()=>{
const articlesContainer = document.querySelector("#articles");
const breadcrumb = document.querySelector('#breadcrumb span')
const categoryInfo = document.querySelector('#category-info')
const urlID = getUrlParam('id')
getArticleInfos().then((categories)=>{
 const thisCategory = categories.find((cat)=> cat._id == urlID)

breadcrumb.innerHTML = thisCategory.name
categoryInfo.insertAdjacentHTML('beforeend',
    `<img class="rounded-circle" src="https://divarapi.liara.run/${thisCategory.pic.path}">
<p>${thisCategory.name}</p>
`)
thisCategory.articles.forEach((article)=>{
    articlesContainer.insertAdjacentHTML('beforeend',`
            <a href="/divarProject/pages/support/article.html?id=${
              article._id
            }" class="article">
                <div>
                    <p>${article.title}</p>
                    <span>${article.body.slice(0, 180)} ...</span>
                </div>
                <i class="bi bi-arrow-left"></i>
            </a>
        `)
    
})


})

})




const getArticleInfos = async(id) => {

    const fetchArticle = await fetch(`https://divarapi.liara.run/v1/support/category-articles`)
    const fetchArticleres =await fetchArticle.json()
     return fetchArticleres.data.categories
    
}