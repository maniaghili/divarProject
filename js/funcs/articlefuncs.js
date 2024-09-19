import { getUrlParam } from "./util.js"

const getArticleInfo =async (id) => {
   
    const fetchArticle = await fetch(`https://divarapi.liara.run/v1/support/articles/${id}`)
    const fetchArticleres = await fetchArticle.json()
    return fetchArticleres.data.article
  
}

const showArticleInfo = (artecle) => {

const breadcumb = document.querySelector('#breadcumb span')
const articleTitle = document.querySelector('#article-title')
const articleBody = document.querySelector('#article-body')


articleTitle.innerHTML = artecle.title
breadcumb.innerHTML = artecle.title
document.title = artecle.title
articleBody.innerHTML = artecle.body
    
}

const getSameArticles =async (id) => {
   const fetchSameArticles = await fetch(`https://divarapi.liara.run/v1/support/categories/${id}/articles`)
   const fetchSameArticlesres = await fetchSameArticles.json()
    return fetchSameArticlesres.data.articles
    
}

const showSameArticles = (same) => {
const urlID = getUrlParam('id')

const sameArticles = document.querySelector('#same-articles')
console.log(same);
same.forEach((s)=>{
    if(s._id!=urlID){
        sameArticles.insertAdjacentHTML('beforeend',`
            <a href="./support/article.html?id=${s._id}">${s.title}</a>
                `)
    }
  
})

}

// const 
export{getArticleInfo,showArticleInfo,getSameArticles ,showSameArticles}