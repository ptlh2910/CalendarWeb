const date = new Date();
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

  document.querySelector(".date p").innerHTML = new Date().toDateString();

  let days = "";

  for (let x = firstDayIndex; x > 0; x--) {
    days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDay; i++) {
    if (
      i === new Date().getDate() &&
      date.getMonth() === new Date().getMonth()
    ) {
      days += `<div class="today">${i}</div>`;
    } else {
      days += `<div>${i}</div>`;
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="next-date">${j}</div>`;
    monthDays.innerHTML = days;
  }
};

document.querySelector(".prev").addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar(date);
});

document.querySelector(".next").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar(date);
});


renderCalendar(date);

$(document).ready(function() {
  
  $('#calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,basicWeek,basicDay'
    },
    defaultDate: '2016-12-12',
    navLinks: true, // can click day/week names to navigate views
    editable: true,
    eventLimit: true, // allow "more" link when too many events
    events: [
      {
        title: 'All Day Event',
        start: '2016-12-01'
      },
      {
        title: 'Long Event',
        start: '2016-12-07',
        end: '2016-12-10'
      },
      {
        id: 999,
        title: 'Repeating Event',
        start: '2016-12-09T16:00:00'
      },
      {
        id: 999,
        title: 'Repeating Event',
        start: '2016-12-16T16:00:00'
      },
      {
        title: 'Conference',
        start: '2016-12-11',
        end: '2016-12-13'
      },
      {
        title: 'Meeting',
        start: '2016-12-12T10:30:00',
        end: '2016-12-12T12:30:00'
      },
      {
        title: 'Lunch',
        start: '2016-12-12T12:00:00'
      },
      {
        title: 'Meeting',
        start: '2016-12-12T14:30:00'
      },
      {
        title: 'Happy Hour',
        start: '2016-12-12T17:30:00'
      },
      {
        title: 'Dinner',
        start: '2016-12-12T20:00:00'
      },
      {
        title: 'Birthday Party',
        start: '2016-12-13T07:00:00'
      },
      {
        title: 'Click for Google',
        url: 'https://google.com/',
        start: '2016-12-28'
      }
    ]
  });
  
});


function changeTooltip(id) {
  document.getElementById(id).setAttribute('data-tooltip', 'aaa');
}

document.getElementById("c1").addEventListener("click", function() {
  changeTooltip("c1");
});