let firstTime = true;

async function onNewNameReceived(payload) {
    let data = JSON.parse(payload.body);

    for (room of listRoom) {
        if (room.dataset.roomId === data.roomId) {
            let pRoomName = room.querySelector("p");

            pRoomName.innerText = data.roomDTO5.newName;
            room.dataset.roomName = data.roomDTO5.newName;
            chatTitleText.innerText = data.roomDTO5.newName;

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