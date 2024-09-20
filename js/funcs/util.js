const setLocalStorage = (key,value) => {
   localStorage.setItem(key,JSON.stringify(value))

}

const getLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key))

}

const setCityNameCookie = (city) => {
    document.cookie = `city = ${city};path =/`
}
  
const getCityCookie = () => {
   
   const cookiesArray = document.cookie.split(';')
   const constantValue = 'city='

   let result = ''
    cookiesArray.forEach((cookie)=>{
    if(cookie.includes(constantValue)){
      result = cookie.substring(constantValue.length)
    }
    
   })
   return result
   
}

const setUrlParam = (key,value) => {
  
  let url = new URL(location.href)
  
  let searchUrl = url.searchParams
  searchUrl.set(key,value)
  url.search = searchUrl.toString()
  location.href = url.toString()
 
  
}

const getUrlParam = (key) => {
  let url = new URLSearchParams(location.search)

 return url.get(key)
}

const showModal = (id,className) => {
const elementID = document.querySelector(`#${id}`)
elementID.classList.add(className)
}

const hideModal = (id,className) => {
  const elementID = document.querySelector(`#${id}`)
  elementID.classList.remove(className)
  
}

const pagination = (href,totalItems,itemsPrepages) => {
  const parentElement = document.querySelector(".pagination-items");
  let page = getUrlParam('page')
  !page ? page = 1 : '' 
 let currentItems = totalItems / itemsPrepages
 
 for(let i =1 ; currentItems+1>i ; i++){
  parentElement.insertAdjacentHTML('beforeend',`
    <li>
    <a href="${href}?page=${i}" class="${page == i?`active`:''}">${i}</a>
    </li>
    `)
 }
}


export { getCityCookie,
  getLocalStorage,
  setCityNameCookie,
  setLocalStorage,
  setUrlParam,
  getUrlParam,
  showModal,
  pagination,
hideModal}