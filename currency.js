let currencyvl = document.querySelector("#currency-vl");
let view = document.querySelector("#paraholder");
let country = document.getElementById("country");
let btn1 = document.getElementById("btn1");
let para = document.getElementById("para");
let username = document.getElementById("username");
let signOutBtn = document.getElementById("signOut-btn");
let saveBtn = document.getElementById("saveBtn");
let savedItems = document.getElementById("savedItems");
let historyList = document.getElementById("history-list");
let historyContainer = document.getElementById("history-container");

let localAuthUser = localStorage.getItem("authUser");

// If localAuthUser is false , null, undefined, an empty string, or false, authUser is set to null
let authUser = localAuthUser ? JSON.parse(localAuthUser) : null;

// authUser variable is null, the user is not authenticated
if (authUser === null) {
  window.location.href = "logIn.html";
}
currencyvl.placeholder = authUser.country;
country.value = authUser.country;
username.innerHTML = authUser.name;
console.log({ authUser });
country.addEventListener("change", () => {
  currencyvl.placeholder = country.value;
});

let ratio = {};
//function getCurrencies fetches currency exchange rate data based on a given currency.
function getCurrencies(currency) {
  return fetch(
    `https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_0tRX5J3YCyThWjkq2KcGtK3S7pZYEqllEiRz4e85&currencies=EUR%2CUSD%2CCAD%2CBGN%2CAUD%2CCNY%2CMYR%2CHKD%2CILS%2CPHP%2CZAR&base_currency=${currency}`
  )
    .then((data) => data.json())
    .then((exctual) => {
      ratio = exctual.data;
    });
}

// showData calls  getCurrencies function parameter country.value || "ZAR". fetching currency data for a specific country indicated by country.value, if the value is not provided or false, it defaults to "ZAR".
function showData() {
  getCurrencies(country.value || "ZAR").then(() => {
    // Once the currency data is fetched , it clears the content of view element.
    view.innerHTML = "";
    if (currencyvl.value === "") {
      return;
    } else {
      for (let key in ratio) {
        let temp = currencyvl.value * ratio[key];
        // let itm = document.getElementById(`${key}`);
        // if(itm) itm.innerHTML = `${key}: ${temp.toFixed(4)}`;
        let template = `<p>${key}: ${temp.toFixed(2)}</p>`;
        view.insertAdjacentHTML("beforeend", template);
      }
    }
  });
}

btn1.addEventListener("click", () => {
  currencyvl.value = "";

  let paragraphs = view.querySelectorAll("p");

  paragraphs.forEach((paragraph) => {
    paragraph.innerHTML = "";
  });
});

signOutBtn.addEventListener("click", () => {
  localStorage.removeItem("authUser");
  window.location.href = "logIn.html";
});

// allowing users to save historical data, both in their local storage and on a server. also ensures that duplicate data is not added to the history.
let history = [];

saveBtn.addEventListener("click", (e) => {
  let selectedOption = country.value;
  if (!history.includes(selectedOption)) {
    history.push(selectedOption);
    console.log("history", history);
    let listItem = document.createElement("li");
    // history.push(listItem);
    console.log("listItem", listItem);
    listItem.innerText = selectedOption + " " + currencyvl.value;
    historyList.appendChild(listItem);
    localStorage.setItem("history", JSON.stringify(history));
    saveBtn.value = "Loading....";
    // posting to server, for retrieval
    fetch("https://john-cc-8556014fa412.herokuapp.com/history", {
      method: "POST",
      body: JSON.stringify({
        country: country.value,
        currencyvl: currencyvl.value,
        userId: authUser._id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
});

window.addEventListener("load", () => {
  fetch(`https://john-cc-8556014fa412.herokuapp.com/http://localhost:3001/history/${authUser._id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    response.json().then(() => {
      console.log(response);
    });
  });
});
