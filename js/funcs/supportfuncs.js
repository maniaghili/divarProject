

const getSupportArticles = async () => {
    const res = await fetch(`https://divarapi.liara.run/v1/support/category-articles`);
    const response = await res.json();
  
    return response.data.categories;
  };

  export {getSupportArticles}