import { isLoginn } from "../funcs/postDetalesfuncs.js";


window.addEventListener('load',()=>{

    isLoginn().then(user=>{
        if(user){
          const sidebarPhoneNumber = document.querySelector('#sidebar-phone-number')
         sidebarPhoneNumber.innerHTML = user.data.user.username
        }else{
            location.href = '/frontend/pages/posts.html'
        }
        
    })

})