const addFriendDiv = document.getElementById("addFriendDiv");
const addFriendBtn = document.getElementById("addFriendBtn");
const closeAFBtn = document.getElementById("closeAFBtn");
const formAF = document.getElementById("formAF");
const formGroup = document.getElementById("formGroup");
const searchInputAF = document.getElementById("searchInputAF");
const searchInputMember = document.getElementById("searchInputMember");
const listUserInfor = document.getElementById("listUserInfor");
const listUserInforToGroup = document.getElementById("listUserInforToGroup");
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

viewUserBio.classList.add("hide");

imageInput.addEventListener("change", function () {
    if (this.files.length > 0) {
        let listFile = "";
        for (let i = 0; i < this.files.length; i++) {
            listFile += this.files[i].name + "\n";
        }
        fileName.innerText = listFile;
    }
});


addFriendDiv.classList.remove("createBox");
addFriendDiv.classList.add("hide");

addGroupDiv.classList.remove("createBox");
addGroupDiv.classList.add("hide");

addFriendBtn.addEventListener("click", function () {
    addFriendDiv.classList.remove("hide");
    addFriendDiv.classList.add("createBox");
});

closeAFBtn.addEventListener("click", function () {
    addFriendDiv.classList.remove("createBox");
    addFriendDiv.classList.add("hide");
});

async function getChattingUser(name) {
    let users = await fetch("/api/addMemberSearch?name=" + name);
    return await users.json();
}

async function loadChattingUser(e) {
    e.preventDefault();

    let name = searchInputMember.value.trim();
    searchInputMember.value = name;

    listUserInforToGroup.innerHTML = "";
    let users = await getChattingUser(name);

    if (users.length === 0) {
        alert("Không tìm thấy kết quả phù hợp");
        return;
    }

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
    addGroupDiv.classList.remove("createBox");
    addGroupDiv.classList.add("hide");
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

        chatOption.classList.add("chatOption");
        chatOption.innerText = "Nhắn tin";
        chatOption.dataset.userId = users[i].userId;

        userInforDiv.appendChild(userNameElement);
        userInforDiv.appendChild(viewBio);
        userInforDiv.appendChild(chatOption);

        listUserInfor.appendChild(userInforDiv);
    }
});

listUserInfor.addEventListener("click", async function (e) {
    // nếu click vào nút viewBio
    if (e.target.classList.contains("viewBio")) {
        viewUserBio.style.left = "450px";
        viewUserBio.classList.toggle("show");

        userProfile.style.zIndex = 3;
        viewUserBio.style.zIndex = 2;
        addFriendDiv.style.zIndex = 1;

        viewUserBio.querySelector("#lbName").innerText = e.target.dataset.userName;
        viewUserBio.querySelector("#lbBio").innerText = e.target.dataset.bio;
    }
    else if (e.target.classList.contains("chatOption")) {
        e.preventDefault();

        await fetch("/api/createDirectRoom", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: e.target.dataset.userId
            })
        });

        addFriendDiv.classList.remove("addFriendDiv");
        addFriendDiv.classList.add("hide");
        viewUserBio.classList.add("hide");

        window.location.href = "/home";
    }
});

closeViewBio.addEventListener("click", function () {
    viewUserBio.classList.toggle("show");
});

formGroup.addEventListener("submit", loadChattingUser);

listUserInforToGroup.addEventListener("click", function (e) {
    if (e.target.classList.contains("viewBio")) {
        viewUserBio.style.left = "450px";
        viewUserBio.classList.toggle("show");

        userProfile.style.zIndex = 3;
        viewUserBio.style.zIndex = 2;
        addGroupDiv.style.zIndex = 1;

        viewUserBio.querySelector("#lbName").innerText = e.target.dataset.userName;
        viewUserBio.querySelector("#lbBio").innerText = e.target.dataset.bio;
    }
});

acptCreateGroup.addEventListener("click", async function () {
    let roomName = nameGroupInput.value.trim();
    
    if (roomName === "") {
        alert("Vui lòng nhập tên nhóm");
        return;
    }
    
    addGroupDiv.classList.remove("createBox");
    addGroupDiv.classList.add("hide");

    let addBtns = document.querySelectorAll(".addBtn");
    let userIds = [];
    for (let addBtn of addBtns) {
        if (addBtn.checked) {
            let userId = addBtn.dataset.userId;
            userIds.push(userId);
        }
    }

    await fetch("/api/createGroup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userIds: userIds,
            roomName: roomName
        })
    });

    window.location.href = "/home";
});

chatTitle.addEventListener("click", function (e) {
    if (e.target.classList.contains("viewMemberBtn")) {
        
    }
});