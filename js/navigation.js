// =========================================
// navigation.js
// GGN Navigation Module
// =========================================

// =========================================
// State
// =========================================

let currentDestination = null;

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