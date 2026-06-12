const logoutBtn = document.getElementById("logoutBtn");
const manageReportBtn = document.getElementById("manageReportBtn");
const manageUserBtn = document.getElementById("manageUserBtn");
const listUser = document.createElement("ul");
const listReport = document.createElement("ul");
const goHomeBtn = document.getElementById("goHomeBtn");
const mainView2 = document.querySelector(".main-view2");
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const closeSearch = document.getElementById("closeSearch");

closeSearch.classList.add("hide");
let userLoginId = null;
let viewUser = false;
let viewReport = false;

async function initUserId() {
    userLoginId = await fetch("/api/getSession").then(res => res.text());
    connect();
}

initUserId();

let stompClient = null;

function connect() {
    let socket = new SockJS("/ws");
    stompClient = Stomp.over(socket);
    stompClient.connect({
        userId: userLoginId
    },
        onConnected, onError);
}

function onConnected() {
    console.log("Kết nối websocket cho admin thành công");
}

function onError() {
    console.log("Lỗi kết nối websocket cho admin");
}

searchInput.classList.add("hide");

goHomeBtn.addEventListener("click", function () {
    window.location.href = "/manage";
    viewReport = false;
    viewUser = false;
});

async function loadReportDetail(liElement) {
    let response = await fetch("/api/manage/viewReportDetail?reportId=" + liElement.dataset.reportId);
    let reportInfor = await response.json();

    let reportBox = document.createElement("div");
    reportBox.classList.add("detailBox");

    let userSendInfor = document.createElement("p");
    userSendInfor.innerText = "ID người gửi: " + reportInfor.userSendId;

    let reportedUserInfor = document.createElement("p");
    reportedUserInfor.innerText = "ID người vi phạm: " + reportInfor.reportedUserId;

    let content = document.createElement("p");
    content.style.overflow = "auto";
    content.style.overflowY = "scroll";
    content.innerText = "Nội dung: " + reportInfor.content;

    let createdAt = document.createElement("small");
    createdAt.innerText = "Ngày gửi: " + formatDate(reportInfor.createdAt.substring(0, 10)) + " " + reportInfor.createdAt.substring(11);

    let closeBtn = document.createElement("button");
    closeBtn.classList.add("closeBtn");
    closeBtn.innerText = "Đóng";
    closeBtn.addEventListener("click", function () {
        liElement.style.backgroundColor = "";
        mainView2.removeChild(document.querySelector(".detailBox"));
    });

    reportBox.appendChild(userSendInfor);
    reportBox.appendChild(reportedUserInfor);
    reportBox.appendChild(content);
    reportBox.appendChild(createdAt);
    reportBox.appendChild(closeBtn);

    mainView2.appendChild(reportBox);
}

manageReportBtn.addEventListener("click", async function () {
    searchInput.value = "";
    searchInput.classList.remove("hide");
    closeSearch.classList.add("hide");

    manageReportBtn.style.backgroundColor = "#1E90FF";
    manageUserBtn.style.backgroundColor = "";
    searchInput.placeholder = "Tìm kiếm theo ngày";
    viewUser = false;
    viewReport = true;

    mainView2.innerHTML = "";
    listReport.innerHTML = "";

    listReport.classList.add("listReport");

    let response = await fetch("/api/manage/getReports");
    let reports = await response.json();

    let title = document.createElement("p");
    title.innerText = "Danh sách báo cáo";
    title.style.fontWeight = "bold";
    listReport.appendChild(title);

    for (let i = 0; i < reports.length; i++) {
        let liElement = document.createElement("li");
        liElement.dataset.reportId = reports[i].reportId;
        liElement.addEventListener("click", function () {
            if (document.querySelector(".detailBox") === null) {
                liElement.style.backgroundColor = "#A9A9A9";
                unMark(reports[i].reportId);
                loadReportDetail(liElement);
            }
        });

        let reportDiv = document.createElement("div");
        reportDiv.classList.add("item");

        let reportLabel = document.createElement("p");
        reportLabel.innerText = "Người gửi: " + reports[i].userSendName;
        reportLabel.style.paddingRight = "50px";

        let createdAt = document.createElement("p");
        createdAt.innerText = "Ngày gửi: " + formatDateTime(reports[i].createdAt);

        reportDiv.appendChild(reportLabel);
        reportDiv.appendChild(createdAt);
        liElement.appendChild(reportDiv);
        listReport.appendChild(liElement);
    }

    mainView2.appendChild(listReport);
});

function formatDateTime(createdAt) {
    let date = formatDate(createdAt.split("T")[0]);
    let time = createdAt.split("T")[1];
    return `${date} ${time}`;
}

function formatDate(date) {
    let array = date.split("-");
    return `${array[2]}/${array[1]}/${array[0]}`;
}

logoutBtn.addEventListener("click", function () {
    window.location.href = "/logout";
});

async function loadUserDetail(liElement) {
    let response = await fetch("/api/manage/viewUserDetail?userId=" + liElement.dataset.userId);
    let userInfor = await response.json();

    let userBox = document.createElement("div");
    userBox.classList.add("detailBox");

    let userIdElement = document.createElement("p");
    userIdElement.innerText = "ID: " + userInfor.userId;

    let userNameElement = document.createElement("p");
    userNameElement.innerText = "Tên đăng nhập: " + userInfor.userName;

    let emailElement = document.createElement("p");
    emailElement.innerText = "Email: " + userInfor.email;

    let addressElement = document.createElement("p");
    addressElement.innerText = "Địa chỉ: " + userInfor.address;

    let bioElement = document.createElement("p");
    bioElement.innerText = "Giới thiệu: " + userInfor.bio;

    let statusElement = document.createElement("p");
    if (userInfor.status === "banned") {
        statusElement.innerText = "Trạng thái: Bị khóa";
    }
    else {
        statusElement.innerText = "Trạng thái: Đang hoạt động";
    }

    let closeBtn = document.createElement("button");
    closeBtn.classList.add("closeBtn");
    closeBtn.innerText = "Đóng";
    closeBtn.addEventListener("click", function () {
        liElement.style.backgroundColor = "";
        mainView2.removeChild(document.querySelector(".detailBox"));
    });

    let banBtn = document.createElement("button");
    banBtn.classList.add("banBtn");
    if (userInfor.status === "banned") {
        banBtn.innerText = "Mở khóa";
        banBtn.addEventListener("click", async function () {
            stompClient.send("/app/manage.changeStatusUser", {}, JSON.stringify({
                status: "allowed",
                userId: userInfor.userId
            }));
            alert("Mở khóa tài khoản thành công");
            mainView2.removeChild(document.querySelector(".detailBox"));
        });
    }
    else {
        banBtn.innerText = "Khóa";
        banBtn.addEventListener("click", async function () {
            stompClient.send("/app/manage.changeStatusUser", {}, JSON.stringify({
                status: "banned",
                userId: userInfor.userId
            }));
            alert("Khóa tài khoản thành công");
            mainView2.removeChild(document.querySelector(".detailBox"));
        });
    }

    userBox.appendChild(userIdElement);
    userBox.appendChild(userNameElement);
    userBox.appendChild(emailElement);
    userBox.appendChild(addressElement);
    userBox.appendChild(bioElement);
    userBox.appendChild(statusElement);
    userBox.appendChild(banBtn);
    userBox.appendChild(closeBtn);

    mainView2.appendChild(userBox);
}

function unMark(target) {
    if (viewUser === true) {
        let liElements = document.querySelectorAll(".listUser li");
        liElements.forEach(li => {
            if (li.dataset.userId != target) {
                li.style.backgroundColor = "";
            }
        });
    }
    else if (viewReport === true) {
        let liElements = document.querySelectorAll(".listReport li");
        liElements.forEach(li => {
            if (li.dataset.reportId != target) {
                li.style.backgroundColor = "";
            }
        });
    }
}

manageUserBtn.addEventListener("click", async function () {
    searchInput.value = "";
    searchInput.classList.remove("hide");
    searchInput.placeholder = "Tìm kiếm theo tên hoặc ID";

    manageReportBtn.style.backgroundColor = "";
    manageUserBtn.style.backgroundColor = "#1E90FF";
    viewReport = false;
    viewUser = true;

    mainView2.innerHTML = "";
    listUser.innerHTML = "";

    listUser.classList.add("listUser");

    let response = await fetch("/api/manage/getUsers");
    let users = await response.json();

    let title = document.createElement("p");
    title.innerText = "Danh sách người dùng";
    title.style.fontWeight = "bold";
    listUser.appendChild(title);

    for (let i = 0; i < users.length; i++) {
        let liElement = document.createElement("li");
        liElement.dataset.userId = users[i].userId;
        liElement.addEventListener("click", function () {
            if (document.querySelector(".detailBox") === null) {
                liElement.style.backgroundColor = "#A9A9A9";
                unMark(users[i].userId);
                loadUserDetail(liElement);
            }
        });

        let userDiv = document.createElement("div"); // Từng hàng của người dùng
        userDiv.classList.add("item");

        let userLabel = document.createElement("p"); // Nhãn cho từng dòng
        userLabel.innerText = users[i].userName + " (ID: " + users[i].userId + ")";

        userDiv.appendChild(userLabel);
        liElement.appendChild(userDiv);
        listUser.appendChild(liElement);
    }

    mainView2.appendChild(listUser);
});

function validDate(dateString) {
    let regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dateString)) return false;

    let parts = dateString.split("/");
    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10);
    let year = parseInt(parts[2], 10);

    let d = new Date(year, month - 1, day);

    return d.getFullYear() === year && (d.getMonth() + 1) === month && d.getDate() === day;
}

searchForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    let target = searchInput.value.trim();
    searchInput.value = target;
    if (target === "") return;

    if (viewUser === true) {
        closeSearch.classList.remove("hide");

        let response = await fetch("/api/manage/searchUser?target=" + target);
        let userIds = await response.json();

        if (userIds.length === 0) {
            alert("Không tìm thấy kết quả phù hợp");
            unMark("");
            return;
        }

        let liElements = document.querySelectorAll(".listUser li");
        liElements.forEach(liElement => {
            if (userIds.includes(liElement.dataset.userId)) {
                liElement.style.backgroundColor = "#A9A9A9";
            }
        });
    }
    else if (viewReport === true) {
        if (!validDate(target)) {
            alert("Vui lòng nhập đúng định dạng dd/MM/yyyy");
            return;
        }

        closeSearch.classList.remove("hide");

        let response = await fetch("/api/manage/searchReport?target=" + target);
        let reportIds = await response.json();

        if (reportIds.length === 0) {
            alert("Không tìm thấy kết quả phù hợp");
            unMark("");
            return;
        }

        let liElements = document.querySelectorAll(".listReport li");
        liElements.forEach(liElement => {
            if (reportIds.includes(liElement.dataset.reportId)) {
                liElement.style.backgroundColor = "#A9A9A9";
            }
        });
    }

});

closeSearch.addEventListener("click", function () {
    if (!closeSearch.classList.contains("hide")) {
        unMark("");
        searchInput.value = "";
        closeSearch.classList.add("hide");
    }
});