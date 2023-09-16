document.addEventListener("DOMContentLoaded", checkLoginStatus);
const welcome = document.getElementById('welcomeText');
const signupIcon = document.getElementById('signupIcon');
const loginIcon = document.getElementById('loginIcon');
const logoutIcon = document.getElementById('logoutIcon');
const deleteIcon = document.getElementById('deleteIcon');
const loginSubmit = document.getElementById('loginSubmit');
const deleteAccountButton = document.getElementById('deleteAccountButton');
const logButton = document.getElementById('logButton');
const listButton = document.getElementById('listButton');
const summaryButton = document.getElementById('summaryButton');

function displayIcon(icon, status) {
    status ? (icon.style.display = "none") : (icon.style.display = "block");
}

function defaultView() {
    displayIcon(logButton, true);
    displayIcon(listButton, true);
    displayIcon(summaryButton, true);
    displayIcon(logoutIcon, true);
    displayIcon(deleteIcon, true);
    displayIcon(signupIcon, false);
    displayIcon(loginIcon, false);
    welcome.style.display = 'none';
    document.body.style.display = 'block';
}

function loggedView() {
    displayIcon(signupIcon, true);
    displayIcon(loginIcon, true);
    displayIcon(deleteIcon, false);
    displayIcon(logoutIcon, false);
    displayIcon(logButton, false);
    displayIcon(listButton, false);
    displayIcon(summaryButton, false);
    document.body.style.display = 'block';
};

function checkLoginStatus() {
    fetch(`${userApi}/token`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(res => res.json())
    .then(data => {
       if (data.loggedin) {
        showLoggedUser();      
       } else {
        defaultView();
       }
     })
    .catch(error => console.log(error));
}

function showLoggedUser() {
    fetch(`${userApi}`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(res => res.json())
    .then(data => {
       if (data.message[0].first_name === null) {
        var user = data.message[0].username
       } else {
        var user = data.message[0].first_name
       }
       welcome.textContent = `Hello, ${user}. What would you like to do today?`;
       loggedView();
    })
    .catch(error => console.log(error));
}

async function getQOTD(url) {
  try {
    const response = await fetch(url);
    var data = await response.json();

    const qotd = document.getElementById('qotd');

    const header = document.createElement("em");
    header.classList.add("h4")
    header.classList.add("mb-3")
    header.classList.add("mb-md-0")
    header.classList.add("pb-2")

    header.append(document.createTextNode("Quote of the day:"))

    const paragraph = document.createElement("p");
    paragraph.classList.add("text-center")
    paragraph.classList.add("h5")
    var quote = document.createTextNode(data.contents.quotes[0].quote)
    var author = document.createTextNode(data.contents.quotes[0].author)

    paragraph.append(quote, " - ", author);
    qotd.after(header, paragraph);
  } catch (error) {
    console.log(error);
  }
};

getQOTD(externalApi);









