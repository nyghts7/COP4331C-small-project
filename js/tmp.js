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

/* =========================
   Load Contacts
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const userId = getCookie("userId"); // use YOUR cookie name

  if (!userId) {
    window.location.href = "index.html"; // or login page
    return;
  }

  loadContacts(userId, "");

});

function loadContacts(userId, query) {
  //const url = `contacts.php?userID=${encodeURIComponent(userId)}&query=${encodeURIComponent(query)}`;

  const url = "https://poosdteam13.xyz/LAMPAPI/contacts.php"
  
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

      const contacts = Array.isArray(response) ? response : [];
      renderContactsList(contacts);
    } else {
      console.error("Failed to load contacts:", xhr.status, xhr.responseText);
    }
  };

  xhr.send(null);
}


function renderContactsList(contacts) {
  const list = document.getElementById("contact-list");
  if (!list) return;

  list.innerHTML = "";

  contacts.forEach((c) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "selector-item";
    btn.textContent = `${c.FirstName ?? ""} ${c.LastName ?? ""}`.trim() || "(No name)";

    btn.addEventListener("click", () => {
      showContactDetails(c);
      showTab("contact-contact");
    });

    list.appendChild(btn);
  });
}

// Basic cookie helper
function getCookie(name) {
  const parts = document.cookie.split(",").map(p => p.trim());
  for (const part of parts) {
    if (part.startsWith(name + "=")) return decodeURIComponent(part.substring(name.length + 1));
  }
  return "";
}

/* =========================
   Add, View (Contact), Edit, Delete Buttons
========================= */

const addButton = document.getElementById("add-btn");
const formContainer = document.getElementById("add-form-container");
const editButton = document.getElementById("edit-btn");
const deleteButton = document.getElementById("delete-btn");

// Add contact
document.addEventListener("DOMContentLoaded", () => {
  const cancel = document.getElementById("add-cancel");
  if (cancel) cancel.addEventListener("click", () => showTab("contact-contact"));

  const form = document.getElementById("add-contact-form");
  if (!form) return;
  
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const payload = {
      UserID: userId,
      FirstName: document.getElementById("firstName").value.trim(),
      LastName: document.getElementById("lastName").value.trim(),
      Email: document.getElementById("email").value.trim(),
      PhoneNumber: document.getElementById("phone").value.trim(),
    };
    let jsonPayload = JSON.stringify(payload)

    let url = 'https://poosdteam13.xyz/contacts.php';

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
      xhr.onreadystatechange = function() 
      {
        if (this.readyState == 4 && this.status == 200) 
        {
          let jsonObject = JSON.parse( xhr.responseText );
          userId = jsonObject.ID;
          
        } else if (xhr.status === 400){
          document.getElementById("addResult").innerHTML = "Failed to add contact.";
        } else if (xhr.status === 409){
          document.getElementById("addResult").innerHTML = "A contact with this information already exists.";
        }
      };
      xhr.send(jsonPayload);
    }
    catch(err)
    {
      document.getElementById("addResult").innerHTML = err.message;
    }

    //Reset form
    form.reset();
    showTab("contact-contact");
  })
});

function showContactDetails(contact){
  let contactTab = document.getElementById("contact-contact");
  contactTab.innerHTML = "";

  contactTab.createElement("img")
}


function showTab(tabID){
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  const target = document.getElementById(tabID);

  if (target) target.classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".icon")?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-target]");
    if (!btn) return;

    e.preventDefault();
    showTab(btn.dataset.target);
  });
});
