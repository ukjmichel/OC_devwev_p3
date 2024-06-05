/*global var********************************************************************* */
let isModalOpen = false; // Variable that holds the state of the modal (modal)
let isFormOpen = false;
const modalSection = document.getElementById("modal-section"); // Select the modal section container
/******************************************************************************* */

/* Function that appends a modal element with an image*/
const createModalElement = (image) => {
  // Select the modal gallery container
  const modalGallery = document.querySelector(".modal-galery");
  // Create an img element and set its source to the provided image URL
  const imgElement = document.createElement("img");
  imgElement.src = image;
  // Append the img element to the modal gallery
  modalGallery.appendChild(imgElement);
};

/*Function that appends all elements to the modal gallery by fetching data*/
const createModalGallery = async () => {
  // Fetch data asynchronously
  const data = await fetchdata();
  // For each item in the fetched data, create and append a modal element
  data.forEach(({ imageUrl }) => {
    createModalElement(imageUrl);
  });
};

/* Function that deletes all elements in the modal gallery*/
const deleteModalGallery = () => {
  document.querySelector(".modal-btn").remove();
  document.querySelector(".modal-galery").remove();
};

const deleteModalForm = () => {
  document.querySelector("#modal-form").remove();
  isFormOpen = false;
};

/* Function that create the modal layout*/
const openModal = () => {
  isModalOpen = true; // Set the modal state to true

  modalSection.classList.add("dark-overlay"); // Add a dark overlay class to the modal section
  const modal = document.createElement("div"); // Create the modal container
  modal.className = "modal";
  const modalHeader = document.createElement("div"); // Create the modal header container
  modalHeader.className = "modal-header";

  const closeBtn = document.createElement("button"); // Create the close button (x mark) for the modal
  setAttributes(closeBtn, {
    class: "xmark-btn fa-solid fa-xmark",
  });
  closeBtn.addEventListener("click", (e) => {
    closeModal();
  });

  const arrowBtn = document.createElement("button"); // Create the close button (x mark) for the modal
  setAttributes(arrowBtn, {
    class: "arrow-btn fa-solid fa-arrow-left",
  });
  arrowBtn.addEventListener("click", (e) => {
    openModalGalerie();
  });

  const modalTitle = document.createElement("h3"); // Create the modal title element
  modalTitle.className = "modal-title";
  modalTitle.innerHTML = "Galerie photo";

  /* Append Elements Layout***************************/
  modalHeader.appendChild(closeBtn);
  modalHeader.appendChild(arrowBtn);
  modal.appendChild(modalHeader);
  modal.appendChild(modalTitle);
  modalSection.appendChild(modal);
  openModalGalerie(); // Append modal galery
  /************************************************ */
};

/* Function that create the galerie */
const openModalGalerie = () => {
  if (isFormOpen) {
    deleteModalForm();
    console.log("hello");
  }
  const modal = document.querySelector(".modal");
  const arrowBtn = document.querySelector(".arrow-btn");
  arrowBtn.style.visibility = "hidden";
  const modalTitle = document.querySelector(".modal-title"); // point to the title
  modalTitle.innerHTML = "Galerie photo"; //change the title
  // Create the modal galery container
  const modalGallery = document.createElement("div");
  modalGallery.className = "modal-galery";
  // Create the add photos button for the modal
  const modalBtn = document.createElement("button");
  modalBtn.className = "modal-btn";
  modalBtn.innerHTML = "Ajouter une photo";
  modalBtn.addEventListener("click", () => {
    openForm();
  });
  modal.appendChild(modalGallery);
  modal.appendChild(modalBtn);
  createModalGallery();
};

/*Function that create the form */
const openForm = async () => {
  isFormOpen = true;
  deleteModalGallery(); //reset modal elements

  const modal = document.querySelector(".modal"); // point to the modal
  const arrowBtn = document.querySelector(".arrow-btn");
  arrowBtn.style.visibility = "visible";

  const modalTitle = document.querySelector(".modal-title"); // point to the title
  modalTitle.innerHTML = "Ajout de photo"; //change the title
  const modalForm = document.createElement("form"); // create the form
  modalForm.id = "modal-form"; // append class

  const dropArea = createDropArea(); // create drop area

  const titleLabel = document.createElement("label");
  setAttributes(titleLabel, {
    for: "title",
  });
  titleLabel.innerHTML = "Titre";

  const titleInput = document.createElement("input");
  setAttributes(titleInput, {
    type: "text",
    id: "title",
    name: "title",
    required: true,
  });

  const categorieLabel = document.createElement("label");
  setAttributes(categorieLabel, {
    for: "category",
  });
  categorieLabel.innerHTML = "Categorie";

  const categorieSelect = await createCategorySelect();

  const spanLine = document.createElement("span");
  setAttributes(spanLine, {
    class: "modal-line",
  });

  const submitBtn = document.createElement("button");
  setAttributes(submitBtn, {
    class: "modal-btn",
    type: "submit",
  });
  submitBtn.innerHTML = "Valider";

  modalForm.appendChild(dropArea);
  modalForm.appendChild(titleLabel);
  modalForm.appendChild(titleInput);
  modalForm.appendChild(categorieLabel);
  modalForm.appendChild(categorieSelect);
  modalForm.appendChild(spanLine);
  modalForm.appendChild(submitBtn);
  modal.appendChild(modalForm); //append form to modal
};
/*************************************** */

const createCategorySelect = async () => {
  const data = await fetchdata();
  const categories = CreateCategories(data);
  const categorieSelect = document.createElement("select");
  setAttributes(categorieSelect, {
    id: "category",
    name: "category",
    required: true,
  });
  categories.forEach((category) => {
    const categoryOption = document.createElement("option");
    setAttributes(categoryOption, {
      value: category,
    });
    categoryOption.textContent = category;
    categorieSelect.appendChild(categoryOption);
  });
  return categorieSelect;
};

const createDropArea = () => {
  const dropArea = document.createElement("div"); //create the drop area
  setAttributes(dropArea, {
    id: "modal-drop-area",
    for: "input-file",
  });
  const fileInput = document.createElement("input"); //create the file input
  setAttributes(fileInput, {
    id: "input-file",
    type: "file",
    accept: "image/",
    name: "input-file",
    required: true,
  });
  const label = document.createElement("label"); //create the append file button
  setAttributes(label, {
    for: "input-file",
  });
  label.innerHTML = "+ Ajouter photo";
  /*handle drop*/
  ["dragenter", "dragover", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  //
  const handleDrop = (e) => {
    const droppedFiles = e.dataTransfer.files;
    const hasImages = [...droppedFiles].some((file) =>
      file.type.startsWith("image/")
    );

    if (hasImages) {
      const firstImage = droppedFiles[0]; // Assuming you only want to display the first image
      const reader = new FileReader();

      reader.onload = (event) => {
        const droppedImage = new Image();
        console.log(droppedImage);
        droppedImage.src = event.target.result;
        dropArea.innerHTML = ""; // Clear previous content
        dropArea.appendChild(droppedImage);
      };

      reader.readAsDataURL(firstImage);
    } else {
      // Handle non-image files (optional)
      alert("Only image files allowed");
    }
    fileInput.files = droppedFiles; // Still assign to hidden input for further processing
  };
  dropArea.addEventListener("drop", handleDrop);
  dropArea.appendChild(fileInput);
  dropArea.appendChild(label);

  return dropArea;
};

/* Function that closes the modal*/
const closeModal = () => {
  // Select the modal section container
  const modalSection = document.getElementById("modal-section");
  // Select the modal container
  const modal = document.querySelector(".modal");
  // Remove the dark overlay class from the modal section
  modalSection.classList.remove("dark-overlay");
  // Remove the modal container from the modal section
  modal.remove();
  // Set the modal state to false
  isModalOpen = false;
  isFormOpen = false;
  // Log the modal state to the console
  console.log("isModalOpen:", isModalOpen);
};

/*Event listener used to open the modal*/
document.getElementById("open-modal").addEventListener("click", () => {
  // Check if the modal is not already open
  if (isModalOpen == false) {
    // Open the modal
    openModal(isModalOpen);
    isModalOpen = true;
  }
});

const postData = async (data) => {
  const newWork = {
    id: data.id,
    title: data.title,
    imageUrl: data.imageUrl,
    categoryId: data.categoryId,
    userId: userId,
  };
  try {
    const response = await axios.post(
      "http://localhost:5678/api/works",
      newWork
    );
    console.log("Response:", response.data);
    return response.data; // Return the response data if needed
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error if needed
  }
};
