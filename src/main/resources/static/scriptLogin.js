const formLogin = document.getElementById("formLogin");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const signupBtn = document.getElementById("signupBtn");

signupBtn.addEventListener("click", function (event) {
    event.preventDefault();

    window.location.href = "/signup";
});