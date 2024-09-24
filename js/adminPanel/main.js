import { isLoginn } from "../funcs/postDetalesfuncs.js";
import { getToken } from "../funcs/share.js";

window.addEventListener('load',()=>{
    if(getToken()){
        isLoginn().then((user)=>{
            console.log(user.data.user);
            
        })
        
    }
    
})