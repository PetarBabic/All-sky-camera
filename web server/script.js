var today = new Date()
var dd = String(today.getDate()).padStart(2, '0');
var mm = today.getMonth() //January is 0!
var yyyy = today.getFullYear();

const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function printDays() {
    let dayList = document.getElementById("listOfDays");

    for (let i = 1; i < days[mm] + 1; i++) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(i));
        dayList.appendChild(li)
    }
}

function setCurrentDate() {
    document.getElementById("currentMonth").textContent = String(months[mm]) + " " + String(yyyy)
}
function loadImage(path) {
    let full = document.getElementById("full-sized_image");
    let med = document.getElementById("medium_image");

    path = path.replace("thumbnail", "full-sized");
    full.href = path;

    path = path.replace("full-sized", "medium");
    med.src = path;
}


function loadThumbnails() {
    var path = "images/thumbnail/2034-"
    let imageList = document.getElementById("imageList");

    for(let i = 10; i <= 27; i++) {
        let li = document.createElement("li");
        let button = document.createElement("button");
        let img = document.createElement("img");

        var tmp_path = path + String(i) + ".jpg";

        img.src = tmp_path
        button.addEventListener("click", () => loadImage(tmp_path));

        button.appendChild(img);
        li.appendChild(button);
        imageList.appendChild(li)
    }
}

window.onload = function() {
    printDays()
    setCurrentDate()
    loadThumbnails()
};