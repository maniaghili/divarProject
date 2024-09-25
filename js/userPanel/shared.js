import { isLoginn } from "../funcs/postDetalesfuncs.js";
import { logOut } from "../funcs/util.js";

window.addEventListener('load',()=>{

    isLoginn().then(user=>{
        if(user){
          const sidebarPhoneNumber = document.querySelector('#sidebar-phone-number')
         sidebarPhoneNumber.innerHTML = user.data.user.username
         const logoutBtn = document.querySelector('#logout-btn')
         logoutBtn.addEventListener('click',(e)=>{
            e.preventDefault()
         logOut()
         })
         
        }else{
            location.href = '/divarProject/pages/posts.html'
        }
        
    })

})