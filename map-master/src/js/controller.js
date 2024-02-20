"use strict";
const input = document.getElementById("ogretimGorevlisiAdi");
var map = L.map("map").setView([37.739787, 29.101539], 17);
var currentLat, currentLng;
let currentLocation;
var waypointLat, waypointLng;
var currentPositionMarker = null;
var personPositionMarker = null;
var routingControl = null;
const currentData = [];
let person = {};

const getJson = async function () {
  try {
    const res = await fetch("./src/data.json");
    if (!res.ok) {
      throw new Error("Birşeyler ters gitti");
    }
    const data = await res.json();
    currentData.push(...data);
    console.log(data);
  } catch (err) {
    console.error(err.message);
  }
};
getJson();

// OSM layer
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

L.control.locate().addTo(map);

// Mevcut lokasyon

map.on("locationfound", function (e) {
  currentLocation = [...Object.values(e.latlng)];
  [currentLat, currentLng] = currentLocation;
  console.log(currentLat, currentLng);
});

input.addEventListener("input", (e) => {
  if (e.target.value.length < 3) return;
  if (!currentLocation) alert("Lütfen konumunuzu belirtin");

  const searchValue = e.target.value.toLowerCase().split(" ").join(" ");

  const filteredObj = currentData.find((data) => data.name === searchValue);

  person = { ...filteredObj };
  console.log(person);

  personPositionMarker = L.marker([person.Latitude, person.Longitude])
    .addTo(map)
    .on("click", (e) => e.target.remove());
  personPositionMarker
    .bindPopup(
      `<div class="card" style="width: 188px;">
      <img src=${person.photo} class="card-img-top" alt="...">
      <div class="card-body">
        <h4 class="card-title">${person.title} ${person.name
        .split(" ")
        .map((el) => el[0].toUpperCase() + el.slice(1))
        .join(" ")}</h4>
        <h5 class="card-text">Bölüm: <small class="text-body-secondary">${
          person.major
        }</small></h5>
        <h5 class="card-text">${person.blok} Blok Kat: ${person.floor}</h5>
      </div>
    </div>`
    )
    .openPopup();

  // Person nesnesi güncellendikten sonra routingControl'u oluştur
  if (routingControl) {
    map.removeControl(routingControl);
  }

  routingControl = L.Routing.control({
    waypoints: [
      L.latLng(currentLat, currentLng),
      L.latLng(person.Latitude, person.Longitude),
    ],
  }).addTo(map);
});
