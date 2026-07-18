// =========================================
// navigation.js
// GGN Navigation Module
// =========================================

// =========================================
// State
// =========================================

let currentDestination = null;

// =========================================
// Element
// =========================================

const navigationPanel =
    document.getElementById("navigationPanel");

const navigationInfo =
    document.getElementById("navigationInfo");

const startNavigationBtn =
    document.getElementById("startNavigationBtn");

// =========================================
// Set Destination
// =========================================

function setDestination(item) {

    currentDestination = item;

    console.log(
        "Destination :",
        item
    );

}

// =========================================
// Get Destination
// =========================================

function getDestination() {

    return currentDestination;

}

// =========================================
// Show Navigation Panel
// =========================================

function showNavigationPanel(item) {

    if (
        !navigationPanel ||
        !navigationInfo
    ) {

        console.warn(
            "Navigation Panel ยังไม่มีใน HTML"
        );

        return;

    }

    currentDestination = item;

    navigationInfo.innerHTML = `

        <h3>${item.name}</h3>

        <br>

        <b>จังหวัด</b>

        ${item.province}

        <br>

        <b>โซน</b>

        ${item.zone}

    `;

    navigationPanel.classList.add("show");

}

// =========================================
// Hide Navigation Panel
// =========================================

function hideNavigationPanel() {

    if (!navigationPanel)
        return;

    navigationPanel.classList.remove("show");

}

// =========================================
// Get Current Location
// =========================================

function getCurrentLocation() {

    return new Promise((resolve, reject) => {

        if (!navigator.geolocation) {

            reject("Browser ไม่รองรับ GPS");

            return;

        }

        navigator.geolocation.getCurrentPosition(

            position => {

                resolve({

                    lat: position.coords.latitude,

                    lng: position.coords.longitude

                });

            },

            error => {

                reject(error);

            },

            {

                enableHighAccuracy: true,

                timeout: 10000,

                maximumAge: 0

            }

        );

    });

}

// =========================================
// Start Navigation
// =========================================

async function startNavigation() {

    if (!currentDestination) {

        alert("ยังไม่ได้เลือกปลายทาง");

        return;

    }

    try {

        const current = await getCurrentLocation();

        console.log("Current :", current);

        console.log("Destination :", currentDestination);

    }

    catch (error) {

        console.error(error);

    }

}

// =========================================
// Export
// =========================================

window.setDestination = setDestination;

window.getDestination = getDestination;

window.getCurrentLocation = getCurrentLocation;

window.startNavigation = startNavigation;

window.showNavigationPanel = showNavigationPanel;

window.hideNavigationPanel = hideNavigationPanel;