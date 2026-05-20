let firstTime = true;

async function onNewNameReceived(payload) {
    let data = JSON.parse(payload.body);

    for (room of listRoom) {
        if (room.dataset.roomId === data.roomId) {
            let pRoomName = room.querySelector("p");
            let avatarRoom = room.querySelector(".avatar");
            let chatTitleIconRoom = room.querySelector(".avatar h1");

            pRoomName.innerText = data.roomDTO5.newName;
            room.dataset.roomName = data.roomDTO5.newName;
            room.dataset.firstChar = (data.roomDTO5.newName).toUpperCase().substring(0, 1);
            avatarRoom.style.backgroundColor = getColorCode(room.dataset.firstChar);
            chatTitleIconRoom.innerText = room.dataset.firstChar;

            if (roomViewing === data.roomId) {
                let avatarChat = chatTitle.querySelector(".avatar");

                chatTitleText.innerText = data.roomDTO5.newName;
                avatarChat.style.backgroundColor = getColorCode(room.dataset.firstChar);
                chatTitleIcon.innerText = room.dataset.firstChar;
            }

            break;
        }
    }
}

setTimeout(() => {
    if (firstTime === true) {
        stompClient.subscribe("/users/queue/update-room-name", onNewNameReceived);
        firstTime = false;
    }
}, 600);