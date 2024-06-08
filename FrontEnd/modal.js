/*********************************************************************** */
let isModalOpen = false; // Variable that holds the state of the modal (modal)
let isFormOpen = false;
const modalSection = document.getElementById("modal-section"); // Select the modal section container
/******************************************************************************* */

/* Function that appends a modal element with an image*/
const createModalElement = ({ imageUrl, id }) => {
  const modalGallery = document.getElementById("modal-galery");
  const figure = document.createElement("figure");
  setAttributes(figure, {
    class: "modal-galery-el",
  });
  figure.style.backgroundImage = `url(${imageUrl})`;
  const deleteBtn = document.createElement("div");
  setAttributes(deleteBtn, {
    class: "modal-delete-btn",
    value: id,
  });
  deleteBtn.innerHTML = "<i class='fa-solid fa-trash-can'></i>";
  deleteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    deleteDataFromAPI(id);
  });
  figure.appendChild(deleteBtn);
  modalGallery.appendChild(figure);
};

/*Function that appends all elements to the modal gallery by fetching data*/
const createModalGallery = async () => {
  // Fetch data asynchronously
  const data = await fetchdata();
  // For each item in the fetched data, create and append a modal element
  data.forEach((data) => {
    createModalElement(data);
  });
};

/* Function that deletes all elements in the modal gallery*/
const deleteModalGallery = () => {
  document.querySelector(".modal-btn").remove();
  document.getElementById("modal-galery").remove();
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
    id: "arrow-btn",
    class: "fa-solid fa-arrow-left",
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
  const arrowBtn = document.getElementById("arrow-btn");
  arrowBtn.style.visibility = "hidden";
  const modalTitle = document.querySelector(".modal-title"); // point to the title
  modalTitle.innerHTML = "Galerie photo"; //change the title
  // Create the modal galery container
  const modalGallery = document.createElement("div");
  modalGallery.id = "modal-galery";
  // Create the add photos button for the modal
  const modalBtn = document.createElement("button");
  modalBtn.className = "modal-btn";
  modalBtn.innerHTML = "Ajouter une photo";
  modalBtn.addEventListener("click", () => {
    openModalForm();
  });
  modal.appendChild(modalGallery);
  modal.appendChild(modalBtn);
  createModalGallery();
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

const deleteDataFromAPI = async (id) => {
  const token = localStorage.getItem("token");
  await axios
    .delete(`http://localhost:5678/api/works/${id}`, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};
