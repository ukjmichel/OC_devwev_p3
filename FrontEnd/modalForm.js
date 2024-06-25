/*
*
*/
const preventDefaults = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

/*
*
*/
const openModalForm = async () => {
  isFormOpen = true;
  deleteModalGallery(); //delete modal gallery

  const modal = document.querySelector(".modal"); // point to the modal

  const arrowBtn = document.getElementById("arrow-btn");
  arrowBtn.style.visibility = "visible";

  const modalTitle = document.querySelector(".modal-title"); // point to the title
  modalTitle.innerHTML = "Ajout de photo"; // change the title
  const modalForm = document.createElement("form"); // create the form
  modalForm.id = "modal-form"; // append class

  const dropArea = appendDropArea(); // create drop area

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

  const categorieSelect = await appendCategorySelect();

  const spanLine = document.createElement("span");
  setAttributes(spanLine, {
    class: "modal-line",
  });

  const submitBtn = appendSubmitBtn();
  modalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    postNewWorkToAPI();
  });
  modalForm.appendChild(dropArea);
  modalForm.appendChild(titleLabel);
  modalForm.appendChild(titleInput);
  modalForm.appendChild(categorieLabel);
  modalForm.appendChild(categorieSelect);
  modalForm.appendChild(spanLine);
  modalForm.appendChild(submitBtn);
  modal.appendChild(modalForm); //append form to modal

  setValidateform();
};

/*
*
*/
const deleteModalForm = () => {
  document.querySelector("#modal-form").remove();
  isFormOpen = false;
};

/*
*
*/
const appendDropArea = () => {
  const dropArea = document.createElement("div"); //create the drop area
  setAttributes(dropArea, {
    id: "modal-drop-area",
    for: "input-file",
  });
  const dropIcon = document.createElement("img");
  setAttributes(dropIcon, {
    id: "drop-icon",
    src: "./assets/icons/image-regular.svg",
  });
  const fileInput = document.createElement("input"); //create the file input
  setAttributes(fileInput, {
    id: "input-file",
    type: "file",
    accept: "image/",
    name: "input-file",
    required: true,
  });
  fileInput.addEventListener("change", handleInputFile);
  const label = document.createElement("label"); //create the append file button
  setAttributes(label, {
    //for: "input-file",
  });
  const dropText = document.createElement("span");
  setAttributes(dropText, {
    id: "drop-text",
  });
  dropText.innerHTML = "jpg, png : 4mo max";
  label.innerHTML = "+ Ajouter photo";
  ["dragenter", "dragover", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults);
  });

  //

  dropArea.addEventListener("drop", handleDropFile);
  dropArea.addEventListener("click", function () {
    // Programmatically trigger a click on the file input element
    fileInput.click();
  });
  dropArea.appendChild(dropIcon);
  dropArea.appendChild(fileInput);
  dropArea.appendChild(label);
  dropArea.appendChild(dropText);

  return dropArea;
};
const handleDropFile = (e) => {
  preventDefaults(e);
  const fileInput = document.getElementById("input-file");
  const inputLabel = document.querySelector("#modal-form label");
  const dropArea = document.getElementById("modal-drop-area");
  const dropIcon = document.getElementById("drop-icon");
  const dropText = document.getElementById("drop-text");
  const files = e.dataTransfer.files;
  const newFile = files[files.length - 1];
  const maxSizeInBytes = 4 * 1024 * 1024;
  if (
    newFile.type.startsWith("image/jpeg") ||
    newFile.type.startsWith("image/png")
  ) {
    if (newFile.size < maxSizeInBytes) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataURL = event.target.result;
        dropArea.style.backgroundImage = `url(${dataURL})`;
        inputLabel.style.visibility = "hidden";
        dropIcon.style.visibility = "hidden";
        dropText.style.visibility = "hidden";
        if (files.length > 1) {
          files[0] = newFile;
          files.pop();
        }
      };
      reader.readAsDataURL(newFile);
      fileInput.files = files;
    } else {
      alert("File size exceeds 4mo");
    }
  } else {
    alert("files format not accepted");
  }
};
const handleInputFile = (e) => {
  preventDefaults(e);
  const fileInput = document.getElementById("input-file");
  const inputLabel = document.querySelector("#modal-form label");
  const dropArea = document.getElementById("modal-drop-area");
  const dropIcon = document.getElementById("drop-icon");
  const dropText = document.getElementById("drop-text");
  const files = fileInput.files;
  const newFile = files[files.length - 1];
  const maxSizeInBytes = 4 * 1024 * 1024;
  if (
    newFile.type.startsWith("image/jpeg") ||
    newFile.type.startsWith("image/png")
  ) {
    if (newFile.size < maxSizeInBytes) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataURL = event.target.result;
        dropArea.style.backgroundImage = `url(${dataURL})`;
        inputLabel.style.visibility = "hidden";
        dropIcon.style.visibility = "hidden";
        dropText.style.visibility = "hidden";
        if (files.length > 1) {
          files[0] = newFile;
          files.pop();
        }
      };
      reader.readAsDataURL(newFile);
      fileInput.files = files;
    } else {
      alert("File size exceeds 4mo");
    }
  } else {
    alert("files format not accepted");
  }
};

/*
*
*/

const appendCategorySelect = async () => {
  const data = await fetchdata();
  const { categories, categoriesId } = extractCategories(data);

  const categorieSelect = document.createElement("select");
  setAttributes(categorieSelect, {
    id: "category",
    name: "category",
    required: true,
  });
  categories.forEach((category) => {
    const categoryOption = document.createElement("option");
    setAttributes(categoryOption, {
      value: categoriesId,
    });
    categoryOption.textContent = category;
    categorieSelect.appendChild(categoryOption);
  });
  return categorieSelect;
};

/*
*
*/

const appendSubmitBtn = () => {
  const submitBtn = document.createElement("button");
  setAttributes(submitBtn, {
    id: "modal-submit-btn",
    class:'disabled-btn',
    type: "submit",
    disabled: "true",
  });
  submitBtn.innerHTML = "Valider";

  return submitBtn;
};

/*
*
*/

const postNewWorkToAPI = async () => {
  const title = document.getElementById("title").value;
  const image = document.getElementById("input-file").files[0];
  const category = parseInt(document.getElementById("category").value);
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("image", image); // Append the file object
  await axios
    .post("http://localhost:5678/api/works", formData, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

/*
* verify if form ready to be submit
*/

const setValidateform = () => {
  const submitBtn = document.getElementById("modal-submit-btn");
  const titleInput = document.getElementById("title");
  const categoryInput = document.getElementById("category");
  const imageInput = document.getElementById("input-file");
  const validateForm = () => {
    const titleValue = titleInput.value;
    const categoryValue = categoryInput.value;
    const imageFile = imageInput.files[0];
    const imageUploaded = !!imageFile;
    if (titleValue && imageUploaded && categoryValue) {
      submitBtn.disabled = false;
      submitBtn.classList.remove("disabled-btn");
      submitBtn.classList.add("enabled-btn");
    } else {
      submitBtn.disabled = true;
      submitBtn.classList.remove("enabled-btn");
      submitBtn.classList.add("disabled-btn");
    }
  };

  // Log file upload changes for image input
  imageInput.addEventListener("input", (e) => {
    const file = e.target.files[0];
    if (file) {
      validateForm();
    }
  });

  // Add event listeners to each input
  [titleInput, categoryInput].forEach((input) => {
    input.addEventListener("input", validateForm);
  });
};
