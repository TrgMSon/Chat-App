let pageIndex = 1;
let isLoading = false;
let hasMore = true;
let lastMessage = null;
tmpDate = null;

messageArea.addEventListener("scroll", function () {
    if (messageArea.scrollTop === 0 && tmpDate != null) {
        loadMessagePrevious();
    }
});

listRoom.forEach(room => {
    room.addEventListener("click", function () {
        pageIndex = 1;
        isLoading = false;
        hasMore = true;
        lastMessage = null;
        tmpDate = null;
    });
});

async function loadMessagePrevious() {
    if (!hasMore || isLoading) return;

    isLoading = true;
    loader.classList.remove("hide");

    let oldHeight = messageArea.scrollHeight;

    let roomId = chatTitle.dataset.roomId;
    let response = await fetch("/api/getPreMessage?roomId=" + roomId + "&pageIndex=" + pageIndex);
    let messages = await response.json();

    if (messages.length === 0) {
        hasMore = false;
        loader.classList.add("hide");
        return;
    }

    for (let message of messages) {
        lastMessage = message;
        await addPreMessageToUI(message);

        let newHeight = messageArea.scrollHeight;
        messageArea.scrollTop = newHeight - oldHeight;
    }

    loader.classList.add("hide");
    isLoading = false;

    pageIndex++;
}

async function addPreMessageToUI(message) {
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
        if (tmpDate1 === "Hôm nay") tmpDate1 = getCurrentDateTime();
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
        if (!isUrl(message.content)) {
            const contentElement = document.createElement("p");
            contentElement.innerText = message.content;
            contentDiv.appendChild(contentElement);
        }
        else {
            const contentElement = document.createElement("a");
            contentElement.style.marginTop = "20px";
            contentElement.style.marginBottom = "20px";
            contentElement.innerHTML = parseTextToUrl(message.content);
            contentDiv.appendChild(contentElement);
        }
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
        };
        contentDiv.appendChild(realImg);
    }
    else {
        const fileDiv = document.createElement("div");
        fileDiv.classList.add("file-div");

        const iconFile = document.createElement("img");
        iconFile.src = getIconFile(message.fileName);
        iconFile.style.width = "100px";
        iconFile.style.height = "100px";

        const fileInfor = document.createElement("div");
        fileInfor.classList.add("file-infor");

        const fileName = document.createElement("p");
        fileName.innerText = message.fileName;

        const downloadOpt = document.createElement("a");
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

        fileInfor.appendChild(fileName);
        fileInfor.appendChild(downloadOpt);
        fileDiv.appendChild(iconFile);
        fileDiv.appendChild(fileInfor);
        contentDiv.appendChild(fileDiv);
    }

    contentDiv.appendChild(timeSend);
    newMessage.appendChild(contentDiv);

    if (tmpDate != dateFromDB) {
        dateElement.innerText = tmpDate;
        dateElement.classList.add("dateTag");

        if (dateFromDB === getCurrentDateTime()) dateElement.innerText = "Hôm nay";

        messageArea.prepend(dateElement);
        tmpDate = dateFromDB;
    }

    messageArea.prepend(newMessage);

    if (message === lastMessage) {
        dateElement.innerText = dateFromDB;
        if (dateFromDB === getCurrentDateTime()) dateElement.innerText = "Hôm nay";
        dateElement.classList.add("dateTag");
        messageArea.prepend(dateElement);
    }
}

messageArea.addEventListener("scroll", async function () {
    for (let room of listRoom) {
        if (room.dataset.roomId === roomViewing && isNearBottomChat()) {
            room.style.fontWeight = "";
            if (room.dataset.isReadLastMessage === "0") {
                room.dataset.isReadLastMessage = "1";
                await updateSeenLastMessage(room);
            }
            break;
        }
    }
});