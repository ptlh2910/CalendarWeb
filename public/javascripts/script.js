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



document.getElementById("profile_link").onclick = function () {
    stringURL = "/profile?username=" + USERNAME;
    this.href = stringURL;
}

document.getElementById("home_link").onclick = function () {
    stringURL = "/home";
    this.href = stringURL;
}


