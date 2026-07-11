// =========================================
// GGN MAP V2
// script.js
// ระบบค้นหาหน่วยงาน
// =========================================

// =========================================
// Global
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

// Information Card
const infoPanel =
    document.getElementById("infoPanel");

// =========================================
// โหลดข้อมูล KML
// =========================================

async function loadKML(filePath, province, zone) {

    // ล้างข้อมูลเดิม
    allLocations = [];
    currentResults = [];
    selectedLocation = null;

    // ล้างช่องค้นหา
    if (searchInput) {

        searchInput.value = "";

    }

    // ล้างผลค้นหา
    if (searchResult) {

        searchResult.innerHTML =
            '<p class="empty">กำลังโหลดข้อมูล...</p>';

        searchResult.style.display = "block";

    }

    // ล้าง Information Card
    if (infoPanel) {

        infoPanel.innerHTML = `

            <div class="info-empty">

                📍 เลือกหน่วยงานเพื่อดูรายละเอียด

            </div>

        `;

    }

    try {

        console.log("=================================");
        console.log("Loading KML");
        console.log(filePath);

        const response =
            await fetch(filePath);

        if (!response.ok) {

            throw new Error(response.status);

        }

        const text =
            await response.text();

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

        // ---------------------------------
        // อ่าน Placemark
        // ---------------------------------

        const placemarks =
            Array.from(
                xml.getElementsByTagName("*")
            ).filter(node =>
                node.localName === "Placemark"
            );

        console.log(
            "Placemark :",
            placemarks.length
        );

        // ---------------------------------
        // อ่านข้อมูลแต่ละจุด
        // ---------------------------------

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
            ) {

                continue;

            }

            allLocations.push({

                name,

                description,

                lat,

                lng,

                province,

                zone

            });

        }

        // ---------------------------------
        // Dashboard
        // ---------------------------------

        const totalUnit =
            document.getElementById("totalUnit");

        if (totalUnit) {

            totalUnit.textContent =
                allLocations.length;

        }

        console.log(
            "Total Locations :",
            allLocations.length
        );

        // ---------------------------------
        // พร้อมค้นหา
        // ---------------------------------

        if (searchResult) {

            searchResult.innerHTML =

                '<p class="empty">พิมพ์ชื่อหน่วยงานเพื่อค้นหา</p>';

            searchResult.style.display = "none";

        }

    }

    catch (error) {

        console.error(error);

        if (searchResult) {

            searchResult.innerHTML =

                '<p class="empty">โหลดข้อมูลไม่สำเร็จ</p>';

            searchResult.style.display = "block";

        }

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

    // -----------------------------
    // ยังไม่พิมพ์
    // -----------------------------

    if (keyword === "") {

        currentResults = [];

        searchResult.innerHTML =

            '<p class="empty">พิมพ์ชื่อหน่วยงานเพื่อค้นหา</p>';

        searchResult.style.display = "none";

        return;

    }

    // -----------------------------
    // ค้นหา
    // -----------------------------

    currentResults = allLocations.filter(item => {

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

    console.log("=================================");
    console.log("Keyword :", keyword);
    console.log("Result :", currentResults.length);

    // -----------------------------
    // ไม่พบข้อมูล
    // -----------------------------

    if (currentResults.length === 0) {

        searchResult.innerHTML = `

            <p class="empty">

                ไม่พบข้อมูล

            </p>

        `;

        searchResult.style.display = "block";

        return;

    }

    renderSearchResults();

}

// =========================================
// แสดงผลการค้นหา
// =========================================

function renderSearchResults() {

    let html = `

        <div class="result-count">

            พบ ${currentResults.length} รายการ

        </div>

    `;

    currentResults.forEach((item, index) => {

        html += `

            <div
                class="result-item"
                data-index="${index}">

                <div class="result-title">

                    📍 ${item.name}

                </div>

                <div class="result-sub">

                    ${item.province}

                    •

                    ${item.zone}

                </div>

            </div>

        `;

    });

    searchResult.innerHTML = html;

    searchResult.style.display = "block";

    bindResultEvents();

}

// =========================================
// Information Card
// =========================================

function showInfo(item) {

    if (!infoPanel)
        return;

    infoPanel.innerHTML = `

        <h3>

            📍 ${item.name}

        </h3>

        <hr>

        <p>

            <strong>จังหวัด</strong>

            <br>

            ${item.province}

        </p>

        <br>

        <p>

            <strong>โซน</strong>

            <br>

            ${item.zone}

        </p>

        <br>

        <p>

            <strong>รายละเอียด</strong>

        </p>

        <div class="info-description">

            ${item.description || "-"}

        </div>

    `;

}

// =========================================
// Event ของผลการค้นหา
// =========================================

function bindResultEvents() {

    document
        .querySelectorAll(".result-item")
        .forEach(item => {

            item.addEventListener("click", function () {

                // -------------------------
                // Highlight
                // -------------------------

                document
                    .querySelectorAll(".result-item")
                    .forEach(result => {

                        result.classList.remove("active");

                    });

                this.classList.add("active");

                // -------------------------
                // ข้อมูลที่เลือก
                // -------------------------

                const index =
                    Number(this.dataset.index);

                const location =
                    currentResults[index];

                if (!location)
                    return;

                selectedLocation =
                    location;

                // -------------------------
                // แสดง Information Card
                // -------------------------

                showInfo(location);

                // -------------------------
                // ตรวจสอบแผนที่
                // -------------------------

                if (!window.currentMap) {

                    alert("กรุณาเลือกจังหวัดและโซนก่อน");

                    return;

                }

                // -------------------------
                // ซูม Google My Maps
                // -------------------------

                const url =
                    new URL(window.currentMap.map);

                url.searchParams.set(
                    "ll",
                    `${location.lat},${location.lng}`
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

                };

                window.mapFrame.src =
                    url.toString();

            });

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

    // ค้นหาทันทีเมื่อพิมพ์

    searchInput.addEventListener(

        "input",

        searchLocation

    );

    // กด Enter

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

            currentResults = [];

            selectedLocation = null;

            searchResult.innerHTML =

                '<p class="empty">พิมพ์ชื่อหน่วยงานเพื่อค้นหา</p>';

            searchResult.style.display =

                "none";

            // รีเซ็ต Information Card

            if (infoPanel) {

                infoPanel.innerHTML = `

                    <div class="info-empty">

                        📍 เลือกหน่วยงานเพื่อดูรายละเอียด

                    </div>

                `;

            }

            searchInput.focus();

        }

    );

}

// =========================================
// Export
// =========================================

window.loadKML =
    loadKML;

window.searchLocation =
    searchLocation;

console.log("=================================");
console.log("GGN MAP V2");
console.log("Search Ready");
console.log("=================================");