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
const userLoginName = userIcon.dataset.userName;

let stompClient = null;

function connect() {
    let socket = new SockJS("/ws");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected, onError);
}

connect();

function onConnected() {
    console.log("Kết nối WebSocket thành công");

    listRoom.forEach(room => {
        let roomId = room.dataset.roomId;
        stompClient.subscribe("/topic/room/" + roomId, onMessageReceived); // tin nhắn realtime
    });
}

function onMessageReceived(payload) {
    let messageData = JSON.parse(payload.body);
    addMessageToUI(messageData);
}

function onError() {
    alert("Lỗi kết nối WebSocket");
}

closeSearchBtn.classList.add("hide");

let userLoginId = null;
let roomType = null;
let roomId = null;
let tmpDate = null;

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

listRoom.forEach(room => {
    room.addEventListener("click", function () {
        chatTitle.classList.remove("hide");
        messageForm.classList.remove("hide");
        welcomePage.classList.add("hide");

        messageArea.innerHTML = "";

        let viewMemberBtn = document.createElement("button");
        viewMemberBtn.innerText = "Xem thành viên";
        viewMemberBtn.classList.add("viewMemberBtn");

        roomType = this.dataset.roomType;
        if (roomType === "group" && chatTitle.querySelector(".viewMemberBtn") === null) {
            chatTitle.appendChild(viewMemberBtn);
        }
        if (roomType === "direct" && chatTitle.querySelector(".viewMemberBtn") !== null) {
            chatTitle.removeChild(chatTitle.querySelector(".viewMemberBtn"));
        }

        let roomName = this.dataset.roomName;
        let firstChar = this.dataset.firstChar;
        chatTitleText.innerText = roomName;
        chatTitleIcon.innerText = firstChar;

        let chatTitleAvatar = chatTitle.querySelector(".avatar");
        chatTitleAvatar.style.backgroundColor = getColorCode(firstChar);

        roomId = this.dataset.roomId;
        loadMessages(roomId);
    });
});

listRoom.forEach(room => {
    let avatarDiv = room.querySelector(".avatar");
    avatarDiv.style.backgroundColor = getColorCode(room.dataset.firstChar);
});

async function initUserId() {
    const userId = await fetch("/api/getSession");
    userLoginId = await userId.text();
}

initUserId();

function getCurrentDateTime() {
    let currentDateTime = new Date();
    let tmp = currentDateTime.toLocaleString().substring(0, 9).split("/");
    return tmp[1].padStart(2, '0') + "/" + tmp[0].padStart(2, '0') + "/" + tmp[2];
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
    }

    if (images.length > 0) {
        let formData = new FormData();
        for (let image of images) {
            formData.append("image", image);

            let response = await fetch("/api/upload-image", {
                method: "POST",
                body: formData
            });

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
    }
}

function formatDate(date) {
    let array = date.split("-");
    let ans = "";
    ans = array[2] + "/" + array[1] + "/" + array[0];
    return ans;
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
    if (checkDate(dateFromDB) === true && tmpDate != dateFromDB) {
        const dateElement = document.createElement("small");
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
        contentDiv.appendChild(imageElement);
    }

    contentDiv.appendChild(datetime);
    newMessage.appendChild(contentDiv);
    messageArea.appendChild(newMessage);
}

messageForm.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
    }
});

async function loadMessages(roomId) {
    const res = await fetch("/api/getMessages?roomId=" + roomId);
    const messages = await res.json();

    messages.forEach(message => {
        addMessageToUI(message);
    })
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