/*
*   global function
*/

const fetchdata = async () => {
  try {
    const response = await axios.get("http://localhost:5678/api/works");
    return response.data; 
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; 
  }
};
const extractCategories = (data) => {
  const uniqueCategories = [
    ...new Set(
      data.map(({ category }) =>
        JSON.stringify({ name: category.name, id: category.id })
      )
    ),
  ].map((item) => JSON.parse(item));
  const categories = uniqueCategories.map((item) => item.name);
  const categoriesId = uniqueCategories.map((item) => item.id);
  return { categories, categoriesId };
};
const setAttributes = (elem, attrs) => {
  for (let key in attrs) {
    elem.setAttribute(key, attrs[key]);
  }
};

/*
* 
*/

const createGallery = async () => {
  try {
    const data = await fetchdata();
    let categories = extractCategories(data).categories;
    categories.unshift("Tous"); 
    categories.forEach((category) => {
      appendFilterBtn(category);
    });
    data.forEach(({ imageUrl, title }) => {
      appendGalleryElement(imageUrl, title);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
const appendFilterBtn = (content) => {
  const button = document.createElement("button");
  const filterDiv = document.getElementById("filter");
  setAttributes(button, {
    type: "button",
    value: content,
  });
  button.textContent = content; 
  if (content == "Tous") {
    button.classList.add("active");
  }
  button.addEventListener("click", () => {
    let buttons = document.querySelectorAll("button");
    buttons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active"); // Add the 'active' class to the clicked button
    resetGallery();
    if (content == "Tous") {
      filterByCategoryAll();
    } else {
      filterByCategory(content);
    }
  });
  
  filterDiv.appendChild(button);
};
const appendGalleryElement = (image, content) => {
  const figureElement = document.createElement("figure");
  const imgElement = document.createElement("img");
  setAttributes(imgElement, {
    src: image,
    alt: content,
  });
  const figcaptionElement = document.createElement("figcaption"); // Create the <figcaption> element and set its text content
  figcaptionElement.innerHTML = content;
  figureElement.appendChild(imgElement);
  figureElement.appendChild(figcaptionElement);
  figureElement.addEventListener("click", (e) => {
    window.open(image, "content");
  });
  const galleryElement = document.querySelector(".gallery"); // Find the .gallery element
  galleryElement.appendChild(figureElement); // Append the <figure> element to the .gallery element
};

/*
* 
*/

const filterByCategory = async (filter) => {
  try {
    const data = await fetchdata();
    const filteredData = data.filter(
      ({ category }) => category.name === filter
    );
    filteredData.forEach(({ imageUrl, title }) => {
      // Destructure data object assuming it contains imageUrl and content properties
      appendGalleryElement(imageUrl, title);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
const filterByCategoryAll = async () => {
  try {
    const data = await fetchdata();
    data.forEach(({ imageUrl, title }) => {
      // Destructure data object assuming it contains imageUrl and content properties
      appendGalleryElement(imageUrl, title);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

/*
*
*/

const resetGallery = () => {
  const gallery = document.querySelector(".gallery");
  const figures = gallery.querySelectorAll("figure");
  figures.forEach((figure) => {
    figure.remove();
  });
};

/*
* function call
*/

createGallery();

/*
*
*/

const loginState = sessionStorage.getItem("loginState");
if (loginState) {
  const elements = document.querySelectorAll(".edit-mod-el");
  const loginBtn = document.getElementById("login-btn");
  elements.forEach((element) => {
    element.style.display = "flex";
  });
  loginBtn.style.display = "none";
}

/*
* Logoff edit mode
*/

document.getElementById("logoff-btn").addEventListener("click", (e) => {
  sessionStorage.setItem("loginState", false);
  const elements = document.querySelectorAll(".edit-mod-el");
  const loginBtn = document.getElementById("login-btn");
  // Loop through each element and set the display style to "none"
  elements.forEach((element) => {
    element.style.display = "none";
  });
  loginBtn.style.display = "flex";
});
