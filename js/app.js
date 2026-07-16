// =========================================
// GGN Operations Map
// app.js
// =========================================

const province =
    document.getElementById("province");

const zone =
    document.getElementById("zone");

const mapFrame =
    document.getElementById("mapFrame");

const totalUnit =
    document.getElementById("totalUnit");

const loading =
    document.getElementById("loading");

// เก็บแผนที่ปัจจุบัน
window.currentMap = null;

// =========================================
// โหลดรายชื่อจังหวัด
// =========================================

function loadProvince() {

    province.innerHTML = "";

    Object.keys(maps).forEach(name => {

        const option =
            document.createElement("option");

        option.value = name;
        option.textContent = name;

        province.appendChild(option);

    });

    loadZone();

}

// =========================================
// โหลดเขต
// =========================================

function loadZone() {

    zone.innerHTML = "";

    const provinceName =
        province.value;

    Object.keys(
        maps[provinceName]
    ).forEach(name => {

        const option =
            document.createElement("option");

        option.value = name;
        option.textContent = name;

        zone.appendChild(option);

    });

    loadMap();

}

// =========================================
// โหลด Google My Map
// =========================================

async function loadMap() {

    loading.style.display = "flex";

    const provinceName =
        province.value;

    const zoneName =
        zone.value;

    const item =
        maps[provinceName][zoneName];

    window.currentMap = item;

    mapFrame.src = item.map;

    totalUnit.textContent =
        item.total;

    mapFrame.onload = () => {

        loading.style.display = "none";

    };

}

// =========================================
// โหลดข้อมูลค้นหาทั้งหมด
// =========================================

async function initializeSystem(){

    loading.style.display="flex";

    await loadAllPlaces();

    initPopup();

    initSearch();

    loading.style.display="none";

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

window.addEventListener(

    "DOMContentLoaded",

    async ()=>{

        loadProvince();

        await initializeSystem();

    }

);