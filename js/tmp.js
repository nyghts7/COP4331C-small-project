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
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

/* =========================
   Load Contacts
========================= */

document.addEventListener("DOMContentLoaded", () => {
  // Example data for now (replace with API results later)
  const contacts = data.results;
  renderContactsList(contacts);

});

function renderContactsList(contacts) {
  const list = document.getElementById("contact-list");
  if (!list) return;

  // Clear anything currently there
  list.innerHTML = "";

  contacts.forEach((c) => {
    // Create a clickable item for the sidebar
    const item = document.createElement("button");
    item.type = "button";
    item.className = "contact-item"; // optional CSS class
    item.textContent = `${c.firstName} ${c.lastName}`.trim();

    item.addEventListener("click", () => {
      // When clicked, you can display details somewhere else
      // For now, just log it:
      console.log("Selected contact:", c);
    });

    list.appendChild(item);
  });
}
