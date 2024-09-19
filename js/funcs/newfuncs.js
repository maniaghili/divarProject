
const getCategories = async () => {
    const fetchAllCategories = await fetch(`https://divarapi.liara.run/v1/category`)
    const fetchAllCategoriesres = await fetchAllCategories.json()
    return fetchAllCategoriesres.data.categories
    
}






export{getCategories}