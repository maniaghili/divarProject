import{getLocalStorage, getUrlParam} from './util.js'
import { getCategories } from './newfuncs.js'
let allImages = null
let dynamicField = {}  
let mapView = { x: 35.715298, y: 51.404343 };
const showSubCategoryDetale = async () => {
  const citySelectBox = document.querySelector(".city-select-box");
  const neighborhoodSelectBox = document.querySelector(".neighborhood-select-box");
  const postTitleInput = document.querySelector("#post-title-input");
  const postPriceInput = document.querySelector("#post-price-input");
  const exchangeCheckbox = document.querySelector("#exchange-checkbox");
  const postDescriptionTextarea = document.querySelector("#post-description-textarea");

  let urlID =  getUrlParam('subCategoryID')
  
getCategories().then((categories)=>{
  const dynamicFields = document.querySelector(".dynamic");
  const categoryDetails = document.querySelector('.category_details p')
const sendPost = document.querySelector('.send-post')

  let allCat = categories.flatMap((subs)=>subs.subCategories)
  let allSub = allCat.flatMap((sub)=>sub.subCategories)
  let urlSub = allSub.find((sub)=>sub._id == urlID)
  
    categoryDetails.innerHTML = urlSub.title

    urlSub.productFields.map((field) => {

      dynamicFields.insertAdjacentHTML(
        "beforeend",
        `
          ${
            field.type === "selectbox"
              ? `
                   <div class="group">
                  <p class="field-title">${field.name}</p>
                  <div class="field-box">
                    <select required="required" onchange="fieldChangeHandler('${
                      field.slug
                    }', event.target.value)">
                      <option value="default">انتخاب</option>
                      ${field.options.map(
                        (option) =>
                          `<option value="${option}">${option}</option>`
                      )}
                    </select>
                  
                  </div>
                  
                </div>
                `
              : `
                <div class="group checkbox-group">
                  <input class="checkbox" type="checkbox" onchange="fieldChangeHandler('${field.slug}', event.target.checked)" />
                  <p>${field.name}</p>
                </div>             
                `
          }
        `
      );

      if(field.type == 'selectbox'){
    dynamicField[field.slug] = null
      }else{
        dynamicField[field.slug] = false
      }

    });
  
    window.fieldChangeHandler = (slug, data) => {
      dynamicField[slug] = data
   
    };
    //validation
    let dynamicValidation = null
   
    sendPost.addEventListener('click',async (e)=>{
      e.preventDefault()
     for(let valid in dynamicField){
      if(dynamicField[valid] == null || false){
        dynamicValidation = false
      }else{
        dynamicValidation = true
      }
     }
     if(citySelectBox.value == 'default'|| !postTitleInput.value.trim().length || !postDescriptionTextarea.value.trim().length ||
    !postPriceInput.value.trim().length || dynamicValidation == false){
      alert('لطفا اطلاعات را کامل پر کنید')
      dynamicValidation = false
    }else{
      dynamicValidation = true
      // finish validation
      const formData = new FormData();
      formData.append("city", citySelectBox.value);
      formData.append("neighborhood", neighborhoodSelectBox.value);
      formData.append("title", postTitleInput.value);
      formData.append("description", postDescriptionTextarea.value);
      formData.append("price", postPriceInput.value);
      formData.append("exchange", exchangeCheckbox.checked);
      formData.append("map", JSON.stringify(mapView));
      formData.append("categoryFields", JSON.stringify(dynamicField));

      allImages?.map((pic) => {
        formData.append("pics", pic);
      });

      const res = await fetch(`https://divarapi.liara.run/v1/post/${urlID}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getLocalStorage('divar')}`,
        },
        body: formData,
      });

      const data = await res.json();
   console.log(data);
   
      if (res.status === 201) {
       alert("آگهی مورد نظر با موفقیت در صف انتشار قرار گرفت")
      }
    }
    })

    
  });

}


const showCities = async () => {
  const neighborhoodSelectBox = document.querySelector('.neighborhood-select-box')
    const citySelectBox = document.querySelector('.city-select-box')
    const fetchAllCities = await fetch(`https://divarapi.liara.run/v1/location/`)
    const fetchAllCitiesres = await fetchAllCities.json()
   let data = fetchAllCitiesres.data
 
  data.cities.map((city)=>{
    citySelectBox.insertAdjacentHTML('beforeend',`
      <option value="${city.id}">${city.name}</option>
      `)
  })
  citySelectBox.addEventListener('change',(e)=>{

   let ne = data.neighborhoods.filter((neighborhood)=>{
      return neighborhood.city_id == e.target.value
    })
    neighborhoodSelectBox.innerHTML = ''
    if(ne.length){
    ne.map((nee)=>{

      neighborhoodSelectBox.insertAdjacentHTML('beforeend',`
      <option value="${nee.id}">${nee.name}</option>
      `)
    })
  }
  else{
    neighborhoodSelectBox.insertAdjacentHTML('beforeend',`
      <option value="">منطقه ای پیدا نشد</option>
      `)
  }
    
  })




  //  const cityChoices = new Choices(citySelectBox);
  //  const neighborhoodChoices = new Choices(neighborhoodSelectBox);

  //   const tehranNeighborhood = data.neighborhoods.filter(
  //     (neighborhood) => neighborhood.city_id === 301 // 301 is tehran code
  //   );

  //   const neighborhoodChoicesConfigs = [
  //     {
  //       value: "default",
  //       label: "انتخاب محله",
  //       disabled: true,
  //       selected: true,
  //     },
  //     ...tehranNeighborhood.map((neighborhood) => ({
  //       value: neighborhood.id,
  //       label: neighborhood.name,
  //     })),
  //   ];

  //   neighborhoodChoices.setChoices(
  //     neighborhoodChoicesConfigs,
  //     "value",
  //     "label",
  //     false
  //   );

  //   cityChoices.setChoices(
  //     data.cities.map((city) => {
  //       return {
  //         value: city.id,
  //         label: city.name,
  //         customProperties: { id: city.id },
  //         selected: city.name === "تهران" ? true : false,
  //       };
  //     }),
  //     "value",
  //     "label",
  //     false
  //   );

  //   citySelectBox.addEventListener("addItem", (event) => {
  //     neighborhoodChoices.clearStore();
  //     const neighborhoods = data.neighborhoods.filter(
  //       (neighborhood) =>
  //         neighborhood.city_id === event.detail.customProperties.id
  //     );

  //     console.log(neighborhoods);

  //     if (neighborhoods.length) {
  //       const neighborhoodChoicesConfigs = [
  //         {
  //           value: "default",
  //           label: "انتخاب محله",
  //           disabled: true,
  //           selected: true,
  //         },
  //         [...neighborhoods].map((neighborhood) => ({
  //           value: neighborhood.id,
  //           label: neighborhood.name,
  //         })),
  //       ];

  //       neighborhoodChoices.setChoices(
  //         neighborhoodChoicesConfigs,
  //         "value",
  //         "label",
  //         false
  //       );
  //     } else {
  //       neighborhoodChoices.setChoices(
  //         [
  //           {
  //             value: 0,
  //             label: "محله‌ای یافت نشد",
  //             disabled: true,
  //             selected: true,
  //           },
  //         ],
  //         "value",
  //         "label",
  //         false
  //       );
  //     }
  //   });
}

const uploadImage =async (allImage) => {
  allImages = allImage
  const imagesContainer = document.querySelector("#images-container");
     allImage.map(image=>{
      let ff = new FileReader()
      ff.onloadend = function () {
        let src = ff.result
        
        imagesContainer.insertAdjacentHTML('beforeend',`
        <div class="image-box">
              <div onclick="deleteImage('${image.name}')">
                <i class="bi bi-trash"></i>
              </div>
              <img src="${src}" alt="post-image" />
            </div> 
        `)
      }
      ff.readAsDataURL(image)
     })
}

const postMap = () => {
 
 
  let markerIcon = null;
  let iconStatus = "FIRST_ICON";
 
  let map = L.map("map").setView([35.715298, 51.404343], 13);

  let firstIcon = L.icon({
    iconUrl:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjciIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNyA0OCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBpbi1hIiB4MT0iNTAlIiB4Mj0iNTAlIiB5MT0iMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0E2MjYyNiIgc3RvcC1vcGFjaXR5PSIuMzIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjQTYyNjI2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHBhdGggaWQ9InBpbi1jIiBkPSJNMTguNzk0MzMzMywxNC40NjA0IEMxOC43OTQzMzMzLDE3LjQwNTQ1OTkgMTYuNDA3NDQ5NiwxOS43OTM3MzMzIDEzLjQ2MDEwNDcsMTkuNzkzNzMzMyBDMTAuNTE0NTUwNCwxOS43OTM3MzMzIDguMTI3NjY2NjcsMTcuNDA1NDU5OSA4LjEyNzY2NjY3LDE0LjQ2MDQgQzguMTI3NjY2NjcsMTEuNTE1MzQwMSAxMC41MTQ1NTA0LDkuMTI3MDY2NjcgMTMuNDYwMTA0Nyw5LjEyNzA2NjY3IEMxNi40MDc0NDk2LDkuMTI3MDY2NjcgMTguNzk0MzMzMywxMS41MTUzNDAxIDE4Ljc5NDMzMzMsMTQuNDYwNCIvPgogICAgPGZpbHRlciBpZD0icGluLWIiIHdpZHRoPSIyMzEuMiUiIGhlaWdodD0iMjMxLjIlIiB4PSItNjUuNiUiIHk9Ii00Ni45JSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij4KICAgICAgPGZlT2Zmc2V0IGR5PSIyIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIxIiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiIHN0ZERldmlhdGlvbj0iMiIvPgogICAgICA8ZmVDb2xvck1hdHJpeCBpbj0ic2hhZG93Qmx1ck91dGVyMSIgdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuMjQgMCIvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICA8cGF0aCBmaWxsPSJ1cmwoI3Bpbi1hKSIgZD0iTTEzLjA3MzcsMS4wMDUxIEM1LjgwMzIsMS4yMTUxIC0wLjEzOTgsNy40Njg2IDAuMDAyNywxNC43MzkxIEMwLjEwOTIsMjAuMTkwMSAzLjQ1NTcsMjQuODQ2MSA4LjE5NTcsMjYuODYzNiBDMTAuNDUzMiwyNy44MjUxIDExLjk3MTIsMjkuOTc0NiAxMS45NzEyLDMyLjQyODYgTDExLjk3MTIsMzkuNDExNTUxNCBDMTEuOTcxMiw0MC4yMzk1NTE0IDEyLjY0MTcsNDAuOTExNTUxNCAxMy40NzEyLDQwLjkxMTU1MTQgQzE0LjI5OTIsNDAuOTExNTUxNCAxNC45NzEyLDQwLjIzOTU1MTQgMTQuOTcxMiwzOS40MTE1NTE0IEwxNC45NzEyLDMyLjQyNTYgQzE0Ljk3MTIsMzAuMDEyMSAxNi40MTcyLDI3LjgzNDEgMTguNjQ0NywyNi45MDU2IEMyMy41MTY3LDI0Ljg3NzYgMjYuOTQxMiwyMC4wNzYxIDI2Ljk0MTIsMTQuNDcwNiBDMjYuOTQxMiw2Ljg5ODYgMjAuNjkzNywwLjc4NjEgMTMuMDczNywxLjAwNTEgWiIvPgogICAgPHBhdGggZmlsbD0iI0E2MjYyNiIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMTMuNDcwNiw0Ny44MTIgQzEyLjU1NTYsNDcuODEyIDExLjgxNDYsNDcuMDcxIDExLjgxNDYsNDYuMTU2IEMxMS44MTQ2LDQ1LjI0MSAxMi41NTU2LDQ0LjUgMTMuNDcwNiw0NC41IEMxNC4zODU2LDQ0LjUgMTUuMTI2Niw0NS4yNDEgMTUuMTI2Niw0Ni4xNTYgQzE1LjEyNjYsNDcuMDcxIDE0LjM4NTYsNDcuODEyIDEzLjQ3MDYsNDcuODEyIFoiLz4KICAgIDx1c2UgZmlsbD0iIzAwMCIgZmlsdGVyPSJ1cmwoI3Bpbi1iKSIgeGxpbms6aHJlZj0iI3Bpbi1jIi8+CiAgICA8dXNlIGZpbGw9IiNGRkYiIHhsaW5rOmhyZWY9IiNwaW4tYyIvPgogIDwvZz4KPC9zdmc+Cg==",
    iconSize: [30, 30],
  });

  let secondIcon = L.icon({
    iconUrl:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNSA0OUMxMS44IDQ5IDEgMzguMiAxIDI1QzEgMTEuOCAxMS44IDEgMjUgMUMzOC4yIDEgNDkgMTEuOCA0OSAyNUM0OSAzOC4yIDM4LjIgNDkgMjUgNDlaTTI1IDUuOEMxNC40NCA1LjggNS44IDE0LjQ0IDUuOCAyNUM1LjggMzUuNTYgMTQuNDQgNDQuMiAyNSA0NC4yQzM1LjU2IDQ0LjIgNDQuMiAzNS41NiA0NC4yIDI1QzQ0LjIgMTQuNDQgMzUuNTYgNS44IDI1IDUuOFoiIGZpbGw9IiNBNjI2MjYiLz4KPHBhdGggZD0iTTI1IDM3QzE4LjQgMzcgMTMgMzEuNiAxMyAyNUMxMyAxOC40IDE4LjQgMTMgMjUgMTNDMzEuNiAxMyAzNyAxOC40IDM3IDI1QzM3IDMxLjYgMzEuNiAzNyAyNSAzN1oiIGZpbGw9IiNBNjI2MjYiLz4KPC9zdmc+Cg==",
    iconSize: [30, 30],
  });

  markerIcon = firstIcon;

  let mapMarker = L.marker([35.715298, 51.404343], { icon: markerIcon }).addTo(
    map
  );

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 20,
  }).addTo(map);

  const mapIconControll = document.querySelector(".icon-controll");
  mapIconControll.addEventListener("change", (event) => {
    if (iconStatus === "FIRST_ICON") {
      markerIcon = secondIcon;
      mapMarker.setIcon(markerIcon);
      iconStatus = "SECOND_ICON";
    } else {
      markerIcon = firstIcon;
      mapMarker.setIcon(markerIcon);
      iconStatus = "FIRST_ICON";
    }
  });

  map.on("move", () => {
    const center = map.getSize().divideBy(2);
    const targetPoint = map.containerPointToLayerPoint(center);
    const targetLating = map.layerPointToLatLng(targetPoint);

    mapMarker.setLatLng(targetLating);

    mapView = {
      x: targetLating.lat,
      y: targetLating.lng,
    };
    console.log(mapView);
    
  });

}


export{showSubCategoryDetale,showCities,uploadImage,postMap}