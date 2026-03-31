const logoutBtn = document.getElementById("logoutBtn");
const manageReportBtn = document.getElementById("manageReportBtn");
const manageUserBtn = document.getElementById("manageUserBtn");
const listUser = document.createElement("ul");
const listReport = document.createElement("ul");
const goHomeBtn = document.getElementById("goHomeBtn");
const mainView2 = document.querySelector(".main-view2");
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");

let userLoginId = null;

async function initUserId() {
    let userId = await fetch("/api/getSession");
    userLoginId = await userId.text();
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

searchForm.classList.add("hide");
logoutBtn.style.marginLeft = "1000px";

goHomeBtn.addEventListener("click", function () {
    window.location.href = "/manage";
});

async function loadReportDetail() {
    let response = await fetch("/api/manage/viewReportDetail?reportId=" + this.dataset.reportId);
    let reportInfor = await response.json();

    let reportBox = document.createElement("div");
    reportBox.classList.add("detailBox");

    let userSendInfor = document.createElement("p");
    userSendInfor.innerText = "ID người gửi: " + reportInfor.userSendId;

    let reportedUserInfor = document.createElement("p");
    reportedUserInfor.innerText = "ID người vi phạm: " + reportInfor.reportedUserId;

    let content = document.createElement("p");
    content.innerText = "Nội dung: " + reportInfor.content;

    let createdAt = document.createElement("small");
    createdAt.innerText = "Ngày gửi: " + formatDate(reportInfor.createdAt.substring(0, 10));

    let closeBtn = document.createElement("button");
    closeBtn.classList.add("closeBtn");
    closeBtn.innerText = "Đóng";
    closeBtn.addEventListener("click", function () {
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
    searchForm.classList.add("hide");
    logoutBtn.style.marginLeft = "1000px";

    manageReportBtn.style.backgroundColor = "#A9A9A9";
    manageUserBtn.style.backgroundColor = "";

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
        liElement.addEventListener("click", loadReportDetail);

        let reportDiv = document.createElement("div");
        reportDiv.classList.add("item");

        let reportLabel = document.createElement("p");
        reportLabel.innerText = "Người gửi: " + reports[i].userSendName;

        reportDiv.appendChild(reportLabel);
        liElement.appendChild(reportDiv);
        listReport.appendChild(liElement);
    }

    mainView2.appendChild(listReport);
});

function formatDate(date) {
    let array = date.split("-");
    return `${array[2]}/${array[1]}/${array[0]}`;
}

logoutBtn.addEventListener("click", function () {
    window.location.href = "/login";
});

async function loadUserDetail() {
    let response = await fetch("/api/manage/viewUserDetail?userId=" + this.dataset.userId);
    let userInfor = await response.json();

    let userBox = document.createElement("div");
    userBox.classList.add("detailBox");

    let userIdElement = document.createElement("p");
    userIdElement.innerText = "ID: " + userInfor.userId;

    let userNameElement = document.createElement("p");
    userNameElement.innerText = "Tên đăng nhập: " + userInfor.userName;

    let emailElement = document.createElement("p");
    emailElement.innerText = "Email " + userInfor.email;

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
    userBox.appendChild(bioElement);
    userBox.appendChild(statusElement);
    userBox.appendChild(banBtn);
    userBox.appendChild(closeBtn);

    mainView2.appendChild(userBox);
}

manageUserBtn.addEventListener("click", async function () {
    searchForm.classList.remove("hide");
    logoutBtn.style.marginLeft = "";

    manageReportBtn.style.backgroundColor = "";
    manageUserBtn.style.backgroundColor = "#A9A9A9";

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
        liElement.addEventListener("click", loadUserDetail);

        let userDiv = document.createElement("div");
        userDiv.classList.add("item");

        let userLabel = document.createElement("p");
        userLabel.innerText = users[i].userName + " (ID: " + users[i].userId + ")";

        userDiv.appendChild(userLabel);
        liElement.appendChild(userDiv);
        listUser.appendChild(liElement);
    }

    mainView2.appendChild(listUser);
});

searchForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    let target = searchInput.value.trim();
    searchInput.value = target;
    if (target === "") return;

    let response = await fetch("/api/manage/searchUser?target=" + target);
    let userIds = await response.json();

    if (userIds.length === 0) {
        alert("Không tìm thấy kết quả phù hợp");
        return;
    }

    let liElements = document.querySelectorAll(".listUser li");
    liElements.forEach(liElement => {
        if (userIds.includes(liElement.dataset.userId)) {
            liElement.style.backgroundColor = "#A9A9A9";
        }
    });

});