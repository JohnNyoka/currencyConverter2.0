const username = document.getElementById("username");
const password = document.getElementById("password");
const form = document.querySelector("form");
const errorMessage = document.getElementById("errorMessage");
const subBtn = document.getElementById("submit-btn");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const errors = [];
  errorMessage.innerHTML = "";
  console.log(password.value);
  if (username.value.trim() === "") {
    errors.push("Username required");
  }

  if (password.value.length < 8) {
    errors.push("Please sign up if you have forgotten your password");
  }

  if (errors.length > 0) {
    errorMessage.innerHTML = errors.join(", ");
  } else {
    console.log(subBtn);
    subBtn.value = "Loading....";
    fetch("https://john-cc-8556014fa412.herokuapp.com/auth", {
      method: "POST",
      body: JSON.stringify({ name: username.value, password: password.value }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        subBtn.value = "Submit";
        errorMessage.innerHTML = "";
        // parses the response from the server as JSON. The JSON data  contain information about authenticated user.
        response.json().then((authUser) => {
          console.log({ authUser });
          if (authUser) {
            localStorage.setItem("authUser", JSON.stringify(authUser));
            window.location.href = "currency.html";
          } else {
            alert("Please sign up to login");
          }
        });
      })
      .catch((err) => {
        console.log("err==>", err);
        subBtn.value = "Submit";
        errorMessage.innerHTML = err;
      });
  }
});
