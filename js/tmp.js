console.log("contacts page JS loaded");

let userId = 0;
let lastName = "";
let firstName = "";



/* =========================
   SETTINGS DROPDOWN
========================= */

const settingsBtn = document.getElementById("settingsBtn");
const settingsMenu = document.getElementById("settingsMenu");

if (settingsBtn && settingsMenu) {
  settingsBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    const isOpen = settingsMenu.style.display === "block";
    settingsMenu.style.display = isOpen ? "none" : "block";
    settingsBtn.setAttribute("aria-expanded", !isOpen);
  });
}

/* =========================
   SEARCH BAR (EXPAND + LIVE)
========================= */

const searchToggle = document.getElementById("searchToggle");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

/* Example data — replace with API later */
const searchData = [
  "Alice Johnson",
  "Bob Smith",
  "Charlie Brown",
  "Diana Prince",
  "Evan Miller",
  "Fiona Davis",
  "George Wilson",
  "Hannah Lee"
];

if (searchToggle && searchInput && searchResults) {

  /* Toggle search input */
  searchToggle.addEventListener("click", (e) => {
    e.stopPropagation();

    searchInput.classList.toggle("active");

    if (searchInput.classList.contains("active")) {
      searchInput.focus();
    } else {
      clearSearch();
    }
  });

  /* Live search */
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    searchResults.innerHTML = "";

    if (!query) {
      searchResults.style.display = "none";
      return;
    }

    const matches = searchData.filter(item =>
      item.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      searchResults.style.display = "none";
      return;
    }

    matches.forEach(match => {
      const div = document.createElement("div");
      div.textContent = match;

      div.addEventListener("click", () => {
        searchInput.value = match;
        searchResults.style.display = "none";
      });

      searchResults.appendChild(div);
    });

    searchResults.style.display = "block";
  });
}

/* =========================
   GLOBAL CLICK HANDLING
========================= */

document.addEventListener("click", (e) => {

  /* Close settings dropdown */
  if (settingsMenu && !e.target.closest(".settings-wrapper")) {
    settingsMenu.style.display = "none";
    if (settingsBtn) {
      settingsBtn.setAttribute("aria-expanded", "false");
    }
  }

  /* Close search results */
  if (searchResults && !e.target.closest(".search-container")) {
    searchResults.style.display = "none";
  }
});

/* =========================
   ESC KEY HANDLING
========================= */

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {

    if (settingsMenu) {
      settingsMenu.style.display = "none";
      if (settingsBtn) {
        settingsBtn.setAttribute("aria-expanded", "false");
      }
    }

    if (searchInput) {
      searchInput.classList.remove("active");
      clearSearch();
    }
  }
});

/* =========================
   HELPERS
========================= */

function clearSearch() {
  if (searchInput) searchInput.value = "";
  if (searchResults) searchResults.style.display = "none";
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
  return userId
}


/* =========================
   Load Contacts
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const userId = readCookie(); // use YOUR cookie name
  if (!userId) {
    window.location.href = "index.html"; // or login page
    return;
  }

  loadContacts(userId, "");

});

function loadContacts(userId, query) {
  const url = `contacts.php?userID=${encodeURIComponent(userId)}&query=${encodeURIComponent(query)}`;

  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) return;

    if (xhr.status === 200) {
      let response;
      try {
        response = JSON.parse(xhr.responseText);
      } catch (e) {
        console.error("Bad JSON from contacts.php:", xhr.responseText);
        return;
      }

      const contacts = Array.isArray(response) ? response : (response.data || []);
      renderContactsList(contacts);
    } else {
      console.error("Failed to load contacts:", xhr.status, xhr.responseText);
    }
  };

  xhr.send();
}


function renderContactsList(contacts) {
  const list = document.getElementById("contact-list");
  if (!list) return;

  list.innerHTML = "";

  contacts.forEach((c) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "contact-item";
    btn.textContent = `${c.FirstName ?? c.firstName ?? ""} ${c.LastName ?? c.lastName ?? ""}`.trim();

    list.appendChild(btn);
  });
}

/*
// Basic cookie helper
function getCookie(name) {
  const parts = document.cookie.split(",").map(p => p.trim());
  for (const part of parts) {
    if (part.startsWith(name + "=")) return decodeURIComponent(part.substring(name.length + 1));
  }
  return "";
}
  */