/*global var********************************************************************* */
let modalState = false; // Variable that holds the state of the modal (modal)
const modalSection = document.getElementById("modal-section"); // Select the modal section container
/* Funtion for setting multiple attributes*/
const setAttributes = (elem, attrs) => {
  for (let key in attrs) {
    elem.setAttribute(key, attrs[key]);
  }
};
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
const createmodalGallery = async () => {
  // Fetch data asynchronously
  const data = await fetchdata();
  // For each item in the fetched data, create and append a modal element
  data.forEach(({ imageUrl }) => {
    createModalElement(imageUrl);
  });
};

/* Function that deletes all elements in the modal gallery*/
const deletemodalGallery = () => {
  const modalBtn = document.querySelector(".modal-btn");
  // Select the modal gallery container
  const modalGalery = document.querySelector(".modal-galery");
  modalGalery.remove();
  modalBtn.remove();
};

/* Function that careat the modal layout*/
const openModal = () => {
  // Set the modal state to true
  modalState = true;
  // Add a dark overlay class to the modal section
  modalSection.classList.add("dark-overlay");
  // Create the modal container
  const modal = document.createElement("div");
  modal.className = "modal";
  // Create the modal header container
  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";
  // Create the close button (x mark) for the modal
  const xmarkBtn = document.createElement("button");
  setAttributes(xmarkBtn, {
    id: "xmark-btn",
    class: "fa-solid fa-xmark",
  });
  // Add a click event listener to the close button to close the modal
  xmarkBtn.addEventListener("click", (e) => {
    closeModal();
  });

  // Create the modal title element
  const modalTitle = document.createElement("h3");
  modalTitle.className = "modal-title";
  modalTitle.innerHTML = "Galerie photo";
  // Append Elements Layout
  modalHeader.appendChild(xmarkBtn);
  modal.appendChild(modalHeader);
  modal.appendChild(modalTitle);
  modalSection.appendChild(modal);
  // Append modal galery
  openModalGalerie();
};

/* Function that create the gallerie*/
const openModalGalerie = () => {
  const modal = document.querySelector(".modal");
  // Create the modal galery container
  const modalGallery = document.createElement("div");
  modalGallery.className = "modal-galery";
  // Create the add photos button for the modal
  const modalBtn = document.createElement("button");
  modalBtn.className = "modal-btn";
  modalBtn.innerHTML = "Ajouter une photo";
  modalBtn.addEventListener("click", () => {
    openEdit();
  });
  modal.appendChild(modalGallery);
  modal.appendChild(modalBtn);
};

/*Function that create the form*/
const openEdit = () => {
  deletemodalGallery(); //reset modal elements
  const modal = document.querySelector(".modal"); // point to the modal
  const modalTitle = document.querySelector(".modal-title"); // point to the title
  modalTitle.innerHTML = "Ajout de photo";//change the title
  const modalForm = document.createElement("form");// create the form
  modalForm.className = "modal-form";// append class
  /******************************drop area*****************************/
  const dropArea = document.createElement("div");//create the drop area
  setAttributes(dropArea, {
    id: "modal-drop-area",
    for: "input-file",
  });
  const fileInput = document.createElement("input");//create the file input
  setAttributes(fileInput, {
    id: "input-file",
    type: "file",
    accept: "image/",
    name: "input-file",
    ondrop: "dropHandler(event);",
    ondragover: "dragOverHandler(event);",
  });
  const label = document.createElement("label");//create the append file button
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
  /***************************************************************************/
  const titleLabel = document.createElement("label");
  titleLabel.innerHTML = "Titre";
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  //
  const categorieLabel = document.createElement("label");
  categorieLabel.innerHTML = "Categorie";
  const categorieInput = document.createElement("input");
  categorieInput.type = "text";
  //
  const spanLine = document.createElement("span");
  spanLine.style.width = "100%";
  spanLine.style.border = "solid 1px #b3b3b3";
  spanLine.style.marginTop = "10px";

  //
  const submitBtn = document.createElement("button");
  submitBtn.innerHTML = "Valider";
  submitBtn.className = "modal-btn";
  // append form
  dropArea.appendChild(fileInput);
  dropArea.appendChild(label);
  modalForm.appendChild(dropArea);
  modalForm.appendChild(titleLabel);
  modalForm.appendChild(titleInput);
  modalForm.appendChild(categorieLabel);
  modalForm.appendChild(categorieInput);
  modalForm.appendChild(spanLine);
  modalForm.appendChild(submitBtn);
  modal.appendChild(modalForm);
};
function dropHandler(event) {
  console.log("File(s) dropped");
  event.preventDefault();
}
function dragOverHandler(event) {
  console.log("File(s) in drop zone");
  event.preventDefault();
}

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
  modalState = false;
  // Log the modal state to the console
  console.log("modalState:", modalState);
};

/*Event listener used to open the modal*/
document.getElementById("open-modal").addEventListener("click", () => {
  // Check if the modal is not already open
  if (modalState == false) {
    // Open the modal
    openModal(modalState);
    // Create the modal gallery by fetching and appending images
    createmodalGallery();
    // Set the modal state to true
    modalState = true;
  }
});
