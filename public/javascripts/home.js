
const date = new Date();
function jdFromDate(dd, mm, yy) {
    var a, y, m, jd;
    a = Math.floor((14 - mm) / 12);
    y = yy + 4800 - a;
    m = mm + 12 * a - 3;
    jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    if (jd < 2299161) {
        jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
    }
    return jd;
}
function jdToDate(jd) {
    var a, b, c, d, e, m, day, month, year;
    if (jd > 2299160) { // After 5/10/1582, Gregorian calendar
        a = jd + 32044;
        b = Math.floor((4 * a + 3) / 146097);
        c = a - Math.floor((b * 146097) / 4);
    } else {
        b = 0;
        c = jd + 32082;
    }
    d = Math.floor((4 * c + 3) / 1461);
    e = c - Math.floor((1461 * d) / 4);
    m = Math.floor((5 * e + 2) / 153);
    day = e - Math.floor((153 * m + 2) / 5) + 1;
    month = m + 3 - 12 * Math.floor(m / 10);
    year = b * 100 + d - 4800 + Math.floor(m / 10);
    return new Array(day, month, year);
}
function getNewMoonDay(k, timeZone) {
    var T, T2, T3, dr, Jd1, M, Mpr, F, C1, deltat, JdNew;
    T = k / 1236.85; // Time in Julian centuries from 1900 January 0.5
    T2 = T * T;
    T3 = T2 * T;
    dr = Math.PI / 180;
    Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr); // Mean new moon
    M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3; // Sun's mean anomaly
    Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3; // Moon's mean anomaly
    F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3; // Moon's argument of latitude
    C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
    C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
    C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
    C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
    C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
    C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
    C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
    if (T < -11) {
        deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
    } else {
        deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
    };
    JdNew = Jd1 + C1 - deltat;
    return Math.floor(JdNew + 0.5 + timeZone / 24)
}
function getSunLongitude(jdn, timeZone) {
    var T, T2, dr, M, L0, DL, L;
    T = (jdn - 2451545.5 - timeZone / 24) / 36525; // Time in Julian centuries from 2000-01-01 12:00:00 GMT
    T2 = T * T;
    dr = Math.PI / 180; // degree to radian
    M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2; // mean anomaly, degree
    L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2; // mean longitude, degree
    DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
    L = L0 + DL; // true longitude, degree
    L = L * dr;
    L = L - Math.PI * 2 * (Math.floor(L / (Math.PI * 2))); // Normalize to (0, 2*Math.PI)
    return Math.floor(L / Math.PI * 6)
}
function getLunarMonth11(yy, timeZone) {
    var k, off, nm, sunLong;
    off = jdFromDate(31, 12, yy) - 2415021;
    k = Math.floor(off / 29.530588853);
    nm = getNewMoonDay(k, timeZone);
    sunLong = getSunLongitude(nm, timeZone); // sun longitude at local midnight
    if (sunLong >= 9) {
        nm = getNewMoonDay(k - 1, timeZone);
    }
    return nm;
}
function getLeapMonthOffset(a11, timeZone) {
    var k, last, arc, i;
    k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    last = 0;
    i = 1; // We start with the month following lunar month 11
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    do {
        last = arc;
        i++;
        arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    } while (arc != last && i < 14);
    return i - 1;
}
function convertSolar2Lunar(dd, mm, yy, timeZone) {
    var k, dayNumber, monthStart, a11, b11, lunarDay, lunarMonth, lunarYear, lunarLeap;
    dayNumber = jdFromDate(dd, mm, yy);
    k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
    monthStart = getNewMoonDay((k + 1), timeZone);
    if (monthStart > dayNumber) {
        monthStart = getNewMoonDay(k, timeZone);
    }
    a11 = getLunarMonth11(yy, timeZone);
    b11 = a11;
    if (a11 >= monthStart) {
        lunarYear = yy;
        a11 = getLunarMonth11(yy - 1, timeZone);
    }
    else {
        lunarYear = yy + 1;
        b11 = getLunarMonth11(yy + 1, timeZone);
    }
    lunarDay = dayNumber - monthStart + 1;
    var diff = Math.floor((monthStart - a11) / 29);
    lunarLeap = 0;
    lunarMonth = diff + 11;
    if (b11 - a11 > 365) {
        var leapMonthDiff = getLeapMonthOffset(a11, timeZone);
        if (diff >= leapMonthDiff) {
            lunarMonth = diff + 10;
            if (diff == leapMonthDiff) {
                lunarLeap = 1;
            }
        }
    }
    if (lunarMonth > 12) {
        lunarMonth = lunarMonth - 12;
    }
    if (lunarMonth >= 11 && diff < 4) {
        lunarYear -= 1;
    }
    return new Array(lunarDay, lunarMonth, lunarYear);
}

const renderCalendar = (date) => {
    date.setDate(1);

    const monthDays = document.querySelector(".days");

    const lastDay = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDate();

    const prevLastDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        0
    ).getDate();

    const firstDayIndex = date.getDay();

    const lastDayIndex = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDay();

    const nextDays = 7 - lastDayIndex - 1;

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    document.querySelector(".date h1").innerHTML = months[date.getMonth()];
    var monthss = date.getMonth() + 1;
    var year = date.getFullYear() + 1
    document.querySelector(".date p").innerHTML = new Date().toDateString();

    let days = "";

    for (let x = firstDayIndex; x > 0; x--) {
        let Day = prevLastDay - x + 1;
        let xxx = convertSolar2Lunar(Day, monthss - 1, year - 1, 7);
        let ngay = xxx[0];
        let thang = xxx[1];
        let nam = xxx[2];
        days += `<div class="prev-date">` + Day + "<p class=\"lunar\">" + ngay + "/" + thang + "</p>" + `</div>`;
    }

    for (let i = 1; i <= lastDay; i++) {
        if (
            i === new Date().getDate() &&
            date.getMonth() === new Date().getMonth()
        ) {
            let Day = i;
            let xxx = convertSolar2Lunar(Day, monthss, year - 1, 7);
            let ngay = xxx[0];
            let thang = xxx[1];
            let nam = xxx[2];
            days += `<div class="today">` + Day + "<p class=\"lunar\">" + ngay + "/" + thang + "</p>" + `</div>`;
        } else {
            let Day = i;
            let xxx = convertSolar2Lunar(Day, monthss, year - 1, 7);
            let ngay = xxx[0];
            let thang = xxx[1];
            let nam = xxx[2];
            days += `<div class="normal-dates">` + Day + "<p class=\"lunar\">" + ngay + "/" + thang + "</p>" + `</div>`;
        }
    }

    for (let j = 1; j <= nextDays; j++) {
        let Day = j;
        let xxx = convertSolar2Lunar(Day, monthss + 1, year - 1, 7);
        let ngay = xxx[0];
        let thang = xxx[1];
        let nam = xxx[2];
        days += `<div class="next-date">` + Day + "<p class=\"lunar\">" + ngay + "/" + thang + "</p>" + `</div>`;
    }
    monthDays.innerHTML = days;
    document.querySelectorAll(".normal-dates").forEach(item => {
        item.addEventListener("click", event => {
            var targetDate = new Date();
            targetDate.setDate(event.target.textContent);
            targetDate.setMonth(date.getMonth());
        })
    });
};

function get_username() {
    return document.getElementById("dataset").dataset.username;
}


const USERNAME = get_username();

function show_calendar() {

    document.querySelector(".prev").addEventListener("click", () => {
        date.setMonth(date.getMonth() - 1);
        renderCalendar(date);
    });

    document.querySelector(".next").addEventListener("click", () => {
        date.setMonth(date.getMonth() + 1);
        renderCalendar(date);
    });

    renderCalendar(date);
}
show_calendar();

var generated_ID = function () {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
};

const cyrb53 = function (str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
var subcribers = [];

function show_subcriber(subcriber_slidebar) {

    axios.post(
        '/get/SubUser',
        { "id1": USERNAME }
    ).then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
            subcribers.push(response.data[i]["id2"]);
            var other_username = subcribers[i];
            var content = document.createElement("h3");
            // checkbox.style.marginLeft ;
            content.style.color = "darkgreen";
            content.style.background = "azure";
            content.style.padding = "auto";
            content.style.width = "240px";
            content.style.height = "30px";
            content.style.marginTop = "0px";
            content.style.cursor = "pointer";
            content.style.borderRadius = "10px";
            content.style.opacity = "0.7"
            content.innerHTML = "<span style='font-size:20px; margin-left:10px;'>&#9831</span>" + response.data[i]["id2"];
            content.dataset["username"] = subcribers[i];
            content.addEventListener("click", function () {
                window.location.href = "/friend?username0=" + USERNAME + "&username1=" + this.dataset["username"];
            })
            subcriber_slidebar.appendChild(content);
        }
    }).catch(function (error) {
        console.log(error);
    });

}

let subcriber_slidebar = document.getElementById("subcriber");

show_subcriber(subcriber_slidebar);

function generateTableHead(table) {
    var day = new Date();
    var month = day.getMonth() + 1;

    // head.className = 'headtb';

    var row = table.insertRow();

    for (var i = 0; i < 8; i++) {
        var square = row.insertCell();
        var content = document.createElement("header_timetable");
        // square.style.backgroundColor = "#167e56";
        if (i == 0) {
            content.append("Time");
            square.className = 'time';
        } else {
            square.className = 'dayx';
            content.append(String(day.getDate()) + '/' + String(day.getMonth() + 1));
            day.setDate(day.getDate() + 1);
        }
        square.appendChild(content);
    }
}

var list_event_id = [];
var active_id = {};
var cur_day;
var cur_ev_id;
var id_to_date = {};

function generateTable(table) {
    var params;
    for (var i = 0; i < 24; i++) {
        day = new Date();
        day.setDate(day.getDate() - 1);
        var row = table.insertRow();
        for (var j = 0; j < 8; j++) {
            var cell = row.insertCell();
            var text = document.createElement("event")
            if (j > 0) {
                cell.style.border = "1px dotted white";
            }
            text.id = cyrb53(String(i) + String(day.getDate()));
            day.setHours(i, 0, 0, 0);
            id_to_date[text.id] = new Date(day);

            if (j == 0) {
                text.append(i.toString() + ".00 - " + (i + 1).toString() + ".00");
                cell.className = 'event_time';
                // cell.style.backgroundColor = "#167e56";
            } else {
                list_event_id.push({ "id": text.id, "username": USERNAME });
                // Send a POST request
                cell.addEventListener("click", function () {
                    let id = this.getElementsByTagName("event")[0].id;
                    if (active_id.hasOwnProperty(id)) {
                        cur_ev_id = id;
                        const data = active_id[id];
                        let form = document.getElementById("calendar-show-form");
                        var day = data.start
                        var date = new Date(String(day));
                        document.getElementById("event-name-info").innerHTML = data.title;
                        document.getElementById("event-time-info").innerHTML = date.toTimeString().substring(0, 5) + " " + date.toDateString();
                        document.getElementById("event-location-info").innerHTML = data.location;
                        document.getElementById("event-detail-info").innerHTML = data.details;
                        document.getElementById("event-mode").checked = data.mode;
                        cur_day = day;
                        //a= document.getElementById("event-name-info");
                        form.style.display = "block";
                    } else {
                        var date = id_to_date[id];

                        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                        // console.log(date.getTimezoneOffset());
                        modal.style.display = "block";
                        // document.getElementById("calendar-form").style.display = "none";
                        document.getElementById("event-start").value = date.toISOString().slice(0, 16);
                        document.getElementById("event-title").value = "";
                        document.getElementById("event-details").value = "";
                        document.getElementById("event-location").value = "";
                    }
                });

            }
            cell.appendChild(text);
            day.setDate(day.getDate() + 1);
        }
    }
    params = {
        ids: list_event_id
    };

    axios.post(
        '/home/getEvents',
        params
    ).then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
            event = response.data[i];
            if (event.id) {
                active_id[event.id] = event;
                document.getElementById(event.id).innerHTML = event.title;
                // document.getElementById(event.id).parentElement.style.backgroundColor = "#167e56";
                document.getElementById(event.id).parentElement.style.backgroundColor = "#fff";
                document.getElementById(event.id).parentElement.style.color = "black";
                document.getElementById(event.id).parentElement.style.opacity = 0.95;
                // console.log(document.getElementById(event.id).parentElement);
                // document.getElementById(res.id).style.fontSize = 0;
            }
        }
    }).catch(function (error) {
        console.log(error);
    });

}
document.getElementById("button-submit").onclick = function () {
    var username = document.getElementById("search_inp").value;
    search_input = { "username": username };

    axios.post(
        "/search/profile",
        search_input
    )
        .then(function (res) {
            if (res.data) {
                window.location.href = "/friend?username0=" + USERNAME + "&username1=" + res.data.username;
            } else {
                console.log("not found");
                alert("The username not found! Try again, please!");
            }
        })
        .catch(function (res) { console.log(res) });
};

document.getElementById("home_link").onclick = function () {
    stringURL = "/home?username=" + USERNAME;
    console.log(stringURL);
    this.href = stringURL;
}

let table = document.getElementById("timetable");
generateTableHead(table);
generateTable(table);

// Get the modal
var modal = document.getElementById('calendar-form');
var modal2 = document.getElementById('calendar-show-form');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == modal2) {
        modal2.style.display = "none";
    }
}
// var createButton = document.getElementById("create_event");

// createButton.addEventListener("click", function(){
//   modal.style.display = "block";
//   // document.getElementById("calendar-form").style.display = "none";
//   document.getElementById("title_event_form").innerHTML = "Create Event";
//   document.getElementById("event-start").value="";
//   document.getElementById("event-title").value = "";
//   document.getElementById("event-details").value = "";
//   document.getElementById("event-location").value = "";
// });

var formElem = document.getElementById("event-form");

formElem.onsubmit = async (e) => {
    e.preventDefault();
    let data = new FormData(formElem);

    // console.log(value);
    var day = new Date(Object.fromEntries(data.entries()).start);
    var date = day.getDate();
    var hour = day.getHours();
    var event_id = cyrb53(String(hour) + String(date));
    data.append("id", event_id);
    data.append("username", USERNAME);
    var value = Object.fromEntries(data.entries());
    console.log(value);
    active_id[event_id] = value;
    if (document.getElementById(event_id)) {
        document.getElementById(event_id).innerHTML = value.title;
        document.getElementById(event_id).parentElement.style.backgroundColor = "#fff";
        document.getElementById(event_id).parentElement.style.color = "black";
        document.getElementById(event_id).parentElement.style.opacity = 0.95;
    } else {
        alert("Create new event in this week, please try again!");
    }
    axios.post(
        "/home/addEvent",
        value
    );

    document.getElementById("calendar-form").style.display = "none";
    document.getElementById("event-start").value = "";
    document.getElementById("event-title").value = "";
    document.getElementById("event-details").value = "";
    document.getElementById("event-location").value = "";
};

var editButton = document.getElementById("ed");
editButton.addEventListener("click", function () {
    let form = document.getElementById("calendar-show-form");
    let cre = document.getElementById("calendar-form");
    document.getElementById("title_event_form").innerHTML = "Edit Event";
    document.getElementById("event-title").value = document.getElementById("event-name-info").textContent;
    document.getElementById("event-start").value = cur_day;
    document.getElementById("event-location").value = document.getElementById("event-location-info").textContent;
    document.getElementById("event-details").value = document.getElementById("event-detail-info").textContent;
    let data = new FormData(formElem);
    data.append("mode", document.getElementById("event-mode").checked);
    var value = Object.fromEntries(data.entries());
    console.log(value);
    axios.post(
        "/update/event",
        value
    );
    form.style.display = "none";
    cre.style.display = "block";

});


document.getElementById("delete_button").addEventListener("click", function () {

    let form = document.getElementById("calendar-show-form");
    let id = cur_ev_id;
    axios.post(
        "/home/deleteEvent",
        { "id": id }
    );

    document.getElementById(id).innerHTML = "";
    document.getElementById(id).parentElement.style.opacity = 0;
    delete active_id[id];
    form.style.display = "none";
});
