// =========================================
// GGN Operations Map
// popup.js
// =========================================

const mapPopup =
    document.getElementById("mapPopup");

const popupTitle =
    document.getElementById("popupTitle");

const popupContent =
    document.getElementById("popupContent");

const togglePopup =
    document.getElementById("togglePopup");

let popupCollapsed = false;

// =========================================
// แสดง Popup
// =========================================

function showPopup(item){

    if(!mapPopup)
        return;

    popupTitle.textContent =
        item.name;

    popupContent.innerHTML = `

        <div class="popup-info">

            <strong>จังหวัด</strong>

            ${item.province}

        </div>

        <div class="popup-info">

            <strong>เขต</strong>

            ${item.zone}

        </div>

        <div class="popup-description">

            ${item.description || "-"}

        </div>

        <div class="popup-action">

            <button
                class="navigate-btn"
                onclick="openNavigation(${item.lat},${item.lng})">

                🧭 นำทาง

            </button>

        </div>

    `;

    mapPopup.classList.remove("hidden");

    if(popupCollapsed){

        popupCollapsed=false;

        popupContent.style.display="block";

        togglePopup.textContent="−";

    }

}

// =========================================
// ซ่อน Popup
// =========================================

function hidePopup(){

    if(!mapPopup)
        return;

    mapPopup.classList.add("hidden");

}

// =========================================
// พับ / ขยาย
// =========================================

function togglePopupContent(){

    popupCollapsed=!popupCollapsed;

    if(popupCollapsed){

        popupContent.style.display="none";

        togglePopup.textContent="+";

    }else{

        popupContent.style.display="block";

        togglePopup.textContent="−";

    }

}

// =========================================
// เปิด Google Maps
// =========================================

function openNavigation(lat,lng){

    window.open(

        `https://www.google.com/maps?q=${lat},${lng}`,

        "_blank"

    );

}

// =========================================
// Event
// =========================================

function initPopup(){

    if(togglePopup){

        togglePopup.addEventListener(

            "click",

            togglePopupContent

        );

    }

}