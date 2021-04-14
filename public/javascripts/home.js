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

document.querySelector(".event-type").addEventListener("click", () => {

});


renderCalendar(date);


function changeTooltip(id) {
  document.getElementById(id).setAttribute('data-tooltip', 'aaa');
}

document.getElementById("c1").addEventListener("click", function() {
  changeTooltip("c1");
});

function check_event(ID, event){
    var x = event.screenX;
    var y = event.screenY;
    document.getElementById("calendar-form").style.display = "block";
    document.getElementById("c1").addEventListener("click", function() {
      changeTooltip("c1");
    });
}


// Get the modal
var modal = document.getElementById('calendar-form');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

var events = []
events=parselocalstorage('events')

var renderPopup = function (jsEvent, start, end, calEvent) {
  var $popup = $('#calendar-popup');
  var $eventForm = $('#event-form');
  $event = $('#event');
  var $selectedElmt = $(jsEvent.target);

  var relativeStartDay = start.calendar(null, { lastDay: '[yesterday]', sameDay: '[today]'});
  var endNextDay = '';

  if(relativeStartDay === 'yesterday') {
    endNextDay = '[Today at] ';
  }
  else if(relativeStartDay === 'today') {
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

  if(calEvent) {
   $eventForm.hide();

    $event.children('header').html(`<i class="fa fa-calendar-o"></i>`+calEvent.title);
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

  if($selectedElmt.hasClass('fc-highlight')) {
    leftPosition = $selectedElmt.offset().left - $popup.width() + ($selectedElmt.width() / 2);
    if(leftPosition <= 0) {
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
    leftPosition = jsEvent.originalEvent.pageX - $popup.width()/2;
    if(leftPosition <= 0) {
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

  if((topPosition <= window.pageYOffset)
    && !((topPosition + $popup.height()) > window.innerHeight)) {
      $popup.css('top', jsEvent.originalEvent.pageY + 15);
      $prong.css('top', -($popup.height() + 12))
        .children('div:first-child').removeClass('bottom-prong-dk').addClass('top-prong-dk')
        .next().removeClass('bottom-prong-lt').addClass('top-prong-lt');
  }
  else {
    $popup.css('top', topPosition);
    $prong.css({'top': 0, 'bottom': 0})
      .children('div:first-child').removeClass('top-prong-dk').addClass('bottom-prong-dk')
      .next().removeClass('top-prong-lt').addClass('bottom-prong-lt');
  }

  $popup.show();
  $popup.find('input[type="text"]:first').focus();
}

$(document).ready(function() {
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
    scrollTime :  "8:00:00",
    axisFormat: 'h:mm a',
    timeFormat: 'h:mm A()',
    selectable: true,
    events: function(start, end, timezone, callback) {
            let arr = parselocalstorage('events')  
      callback(arr);
    },
    eventColor: '#dec5c9',
    eventClick: function (calEvent, jsEvent) {
      
      renderPopup(jsEvent, calEvent.start, calEvent.end, calEvent);

      
    },
    eventRender: function(event, element) {
            element.append( `<span class='I_delete'><i class="fa fa-remove fa-2x"></i></span>` );
            element.append( `<span class='I_edit'><i class="fa fa-edit fa-2x"></i></span>` );
            element.find(".I_delete").click(function() {
            $('#calendar-popup').hide();
            if(confirm('are you sure want to delete event?')) {
             $('#calendar').fullCalendar('removeEvents',event._id);
            var index=events.map(function(x){ return x.id; }).indexOf(event.id);
            events.splice(index,1);
            localStorage.setItem('events', JSON.stringify(events));
           
            events=parselocalstorage('events')   

       }
            });
        element.find(".I_edit").click(function() {
            $('#calendar-popup').hide();

          $('#eventname').val(event.title)
          $('#location').val(event.location)
          $('#eventdetails').val(event.details)
          $('input#eventstart').val(event.start._i)
           $('input#eventend').val(event.end._i)
          $('#simplemodal').show();
         
          
          //update events
          var that=event;
           $('#edit-form').on('submit', function(e) {
           e.preventDefault();
           $form = $(e.currentTarget);

         $title = $form.find('input#eventname');
         $location = $form.find('input#location');
         $details = $form.find('textarea#eventdetails');
             $start= $form.find('input#eventstart');
             $end= $form.find('input#eventend');
            //update value
             that.title=$title.val();
              that.location=$location.val();
             that.details=$details.val();
                that.start=$start.val();               
               that.end=$end.val();
            
            $('#calendar').fullCalendar('updateEvent', that);
             console.log('after update',events)
              $('#simplemodal').hide();
              $('#calendar-popup').hide();
           });
           $('#calendar').fullCalendar('updateEvent', event);
         
         // 
           //       localStorage.setItem('events', JSON.stringify(events));
            });
      
      $('#close-btnid').click(function(){
                  $('#simplemodal').hide();
      })
    
      var modal=document.getElementById('simplemodal')

     window.addEventListener('click',clickOutside)
      function clickOutside(e){
      if(e.target==modal){
        modal.style.display='none';

        }
        }
        }
    ,
    select: function(start, end, jsEvent) {
        $('.btn-primary').css('opacity',1)
          $('.btn-primary').click(function(){
        renderPopup(jsEvent, start.local(), end.local());
      }) 
      renderPopup(jsEvent, start.local(), end.local());
    
    }
  });

  $('#event-form').on('submit', function(e) {
    e.preventDefault();

    $form = $(e.currentTarget);

    $title = $form.find('input#event-title');
    $location = $form.find('input#event-location');
    $details = $form.find('textarea#event-details');
 $ID = '_' + Math.random().toString(36).substr(2, 9)
    events.push({
      id:$ID,
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
  $('#calendar-popup').on('keydown', function(e) {
    $this = $(this);
    console.log($this);
    if($this.is(':visible') && e.which === 27) {
      $this.blur();
    }
  })
  //Set hide action for lost focus event
  .on('focusout', function(e) {
    $this = $(this);
    if($this.is(':visible') && !$(e.relatedTarget).is('#calendar-popup, #calendar-popup *')) {
      $this.hide();
    }
  });
});
