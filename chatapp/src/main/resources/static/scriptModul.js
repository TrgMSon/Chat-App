const addFriendDiv = document.getElementById("addFriendDiv");
const addFriendBtn = document.getElementById("addFriendBtn");
const closeAFBtn = document.getElementById("closeAFBtn");
const formAF = document.getElementById("formAF");
const searchInputAF = document.getElementById("searchInputAF");
const listUserInfor = document.getElementById("listUserInfor");
const viewBios = document.querySelectorAll(".viewBio");
const chatOptions = document.querySelectorAll(".chatOption");
const fileName = document.getElementById("fileName");

imageInput.addEventListener("change", function () {
    if (this.files.length > 0) {
        let listFile = "";
        for (let i=0; i<this.files.length; i++) {
            listFile += this.files[i].name + "\n"; 
        }
        fileName.innerText = listFile;
    }
});

addFriendDiv.classList.add("hide");

console.log("hello");

addFriendBtn.addEventListener("click", function () {
    addFriendDiv.classList.remove("hide");
    addFriendDiv.classList.add("addFriendDiv");
});

closeAFBtn.addEventListener("click", function () {
    addFriendDiv.classList.remove("addFriendDiv");
    addFriendDiv.classList.add("hide");
});

async function getListRoom(name) {
    let rooms = await fetch("/api/addFriendsearch?name=" + name);
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

    users.forEach(user => {
        let userNameElement = document.createElement("p");
        let viewBio = document.createElement("button");
        let chatOption = document.createElement("button");
        let userInforDiv = document.createElement("div");

        userInforDiv.classList.add("userInforDiv");
        userNameElement.innerText = user.userName;

        viewBio.classList.add("viewBio");
        viewBio.innerText = "Xem giới thiệu";
        viewBio.dataset.userName = user.userName;
        viewBio.dataset.bio = user.bio;

        chatOption.classList.add("chatOption");
        chatOption.innerText = "Nhắn tin";
        chatOption.dataset.userId = user.userId;

        userInforDiv.appendChild(userNameElement);
        userInforDiv.appendChild(viewBio);
        userInforDiv.appendChild(chatOption);

        listUserInfor.appendChild(userInforDiv);
    });
});

listUserInfor.addEventListener("click", function (e) {
    // nếu click vào nút viewBio
    if (e.target.classList.contains("viewBio")) {
        userProfile.classList.toggle("show");
        
        userProfile.style.zIndex = 2;
        addFriendDiv.style.zIndex = 1;
        
        userProfile.querySelector("#lbName").innerText = e.target.dataset.userName;
        userProfile.querySelector("#lbBio").innerText = e.target.dataset.bio;
    }
    else if (e.target.classList.contains("chatOption")) {
        
    }
});