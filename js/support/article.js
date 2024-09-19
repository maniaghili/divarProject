import { getUrlParam } from "../funcs/util.js"
import { getArticleInfo ,showArticleInfo,getSameArticles,showSameArticles} from "../funcs/articlefuncs.js";
window.addEventListener('load',()=>{
const urlID = getUrlParam('id')
getArticleInfo(urlID).then((article)=>{
    showArticleInfo(article)
    getSameArticles(article.categories[0]).then((same)=>{
        showSameArticles(same)
    })
})
    
})