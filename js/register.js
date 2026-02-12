const urlBase = 'https://poosdteam13.xyz/LAMPAPI';
const extension = 'php';

function doRegister()
{
	let firstName = document.getElementById("firstName").value.trim();
	let lastName = document.getElementById("lastName").value.trim();
	let login = document.getElementById("email").value.trim();
	let password = document.getElementById("password").value;
	let repeatPassword = document.getElementById("verifyPassword").value;

	let result = document.getElementById("registerResult");
	result.innerHTML = "";

	// Ensure all fields are populated
	if(firstName === "" || lastName === "" || email === "" || password === "" || repeatPassword === "")
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
		FirstName: firstName,
		LastName: lastName,
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
