// ===== BUTTON EVENTS =====
document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("submitReportBtn").addEventListener("click", addReport);
document.getElementById("showRouteBtn").addEventListener("click", findRoute);
document.getElementById("logoutBtn").addEventListener("click", logout);

// ===== MAP VARIABLES =====
let map;
let markerMode = false;

// ===== LOGIN =====
function login() {
  var username = document.getElementById("username").value.trim();

  if (username === "") {
    alert("Please enter your name");
    return;
  }

  document.getElementById("welcomeText").innerText = "Welcome, " + username;
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("loginSection").style.display = "none";

  initMap();
}

// ===== REPORT SECTION =====
function addReport() {
  var location = document.getElementById("location").value.trim();
  var issue = document.getElementById("issue").value.trim();
  var description = document.getElementById("description").value.trim();

  if (location === "" || issue === "" || description === "") {
    alert("Fill all fields");
    return;
  }

  var reportList = document.getElementById("reportList");

  var newReport = document.createElement("div");
  newReport.className = "report";
  newReport.innerHTML =
    "<b>Location:</b> " + escapeHtml(location) +
    "<br><b>Issue:</b> " + escapeHtml(issue) +
    "<br><b>Description:</b> " + escapeHtml(description);

  reportList.appendChild(newReport);

  document.getElementById("location").value = "";
  document.getElementById("issue").value = "";
  document.getElementById("description").value = "";
}

// ===== SAFE ROUTE =====
function findRoute() {
  var start = document.getElementById("start").value.trim();
  var destination = document.getElementById("destination").value.trim();

  if (start === "" || destination === "") {
    alert("Enter both locations");
    return;
  }

  var safetyLevels = ["Low Risk Area", "Moderate Risk Area", "High Risk Area"];
  var randomLevel = safetyLevels[Math.floor(Math.random() * safetyLevels.length)];

  var advice = "";
  if (randomLevel === "Low Risk Area") {
    advice = "Well-lit roads, CCTV coverage available.";
  } else if (randomLevel === "Moderate Risk Area") {
    advice = "Moderate traffic. Stay alert while crossing.";
  } else {
    advice = "Poor lighting detected. Avoid late-night travel.";
  }

  document.getElementById("routeResult").innerHTML =
    "<div class='report'>" +
    "<b>Safest Route:</b> " + escapeHtml(start) + " ➜ " + escapeHtml(destination) +
    "<br><b>Safety Level:</b> " + randomLevel +
    "<br><b>Advice:</b> " + advice +
    "</div>";

  document.getElementById("mapPreview").innerText = start + " ➜ " + destination;
}

// ===== MAP INITIALIZATION =====
function initMap() {

  if (map) return;

  map = L.map('map').setView([8.5241, 76.9366], 13); // Default location

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  loadMarkers();

  map.on('click', function(e) {

    if (!markerMode) return;

    var type = document.getElementById("markerType").value;
    var note = document.getElementById("markerNote").value;

    addMarker(e.latlng.lat, e.latlng.lng, type, note);

    markerMode = false;
    alert("Marker added!");
  });
}

// ===== ENABLE MARKER MODE =====
function enableMarker() {
  markerMode = true;
  alert("Click on map to place marker");
}

// ===== ADD MARKER =====
function addMarker(lat, lng, type, note) {

  var color = type === "Unsafe" ? "red" : "green";

  var marker = L.circleMarker([lat, lng], {
    radius: 8,
    color: color,
    fillOpacity: 0.8
  }).addTo(map);

  marker.bindPopup("<b>" + type + "</b><br>" + note);

  saveMarker(lat, lng, type, note);
}

// ===== SAVE MARKER =====
function saveMarker(lat, lng, type, note) {

  var markers = JSON.parse(localStorage.getItem("markers")) || [];

  markers.push({ lat: lat, lng: lng, type: type, note: note });

  localStorage.setItem("markers", JSON.stringify(markers));
}

// ===== LOAD SAVED MARKERS =====
function loadMarkers() {

  var markers = JSON.parse(localStorage.getItem("markers")) || [];

  markers.forEach(function(m) {
    addMarker(m.lat, m.lng, m.type, m.note);
  });
}

function logout() {
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("loginSection").style.display = "block";
  document.getElementById("username").value = "";
}
// ===== SAFE TEXT OUTPUT =====
function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}