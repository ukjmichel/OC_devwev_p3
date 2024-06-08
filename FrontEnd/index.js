/* fetch data from API function*/
const fetchdata = async () => {
  try {
    const response = await axios.get("http://localhost:5678/api/works");
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error to be caught by the caller
  }
};
/* function for creating a set for catgories */
const CreateCategories = (data) => {
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
/* Funtion for setting multiple attributes*/
const setAttributes = (elem, attrs) => {
  for (let key in attrs) {
    elem.setAttribute(key, attrs[key]);
  }
};
/* Funtion for creating figure element for gallery*/
const createFigure = (image, content) => {
  const figureElement = document.createElement("figure");
  const imgElement = document.createElement("img");
  setAttributes(imgElement, {
    src: image,
    alt: content,
  });
  const figcaptionElement = document.createElement("figcaption"); // Create the <figcaption> element and set its text content
  setAttributes(figcaptionElement, {
    textContent: content,
  });
  figureElement.appendChild(imgElement);
  figureElement.appendChild(figcaptionElement);
  const galleryElement = document.querySelector(".gallery"); // Find the .gallery element
  galleryElement.appendChild(figureElement); // Append the <figure> element to the .gallery element
};
/* function for creating filter bar*/
const createFilter = (content) => {
  const button = document.createElement("button");
  setAttributes(button, {
    type: "button",
    value: content,
    textContent: "button",
  });
  button.textContent = content; // add text to button
  if (content == "Tous") {
    button.classList.add("active");
  }
  button.addEventListener("click", () => {
    let buttons = document.querySelectorAll("button");
    buttons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active"); // Add the 'active' class to the clicked button
    resetGallery();
    if (content == "Tous") {
      filterGaleryAll();
    } else {
      filterGalery(content);
    }
  });
  // Set the button class
  button.classList.add("filter-button");
  // Get the div element with the class of 'filter'
  const filterDiv = document.querySelector(".filter");
  // Append the button to the div element
  filterDiv.appendChild(button);
};
/* init galery*/
const createGallery = async () => {
  try {
    const data = await fetchdata();
    let categories = CreateCategories(data).categories;
    categories.unshift("Tous"); //add "Tous" as category
    categories.forEach((category) => {
      createFilter(category);
    });
    data.forEach(({ imageUrl, title }) => {
      createFigure(imageUrl, title);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

/*refresh galery element with filter */
const filterGalery = async (filter) => {
  try {
    const data = await fetchdata();
    const filteredData = data.filter(
      ({ category }) => category.name === filter
    );
    filteredData.forEach(({ imageUrl, title }) => {
      // Destructure data object assuming it contains imageUrl and content properties
      createFigure(imageUrl, title);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// refresh gallery with all element
const filterGaleryAll = async () => {
  try {
    const data = await fetchdata();
    data.forEach(({ imageUrl, title }) => {
      // Destructure data object assuming it contains imageUrl and content properties
      createFigure(imageUrl, title);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// delete galery element
const resetGallery = () => {
  const gallery = document.querySelector(".gallery");

  // Select all figure elements within the gallery
  const figures = gallery.querySelectorAll("figure");
  // Remove each figure element
  figures.forEach((figure) => {
    figure.remove();
  });
};

//
createGallery();

/********************************************* */
const loginState = sessionStorage.getItem("loginState");
if (loginState) {
  // Select all elements to change state"
  const elements = document.querySelectorAll(".edit-mod-el");
  const loginBtn = document.getElementById("login-btn");
  // Loop through each element and set the display style to "flex"
  elements.forEach((element) => {
    element.style.display = "flex";
  });
  loginBtn.style.display = "none";
}

// Logoff edit mode
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
