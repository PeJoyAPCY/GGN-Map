// =========================================
// GGN MAP V1.3
// app.js
// =========================================

const province =
    document.getElementById("province");

const zone =
    document.getElementById("zone");

const mapFrame =
    document.getElementById("mapFrame");

window.mapFrame =
    mapFrame;

const totalUnit =
    document.getElementById("totalUnit");

const loading =
    document.getElementById("loading");

window.loading =
    loading;

// =========================================
// โหลดจังหวัด
// =========================================

function loadProvince() {

    province.innerHTML = "";

    Object.keys(maps).forEach(name => {

        province.innerHTML += `

            <option value="${name}">

                ${name}

            </option>

        `;

    });

    loadZone();

}

// =========================================
// โหลดโซน
// =========================================

function loadZone() {

    const p =
        province.value;

    zone.innerHTML = "";

    Object.keys(maps[p]).forEach(name => {

        zone.innerHTML += `

            <option value="${name}">

                ${name}

            </option>

        `;

    });

    loadMap();

}

// =========================================
// โหลดแผนที่
// =========================================

async function loadMap() {

    const p =
        province.value;

    const z =
        zone.value;

    const data =
        maps[p][z];

    if (!data)
        return;

    // -------------------------
    // เก็บข้อมูลแผนที่ปัจจุบัน
    // -------------------------

    window.currentMap =
        data;

    // -------------------------
    // ซ่อน Popup
    // -------------------------

    if (window.hidePopup) {

        window.hidePopup();

    }

    loading.style.display =
        "block";

    mapFrame.src =
        data.map;

    totalUnit.innerText =
        data.total;
    // -------------------------
    // โหลด Google My Maps
    // -------------------------

    await loadKML(

        data.kml,

        p,

        z

    );

    // -------------------------
    // ซ่อนผลการค้นหา
    // -------------------------

    const searchResult =
        document.getElementById("searchResult");

    if (searchResult) {

        searchResult.style.display =
            "none";

        searchResult.innerHTML =
            '<p class="empty">พิมพ์ชื่อหน่วยงานเพื่อค้นหา</p>';

    }

    // -------------------------
    // โหลดเสร็จ
    // -------------------------

    loading.style.display =
        "none";

    // -------------------------
    // ปุ่มเปิด Google My Maps
    // -------------------------

}

// =========================================
// Event
// =========================================

province.addEventListener(

    "change",

    loadZone

);

zone.addEventListener(

    "change",

    loadMap

);

// =========================================
// Start
// =========================================

loadProvince();

console.log("=================================");

console.log("GGN MAP V1.3");

console.log("Application Ready");

console.log("=================================");