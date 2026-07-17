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

    if (!mapPopup) return;

    popupTitle.textContent =
        item.name || "ไม่ระบุชื่อ";

    const desc =
        (item.description || "")
        .replace(/<br\s*\/?>/gi,"\n")
        .replace(/<\/div>/gi,"\n")
        .replace(/<[^>]*>/g,"")
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
        ${desc.replace(/\n/g,"<br>")}
    </div>

    <button
        class="navigate-btn"
        onclick="navigateTo(${item.lat}, ${item.lng})">
        📍 นำทาง
    </button>

    `;

    popupContent.style.display =
        popupCollapsed ? "none" : "block";

    updatePopupArrow();

    mapPopup.classList.add("show");

}

// =========================================
// Button
// =========================================

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

    if (!header) return;

    header.onclick = function () {

        popupCollapsed = !popupCollapsed;

        popupContent.style.display =
            popupCollapsed ? "none" : "block";

        updatePopupArrow();

    };

}

// =========================================
// Navigate
// =========================================

function navigateTo(lat, lng) {

    if (!navigator.geolocation) {

        alert("อุปกรณ์ไม่รองรับ GPS");

        return;

    }

    navigator.geolocation.getCurrentPosition(

        function(position){

            const origin =
                `${position.coords.latitude},${position.coords.longitude}`;

            const destination =
                `${lat},${lng}`;

            const url =
                `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

            window.open(url, "_blank");

        },

        function(error){

            switch(error.code){

                case error.PERMISSION_DENIED:
                    alert("กรุณาอนุญาตการเข้าถึงตำแหน่ง");
                    break;

                case error.POSITION_UNAVAILABLE:
                    alert("ไม่สามารถระบุตำแหน่งได้");
                    break;

                case error.TIMEOUT:
                    alert("หมดเวลาการค้นหาตำแหน่ง");
                    break;

                default:
                    alert("เกิดข้อผิดพลาดในการระบุตำแหน่ง");
            }

        },

        {

            enableHighAccuracy:true,

            timeout:10000,

            maximumAge:0

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