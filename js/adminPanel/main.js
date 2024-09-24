import { isLoginn } from "../funcs/postDetalesfuncs.js";
import { getToken } from "../funcs/share.js";
import { logOut } from "../funcs/util.js";

window.addEventListener('load',()=>{
    const userPhone = document.querySelector('#user-phone')
    const logout = document.querySelector('.logout')
    if(getToken()){
        isLoginn().then((user)=>{
            let userInfo = user.data.user
            userPhone.innerHTML = userInfo.phone
        })
        
    }
    

    logout.addEventListener('click',()=>{
        logOut()
    })
})