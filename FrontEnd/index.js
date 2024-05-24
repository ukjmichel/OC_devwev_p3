// fecth data
const fetchdata = async () => {
  try {
    const response = await axios.get("http://localhost:5678/api/works");
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error to be caught by the caller
  }
};

// create figure element
const createFigure = (image, content) => {
  // Create the <figure> element
  const figureElement = document.createElement("figure");

  // Create the <img> element and set its attributes
  const imgElement = document.createElement("img");
  imgElement.src = image;
  imgElement.alt = content;

  // Create the <figcaption> element and set its text content
  const figcaptionElement = document.createElement("figcaption");
  figcaptionElement.textContent = content;

  // Append the <img> and <figcaption> elements to the <figure> element
  figureElement.appendChild(imgElement);
  figureElement.appendChild(figcaptionElement);

  // Find the .gallery element
  const galleryElement = document.querySelector(".gallery");

  // Append the <figure> element to the .gallery element
  galleryElement.appendChild(figureElement);
};

// create filter bar
const createFilter = (content) => {
  const button = document.createElement("button");
  // Set the button text
  button.textContent = content;
  // Set the button type
  button.type = "button";
  // Set the value
  button.value = content;
  // Set EventListener
  if (content == "Tous") {
    button.classList.add("active");
  }
  button.addEventListener("click", () => {
    let buttons = document.querySelectorAll("button");
    buttons.forEach((btn) => btn.classList.remove("active"));
    // Add the 'active' class to the clicked button
    button.classList.add("active");
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

// init galery
const createGallery = async () => {
  try {
    const data = await fetchdata(); // Assuming fetchdata() returns a Promise
    let categories = [...new Set(data.map(({ category }) => category.name))];
    categories.unshift("Tous");
    categories.forEach((category) => {
      createFilter(category);
    });
    data.forEach(({ imageUrl, title }) => {
      // Destructure data object assuming it contains imageUrl and content properties
      createFigure(imageUrl, title);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// refresh galery element with filter
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
