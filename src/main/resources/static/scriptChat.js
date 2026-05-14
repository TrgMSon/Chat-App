const messageArea = document.getElementById("messageArea");
const messageInput = document.getElementById("messageInput");
const fileInput = document.getElementById("fileInput");
const messageForm = document.getElementById("messageForm");
const chatTitle = document.getElementById("chatTitle");
const chatTitleText = document.getElementById("chatTitleText");
const chatTitleIcon = document.getElementById("chatTitleIcon");
let listRoom = document.querySelectorAll("#listRoom li");
const welcomePage = document.getElementById("welcomePage");
const userIcon = document.getElementById("userIcon");
const menuUserInfor = document.getElementById("menu");
const buttonProfile = document.getElementById("profileBtn");
const buttonCloseProfile = document.getElementById("closeUserProfileBtn");
const userProfile = document.getElementById("userProfile");
const searchForm = document.getElementById("searchFormInput");
const searchInput = document.getElementById("searchInput");
const closeSearchBtn = document.getElementById("closeSearchBtn");
const fileNames = document.getElementById("fileName");
const hiddenDiv = document.getElementById("hiddenDiv");
const cancelSendFile = document.getElementById("cancelSendFile");
const loader = document.querySelector(".loader");
const sendMessBtn = document.getElementById("sendMessBtn");

let userLoginId = null;
let roomType = null;
let roomId = null;
let tmpDate = null;
let numberMessage = 0;
let pendingFile = [];
const userLoginName = userIcon.dataset.userName;

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
    console.log("Kết nối WebSocket thành công");

    listRoom.forEach(room => {
        stompClient.subscribe("/topic/room/" + room.dataset.roomId, onMessageReceived); // tin nhắn realtime
    });

    stompClient.subscribe("/users/queue/new-room", onRoomReceived);
    stompClient.subscribe("/users/queue/force-logout", onStatusReceived);
}

function onError() {
    alert("Lỗi kết nối WebSocket");
}

function onStatusReceived(payload) {
    let data = JSON.parse(payload.body);
    if (data.status === "banned") {
        setTimeout(() => {
            window.location.href = "/logout";
        }, 3000);
        alert("Tài khoản của bạn đã bị khóa");
    }
}

function addRoomToUI(roomData) {
    loader.classList.remove("hide");
    loader.style.left = "40px";
    loader.style.top = "130px";

    let roomList = document.getElementById("listRoom");
    let roomElement = document.createElement("li");
    roomElement.classList.add("room");

    roomElement.dataset.roomId = roomData.roomId;
    roomElement.dataset.roomName = roomData.roomName;
    roomElement.dataset.roomType = roomData.type;
    roomElement.dataset.firstChar = (roomData.roomName).toUpperCase().substring(0, 1);

    let avatarDiv = document.createElement("div");
    avatarDiv.classList.add("avatar");
    let iconElement = document.createElement("h1");
    iconElement.innerText = roomElement.dataset.firstChar;
    avatarDiv.style.backgroundColor = getColorCode(roomElement.dataset.firstChar);
    avatarDiv.appendChild(iconElement);

    let roomNameElement = document.createElement("p");
    roomNameElement.innerText = roomElement.dataset.roomName;

    roomElement.appendChild(avatarDiv);
    roomElement.appendChild(roomNameElement);

    roomList.prepend(roomElement);

    loader.classList.add("hide");
    loader.style.left = "";
    loader.style.top = "100px";
}

function onRoomReceived(payload) {
    let roomData = JSON.parse(payload.body);

    addRoomToUI(roomData);
    stompClient.subscribe("/topic/room/" + roomData.roomId, onMessageReceived);

    listRoom = document.querySelectorAll("#listRoom li");
    listRoom.forEach(room => {
        if (room.dataset.roomId === roomData.roomId) {
            room.addEventListener("click", function () {
                loadRoom(room);
            });
            return;
        }
    });

    loader.classList.add("hide");
    loader.style.left = "";
    loader.style.top = "100px";
}

function isNearBottom() {
    return messageArea.scrollTop + messageArea.clientHeight >= messageArea.scrollHeight - 200;
}

function onMessageReceived(payload) {
    let messageData = JSON.parse(payload.body);

    if (roomId === messageData.roomId) {
        if (numberMessage > 0) {
            numberMessage -= 1;
        }
        addMessageToUI(messageData);
    }

    listRoom.forEach(room => {
        if (room.dataset.roomId === messageData.roomId && messageData.userId != userLoginId) {
            room.style.fontWeight = "bold";
        }

        if (isNearBottom() && roomId === messageData.roomId && messageData.userId != userLoginId) {
            scrollToBottom();
            room.style.fontWeight = "";
        }

        if (room.dataset.roomId === messageData.roomId && messageData.userId === userLoginId) {
            scrollToBottom();
        }
    });
}

closeSearchBtn.classList.add("hide");

chatTitle.classList.add("hide");
messageForm.classList.add("hide");
welcomePage.classList.remove("hide");

userIcon.addEventListener("click", function () {
    menuUserInfor.classList.toggle("show");
});

function getColorCode(firstChar) {
    let colorCodes = ["green", "#663399", "#4169E1", "#FF8C00", "#E74C3C"];
    let index = firstChar.charCodeAt(0) % 5;
    return colorCodes[index];
}

userIcon.style.backgroundColor = getColorCode(userIcon.dataset.firstChar);

messageInput.addEventListener("input", function () {
    sendMessBtn.classList.remove("hide");

    let content = messageInput.value;
    hiddenDiv.innerHTML = content.replace(/\n/g, "<br>") + "<br>";

    if (content === "" && pendingFile.length === 0) sendMessBtn.classList.add("hide");

    let newHeight = hiddenDiv.scrollHeight;
    if (newHeight >= 150) messageInput.style.minHeight = "150px";
    else if (newHeight > 60) messageInput.style.minHeight = newHeight + "px";
    else messageInput.style.minHeight = "60px";
});

function removeFile(file, container) {
    // xóa khỏi mảng
    pendingFile = pendingFile.filter(f => f !== file);

    // xóa UI
    container.remove();

    if (pendingFile.length === 0) {
        cancelSendFile.classList.add("hide");
        if (messageInput.value === "") sendMessBtn.classList.add("hide");
    }
}

function previewImage(file) {
    let divPreview = document.createElement("div");
    divPreview.classList.add("div-preview");

    let img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.style.width = "100px";
    img.style.height = "120px";
    img.style.maxWidth = "100px";
    img.style.maxHeight = "120px";

    let delFileBtn = document.createElement("button");
    delFileBtn.classList.add("remove-file-btn");
    delFileBtn.innerText = "x";
    delFileBtn.addEventListener("click", function (e) {
        e.preventDefault();
        removeFile(file, divPreview);
    });

    divPreview.appendChild(img);
    divPreview.appendChild(delFileBtn);

    fileNames.appendChild(divPreview);

    // giải phóng bộ nhớ sau khi load xong
    img.onload = () => URL.revokeObjectURL(img.src);
}

function preViewFile(file) {
    let divPreview = document.createElement("div");
    divPreview.classList.add("div-preview");
    divPreview.style.width = "200px";

    let img = document.createElement("img");
    img.src = "https://res.cloudinary.com/dgtovt9xh/image/upload/v1778580283/simple-file-icon-the-icon-can-be-used-for-websites-print-templates-presentation-templates-illustrations-etc-free-vector_tqk4dn.webp";
    img.style.width = "50px";
    img.style.height = "60px";
    img.style.maxWidth = "50px";
    img.style.maxHeight = "60px";

    let fileTitle = document.createElement("p");
    fileTitle.innerText = file.name;

    let delFileBtn = document.createElement("button");
    delFileBtn.classList.add("remove-file-btn");
    delFileBtn.innerText = "x";
    delFileBtn.addEventListener("click", function (e) {
        e.preventDefault();
        removeFile(file, divPreview);
    });

    divPreview.appendChild(img);
    divPreview.appendChild(fileTitle);
    divPreview.appendChild(delFileBtn);

    fileNames.appendChild(divPreview);

    // giải phóng bộ nhớ sau khi load xong
    img.onload = () => URL.revokeObjectURL(img.src);
}

messageInput.addEventListener("paste", function (event) {
    let files = event.clipboardData.files;
    if (files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
        if (checkType(files[i])) {
            sendMessBtn.classList.remove("hide");
            cancelSendImg.classList.remove("hide");
        }
        else {
            alert("File không hợp lệ");
            continue;
        }

        if (checkSize(files[i])) {
            previewImage(files[i]);
            pendingFile.push(files[i]);
        }
        else alert("File quá dung lượng cho phép, vui lòng thử lại");
    }
});

async function loadRoom(room) {
    room.style.fontWeight = "";
    messageInput.value = "";
    fileInput.value = "";
    fileNames.innerHTML = "";
    pendingFile = [];
    numberMessage = 0;

    chatTitle.classList.remove("hide");
    messageForm.classList.remove("hide");
    welcomePage.classList.add("hide");

    messageArea.innerHTML = "";

    let viewMemberBtn = document.createElement("button");
    viewMemberBtn.innerText = "Xem thành viên";
    viewMemberBtn.classList.add("viewMemberBtn");

    let reportBtn = document.createElement("button");
    reportBtn.innerText = "Báo cáo";
    reportBtn.classList.add("reportBtn");
    reportBtn.style.height = "30%";

    roomId = room.dataset.roomId;
    roomType = room.dataset.roomType;
    let chatTitleAvatar = chatTitle.querySelector(".avatar");
    if (roomType === "group") {
        chatTitleAvatar.style.cursor = "";

        if (chatTitle.querySelector(".viewMemberBtn") === null) {
            viewMemberBtn.dataset.roomId = room.dataset.roomId;
            chatTitle.appendChild(viewMemberBtn);
        }
        if (chatTitle.querySelector(".reportBtn") != null) {
            chatTitle.removeChild(chatTitle.querySelector(".reportBtn"));
        }
    }
    if (roomType === "direct") {
        chatTitleAvatar.style.cursor = "pointer";

        if (chatTitle.querySelector(".viewMemberBtn") != null) {
            chatTitle.removeChild(chatTitle.querySelector(".viewMemberBtn"));
        }
        if (chatTitle.querySelector(".reportBtn") === null) {
            reportBtn.dataset.roomId = roomId;
            chatTitle.appendChild(reportBtn);
        }
    }

    let roomName = room.dataset.roomName;
    let firstChar = room.dataset.firstChar;
    chatTitle.dataset.roomType = roomType;
    chatTitleText.innerText = roomName;
    chatTitleIcon.innerText = firstChar;
    chatTitleIcon.style.fontWeight = "";
    chatTitle.dataset.roomId = room.dataset.roomId;

    chatTitleAvatar.style.backgroundColor = getColorCode(firstChar);

    await loadMessages(roomId);

    scrollToBottom();
    loader.classList.add("hide");
}

listRoom.forEach(room => {
    room.addEventListener("click", function () {
        loadRoom(room);
        room.style.backgroundColor = "#A9A9A9";
        listRoom.forEach(room1 => {
            if (room1.dataset.roomId != room.dataset.roomId) room1.style.backgroundColor = "";
        });
    });
});

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight - messageArea.clientHeight + 200;
}

listRoom.forEach(room => {
    let avatarDiv = room.querySelector(".avatar");
    avatarDiv.style.backgroundColor = getColorCode(room.dataset.firstChar);
});

function getCurrentDateTime() {
    let now = new Date();

    let day = String(now.getDate()).padStart(2, '0');
    let month = String(now.getMonth() + 1).padStart(2, '0');
    let year = now.getFullYear();

    return `${day}/${month}/${year}`;
}

function checkType(file) {
    const allowedTypes = [
        "image/",
        "video/",
        "audio/",
        "application/pdf",
        "application/x-zip-compressed",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ];

    let isValid = false;

    console.log(file.type);

    allowedTypes.forEach(type => {
        // các loại có prefix
        if (type.endsWith("/")) {
            if (file.type.startsWith(type)) isValid = true;
        }

        // loại cụ thể
        if (file.type === type) isValid = true;
    });

    return isValid;
}

function checkSize(file) {
    if (file.type.startsWith("video")) return file.size <= 100 * 1024 * 1024;
    return file.size <= 10 * 1024 * 1024;
}

async function sendMessage() {
    let content = messageInput.value.trim();

    if (content === "" && pendingFile.length === 0) return;

    sendMessBtn.classList.add("hide");
    messageInput.value = "";
    hiddenDiv.innerHTML = "";

    if (pendingFile.length > 0) {
        for (let file of pendingFile) {
            const authData = await fetch('/api/generate-signature').then(res => res.json());

            const formData = new FormData();
            formData.append("file", file);
            formData.append("api_key", authData.api_key);
            formData.append("timestamp", authData.timestamp);
            formData.append("signature", authData.signature);

            const response = await fetch("https://api.cloudinary.com/v1_1/" + authData.cloud_name + "/auto/upload", {
                method: "POST",
                body: formData
            });
            let result = await response.json();
            let urlFile = result.secure_url;

            let type = "";
            let fileName = "";
            if (file.type.startsWith("image")) type = "image";
            else {
                type = "file";
                fileName = file.name;
            }

            let messageData = {
                userId: userLoginId,
                roomId: roomId,
                userName: userLoginName,
                content: urlFile,
                type: type,
                fileName: file.name
            }

            stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(messageData));
            numberMessage += 1;
        }

        fileInput.value = "";
        fileNames.innerHTML = "";
        pendingFile = [];
        cancelSendFile.classList.add("hide");

        if (numberMessage === 0) loader.classList.add("hide");
    }

    if (content != "") {
        messageInput.style.minHeight = "60px";
        messageInput.style.maxHeight = "60px";

        let messageData = {
            userId: userLoginId,
            roomId: roomId,
            userName: userLoginName,
            content: content,
            type: "text",
            fileName: ""
        };

        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(messageData));
        numberMessage += 1;
    }
}

function formatDate(date) {
    let array = date.split("-");
    return `${array[2]}/${array[1]}/${array[0]}`;
}

function checkDate(date) {
    let dateNow = getCurrentDateTime();

    let date1 = date.split("/");
    let date2 = dateNow.split("/");

    if (Number(date1[2]) < Number(date2[2])) return true;
    else if (Number(date1[2]) === Number(date2[2])) {
        if (Number(date1[1]) < Number(date2[1])) return true;
        else if (Number(date1[1]) === Number(date2[1])) {
            if (Number(date1[0]) <= Number(date2[0])) return true;
            return false;
        }
        return false;
    }
    return false;
}

function getPublicId(url) {
    let fileName = url.split("/").pop();
    return fileName.split(".")[0] + "";
}

async function addMessageToUI(message) {
    const newMessage = document.createElement("div");
    newMessage.classList.add("message");

    const userNameElement = document.createElement("small");
    userNameElement.innerText = message.userName;

    const avatarElement = document.createElement("div");
    const iconAvatarElement = document.createElement("h3");
    const contentDiv = document.createElement("div");

    const datetime = document.createElement("small");
    datetime.innerText = message.createdAt.substring(11, 16);

    let dateFromDB = formatDate(message.createdAt.substring(0, 10));
    const dateElement = document.createElement("small");
    if (checkDate(dateFromDB) === true && tmpDate != dateFromDB) {
        dateElement.innerText = dateFromDB;
        dateElement.classList.add("dateTag");

        if (dateFromDB === getCurrentDateTime()) {
            dateElement.innerText = "Hôm nay";
        }

        messageArea.appendChild(dateElement);
        tmpDate = dateFromDB;
    }

    contentDiv.classList.add("content-div");

    if (message.userId === userLoginId) {
        newMessage.classList.add("me");
        contentDiv.classList.add("me");
    }
    // hiển thị tin nhắn có avatar
    else {
        iconAvatarElement.innerText = message.userName.toUpperCase().substring(0, 1);
        newMessage.classList.add("other");

        avatarElement.appendChild(iconAvatarElement);
        avatarElement.classList.add("avatar");
        avatarElement.style.marginRight = "10px";
        avatarElement.style.backgroundColor = getColorCode(iconAvatarElement.innerText);
        newMessage.appendChild(avatarElement);

        if (roomType === "group") contentDiv.appendChild(userNameElement);

        contentDiv.style.border = "1px solid black";
        contentDiv.style.borderRadius = "4px";
        contentDiv.style.padding = "10px 10px 10px 10px";
        contentDiv.classList.add("other");
    }

    if (message.type === "text") {
        const contentElement = document.createElement("p");
        contentElement.innerText = message.content;
        contentDiv.appendChild(contentElement);
    }
    else if (message.type === "image") {
        const realImg = document.createElement("img");
        realImg.style.userSelect = "none";
        realImg.src = "https://res.cloudinary.com/dsrecf30u/image/upload/v1775311940/id-loading-1_tptr6p.gif";
        realImg.style.height = "500px";
        realImg.style.width = "100%";

        const waitingImg = document.createElement("img");
        waitingImg.src = message.content;
        waitingImg.style.userSelect = "none";
        waitingImg.style.height = "500px";
        waitingImg.style.width = "100%";

        waitingImg.onload = function () {
            realImg.src = message.content;
            scrollToBottom();
        };
        contentDiv.appendChild(realImg);
    }
    else {
        const fileDiv = document.createElement("div");
        fileDiv.classList.add("file-div");

        const iconFile = document.createElement("img");
        iconFile.src = "https://res.cloudinary.com/dgtovt9xh/image/upload/v1778580283/simple-file-icon-the-icon-can-be-used-for-websites-print-templates-presentation-templates-illustrations-etc-free-vector_tqk4dn.webp";
        iconFile.style.width = "100px";
        iconFile.style.height = "100px";

        const fileInfor = document.createElement("div");
        fileInfor.classList.add("file-infor");

        const fileName = document.createElement("p");
        fileName.innerText = message.fileName;

        const downloadOpt = document.createElement("a");
        if (message.fileName.includes(".pdf")) {
            let response = await fetch("/api/generate-url-dowload-pdf?publicId=" + getPublicId(message.content)).then(res => res.json());
            downloadOpt.href = response.downloadUrl;
            downloadOpt.innerText = "Tải về";
        }
        else {
            downloadOpt.href = "#";
            downloadOpt.innerText = "Tải về";
            downloadOpt.addEventListener("click", async function (e) {
                e.preventDefault();

                const response = await fetch(message.content);
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement("a");

                a.href = blobUrl;
                a.download = message.fileName;
                a.click();

                URL.revokeObjectURL(blobUrl);
            });
        }

        fileInfor.appendChild(fileName);
        fileInfor.appendChild(downloadOpt);
        fileDiv.appendChild(iconFile);
        fileDiv.appendChild(fileInfor);
        contentDiv.appendChild(fileDiv);
    }

    contentDiv.appendChild(datetime);
    newMessage.appendChild(contentDiv);
    messageArea.appendChild(newMessage);
    if (numberMessage === 0) loader.classList.add("hide");
}

messageForm.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        if (e.shiftKey) {
            return;
        }

        e.preventDefault();
        if (messageInput.value === "") sendMessBtn.classList.add("hide");

        if (messageInput.value.trim() != "" || pendingFile.length > 0) loader.classList.remove("hide");
        sendMessage();
    }
});

messageForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (messageInput.value === "") sendMessBtn.classList.add("hide");
    if (messageInput.value.trim() != "" || (fileInput.files).length > 0) loader.classList.remove("hide");
    sendMessage();
});

async function loadMessages(roomId) {
    const res = await fetch("/api/getMessages?roomId=" + roomId);
    const messages = await res.json();

    (messages.reverse()).forEach(message => {
        addMessageToUI(message);
    });
}

buttonProfile.addEventListener("click", function () {
    userProfile.classList.toggle("show");
});

buttonCloseProfile.addEventListener("click", function () {
    userProfile.classList.toggle("show");
});

// mark room searched

async function getRoomIdByName(roomName) {
    let roomIds = await fetch("/api/searchRoom?roomName=" + roomName);
    return await roomIds.json();
}

let roomIds = null;

searchForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    let roomName = searchInput.value.trim();
    if (roomName === "") return;

    let response = await getRoomIdByName(roomName);
    roomIds = response.roomIds;

    if (roomIds.length === 0) {
        alert("Không tìm thấy kết quả");
        return;
    }

    listRoom.forEach(room => {
        if (roomIds.includes(room.dataset.roomId)) {
            room.style.backgroundColor = "#A9A9A9";
        }
    });

    closeSearchBtn.classList.remove("hide");
});

closeSearchBtn.addEventListener("click", function () {
    if (closeSearchBtn.classList.contains("hide")) return;

    listRoom.forEach(room => {
        if (roomIds.includes(room.dataset.roomId) && room.dataset.roomId != roomId) {
            room.style.backgroundColor = "";
        }
    });

    searchInput.value = "";

    closeSearchBtn.classList.add("hide");
});