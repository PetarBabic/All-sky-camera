var today = new Date()
var dd = String(today.getDate()).padStart(2, '0');
var mm = today.getMonth() //January is 0!
var yyyy = today.getFullYear();

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
var currentDay = today.getDate()

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

    console.log("Click happened for: " + e.target.id);
  });
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
            const button = document.createElement("button");

            if(i == 1) {
                if(j >= firstDay) {
                    button.textContent = days;
                    days++;
                }
            }
            else {
                if(days <= lastDay){
                    button.textContent = days;
                    days++;
                }
            }
            
            cell.appendChild(button);
            row.appendChild(cell);
        }
    }
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
    loadThumbnails()
    makeCalendar(yyyy, mm)
};