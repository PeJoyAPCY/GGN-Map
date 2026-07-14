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

    if (
        !mapPopup ||
        !popupTitle ||
        !popupContent
    ) return;

    popupTitle.textContent =
        item.name || "ไม่ระบุชื่อ";

    const desc =
        (item.description || "")
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/div>/gi, "\n")
            .replace(/<[^>]*>/g, "")
            .replace(/\n{2,}/g, "\n")
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

    `;

    mapPopup.classList.add("show");

    mapPopup.classList.toggle(

        "collapsed",

        popupCollapsed

    );

    updatePopupArrow();

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

    if (!header)
        return;

    header.addEventListener(

        "click",

        function () {

            popupCollapsed =
                !popupCollapsed;

            mapPopup.classList.toggle(

                "collapsed",

                popupCollapsed

            );

            updatePopupArrow();

        }

    );

}

// =========================================
// Export
// =========================================

window.showPopup = showPopup;

window.hidePopup = hidePopup;

window.initPopup = initPopup;