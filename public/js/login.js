deleteAccountButton.addEventListener('click', deleteAccount);
loginSubmit.addEventListener('click', userLogin); 
logoutIcon.addEventListener('click', userLogout);

function userLogin(e) {
    e.preventDefault();
    const loginForm = document.getElementById('loginFormData');

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData);

    fetch(`${userApi}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        if (data.loggedin) {
            alert("Logged in!");
            window.location.reload();
        } else {
            alert("Invalid user credentials!");
        }
    })
    .catch(error => console.log(error));
};

function deleteAccount() {
    fetch(`${userApi}`, {
        method: 'DELETE',
        credentials: 'include'
    })
    .then(() => {
        $('#deleteAccount').modal('hide');
        defaultView();
     })
     .catch(error => console.log(error));
};

function userLogout() {
    fetch(`${userApi}/logout`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        if (!data.userlogged) {
        defaultView();
        }
     })
     .catch(error => console.log(error));
};



