const urlBase = 'https://poosdteam13.xyz/LAMPAPI';
const extension = 'php';
let userId;
let firstName;
let lastName;

function doRegister()
{
	let first = document.getElementById("firstName").value.trim();
	let last = document.getElementById("lastName").value.trim();
	let login = document.getElementById("username").value.trim();
	let password = document.getElementById("password").value;
	let repeatPassword = document.getElementById("verifyPassword").value;

	let result = document.getElementById("registerResult");
	result.innerHTML = "";

	// Ensure all fields are populated
	if(firstName === "" || lastName === "" || login === "" || password === "" || repeatPassword === "")
	{
		result.innerHTML = "All fields are required.";
		return;
	}

    // Ensure both passwords match
	if(password !== repeatPassword)
	{
		result.innerHTML = "Passwords do not match.";
		return;
	}

	// JSON Payload
	let tmp = {
		FirstName: first,
		LastName: last,
		Login: login,
		Password: password
	};

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/registration.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	xhr.onreadystatechange = function()
	{
		if(this.readyState == 4)
		{
			if(this.status == 201)
			{
				result.innerHTML = "User successfully registered!";
				doLogin(login, password);
			}
			else
			{
				let response = JSON.parse(xhr.responseText);
				result.innerHTML = response.error || "Registration failed.";
			}
		}
	};

	xhr.send(jsonPayload);

}

function doLogin(login, password){
	//Logging in
	var tmp2 = {login:login,password:password};
	let jsonPayload2 = JSON.stringify( tmp2 );

	let result = document.getElementById("registerResult");

	let url2 = urlBase + '/login.' + extension;

	let xhr2 = new XMLHttpRequest();
	xhr2.open("POST", url2, true);
	xhr2.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr2.onreadystatechange = function() 
		{
			if (this.readyState !== 4) return;
			if (this.status === 200) {
				let jsonObject = JSON.parse( this.responseText );
				userId = jsonObject.ID;
		
				if( userId < 1 )
				{		
					result.innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.FirstName;
				lastName = jsonObject.LastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			} else if (this.status === 401){
				result.innerHTML = "User/Password combination incorrect";
			}
		};
		xhr2.send(jsonPayload2);
	}
	catch(err)
	{
		result.innerHTML = err.message;
	}
}


function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ",expires=" + date.toGMTString();
}