// =========================================
// popup.js
// Floating Popup
// =========================================

// =========================================
// Element
// =========================================

const mapPopup =
    document.getElementById("mapPopup");

const popupTitle =
    document.getElementById("popupTitle");

const popupContent =
    document.getElementById("popupContent");

// =========================================
// State
// =========================================

let popupCollapsed = false;

// =========================================
// Hide
// =========================================

function hidePopup() {

    if (!mapPopup)
        return;

    mapPopup.classList.remove("show");

}

// =========================================
// Show
// =========================================

function showPopup(item) {

    if (!mapPopup)
        return;

    popupTitle.textContent =
        item.name || "ไม่ระบุชื่อ";

    const desc =
        (item.description || "")
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/div>/gi, "\n")
            .replace(/<[^>]*>/g, "")
            .trim();

    popupContent.innerHTML = `

        <div class="popup-info">
            <strong>จังหวัด :</strong>
            ${item.province}
        </div>

        <div class="popup-info">
            <strong>โซน :</strong>
            ${item.zone}
        </div>

        <hr>

        <div class="popup-description">
            ${desc.replace(/\n/g, "<br>")}
        </div>

        <button
            class="navigate-btn"
            onclick="navigateTo(
                ${item.lat},
                ${item.lng},
                '${(item.name || "").replace(/'/g, "\\'")}'
            )">
            📍 นำทาง
        </button>

    `;

    popupContent.style.display =
        popupCollapsed
            ? "none"
            : "block";

    updatePopupArrow();

    mapPopup.classList.add("show");

}
// =========================================
// Update Arrow
// =========================================

function updatePopupArrow() {

    const arrow =
        document.getElementById("popupArrow");

    if (!arrow)
        return;

    arrow.textContent =
        popupCollapsed ? "▶" : "▼";

}

// =========================================
// Init
// =========================================

function initPopup() {

    const header =
        document.getElementById("popupHeader");

    if (!header)
        return;

    header.onclick = function () {

        popupCollapsed = !popupCollapsed;

        popupContent.style.display =
            popupCollapsed
                ? "none"
                : "block";

        updatePopupArrow();

    };

}

// =========================================
// Navigate
// =========================================

function navigateTo(lat, lng, name = "") {

    // ตรวจสอบพิกัด
    if (isNaN(lat) || isNaN(lng)) {

        alert("ไม่พบพิกัดของหน่วยงาน");

        return;

    }

    // ยืนยันก่อนนำทาง
    const confirmNavigate =
        confirm(`ต้องการนำทางไปยัง\n\n${name}`);

    if (!confirmNavigate)
        return;

    // ตรวจสอบการรองรับ GPS
    if (!navigator.geolocation) {

        const url =
            `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&hl=th`;

        window.location.href = url;

        return;

    }

    navigator.geolocation.getCurrentPosition(

        // Success
        function (position) {

            const origin =
                `${position.coords.latitude},${position.coords.longitude}`;

            const destination =
                `${lat},${lng}`;

            const url =
                `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving&hl=th`;

            window.location.href = url;

        },
        // Error
        function () {

            // หากไม่สามารถใช้ GPS ได้
            // ให้เปิดตำแหน่งปลายทางแทน

            const url =
                `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&hl=th`;

            window.location.href = url;

        },

        // Options
        {

            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 0

        }

    );

}

window.navigateTo = navigateTo;

// =========================================
// Export
// =========================================

window.showPopup = showPopup;

window.hidePopup = hidePopup;

window.initPopup = initPopup;