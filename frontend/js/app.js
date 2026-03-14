const API = "http://localhost:5000";

///////////////////////
// USER & VOLUNTEER REGISTER
///////////////////////
async function registerUser() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;

  await fetch(API + "/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, password })
  });

  alert("User Registered");
  window.location = "login.html";
}

async function registerVolunteer() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;

  navigator.geolocation.getCurrentPosition(async position => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    await fetch(API + "/api/volunteers/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        password,
        location: { lat, lng }
      })
    });

    alert("Volunteer Registered");
  });
}

///////////////////////
// LOGIN
///////////////////////
async function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await fetch(API + "/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  window.location = "user-dashboard.html";
}

async function loginVolunteer() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await fetch(API + "/api/volunteers/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  window.location = "volunteer-dashboard.html";
}

///////////////////////
// CREATE HELP REQUEST
///////////////////////
async function createRequest() {
  const description = document.getElementById("description").value;

  navigator.geolocation.getCurrentPosition(async position => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    await fetch(API + "/api/requests/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, location: { lat, lng } })
    });

    alert("Help request created");
    loadRequests(); // refresh request list automatically
  });
}

///////////////////////
// LOAD USER REQUESTS
///////////////////////
async function loadRequests() {
  const res = await fetch(API + "/api/requests/all");
  const data = await res.json();
  const container = document.getElementById("requests");

  if (!container) return;

  container.innerHTML = "";

  data.forEach(r => {
    container.innerHTML += `
      <div class="request-card">
        <p><strong>Description:</strong> ${r.description}</p>
        <p><strong>Status:</strong> ${r.status || "Pending"}</p>
      </div>
    `;
  });
}

///////////////////////
// REVERSE GEOCODING
///////////////////////
async function getLocationName(lat, lng) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
    const data = await res.json();
    return data.display_name || "Unknown location";
  } catch {
    return "Unknown location";
  }
}

///////////////////////
// LOAD MAP FOR VOLUNTEER
///////////////////////
async function loadMap() {
  const mapContainer = document.getElementById("map");
  if (!mapContainer) return;

  navigator.geolocation.getCurrentPosition(async position => {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    const map = L.map('map').setView([userLat, userLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    // Volunteer marker
    const userLocName = await getLocationName(userLat, userLng);
    const userIcon = L.icon({
      iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    L.marker([userLat, userLng], { icon: userIcon })
      .addTo(map)
      .bindPopup("You are here: " + userLocName)
      .openPopup();

    // Fetch all requests
    const res = await fetch(API + "/api/requests/all");
    const data = await res.json();
    const markers = [];

    for (let r of data) {
      if (r.location) {
        const locName = await getLocationName(r.location.lat, r.location.lng);

        const iconColor = r.status === "Pending" ? "red" : "green";
        const requestIcon = L.icon({
          iconUrl: `https://maps.google.com/mapfiles/ms/icons/${iconColor}-dot.png`,
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });

        L.marker([r.location.lat, r.location.lng], { icon: requestIcon })
          .addTo(map)
          .bindPopup(`
            <strong>${r.description}</strong><br>
            Status: ${r.status || "Pending"}<br>
            Location: ${locName}
          `);

        markers.push([r.location.lat, r.location.lng]);
      }
    }

    if (markers.length > 0) {
      map.fitBounds(markers, { padding: [50, 50] });
    }

  }, error => {
    alert("Geolocation is required to view the map.");
  });
}

///////////////////////
// AUTOLOAD ON DASHBOARDS
///////////////////////
window.onload = () => {
  loadRequests();  // user request list
  loadMap();       // volunteer map
};