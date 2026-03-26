const messageArea = document.getElementById("messageArea");
const messageInput = document.getElementById("messageInput");
const imageInput = document.getElementById("imageInput");
const messageForm = document.getElementById("messageForm");
const chatTitle = document.getElementById("chatTitle");
const chatTitleText = document.getElementById("chatTitleText");
const chatTitleIcon = document.getElementById("chatTitleIcon");
const listRoom = document.querySelectorAll("#listRoom li");
const welcomePage = document.getElementById("welcomePage");
const userIcon = document.getElementById("userIcon");
const menuUserInfor = document.getElementById("menu");
const buttonProfile = document.getElementById("profileBtn");
const buttonCloseProfile = document.getElementById("closeUserProfileBtn");
const userProfile = document.getElementById("userProfile");
const searchForm = document.getElementById("searchFormInput");
const searchInput = document.getElementById("searchInput");
const closeSearchBtn = document.getElementById("closeSearchBtn");
const fileName = document.getElementById("fileName");

let userLoginId = null;
let roomType = null;
let roomId = null;
let tmpDate = null;
const userLoginName = userIcon.dataset.userName;

async function initUserId() {
    let userId = await fetch("/api/getSession");
    userLoginId = await userId.text();
    connect();
}

initUserId();

let stompClient = null;

function connect() {
    let socket = new SockJS("/wss");
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
        alert("Tài khoản của bạn đã bị khóa");
        setTimeout(() => {
            window.location.href = "/logout";
        }, 3000);
    }
}

function addRoomToUI(roomData) {
    let roomList = document.getElementById("listRoom");
    let roomElement = document.createElement("li");
    roomElement.classList.add("room");

    roomElement.dataset.roomId = roomData.roomId;
    roomElement.dataset.roomName = roomData.roomName;
    roomElement.dataset.type = roomData.type;
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

    roomList.appendChild(roomElement);
}

function onRoomReceived(payload) {
    let roomData = JSON.parse(payload.body);
    addRoomToUI(roomData);
    stompClient.subscribe("/topic/room/" + roomData.roomId, onMessageReceived);
}

function isNearBottom() {
    return messageArea.scrollTop + messageArea.clientHeight >= messageArea.scrollHeight - 50;
}

function onMessageReceived(payload) {
    let messageData = JSON.parse(payload.body);

    if (roomId === messageData.roomId) addMessageToUI(messageData);

    listRoom.forEach(room => {
        if (room.dataset.roomId === messageData.roomId && messageData.userId != userLoginId) {
            room.style.fontWeight = "bold";

            if (isNearBottom()) {
                scrollToBottom();
                room.style.fontWeight = "";
            }
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
    this.style.height = "auto";

    const maxHeight = 150;

    if (!this.value.trim()) {
        this.style.minHeight = "60px";
        this.style.maxHeight = "60px";
        return;
    }

    if (this.scrollHeight > maxHeight) {
        this.style.minHeight = maxHeight + "px";
    } else {
        this.style.minHeight = this.scrollHeight + "px";
    }
});

listRoom.forEach(room => {
    room.addEventListener("click", async function () {
        room.style.fontWeight = "";
        messageInput.value = "";
        imageInput.value = "";
        fileName.innerHTML = "";

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

        roomId = this.dataset.roomId;
        roomType = this.dataset.roomType;
        if (roomType === "group") {
            if (chatTitle.querySelector(".viewMemberBtn") === null) {
                viewMemberBtn.dataset.roomId = this.dataset.roomId;
                chatTitle.appendChild(viewMemberBtn);
            }
            if (chatTitle.querySelector(".reportBtn") != null) {
                chatTitle.removeChild(chatTitle.querySelector(".reportBtn"));
            }
        }
        if (roomType === "direct") {
            if (chatTitle.querySelector(".viewMemberBtn") != null) {
                chatTitle.removeChild(chatTitle.querySelector(".viewMemberBtn"));
            }
            if (chatTitle.querySelector(".reportBtn") === null) {
                reportBtn.dataset.roomId = roomId;
                chatTitle.appendChild(reportBtn);
            }
        }

        let roomName = this.dataset.roomName;
        let firstChar = this.dataset.firstChar;
        chatTitle.dataset.roomType = roomType;
        chatTitleText.innerText = roomName;
        chatTitleIcon.innerText = firstChar;
        chatTitleIcon.style.fontWeight = "";
        chatTitle.dataset.roomId = this.dataset.roomId;

        let chatTitleAvatar = chatTitle.querySelector(".avatar");
        chatTitleAvatar.style.backgroundColor = getColorCode(firstChar);

        await loadMessages(roomId);

        scrollToBottom();
    });
});

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight - messageArea.clientHeight;
}

listRoom.forEach(room => {
    let avatarDiv = room.querySelector(".avatar");
    avatarDiv.style.backgroundColor = getColorCode(room.dataset.firstChar);
});

function getCurrentDateTime() {
    // let currentDateTime = new Date();
    // let tmp = currentDateTime.toLocaleString().substring(0, 9).split("/");
    // return tmp[1].padStart(2, '0') + "/" + tmp[0].padStart(2, '0') + "/" + tmp[2];

    let now = new Date();

    let day = String(now.getDate()).padStart(2, '0');
    let month = String(now.getMonth() + 1).padStart(2, '0');
    let year = now.getFullYear();

    return `${day}/${month}/${year}`;
}

async function sendMessage() {
    let images = imageInput.files;
    let content = messageInput.value.trim();

    if (content === "" && images.length === 0) return;

    if (content != "") {
        let messageData = {
            userId: userLoginId,
            roomId: roomId,
            userName: userLoginName,
            content: content,
            type: "text"
        };

        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(messageData));
        messageInput.value = "";

        messageInput.style.minHeight = "60px";
        messageInput.style.maxHeight = "60px";
    }

    if (images.length > 0) {
        let formData = new FormData();
        for (let image of images) {
            formData.append("image", image);

            let response = await fetch("/api/upload-image", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                alert("Ảnh gửi lên quá 20MB, vui lòng thử lại");
                return;
            }

            let urlImg = await response.text();

            let messageData = {
                userId: userLoginId,
                roomId: roomId,
                userName: userLoginName,
                content: urlImg,
                type: "image"
            }

            stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(messageData));
        }
        fileName.innerHTML = "";
        imageInput.value = "";
    }
}

function formatDate(date) {
    let array = date.split("-");
    // let ans = "";
    // ans = array[2] + "/" + array[1] + "/" + array[0];
    // return ans;
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

function addMessageToUI(message) {
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

        if (dateFromDB === getCurrentDateTime()) dateElement.innerText = "Hôm nay";

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
    else {
        const imageElement = document.createElement("img");
        imageElement.style.userSelect = "none";
        imageElement.src = message.content;
        imageElement.onload = function () {
            scrollToBottom();
        };
        contentDiv.appendChild(imageElement);
    }

    contentDiv.appendChild(datetime);
    newMessage.appendChild(contentDiv);
    messageArea.appendChild(newMessage);
}

messageForm.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        if (e.shiftKey) {
            return;
        }

        e.preventDefault();
        sendMessage();
    }
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
        let roomId = room.dataset.roomId;
        if (roomIds.includes(roomId)) {
            room.style.backgroundColor = "#A9A9A9";
        }
    });

    closeSearchBtn.classList.remove("hide");
});

closeSearchBtn.addEventListener("click", function (event) {
    event.preventDefault;

    closeSearchBtn.classList.add("hide");

    listRoom.forEach(room => {
        let roomId = room.dataset.roomId;
        if (roomIds.includes(roomId)) {
            room.style.backgroundColor = "";
        }
    });

    searchInput.value = "";
});
