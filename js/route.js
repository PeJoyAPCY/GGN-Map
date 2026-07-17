// =========================================
// route.js
// GGN Route
// =========================================

let routeMap = null;

window.addEventListener("load", function () {

    routeMap = L.map("routeMap").setView(

        [18.7883, 98.9853],

        12

    );

    L.tileLayer(

        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {

            attribution:
                "&copy; OpenStreetMap"

        }

    ).addTo(routeMap);

});