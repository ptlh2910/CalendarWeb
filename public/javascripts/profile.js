url_string = document.getElementById("profile_link").href;
var url = new URL(url_string);

fullname = document.getElementById("inp_fname_info");
dob = document.getElementById("inp_dob_info");
male = document.getElementById("male");
female = document.getElementById("female");
other = document.getElementById("other");
pwd = document.getElementById("inp_pwd_info");
email = document.getElementById("inp_email_info");
phone = document.getElementById("inp_phone_info");

function get_username(){
	return url.searchParams.get("username");
}

const USERNAME = get_username();

function load_data(){
	data = {"username": USERNAME};
	axios.post(
		"/get/profile",
	 	data
	)
	.then(function(res){ 
		if(res.data.length > 0){
			console.log(res);
			if(res.data[0].hasOwnProperty("fullname")){
				fullname.value = res.data[0]["fullname"];
			}
			if(res.data[0].hasOwnProperty("dob")){
				dob.value = res.data[0]["dob"];
			}
			pwd.value = res.data[0]["password"];
			email.value = res.data[0]["email"];
			phone.value = res.data[0]["phone"];
		}
	})
	.catch(function(res){ console.log(res) });
};
 
load_data();

document.getElementById("update_info").onclick = function(){
	console.log(fullname);
	data = {
		"fullname": fullname.value,
		"username": USERNAME,
		"email": email.value,
		"phone": phone.value,
		"dob": dob.value,
		"password": pwd.value
	}
	axios.post(
		"/update/profile",
	 	data
	)
	alert("Update information successful!");
}


document.getElementById("cancel").onclick = function() {
  stringURL = "/home";
  this.href = stringURL;
  console.log(stringURL);
}
