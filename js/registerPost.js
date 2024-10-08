import { showSubCategoryDetale,showCities,uploadImage,postMap } from "./funcs/registerPostfuncs.js";

window.addEventListener('load',()=>{
  const changeCategory = document.querySelector('#change-category')
  changeCategory.addEventListener('click',(e)=>{
    e.preventDefault()
    location.href = '/divarProject/pages/new.html'
  })
    showSubCategoryDetale();
    showCities();
    postMap();
    const imageInput = document.querySelector('#uploader');
    let allImage = [];
    imageInput.addEventListener('change',(e)=>{
      allImage.push(e.target.files[0])
      const imagesContainer = document.querySelector("#images-container");
      imagesContainer.innerHTML = ''
      uploadImage(allImage)
    })
    
    
    window.deleteImage = (name) => {

    allImage = allImage.filter(pic => pic.name != name)
      
      uploadImage(allImage)
    } 
})


