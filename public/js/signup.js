const signupFormData = document.querySelector('#signupFormData');
const signupFormButton = document.getElementById('signupSubmit');

signupFormData.addEventListener('submit', (e) => {
    e.preventDefault();
    const check = checkPasswords();

    if (check) {
        userSignup();
    }
});
 
function checkPasswords() {
    let password = document.getElementById("password").value;
    let repeatPassword = document.getElementById("repeat").value;
    
    if (password != repeatPassword) {
        alert("Passwords do not match!");
        return false;
    } else {
        return true;
    }
};

function userSignup() {
    const formData = new FormData(signupFormData)
    const data = Object.fromEntries(formData);
    
    String.prototype.trim(data.first_name.length);
    data.first_name = upperFirstLetter(data.first_name);

    if (data.first_name.length == 0) {
        data.first_name = null;
    } 
    
    fetch(`${userApi}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            $('#signupForm').modal('hide');
            signupFormData.reset();
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.log(error));
};

function upperFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
}
