const coordinates = window.listing.geometry.coordinates;


const customIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Leaflet uses [latitude, longitude]
const map = L.map("map").setView(
    [coordinates[1], coordinates[0]],
    9
);

L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
        attribution:
            '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: "abcd",
        maxZoom: 20,
    }
).addTo(map);


const marker = L.marker(
    [coordinates[1], coordinates[0]],
    {
        icon: customIcon,
    }
)
    .addTo(map)
    .bindPopup(`
        <div class="popup-card">
            <h5>${window.listing.title}</h5>

            <div class="popup-location">
               📍 ${window.listing.location}
            </div>

            <div class="popup-note">
                Exact location shared after booking.
            </div>
        </div>
   `)

marker.on("mouseover", function () {
    this.openPopup();
});

marker.on("mouseout", function () {
    this.closePopup();
});

