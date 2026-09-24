
/* ------------------------------------- */
/* JS for calendar display and selection */
var today = new Date()
var mm = today.getMonth() //January is 0!
var yyyy = today.getFullYear();

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
var selectedDay = today.getDate()

document.querySelectorAll(".calButton").forEach(function (button) {
  button.addEventListener("click", function (e) {
    if(e.target.id == "incMonth"){
        if(mm + 1 == 12) {
            yyyy++;
            mm = 0
        }
        else
            mm++;
    }
    if(e.target.id == "decMonth"){
        if(mm - 1 == -1) {
            yyyy--;
            mm = 11
        }
        else
            mm--;
    }
    if(e.target.id == "incYear")
        yyyy++;
    if(e.target.id == "decYear")
        yyyy--;

    makeCalendar(yyyy, mm);
  });
});

document.addEventListener("click", function (e) {
    if (!e.target.classList.contains("inactive")) return;

    const active = document.querySelector(".active");

    if (active) {
        active.classList.remove("active");
        active.classList.add("inactive");
    }

    e.target.classList.remove("inactive");
    e.target.classList.add("active");
    selectedDay = e.target.getHTML();

    loadThumbnails()
});

/* Returns the first DOW of the month as a number 0 - Sunday, 1 - Monday, ...
   Months start at 0 - January, 1 - February, ... */
function firstDayOfTheMonth(year, month) {
    var day = new Date(year, month, 1).getDay();
    return day;
}

/* Returns the last day of the month */
function lastDayOfTheMonth(year, month) {
    var day = new Date(year,month,0).getDate();
    return day;
}

function makeCalendar(year, month) {
    var firstDay = firstDayOfTheMonth(year, month);
    var lastDay = lastDayOfTheMonth(year, month);

    var days = 1

    let yearRow = document.getElementById("year");
    yearRow.textContent = year;
    let monthRow = document.getElementById("month");
    monthRow.textContent = months[month];

    for(var i = 1; i <= 6; i++) {
        let row = document.getElementById("row" + String(i));
        row.replaceChildren();

        for(var j = 1; j <= 7; j++) {
            const cell = document.createElement("td");

            if(year == today.getFullYear() && month == today.getMonth() && days == today.getDate()) {
                cell.classList.add("active");
            }
            else {
                cell.classList.add("inactive");
            }

            if(i == 1) {
                if(j >= firstDay) {
                    cell.textContent = days;
                    days++;
                }
            }
            else {
                if(days <= lastDay){
                    cell.textContent = days;
                    days++;
                }
            }
            
            row.appendChild(cell);
        }
    }
}
/* ------------------------------------- */


/* ------------------------------------- */
/* JS for getting all of the images */
/* Displaying all of the thumbnails */
/* Displaying the current picture */

var imageList = [];

async function loadImage(date, time) {
    var full_path = await (await fetch("/api/filepath_full/" + date + "/" + time)).json();
    var medium_path = await (await fetch("/api/filepath_medium/" + date + "/" + time)).json();
    var metadata = await (await fetch("/api/metadata/" + date + "/" + time)).json();

    document.getElementById("aurora").textContent = "Aurora: " + metadata.aurora;
    document.getElementById("cloudy").textContent = "Cloudy: " + metadata.cloudy;
    document.getElementById("meteorite").textContent = "Bolide: " + metadata.meteor;
    document.getElementById("date-time").textContent = date + " " + time;

    let full = document.getElementById("full_image")
    let med = document.getElementById("medium_image");

    full.href = full_path;
    med.src = medium_path;
}

async function loadLatestImage() {
    image_data = await (await fetch("/api/latest/")).json();
    var full_path = image_data.filepath_full;
    var medium_path = image_data.filepath_medium;

    document.getElementById("aurora").textContent = "Aurora: " + image_data.aurora;
    document.getElementById("cloudy").textContent = "Cloudy: " + image_data.cloudy;
    document.getElementById("meteorite").textContent = "Bolide: " + image_data.meteor;
    document.getElementById("date-time").textContent = image_data.date + " " + image_data.time;

    let full = document.getElementById("full_image")
    let med = document.getElementById("medium_image");

    full.href = full_path;
    med.src = medium_path;
}

async function loadThumbnails() {
    const date = `${yyyy}-${String(mm + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
    const images = await (await fetch(`/api/${date}`)).json();

    let imageList = document.getElementById("imageList");

    imageList.replaceChildren();

    for(let i = 0; i < images.length; i++) {
        let li = document.createElement("li");
        let button = document.createElement("button");
        let img = document.createElement("img");

        var tmp_path = images[i].filepath_thumbnail;

        img.src = tmp_path
        button.addEventListener("click", function () {
            loadImage(date, images[i].time);

            const active = document.querySelector(".activeImage");

            if (active) {
                active.classList.remove("activeImage");
                active.classList.add("inactiveImage");
            }

            this.classList.remove("inactiveImage");
            this.classList.add("activeImage");
        });

        button.textContent = images[i].time

        button.appendChild(img);
        li.appendChild(button);
        li.setAttribute('id', i);
        imageList.appendChild(li)
    }
}

window.onload = function() {
    loadThumbnails()
    makeCalendar(yyyy, mm)
    loadLatestImage();
};

// Arrow navigation
function changeActive(id, newId) {
    const oldThumbnail = document.getElementById(id).children[0]
    const newThumbnail = document.getElementById(newId).children[0]

    oldThumbnail.classList.remove("activeImage");
    oldThumbnail.classList.add("inactiveImage");

    newThumbnail.classList.add("activeImage");
    newThumbnail.classList.remove("inactiveImage");

    newThumbnail.scrollIntoView({ behavior: "smooth", block: "center", inline: "center"});
}

window.addEventListener('keydown', (event) => {
    if(document.querySelector(".activeImage") == null)
        return;

    event.preventDefault()
    
    var active = Number(document.querySelector(".activeImage").parentElement.id);

    var liElements = Number(document.getElementById("imageList").getElementsByTagName("li").length);

    if((event.key == "ArrowLeft" || event.key == "ArrowUp") && active != 0) {
        changeActive(active, active - 1)
    }
    else if((event.key == "ArrowRight" || event.key == "ArrowDown") && active < liElements - 1){
        changeActive(active, active + 1)
    }

    const time = document.querySelector(".activeImage").textContent
    const date = `${yyyy}-${String(mm + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
    loadImage(date, time);
});
