// Add an event listener to the form with id "login-form" to handle the submit event
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const url = "http://localhost:5678/api/users/login"; // Define the URL for the login API endpoint
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  // Check if either the email or password field is empty
  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }
  // Create a payload object containing the email and password
  const payload = {
    email: email,
    password: password,
  };
  // Use axios to send a POST request to the login API with the payload
  axios
    .post(url, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      // Handle the response data if the request is successful
      localStorage.setItem("token", response.data.token);
      // Store the login state in sessionStorage
      sessionStorage.setItem("loginState", "true");

      // Redirect the user to the index.html page
      window.location.href = "index.html";
    })
    .catch((error) => {
      // Handle errors if the request fails
      if (error.response) {
        // Server responded with a status code outside the 200 range
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
        // Request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // An error occurred in setting up the request
        console.error("Error:", error.message);
      }
    });
});
