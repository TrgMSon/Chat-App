let pageIndex = 1;
let isLoading = false;
let hasMore = true;
let lastMessage = null;
tmpDate = null;

messageArea.addEventListener("scroll", function () {
    if (messageArea.scrollTop === 0) {
        loadMessagePrevious();
    }
});

listRoom.forEach(room => {
    room.addEventListener("click", function () {
        pageIndex = 1;
        isLoading = false;
        hasMore = true;
        tmpDate = null;
        lastMessage = null;
    });
});

async function loadMessagePrevious() {
    if (!hasMore || isLoading) return;

    isLoading = true;

    let oldHeight = messageArea.scrollHeight;

    let roomId = chatTitle.dataset.roomId;
    let response = await fetch("/api/getPreMessage?roomId=" + roomId + "&pageIndex=" + pageIndex);
    let messages = await response.json();

    if (messages.length === 0) {
        hasMore = false;
        return;
    }

    messages.forEach(message => {
        lastMessage = message;
        addPreMessageToUI(message);
    });

    let newHeight = messageArea.scrollHeight;
    messageArea.scrollTop = newHeight - oldHeight;

    isLoading = false;

    pageIndex++;
}

function addPreMessageToUI(message) {
    const newMessage = document.createElement("div");
    newMessage.classList.add("message");

    const userNameElement = document.createElement("small");
    userNameElement.innerText = message.userName;

    const avatarElement = document.createElement("div");
    const iconAvatarElement = document.createElement("h3");
    const contentDiv = document.createElement("div");

    const timeSend = document.createElement("small");
    timeSend.innerText = message.createdAt.substring(11, 16);

    let dateFromDB = formatDate(message.createdAt.substring(0, 10));
    const dateElement = document.createElement("small");

    if (document.querySelector(".dateTag") != null) {
        let tmpDate1 = (document.querySelector(".dateTag")).innerText;
        if (tmpDate1 === dateFromDB) messageArea.removeChild(document.querySelector(".dateTag"));
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

    contentDiv.appendChild(timeSend);
    newMessage.appendChild(contentDiv);

    if (tmpDate != dateFromDB) {
        dateElement.innerText = tmpDate;
        dateElement.classList.add("dateTag");

        // if (dateFromDB === getCurrentDateTime()) dateElement.innerText = "Hôm nay"; 
        // // sửa load tin nhắn cũ của cùng 1 ngày nhưng khác page, ví dụ ngày 14/3/2026

        messageArea.prepend(dateElement);
        tmpDate = dateFromDB;
    }

    messageArea.prepend(newMessage);

    if (message === lastMessage) {
        dateElement.innerText = dateFromDB;
        dateElement.classList.add("dateTag");
        messageArea.prepend(dateElement);
    }

    //messageArea.appendChild(newMessage);
}

messageArea.addEventListener("scroll", function () {
    let roomId = chatTitle.dataset.roomId;

    listRoom.forEach(room => {
        if (room.dataset.roomId === roomId && isNearBottom()) {
            room.style.fontWeight = "";
        }
    })
})