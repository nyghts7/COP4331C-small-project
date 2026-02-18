console.log("contacts page JS loaded");

let userId = 0;
let lastName = "";
let firstName = "";
let selectedContact = null;
let currentPage = 1;
const pageSize = 50;
let currentQuery = "";


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
    const query = searchInput.value.trim();
    searchResults.innerHTML = "";

    if (!query) {
      loadContacts(userId, "", 1);
      return;
    }

    loadContacts(userId, query, 1);
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
   Add, View (Contact), Edit, Delete Buttons
========================= */
document.addEventListener("DOMContentLoaded", () => {

  const deleteButton = document.getElementById("delete-btn");
  deleteButton.addEventListener("click", (e) => {
    e.preventDefault();
    openDeleteModal();
  });
});
const addButton = document.getElementById("add-btn");
const formContainer = document.getElementById("add-form-container");
const editButton = document.getElementById("edit-btn");


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
      FirstName: document.getElementById("add-firstName").value.trim(),
      LastName: document.getElementById("add-lastName").value.trim(),
      Email: document.getElementById("add-email").value.trim(),
      PhoneNumber: document.getElementById("add-phone").value.trim(),
    };
    let jsonPayload = JSON.stringify(payload)

    let url = 'https://poosdteam13.xyz/LAMPAPI/contacts.php';

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
      xhr.onreadystatechange = function() 
      {
        if (this.readyState == 4 && this.status == 201) 
        {
          document.getElementById("addResult").innerHTML = "Contact Added."
          let newContact = JSON.parse(xhr.responseText);

          showTab("contact-contact");
          showContactDetails(newContact);
          loadContacts(userId, "");
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
  })
});

// Edit Contact
document.addEventListener("DOMContentLoaded", () => {
  const editBtn = document.getElementById("edit-btn");
  if (!editBtn) return;

  editBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    openEditContact();
  })
})

document.addEventListener("DOMContentLoaded", () => {
  const cancel = document.getElementById("edit-cancel");
  if (cancel) cancel.addEventListener("click", () => showTab("contact-contact"));

  const form = document.getElementById("edit-contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const payload = {
      UserID: userId,
      ID: selectedContact.ID,
      FirstName: document.getElementById("edit-firstName").value.trim(),
      LastName: document.getElementById("edit-lastName").value.trim(),
      Email: document.getElementById("edit-email").value.trim(),
      PhoneNumber: document.getElementById("edit-phone").value.trim(),
    };
    let jsonPayload = JSON.stringify(payload)

    let url = 'https://poosdteam13.xyz/LAMPAPI/contacts.php';

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
      xhr.onreadystatechange = function() 
      {
        if (this.readyState == 4 && this.status == 200) {
          document.getElementById("editResult").innerHTML = "Contact Updated."
          const newContact = JSON.parse(xhr.responseText);

          selectedContact = newContact;
          showTab("contact-contact");
          showContactDetails(newContact);
          loadContacts(userId, "");
        } else if (xhr.status === 404){
          document.getElementById("editResult").innerHTML = "Failed to update contact.";
        }
      };
      xhr.send(jsonPayload);
    }
    catch(err)
    {
      document.getElementById("editResult").innerHTML = err.message;
    }

    //Reset form
    form.reset();
  })
});

function openEditContact(){
  if (!selectedContact || !selectedContact.ID) return;

  document.getElementById("edit-firstName").value = selectedContact.FirstName || "";
  document.getElementById("edit-lastName").value  = selectedContact.LastName || "";
  document.getElementById("edit-email").value     = selectedContact.Email || "";
  document.getElementById("edit-phone").value     = selectedContact.PhoneNumber || "";

  const msg = document.getElementById("editResult");
  if (msg) msg.textContent = "";

  showTab("contact-edit")
}

// Delete Contact
function openDeleteModal(){
  if (!selectedContact || !selectedContact.ID) return;

  showTab("contact-contact");

  document.getElementById("delete-preview").innerHTML = `
    <div><strong>${selectedContact.FirstName || ""} ${selectedContact.LastName || ""}</strong></div>
    <div>${selectedContact.PhoneNumber || ""}</div>
    <div>${selectedContact.Email || ""}</div>
    `;
  
  document.getElementById("deleteResults").textContent = "";

  document.getElementById("delete-modal").classList.remove("d-none");
}

function closeDeleteModal(){
  document.getElementById("delete-modal").classList.add("d-none");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("delete-cancel")?.addEventListener("click", closeDeleteModal);
  document.getElementById("delete-cancel-x")?.addEventListener("click", closeDeleteModal);

  document.getElementById("delete-confirm")?.addEventListener("click", () => {
    if (!selectedContact || !selectedContact.ID) return;

    const url = `https://poosdteam13.xyz/LAMPAPI/contacts.php` +
      `?userID=${encodeURIComponent(userId)}` +
      `&ID=${encodeURIComponent(selectedContact.ID)}`;


      const xhr = new XMLHttpRequest();
      xhr.open("DELETE", url, true);

      xhr.onreadystatechange = function(){
        if (xhr.readyState !== 4) return;

        if (xhr.status === 200) {
          closeDeleteModal();
          selectedContact = null;

          showTab("contact-contact");
          document.getElementById("contact-details").replaceChildren();
          loadContacts(userId, "");
        } else {
          document.getElementById("deleteResults").textContent = "Failed to delete contact.";
          console.error("DELETE failed:", xhr.status, xhr.responseText);
        }
      };
      xhr.send(null);
  });
});

function showContactDetails(contact){
  console.log("showContactDetails contact:", contact);
  selectedContact = contact;

  let details = document.getElementById("contact-details");
  console.log("contact-details element:", details);
  if (!details) return;

  details.innerHTML = "";

  const first = contact.FirstName ?? "";
  const last = contact.LastName ?? "";
  const phone = contact.PhoneNumber ?? "";
  const email = contact.Email ?? "";

  const initials = `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "??";

  //Create Profile picture area
  const img = document.createElement("img");
  img.className = "pfp-picture";
  img.src = "pfp.png";
  img.alt = "User Profile";
  img.style.display = "none";
  //Fill it with initials
  const imgDiv = document.createElement("div");
  imgDiv.className = "pfp-placeholder";
  imgDiv.textContent = initials;
  
  //Display contact info
  const info = document.createElement("p");
  info.innerHTML = `
    ${first} ${last}<br/>
    ${phone}${email ? ` - ${email}` : ""}`;
  
  //Append into the tab
  details.appendChild(img);
  details.appendChild(imgDiv);
  details.appendChild(info);
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

/* =========================
   Load Contacts
========================= */

document.addEventListener("DOMContentLoaded", () => {

  userId = getCookie("userId"); // use YOUR cookie name

  if (!userId) {
    window.location.href = "index.html"; // or login page
    return;
  }

  loadContacts(userId, "");

});

document.getElementById("prevPage").addEventListener("click", function(){
  if (currentPage > 1) {
    loadContacts(userId, currentQuery, currentPage - 1);
  }
});

document.getElementById("nextPage").addEventListener("click", function(){
  loadContacts(userId, currentQuery, currentPage + 1);
});

function renderPageNumbers(currentPage, totalPages, totalContacts){
  const container = document.getElementById("pageNumbers");
  const pageInfo = document.getElementById("pageInfo");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");

  container.innerHTML = "";

  if (pageInfo) {
    pageInfo.textContent = "Page " + currentPage + " of " + (totalPages || 1) +
    " (" + totalContacts + " contacts)";
  }

  if (!totalPages || totalPages <= 1) {
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;
    return;
  }

  const maxVisible = 5;
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1){
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++){
    let btn = document.createElement("button");
    btn.className = "btn btn-sm " + (i === currentPage ? "btn-primary" : "btn-outline-secondary");
    btn.textContent = i;

    btn.addEventListener("click", function(){
      loadContacts(userId, currentQuery, i);
    });

    container.appendChild(btn);
  }

  document.getElementById("prevPage").disabled = (currentPage <= 1);
  document.getElementById("nextPage").disabled = (currentPage >= totalPages);
}

function renderContactsList(contacts) {
  const list = document.getElementById("contact-list");
  if (!list) return;

  list.innerHTML = "";

  if (!Array.isArray(contacts) || contacts.length === 0){
    const p = document.createElement("div");
    p.className = "text-muted p-2";
    p.textContent = "No contacts found.";
    list.appendChild(p);
    return;
  }

  contacts.forEach((c) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = `${c.ID}`;
    btn.className = "selector-item";
    btn.textContent = `${c.FirstName ?? ""} ${c.LastName ?? ""}`.trim() || "(No name)";

    btn.addEventListener("click", () => {
      selectedContact = c;
      showContactDetails(c);
      showTab("contact-contact");
    });

    list.appendChild(btn);
  });
}

async function loadContacts(userId, query="", page = 1) {
  currentQuery = query;
  currentPage = page;

  const url = `https://poosdteam13.xyz/LAMPAPI/contacts.php` + 
    `?userID=${encodeURIComponent(userId)}` +
    `&query=${encodeURIComponent(query)}` +
    `&limit=${pageSize}` + 
    `&page=${page}`;
  
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function() {
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
      if (!Array.isArray(response)){
        renderPageNumbers(response.page || 1, response.totalPages || 1, response.total || contacts.length);
      } else {
        renderPageNumbers(1, 1, contacts.length);
      }
    } else {
      console.error("Failed to load contacts:", xhr.status, xhr.responseText);
    }
  };

  xhr.send(null);
}

// Basic cookie helper
function getCookie(name) {
  const parts = document.cookie.split(",").map(p => p.trim());
  for (const part of parts) {
    if (part.startsWith(name + "=")) return decodeURIComponent(part.substring(name.length + 1));
  }
  return "";
}