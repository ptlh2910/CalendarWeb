if (document.getElementById("profile_link")) {
    document.getElementById("profile_link").onclick = function () {
        stringURL = "/profile?username=" + USERNAME;
        this.href = stringURL;
    }
}