function get_username(){
  username = location.search.substring(1).split('&');
  for (var i = 0; i < username.length; i++){
    username[i] = username[i].split('=');
  }
  return username;
}

var username = get_username();
const USERNAME = username[0][1];

axios.post(
  '/get/profile', 
  {"username": username[1][1]}
).then(function (response) {
  profile = response.data[0];
  document.getElementById("username-info").innerHTML = profile["username"];
  document.getElementById("fullname-info").innerHTML = profile["fullname"];
  document.getElementById("email-info").innerHTML = profile["email"];
  document.getElementById("phone-info").innerHTML = profile["phone"];
}).catch(function (error) {
    console.log(error);
});

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

axios.post(
  "/get/SubUser",
  {
    "id1": username[0][1],
    "id2": username[1][1]
  }
).then(function (response) {
  if(response.data.length > 0){
    subcribeButton.innerHTML = "Subcribe " + "&#9996";
  }
}).catch(function (error) {
    console.log(error);
});

const cyrb53 = function(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
};

function generateTableHead(table) {
  var day = new Date();
  var month = day.getMonth() + 1;

  // head.className = 'headtb';

  var row = table.insertRow();

  for (var i = 0; i < 8; i++){
    var square = row.insertCell();
    var content = document.createElement("header_timetable");
    if (i == 0){
      content.append("Time");
    square.className = 'time';
    } else{
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

function generateTable(table) {
  var params;
  for (var i = 0; i < 24; i++) {
    day = new Date();
    day.setDate(day.getDate() - 1);
    var row = table.insertRow();
    for (var j = 0; j < 8; j++) {
      var cell = row.insertCell();
      var text = document.createElement("event");
      text.id = cyrb53(String(i) + String(day.getDate()));

      if (j == 0){
        text.append(i.toString() + ".00 - " + (i + 1).toString() + ".00");  
        cell.className = 'event_time';
      } else{
          list_event_id.push({"id": text.id, "username": username[1][1]});
          // Send a POST request
          // params = {
          //   id: text.id
          // };
          cell.addEventListener("click", function(){
            let id = this.getElementsByTagName("event")[0].id;
            if (active_id.hasOwnProperty(id)){
              cur_ev_id = id;
              const data = active_id[id];
              let form = document.getElementById("calendar-show-form");
              var day = data.start
              var date = new Date(String(day));
              console.log(id);
              console.log(data.start);
              document.getElementById("event-name-info").innerHTML = data.title;
              document.getElementById("event-time-info").innerHTML = date.toDateString();
              document.getElementById("event-location-info").innerHTML = data.location;
              document.getElementById("event-detail-info").innerHTML = data.details;
              cur_day = day;
              //a= document.getElementById("event-name-info");
              form.style.display = "block";
            }
          });

      }
      cell.appendChild(text);
      day.setDate(day.getDate() + 1);
    }
  }
  params = {
    ids : list_event_id
  };

  axios.post(
    '/home/getEvents', 
    params
  ).then(function (response) {
      for (var i = 0; i < response.data.length; i++){
        event = response.data[i];
        console.log(event);
        if(event.id && event.mode != true && event.mode != 'on'){
          active_id[event.id] = event;
          document.getElementById(event.id).innerHTML = event.title;
          // document.getElementById(event.id).parentElement.style.backgroundColor = "#167e56";
          document.getElementById(event.id).parentElement.style.backgroundColor = "#fff";
          document.getElementById(event.id).parentElement.style.color = "black";
          document.getElementById(event.id).parentElement.style.opacity = 0.85;
          // document.getElementById(res.id).style.fontSize = 0;
        }
      }
  }).catch(function (error) {
      console.log(error);
  });

}

let table = document.getElementById("timetable");
generateTableHead(table);
generateTable(table);

// Get the modal
var modal = document.getElementById('calendar-form');
var modal2 = document.getElementById('calendar-show-form');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  if (event.target == modal2) {
    modal2.style.display = "none";
  }
}
var subcribeButton = document.getElementById("subcribe");

subcribeButton.addEventListener("click", function(){

  if(subcribeButton.innerHTML == "Subcribe"){
    subcribeButton.innerHTML = "Subcribe " + "&#9996";
    axios.post(
      "/home/addSubUser",
      {
        "id1": username[0][1],
        "id2": username[1][1]
      }
    );
  
  } else{
    subcribeButton.innerHTML = "Subcribe";
    axios.post(
      "/home/delSubUser",
      {
        "id1": username[0][1],
        "id2": username[1][1]
      }
    );
  }
  
});

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
  data.append("username", USER_NAME);
  var value = Object.fromEntries(data.entries());
  active_id[event_id] = value;
  if (document.getElementById(event_id)){
    document.getElementById(event_id).innerHTML = value.title;
  } else{
    alert("Create new event in this week, please try again!");
  }
  axios.post(
    "/home/addEvent",
     value
  );
  
  document.getElementById("calendar-form").style.display = "none";
  document.getElementById("event-start").value="";
  document.getElementById("event-title").value = "";
  document.getElementById("event-details").value = "";
  document.getElementById("event-location").value = "";
};
 
document.getElementById("follow").addEventListener("click", function(){
  
  var data = {
    "id": cur_ev_id,
    "username": username[1][1]
  }


  axios.post(
    "/home/getEvent",
     data
  ).then(function (response) {
      if(response.data.length > 0){
        data = response.data[0];
        axios.post(
          "/home/checkEvent",
          {
            "id" : data.id,
            "username": username[0][1]
          }
        ).then(function (response) {
            if(response.data.length > 0){
              alert("Conflict event: "+ response.data[0]["title"]);
            } else{
              // console.log(data);
              this.innerHTML = "Followed";
              data["username"] = username[0][1];
              axios.post(
              "/home/addEvent",
               data
              )
            }
        }).catch(function (error) {
            console.log(error);
        });
      }
  }).catch(function (error) {
      console.log(error);
  });
  document.getElementById("calendar-show-form").style.display="none";
});


document.getElementById("profile_link").onclick = function() {
  stringURL = "/profile?username=" + username[0][1];
  document.getElementById("profile_link").href = stringURL;
}


