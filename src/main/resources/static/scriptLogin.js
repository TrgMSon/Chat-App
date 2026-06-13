const togglePasswordBtn = document.getElementById("toggle-password");

togglePasswordBtn.addEventListener("click", function(e) {
    const currentType = password.getAttribute("type");
    const newType = currentType === "password" ? "text" : "password";
    password.setAttribute("type", newType);

    if (newType === "password") {
        this.textContent = "🙈";
    } else {
        this.textContent = "🙉";
    }
});