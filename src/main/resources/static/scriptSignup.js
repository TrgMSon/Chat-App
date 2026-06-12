const userName = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const retypePassword = document.getElementById("retype-password")
const address = document.getElementById("address");
const bio = document.getElementById("bio");
const userForm = document.getElementById("userForm");
const togglePasswordBtn = document.getElementById("toggle-password");
const toggleRetypePasswordBtn = document.getElementById("toggle-retype-password");
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/;

userForm.addEventListener("submit", function (e) {
    const userVal = userName.value.trim();
    const emailVal = email.value.trim();
    const passVal = password.value.trim();
    const retypePassVal = retypePassword.value.trim();
    const addressVal = address.value.trim();
    const bioVal = bio.value.trim();

    if (userVal.length < 3 || userVal.length > 50) {
        alert("Tên người dùng phải từ 3 đến 50 ký tự.");
        userName.focus();
        e.preventDefault();
        return;
    }

    if (emailVal.length === 0 || emailVal.length > 45) {
        alert("Email không được để trống và tối đa 45 ký tự.");
        email.focus();
        e.preventDefault();
        return;
    }

    if (!passwordRegex.test(passVal)) {
        alert("Mật khẩu phải chứa ít nhất 1 chữ cái, 1 số và 1 ký tự đặc biệt.");
        password.focus();
        e.preventDefault();
        return;
    }

    if (passVal.length < 3 || passVal.length > 45) {
        alert("Mật khẩu phải từ 6 đến 45 ký tự.");
        password.focus();
        e.preventDefault();
        return;
    }

    if (retypePassVal !== passVal) {
        alert("Mật khẩu nhập lại không khớp");
        retypePassword.focus();
        e.preventDefault();
        return;
    }

    if (addressVal.length > 60) {
        alert("Địa chỉ tối đa 60 ký tự.");
        address.focus();
        e.preventDefault();
        return;
    }

    if (bioVal.length > 60) {
        alert("Giới thiệu bản thân tối đa 60 ký tự.");
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

toggleRetypePasswordBtn.addEventListener("click", function(e) {
    const currentType = retypePassword.getAttribute("type");
    const newType = currentType === "password" ? "text" : "password";
    retypePassword.setAttribute("type", newType);

    if (newType === "password") {
        this.textContent = "🙈";
    } else {
        this.textContent = "🙉";
    }
});