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

            console.log(targetDate.toDateString());
        })
    });
};
document.querySelector(".prev").addEventListener("click", () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar(date);
});

document.querySelector(".next").addEventListener("click", () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar(date);
});

document.querySelector(".event-type").addEventListener("click", () => {

});


renderCalendar(date);


function changeTooltip(id) {
    document.getElementById(id).setAttribute('data-tooltip', 'aaa');
}

document.getElementById("c1").addEventListener("click", function () {
    changeTooltip("c1");
});

function check_event(ID, event) {
    var x = event.screenX;
    var y = event.screenY;
    document.getElementById("calendar-form").style.display = "block";
    document.getElementById("c1").addEventListener("click", function () {
        changeTooltip("c1");
    });
}


// Get the modal
var modal = document.getElementById('calendar-form');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

var events = []
events = parselocalstorage('events')

var renderPopup = function (jsEvent, start, end, calEvent) {
    var $popup = $('#calendar-popup');
    var $eventForm = $('#event-form');
    $event = $('#event');
    var $selectedElmt = $(jsEvent.target);

    var relativeStartDay = start.calendar(null, { lastDay: '[yesterday]', sameDay: '[today]' });
    var endNextDay = '';

    if (relativeStartDay === 'yesterday') {
        endNextDay = '[Today at] ';
    }
    else if (relativeStartDay === 'today') {
        endNextDay = '[Tomorrow at] ';
    }
    else {
        endNextDay = 'dddd ';
    }

    $('.start-time').html(
        ' <p><i class="fa fa-play" aria-hidden="true"></i>' + (start.isSameOrBefore(moment()) ? 'Started' : 'Starts') + '</p>'
        + '<time datetime="' + start.format() + '">'
        + start.calendar(null, {
            lastWeek: 'L LT',
            nextWeek: 'dddd LT',
            sameElse: 'L LT'
        })
        + '</time>'
    );
    $('.end-time').html(
        '<p><i class="fa fa-stop" aria-hidden="true"></i> '
        + (end.isSameOrBefore(moment()) ? 'Ended' : 'Ends')
        + (end.isSame(start, 'day') ? ' at' : '')
        + '</p>'
        + '<time datetime="' + end.format() + '">'
        + end.calendar(start, {
            sameDay: 'LT',
            nextDay: endNextDay + 'LT',
            nextWeek: 'dddd LT',
            sameElse: 'L LT'
        })
        + '</time>'
    );

    if (calEvent) {
        $eventForm.hide();

        $event.children('header').html(`<i class="fa fa-calendar-o"></i>` + calEvent.title);
        $event.find('.location').text(calEvent.location ? calEvent.location : '(No location information.)');
        $event.find('.details').text(calEvent.details ? calEvent.details : '');

        $event.show();
    }
    else {
        $event.hide();
        $('#event-start').val(start.format('YYYY-MM-DD[T]HH:mm'));
        $('#event-end').val(end.format('YYYY-MM-DD[T]HH:mm'));
        $eventForm.show();
    }

    var leftPosition = 0;
    var $prong = $('.prong');
    var prongPos = 0;

    if ($selectedElmt.hasClass('fc-highlight')) {
        leftPosition = $selectedElmt.offset().left - $popup.width() + ($selectedElmt.width() / 2);
        if (leftPosition <= 0) {
            leftPosition = 5;
            prongPos = $popup.width() - $selectedElmt.offset().left - 30
        }
        else {
            prongPos = 15;
        }

        $popup.css('left', leftPosition);
        $prong.css({
            'left': '',
            'right': prongPos,
            'float': 'right'
        });
    }
    else {
        leftPosition = jsEvent.originalEvent.pageX - $popup.width() / 2;
        if (leftPosition <= 0) {
            leftPosition = 5;
        }
        prongPos = jsEvent.originalEvent.pageX - leftPosition - ($prong.width() * 1.7);

        $popup.css('left', leftPosition);
        $prong.css({
            'left': prongPos,
            'float': 'none',
            'right': ''
        });
    }

    var topPosition = (calEvent ? jsEvent.originalEvent.pageY : $selectedElmt.offset().top) - $popup.height() - 15;

    if ((topPosition <= window.pageYOffset)
        && !((topPosition + $popup.height()) > window.innerHeight)) {
        $popup.css('top', jsEvent.originalEvent.pageY + 15);
        $prong.css('top', -($popup.height() + 12))
            .children('div:first-child').removeClass('bottom-prong-dk').addClass('top-prong-dk')
            .next().removeClass('bottom-prong-lt').addClass('top-prong-lt');
    }
    else {
        $popup.css('top', topPosition);
        $prong.css({ 'top': 0, 'bottom': 0 })
            .children('div:first-child').removeClass('top-prong-dk').addClass('bottom-prong-dk')
            .next().removeClass('top-prong-lt').addClass('bottom-prong-lt');
    }

    $popup.show();
    $popup.find('input[type="text"]:first').focus();
}

$(document).ready(function () {
    $('#calendar').fullCalendar({
        header: {
            left: 'title',
            right: 'prev,next today'
        },
        timezone: 'local',
        defaultView: 'month',
        allDayDefault: false,
        allDaySlot: false,
        slotEventOverlap: true,
        slotDuration: "01:00:00",
        slotLabelInterval: "01:00:00",
        snapDuration: "00:15:00",
        contentHeight: 700,
        scrollTime: "8:00:00",
        axisFormat: 'h:mm a',
        timeFormat: 'h:mm A()',
        selectable: true,
        events: function (start, end, timezone, callback) {
            let arr = parselocalstorage('events')
            callback(arr);
        },
        eventColor: '#dec5c9',
        eventClick: function (calEvent, jsEvent) {

            renderPopup(jsEvent, calEvent.start, calEvent.end, calEvent);


        },
        eventRender: function (event, element) {
            element.append(`<span class='I_delete'><i class="fa fa-remove fa-2x"></i></span>`);
            element.append(`<span class='I_edit'><i class="fa fa-edit fa-2x"></i></span>`);
            element.find(".I_delete").click(function () {
                $('#calendar-popup').hide();
                if (confirm('are you sure want to delete event?')) {
                    $('#calendar').fullCalendar('removeEvents', event._id);
                    var index = events.map(function (x) { return x.id; }).indexOf(event.id);
                    events.splice(index, 1);
                    localStorage.setItem('events', JSON.stringify(events));

                    events = parselocalstorage('events')

                }
            });
            element.find(".I_edit").click(function () {
                $('#calendar-popup').hide();

                $('#eventname').val(event.title)
                $('#location').val(event.location)
                $('#eventdetails').val(event.details)
                $('input#eventstart').val(event.start._i)
                $('input#eventend').val(event.end._i)
                $('#simplemodal').show();


                //update events
                var that = event;
                $('#edit-form').on('submit', function (e) {
                    e.preventDefault();
                    $form = $(e.currentTarget);

                    $title = $form.find('input#eventname');
                    $location = $form.find('input#location');
                    $details = $form.find('textarea#eventdetails');
                    $start = $form.find('input#eventstart');
                    $end = $form.find('input#eventend');
                    //update value
                    that.title = $title.val();
                    that.location = $location.val();
                    that.details = $details.val();
                    that.start = $start.val();
                    that.end = $end.val();

                    $('#calendar').fullCalendar('updateEvent', that);
                    console.log('after update', events)
                    $('#simplemodal').hide();
                    $('#calendar-popup').hide();
                });
                $('#calendar').fullCalendar('updateEvent', event);

                // 
                //       localStorage.setItem('events', JSON.stringify(events));
            });

            $('#close-btnid').click(function () {
                $('#simplemodal').hide();
            })

            var modal = document.getElementById('simplemodal')

            window.addEventListener('click', clickOutside)
            function clickOutside(e) {
                if (e.target == modal) {
                    modal.style.display = 'none';

                }
            }
        }
        ,
        select: function (start, end, jsEvent) {
            $('.btn-primary').css('opacity', 1)
            $('.btn-primary').click(function () {
                renderPopup(jsEvent, start.local(), end.local());
            })
            renderPopup(jsEvent, start.local(), end.local());

        }
    });

    $('#event-form').on('submit', function (e) {
        e.preventDefault();

        $form = $(e.currentTarget);

        $title = $form.find('input#event-title');
        $location = $form.find('input#event-location');
        $details = $form.find('textarea#event-details');
        $ID = '_' + Math.random().toString(36).substr(2, 9)
        events.push({
            id: $ID,
            title: $title.val(),
            start: $form.find('input#event-start').val(),
            end: $form.find('input#event-end').val(),
            location: $location.val(),
            details: $details.val()
        });

        $title.val('');
        $location.val('');
        $details.val('');

        $form.parent().blur().hide();
        localStorage.setItem('events', JSON.stringify(events));
        $('#calendar').fullCalendar('refetchEvents');

    });



    //Set hide action for ESC key event
    $('#calendar-popup').on('keydown', function (e) {
        $this = $(this);
        console.log($this);
        if ($this.is(':visible') && e.which === 27) {
            $this.blur();
        }
    })
        //Set hide action for lost focus event
        .on('focusout', function (e) {
            $this = $(this);
            if ($this.is(':visible') && !$(e.relatedTarget).is('#calendar-popup, #calendar-popup *')) {
                $this.hide();
            }
        });
});
