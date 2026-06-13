const userName = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const address = document.getElementById("address");
const bio = document.getElementById("bio");
const userForm = document.getElementById("userForm");
const togglePasswordBtn = document.getElementById("toggle-password");

userForm.addEventListener("submit", function (e) {
    if (userName.value.trim().length > 50) {
        alert("Tên người dùng tối đa 50 ký tự");
        userName.focus();
        e.preventDefault();
        return;
    }

    if (email.value.trim().length > 45) {
        alert("Email tối đa 45 ký tự");
        email.focus();
        e.preventDefault();
        return;
    }

    if (password.value.trim().length > 45) {
        alert("Mật khẩu tối đa 45 ký tự");
        password.focus();
        e.preventDefault();
        return;
    }

    if (address.value.trim().length > 60) {
        alert("Địa chỉ tối đa 60 ký tự");
        address.focus();
        e.preventDefault();
        return;
    }

    if (bio.value.trim().length > 60) {
        alert("Giới thiệu bản thân tối đa 60 ký tự");
        bio.focus();
        e.preventDefault();
        return;
    }
});

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