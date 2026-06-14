const userName = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const address = document.getElementById("address");
const bio = document.getElementById("bio");
const userForm = document.getElementById("userForm");
const togglePasswordBtn = document.getElementById("toggle-password");

userForm.addEventListener("submit", function (e) {
    if (userName.value.trim() === "" || email.value.trim() === "" || password.value.trim() === "" || address.value.trim() === "") {
        e.preventDefault();
        alert("Vui lòng nhập đủ thông tin");
        return;
    }

    if (userName.value.trim().length > 50) {
        e.preventDefault();
        alert("Tên người dùng tối đa 50 ký tự");
        userName.focus();
        return;
    }

    if (email.value.trim().length > 45) {
        e.preventDefault();
        alert("Email tối đa 45 ký tự");
        email.focus();
        return;
    }

    if (password.value.trim().length > 45) {
        e.preventDefault();
        alert("Mật khẩu tối đa 45 ký tự");
        password.focus();
        return;
    }

    if (address.value.trim().length > 60) {
        e.preventDefault();
        alert("Địa chỉ tối đa 60 ký tự");
        address.focus();
        return;
    }

    if (bio.value.trim().length > 60) {
        e.preventDefault();
        alert("Giới thiệu bản thân tối đa 60 ký tự");
        bio.focus();
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