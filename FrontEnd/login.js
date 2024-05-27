document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const url = "http://localhost:5678/api/users/login";
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Veuillez remplir tous les champs.");
    return;
  }
  const payload = {
    email: email,
    password: password,
  };

  axios
    .post(url, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      // Handle the response data
      console.log("User ID:", response.data.userId);
      console.log("Token:", response.data.token);
      sessionStorage.setItem("loginState", "true");
      window.location.href = "index.html";
    })
    .catch((error) => {
      // Handle errors
      if (error.response) {
        // Server responded with a status other than 200 range
        if (error.response.status === 404) {
          console.error("User not found");
        } else if (error.response.status === 401) {
          console.error("Not Authorized");
        } else {
          console.error(
            "Error:",
            error.response.status,
            error.response.statusText
          );
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request
        console.error("Error:", error.message);
      }
    });
});
