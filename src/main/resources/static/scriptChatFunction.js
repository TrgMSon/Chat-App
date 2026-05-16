const addFriendDiv = document.getElementById("addFriendDiv");
const addFriendBtn = document.getElementById("addFriendBtn");
const closeAFBtn = document.getElementById("closeAFBtn");
const formAF = document.getElementById("formAF");
const formGroup = document.getElementById("formGroup");
const searchInputAF = document.getElementById("searchInputAF");
const searchInputMember = document.getElementById("searchInputMember");
const listUserInfor = document.getElementById("listUserInfor");
const listUserInforToGroup = document.getElementById("listUserInforToGroup");
const listUserInforInGroup = document.getElementById("listUserInforInGroup");
const listRecommendUser = document.getElementById("listRecommendUser");
const viewBios = document.querySelectorAll(".viewBio");
const chatOptions = document.querySelectorAll(".chatOption");
const viewUserBio = document.getElementById("viewUserBio");
const closeViewBio = document.getElementById("closeviewBioBtn");
const createGroupBtn = document.getElementById("createGroupBtn");
const addGroupDiv = document.getElementById("addGroupDiv");
const closeCreateGroupBtn = document.getElementById("closeCreateGroupBtn");
const acptCreateGroup = document.getElementById("acptCreateGroup");
const nameGroupInput = document.getElementById("nameGroupInput");
const viewMemberBtn = document.querySelector(".viewMemberBtn");
const viewMemberDiv = document.getElementById("viewMemberDiv");
const closeViewMemberBtn = document.getElementById("closeViewMemberBtn");
const reportWritter = document.getElementById("reportWritter");
const acptSendReport = document.getElementById("sendReportBtn");
const closeWritterBtn = document.getElementById("closeWritter");
const reloadPageBtn = document.getElementById("reloadPageBtn");

cancelSendFile.classList.add("hide");
viewUserBio.classList.add("hide");

// bản free cloudinary giới hạn tải lên:
// image: 10MB, video: 100MB, raw file: 10MB

fileInput.addEventListener("change", function () {
    if (this.files.length > 0) {
        for (let i = 0; i < this.files.length; i++) {
            if (!checkType(this.files[i])) {
                alert("File không hợp lệ");
                continue;
            }

            if (checkSize(this.files[i])) {
                if (this.files[i].type.startsWith("image")) previewImage(this.files[i]);
                else preViewFile(this.files[i]);
                pendingFile.push(this.files[i]);

                sendMessBtn.classList.remove("hide");
                cancelSendFile.classList.remove("hide");
            }
            else alert("File quá dung lượng cho phép, vui lòng thử lại");
        }
    }
});

cancelSendFile.addEventListener("click", function (e) {
    e.preventDefault();
    sendMessBtn.classList.add("hide");
    fileInput.value = "";
    fileNames.innerHTML = "";
    pendingFile = [];
    cancelSendFile.classList.add("hide");
});

reloadPageBtn.addEventListener("click", function () {
    window.location.href = "/home";
});

viewMemberDiv.classList.remove("createBox");
viewMemberDiv.classList.add("hide");

addFriendDiv.classList.remove("createBox");
addFriendDiv.classList.add("hide");

addGroupDiv.classList.remove("createBox");
addGroupDiv.classList.add("hide");

async function loadRecommendUsers() {
    let userInfor = await fetch("/api/getUserInfor?userId=" + userLoginId).then(res => res.json());
    let users = await fetch("/api/getRecommendUsers?address=" + userInfor.address + "&userLoginId=" + userInfor.userId).then(res => res.json());

    if (users.length === 0) return;

    listRecommendUser.innerHTML = "";

    for (let i = 0; i < users.length; i++) {
        let userNameElement = document.createElement("p");
        let viewBio = document.createElement("button");
        let chatOption = document.createElement("button");
        let userInforDiv = document.createElement("div");

        userInforDiv.classList.add("userInforDiv");
        userNameElement.innerText = users[i].userName;

        viewBio.classList.add("viewBio");
        viewBio.innerText = "Xem giới thiệu";
        viewBio.dataset.userName = users[i].userName;
        viewBio.dataset.bio = users[i].bio;
        viewBio.dataset.address = users[i].address;

        chatOption.classList.add("chatOption");
        chatOption.innerText = "Nhắn tin";
        chatOption.dataset.userId = users[i].userId;

        userInforDiv.appendChild(userNameElement);
        userInforDiv.appendChild(viewBio);
        userInforDiv.appendChild(chatOption);

        listRecommendUser.appendChild(userInforDiv);
    }
}

addFriendBtn.addEventListener("click", async function () {
    addFriendDiv.classList.remove("hide");
    addFriendDiv.classList.add("createBox");
    await loadRecommendUsers();
});

closeAFBtn.addEventListener("click", function () {
    searchInputAF.value = "";
    addFriendDiv.classList.remove("createBox");
    addFriendDiv.classList.add("hide");
    listUserInfor.innerHTML = "";
});

async function getChattingUser(name) {
    let users = await fetch("/api/addMemberSearch?name=" + name);
    return await users.json();
}

async function loadChattingUser() {
    let name = searchInputMember.value.trim();
    searchInputMember.value = name;

    let users = await getChattingUser(name);

    if (users.length === 0) {
        if (name != "") alert("Không tìm thấy kết quả phù hợp");
        return;
    }
    listUserInforToGroup.innerHTML = "";

    for (let i = 0; i < users.length; i++) {
        let userInforDiv = document.createElement("div");
        let userNameElement = document.createElement("p");
        let viewBio = document.createElement("button");
        let addBtn = document.createElement("input");

        addBtn.type = "checkbox";
        addBtn.classList.add("addBtn");
        addBtn.dataset.userId = users[i].userId;

        userNameElement.innerText = users[i].userName;

        viewBio.classList.add("viewBio");
        viewBio.innerText = "Xem giới thiệu";
        viewBio.dataset.userId = users[i].userId;
        viewBio.dataset.userName = users[i].userName;
        viewBio.dataset.bio = users[i].bio;
        viewBio.dataset.address = users[i].address;

        userInforDiv.classList.add("userInforDiv");
        userInforDiv.appendChild(userNameElement);
        userInforDiv.appendChild(viewBio);
        userInforDiv.appendChild(addBtn);

        listUserInforToGroup.appendChild(userInforDiv);
    }
}

createGroupBtn.addEventListener("click", async function (e) {
    addGroupDiv.classList.remove("hide");
    addGroupDiv.classList.add("createBox");
    await loadChattingUser(e);
});

closeCreateGroupBtn.addEventListener("click", function () {
    searchInputMember.value = "";
    nameGroupInput.value = "";
    addGroupDiv.classList.remove("createBox");
    addGroupDiv.classList.add("hide");
    listUserInforToGroup.innerHTML = "";
});

async function getListRoom(name) {
    let rooms = await fetch("/api/addFriendSearch?name=" + name);
    return await rooms.json();
}

formAF.addEventListener("submit", async function (event) {
    event.preventDefault();

    let userName = searchInputAF.value.trim();
    searchInputAF.value = userName;

    listUserInfor.innerHTML = "";

    let users = await getListRoom(userName);

    if (users.length === 0) {
        alert("Không tìm được kết quả phù hợp");
        return;
    }

    for (let i = 0; i < users.length; i++) {
        let userNameElement = document.createElement("p");
        let viewBio = document.createElement("button");
        let chatOption = document.createElement("button");
        let userInforDiv = document.createElement("div");

        userInforDiv.classList.add("userInforDiv");
        userNameElement.innerText = users[i].userName;

        viewBio.classList.add("viewBio");
        viewBio.innerText = "Xem giới thiệu";
        viewBio.dataset.userName = users[i].userName;
        viewBio.dataset.bio = users[i].bio;
        viewBio.dataset.address = users[i].address;

        chatOption.classList.add("chatOption");
        chatOption.innerText = "Nhắn tin";
        chatOption.dataset.userId = users[i].userId;

        userInforDiv.appendChild(userNameElement);
        userInforDiv.appendChild(viewBio);
        userInforDiv.appendChild(chatOption);

        listUserInfor.appendChild(userInforDiv);
    }
});

async function handleOptionInAF(e) {
    // nếu click vào nút viewBio
    if (e.target.classList.contains("viewBio")) {
        viewUserBio.style.left = "450px";
        viewUserBio.classList.toggle("show");

        userProfile.style.zIndex = 3;
        viewUserBio.style.zIndex = 2;
        addFriendDiv.style.zIndex = 1;

        viewUserBio.querySelector("#lbName").innerText = e.target.dataset.userName;
        viewUserBio.querySelector("#lbBio").innerText = e.target.dataset.bio;
        viewUserBio.querySelector("#lbAddress").innerText = e.target.dataset.address;
    }
    else if (e.target.classList.contains("chatOption")) {
        e.preventDefault();

        loader.classList.remove("hide");
        loader.style.left = "120px";
        loader.style.top = "160px";

        stompClient.send("/app/chat.newDirectRoom", {}, JSON.stringify({
            userId1: e.target.dataset.userId,
            userLoginId: userLoginId
        }));

        searchInputAF.value = "";
        addFriendDiv.classList.remove("createBox");
        addFriendDiv.classList.add("hide");
        listUserInfor.innerHTML = "";
    }
}

listUserInfor.addEventListener("click", handleOptionInAF);
listRecommendUser.addEventListener("click", handleOptionInAF);

closeViewBio.addEventListener("click", function () {
    viewUserBio.classList.toggle("show");
});

formGroup.addEventListener("submit", async function (e) {
    e.preventDefault();
    await loadChattingUser();
});

listUserInforToGroup.addEventListener("click", function (e) {
    if (e.target.classList.contains("viewBio")) {
        viewUserBio.style.left = "450px";
        viewUserBio.classList.toggle("show");

        userProfile.style.zIndex = 3;
        viewUserBio.style.zIndex = 2;
        addGroupDiv.style.zIndex = 1;

        viewUserBio.querySelector("#lbName").innerText = e.target.dataset.userName;
        viewUserBio.querySelector("#lbBio").innerText = e.target.dataset.bio;
        viewUserBio.querySelector("#lbAddress").innerText = e.target.dataset.address;
    }
});

acptCreateGroup.addEventListener("click", async function () {
    let roomName = nameGroupInput.value.trim();
    nameGroupInput.value = "";

    if (roomName === "") {
        alert("Vui lòng nhập tên nhóm");
        return;
    }

    if (roomName.length > 65) {
        alert("Tên nhóm quá dài, vui lòng đặt tên ngắn hơn");
        return;
    }

    let addBtns = document.querySelectorAll(".addBtn");
    let userIds = [];
    for (let addBtn of addBtns) {
        if (addBtn.checked) {
            let userId = addBtn.dataset.userId;
            userIds.push(userId);
        }
    }

    if (userIds.length < 2) {
        alert("Nhóm cần có ít nhất 3 thành viên");
        return;
    }

    loader.classList.remove("hide");
    loader.style.left = "120px";
    loader.style.top = "160px";

    stompClient.send("/app/chat.newGroup", {}, JSON.stringify({
        userLoginId: userLoginId,
        userIds: userIds,
        roomName: roomName
    }));

    addGroupDiv.classList.remove("createBox");
    addGroupDiv.classList.add("hide");
});

async function getMember(roomId) {
    let members = await fetch("/api/viewMember?roomId=" + roomId);
    return members.json();
}

chatTitle.addEventListener("click", async function (e) {
    if (e.target.classList.contains("viewMemberBtn")) {
        let members = await getMember(chatTitle.dataset.roomId);

        listUserInforInGroup.innerHTML = "";

        for (let i = 0; i < members.length; i++) {
            let userInforDiv = document.createElement("div");
            let userNameElement = document.createElement("p");
            let viewBio = document.createElement("button");
            let reportBtn = document.createElement("button");

            userNameElement.innerText = members[i].userName;
            if (members[i].userId === userLoginId) {
                userNameElement.innerText = members[i].userName + " (Bạn)";
            }

            viewBio.classList.add("viewBio");
            viewBio.innerText = "Xem giới thiệu";
            viewBio.dataset.userId = members[i].userId;
            viewBio.dataset.userName = members[i].userName;
            viewBio.dataset.bio = members[i].bio;

            reportBtn.classList.add("reportBtn");
            reportBtn.innerText = "Báo cáo";
            reportBtn.dataset.userId = members[i].userId;
            reportBtn.dataset.userName = members[i].userName;

            userInforDiv.classList.add("userInforDiv");
            userInforDiv.appendChild(userNameElement);
            userInforDiv.appendChild(viewBio);

            if (members[i].userId != userLoginId) userInforDiv.appendChild(reportBtn);

            listUserInforInGroup.appendChild(userInforDiv);
        }

        viewMemberDiv.classList.add("createBox");
        viewMemberDiv.classList.remove("hide");
    }

    else if (e.target.classList.contains("reportBtn")) {
        let response = await fetch("/api/viewUserDirectRoom?roomId=" + chatTitle.dataset.roomId + "&userLoginId=" + userLoginId);
        let userInfor = await response.json();

        let reportedUserName = document.getElementById("reportedUserInfor");
        reportedUserName.innerText = "Người dùng vi phạm: " + userInfor.userName;

        acptSendReport.dataset.userIdSend = userLoginId;
        acptSendReport.dataset.reportedUserId = userInfor.userId;

        reportWritter.classList.remove("hide");
        reportWritter.classList.add("createBox");
    }

    else if (chatTitle.dataset.roomType === "direct" && e.target.closest(".avatar")) {
        let response = await fetch("/api/viewUserDirectRoom?roomId=" + chatTitle.dataset.roomId + "&userLoginId=" + userLoginId);
        let userInfor = await response.json();

        viewUserBio.querySelector("#lbName").innerText = userInfor.userName;
        viewUserBio.querySelector("#lbBio").innerText = userInfor.bio;
        viewUserBio.querySelector("#lbAddress").innerText = userInfor.address;

        viewUserBio.classList.toggle("show");
    }
});

listUserInforInGroup.addEventListener("click", async function (e) {
    if (e.target.classList.contains("viewBio")) {
        viewUserBio.style.left = "450px";
        viewUserBio.classList.toggle("show");

        userProfile.style.zIndex = 3;
        viewUserBio.style.zIndex = 2;
        addGroupDiv.style.zIndex = 1;

        viewUserBio.querySelector("#lbName").innerText = e.target.dataset.userName;
        viewUserBio.querySelector("#lbBio").innerText = e.target.dataset.bio;
    }
    else if (e.target.classList.contains("reportBtn")) {
        let reportedUserName = document.getElementById("reportedUserInfor");
        reportedUserName.innerText = "Người dùng vi phạm: " + e.target.dataset.userName;

        acptSendReport.dataset.userIdSend = userLoginId;
        acptSendReport.dataset.reportedUserId = e.target.dataset.userId;

        reportWritter.classList.remove("hide");
        reportWritter.classList.add("createBox");
    }
});

acptSendReport.addEventListener("click", async function () {
    let reportContentInput = document.getElementById("reportContentInput");
    let content = reportContentInput.value.trim();
    if (content === "") {
        alert("Vui lòng nhập nội dung báo cáo");
        return;
    }

    let response = await fetch("/api/sendReport", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userIdSend: userLoginId,
            reportedUserId: acptSendReport.dataset.reportedUserId,
            content: content
        })
    });

    let res = await response.text();

    if (res === "true") {
        alert("Gửi báo cáo thành công");
        reportWritter.classList.remove("createBox");
        reportWritter.classList.add("hide");
        reportWritter.querySelector("#reportContentInput").value = "";
    }
    else alert("Có lỗi xảy ra khi gửi báo cáo");
});

closeWritterBtn.addEventListener("click", function () {
    reportWritter.classList.remove("createBox");
    reportWritter.classList.add("hide");
    reportWritter.querySelector("#reportContentInput").value = "";
});

closeViewMemberBtn.addEventListener("click", function () {
    viewMemberDiv.classList.remove("createBox");
    viewMemberDiv.classList.add("hide");
});