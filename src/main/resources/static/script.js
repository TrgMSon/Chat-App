const messageArea = document.getElementById("messageArea");
const messageInput = document.getElementById("messageInput");
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
const userLoginName = userIcon.dataset.userName;
let userLoginId = null;
let roomType = null;
let roomId = null;

chatTitle.classList.add("hide");
messageForm.classList.add("hide");
welcomePage.classList.remove("hide");

userIcon.addEventListener("click", function () {
    menuUserInfor.classList.toggle("show");
});

listRoom.forEach(room => {
    room.addEventListener("click", function () {
        chatTitle.classList.remove("hide");
        messageForm.classList.remove("hide");
        welcomePage.classList.add("hide");

        roomType = this.dataset.roomType;
        const roomName = this.dataset.roomName;
        const firstChar = this.dataset.firstChar;
        chatTitleText.innerText = roomName;
        chatTitleIcon.innerText = firstChar;

        roomId = this.dataset.roomId;
        loadMessages(roomId);
    }, { once: true })
});

async function getUserId() {
    const userId = await fetch("/api/getSession");
    return userId.text();
}

async function initUserId() {
    userLoginId = await getUserId();
}

initUserId();

function getCurrentDateTime() {
    const currentDateTime = new Date();
    return currentDateTime;
}

async function saveMessage(message) {
    let response = await fetch("/api/saveMessage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
    });
    return response;
}

async function sendMessage(event) {
    event.preventDefault();

    const content = messageInput.value.trim();
    if (content === "") return;

    let message = {
        userId: userLoginId,
        roomId: roomId,
        userName: userLoginName,
        content: content
    };
    
    let response = await saveMessage(message);

    if (response.ok) {
        let message = await response.json();
        addMessageToUI(message);
        messageInput.value = "";
    }
    else alert("Có lỗi xảy ra khi gửi tin nhắn");
}

function addMessageToUI(message) {
    const newMessage = document.createElement("div");
    newMessage.classList.add("message");

    const userNameElement = document.createElement("small");
    userNameElement.innerText = message.userName;

    const avatarElement = document.createElement("div");
    const iconAvatarElement = document.createElement("h3");

    const contentElement = document.createElement("p");
    const contentDiv = document.createElement("div");
    contentElement.innerText = message.content;

    const datetime = document.createElement("small");
    datetime.innerText = message.createdAt;
    console.log(message.createdAt);

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
        newMessage.appendChild(avatarElement);
        
        if (roomType === "group") contentDiv.appendChild(userNameElement);

        contentDiv.style.border = "1px solid black";
        contentDiv.style.borderRadius = "4px";
        contentDiv.style.padding = "10px 10px 10px 10px";
        contentDiv.classList.add("other");
    }

    contentDiv.appendChild(contentElement);
    newMessage.appendChild(contentDiv);
    messageArea.appendChild(newMessage);
}

messageForm.addEventListener("submit", sendMessage);

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

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let roomName = searchInput.value.trim();
    searchInput.value = "";
    if (roomName === "") return;

    let roomIds = getRoomIdByName(roomName);
    console.log(roomIds);

    // listRoom.forEach(room => {
    //     let roomId = room.dataset.roomId;
    //     if (roomIds.includes(roomId)) console.log(roomId + " is ok");
    // });
});