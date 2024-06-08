/*Function that create the form */
const openModalForm = async () => {
  isFormOpen = true;
  deleteModalGallery(); //reset modal elements

  const modal = document.querySelector(".modal"); // point to the modal
  const arrowBtn = document.getElementById("arrow-btn");
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
    id: "modal-submit-btn",
    class: "modal-btn",
    type: "submit",
  });
  submitBtn.innerHTML = "Valider";
  modalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    postDataToAPI();
  });
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
const deleteModalForm = () => {
  document.querySelector("#modal-form").remove();
  isFormOpen = false;
};
const createCategorySelect = async () => {
  const data = await fetchdata();
  const { categories, categoriesId } = CreateCategories(data);

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

const postDataToAPI = async () => {
  const title = document.getElementById("title").value;
  const image = document.getElementById("input-file").files[0];
  const category = 1; //document.getElementById("category").value;
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
