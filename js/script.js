// =========================================
// GGN MAP V1.3
// Search + Floating Popup
// =========================================

let allLocations = [];

let currentResults = [];

let selectedLocation = null;

// =========================================
// Element
// =========================================

const searchInput =
    document.getElementById("searchInput");

const searchResult =
    document.getElementById("searchResult");

const searchBtn =
    document.getElementById("searchBtn");

const clearBtn =
    document.getElementById("clearSearch");

// =========================================
// Popup
// =========================================

const mapPopup =
    document.getElementById("mapPopup");

const popupTitle =
    document.getElementById("popupTitle");

const popupContent =
    document.getElementById("popupContent");

const togglePopup =
    document.getElementById("togglePopup");
    console.log("togglePopup =", togglePopup);

// =========================================
// Popup Function
// =========================================

function hidePopup() {

    if (!mapPopup)
        return;

    mapPopup.classList.remove("show");

}

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
                .replace(/\n{2,}/g, "\n")
                .trim();

        popupContent.innerHTML = `

        <div class="popup-info">

        <strong>จังหวัด :</strong> ${item.province}

        </div>

        <div class="popup-info">

        <strong>โซน :</strong> ${item.zone}

        </div>

        <hr>

        <div class="popup-description">

        ${item.description.replace(/\n+/g,"<br>")}

        </div>

        `;

        mapPopup.classList.add("show");

        // ถ้าเคยพับไว้ ให้คงสถานะเดิม
        mapPopup.classList.toggle(
        "collapsed",
        popupCollapsed
        );

        togglePopup.textContent =
        popupCollapsed ? "+" : "−";

    }

// =========================================
// Popup Collapse
// =========================================

let popupCollapsed = false;

if (togglePopup) {

    togglePopup.addEventListener("click", () => {

        popupCollapsed = !popupCollapsed;

        mapPopup.classList.toggle(
            "collapsed",
            popupCollapsed
        );

        togglePopup.textContent =
            popupCollapsed ? "+" : "−";

    });

}

// =========================================
// โหลดข้อมูล KML
// =========================================

async function loadKML(filePath, province, zone) {

    allLocations = [];

    currentResults = [];

    selectedLocation = null;

    hidePopup();

    if (searchInput) {

        searchInput.value = "";

    }

    if (searchResult) {

        searchResult.innerHTML =
            '<p class="empty">กำลังโหลดข้อมูล...</p>';

    }

    try {

        console.log("Loading :", filePath);

        const response = await fetch(filePath);

        if (!response.ok) {

            throw new Error(response.status);

        }

        const text = await response.text();

        const xml =
            new DOMParser().parseFromString(
                text,
                "application/xml"
            );

        const parserError =
            xml.querySelector("parsererror");

        if (parserError) {

            console.error(parserError.textContent);

            return;

        }

        const placemarks =
            Array.from(
                xml.getElementsByTagName("*")
            ).filter(node =>
                node.localName === "Placemark"
            );

        console.log("KML Loaded");

        console.log(placemarks.length);

        for (const place of placemarks) {

            const elements =
                Array.from(
                    place.getElementsByTagName("*")
                );

            const nameNode =
                elements.find(node =>
                    node.localName === "name"
                );

            const descriptionNode =
                elements.find(node =>
                    node.localName === "description"
                );

            const coordNode =
                elements.find(node =>
                    node.localName === "coordinates"
                );

            if (!coordNode)
                continue;

            const name =
                nameNode
                ? nameNode.textContent.trim()
                : "";

            const description =
                descriptionNode
                ? descriptionNode.textContent.trim()
                : "";

            const coords =
                coordNode.textContent
                    .trim()
                    .split(",");

            if (coords.length < 2)
                continue;

            const lng =
                parseFloat(coords[0]);

            const lat =
                parseFloat(coords[1]);

            if (
                isNaN(lat) ||
                isNaN(lng)
            ) continue;

            allLocations.push({

                name,

                description,

                lat,

                lng,

                province,

                zone

            });

        }

        console.log(
            "Total :",
            allLocations.length
        );

        const totalUnit =
            document.getElementById("totalUnit");

        if (totalUnit) {

            totalUnit.textContent =
                allLocations.length;

        }

        searchResult.innerHTML =
            '<p class="empty">พิมพ์ชื่อหน่วยงานเพื่อค้นหา</p>';

        searchResult.style.display =
            "none";

    }

    catch (error) {

        console.error(error);

        searchResult.innerHTML =
            '<p class="empty">โหลดข้อมูลไม่สำเร็จ</p>';

    }

}

// =========================================
// ค้นหาหน่วยงาน
// =========================================

function searchLocation() {

    if (!searchInput || !searchResult)
        return;

    const keyword =
        searchInput.value
            .trim()
            .toLowerCase();

    if (keyword === "") {

        searchResult.innerHTML =
            '<p class="empty">พิมพ์ชื่อหน่วยงานเพื่อค้นหา</p>';

        searchResult.style.display =
            "none";

        hidePopup();

        return;

    }

    const results =
        allLocations.filter(item => {

            const name =
                (item.name || "")
                    .toLowerCase();

            const description =
                (item.description || "")
                    .toLowerCase();

            return (

                name.includes(keyword) ||

                description.includes(keyword)

            );

        });

    currentResults = results;

    if (results.length === 0) {

        searchResult.innerHTML =

            '<p class="empty">ไม่พบข้อมูล</p>';

        searchResult.style.display =
            "block";

        hidePopup();

        return;

    }

    let html = `

        <div class="result-count">

            พบ ${results.length} รายการ

        </div>

    `;

    results.forEach(item => {

        html += `

            <div

                class="result-item"

                data-lat="${item.lat}"

                data-lng="${item.lng}">

                <div class="result-title">

                    ${item.name}

                </div>

                <div class="result-sub">

                    จังหวัด :
                    ${item.province}

                    |

                    โซน :
                    ${item.zone}

                </div>

            </div>

        `;

    });

    searchResult.innerHTML = html;

    searchResult.style.display =
        "block";
    // =========================================
    // Event เมื่อคลิกผลการค้นหา
    // =========================================

    document

        .querySelectorAll(".result-item")

        .forEach((element, index) => {

            element.addEventListener(

                "click",

                function () {

                    // ---------------------------
                    // Highlight
                    // ---------------------------

                    document

                        .querySelectorAll(".result-item")

                        .forEach(item => {

                            item.classList.remove("active");

                        });

                    this.classList.add("active");

                    // ---------------------------
                    // Location
                    // ---------------------------

                    const item =
                        currentResults[index];

                    selectedLocation =
                        item;

                    // ---------------------------
                    // ตรวจสอบแผนที่
                    // ---------------------------

                    if (!window.currentMap) {

                        alert(

                            "กรุณาเลือกจังหวัดและโซนก่อน"

                        );

                        return;

                    }

                    // ---------------------------
                    // Zoom Google My Maps
                    // ---------------------------

                    const url =
                        new URL(
                            window.currentMap.map
                        );

                    url.searchParams.set(

                        "ll",

                        `${item.lat},${item.lng}`

                    );

                    url.searchParams.set(

                        "z",

                        "17"

                    );

                    window.loading.style.display =
                        "block";

                    window.mapFrame.onload = () => {

                        window.loading.style.display =
                            "none";

                        window.mapFrame.scrollIntoView({

                            behavior: "smooth",

                            block: "center"

                        });

                        // -----------------------
                        // แสดง Popup
                        // -----------------------

                        showPopup(item);

                    };

                    window.mapFrame.src =
                        url.toString();

                }

            );

        });

}

// =========================================
// Event
// =========================================

if (searchBtn) {

    searchBtn.addEventListener(

        "click",

        searchLocation

    );

}

if (searchInput) {

    searchInput.addEventListener(

        "input",

        searchLocation

    );

    searchInput.addEventListener(

        "keydown",

        function (e) {

            if (e.key === "Enter") {

                e.preventDefault();

                searchLocation();

            }

        }

    );

}

if (clearBtn) {

    clearBtn.addEventListener(

        "click",

        function () {

            searchInput.value = "";

            searchResult.innerHTML =

                '<p class="empty">พิมพ์ชื่อหน่วยงานเพื่อค้นหา</p>';

            searchResult.style.display =
                "none";

            currentResults = [];

            selectedLocation = null;

            hidePopup();

            searchInput.focus();

        }

    );

}

// =========================================
// Export
// =========================================

window.loadKML = loadKML;

window.searchLocation = searchLocation;

window.showPopup = showPopup;

window.hidePopup = hidePopup;

console.log("=================================");

console.log("GGN MAP V1.3");

console.log("Floating Popup Ready");

console.log("Locations :", allLocations.length);

console.log("=================================");