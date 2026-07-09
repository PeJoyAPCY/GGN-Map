// ======================================
// GGN Operations Map
// app.js
// จัดการจังหวัด / เขต / Google My Maps
// ======================================

const province = document.getElementById("province");
const zone = document.getElementById("zone");
const mapFrame = document.getElementById("mapFrame");
const totalUnit = document.getElementById("totalUnit");
const openMap = document.getElementById("openMap");
const loading = document.getElementById("loading");

// =======================
// โหลดรายชื่อจังหวัด
// =======================

function loadProvince(){

    province.innerHTML = "";

    Object.keys(maps).forEach(p => {

        province.insertAdjacentHTML(
            "beforeend",
            `<option value="${p}">${p}</option>`
        );

    });

    loadZone();

}

// =======================
// โหลดโซน
// =======================

function loadZone(){

    zone.innerHTML = "";

    const p = province.value;

    if(!maps[p]){

        return;

    }

    Object.keys(maps[p]).forEach(z => {

        zone.insertAdjacentHTML(
            "beforeend",
            `<option value="${z}">${z}</option>`
        );

    });

    loadMap();

}

// =======================
// โหลดแผนที่
// =======================

async function loadMap(){

    const p = province.value;
    const z = zone.value;

    if(!maps[p] || !maps[p][z]){

        return;

    }

    const data = maps[p][z];

    // Google My Maps
    mapFrame.src = data.map;

    // จำนวนหน่วยงาน
    totalUnit.textContent = data.total;

    // ปุ่มเปิด Google My Maps
    openMap.onclick = function(){

        window.open(
            data.viewer,
            "_blank"
        );

    };

    // แสดง Loading
    if(loading){

        loading.style.display = "block";

    }

    // โหลดข้อมูล KML
    if(typeof loadKML === "function"){

        await loadKML(
            data.kml,
            p,
            z
        );

    }

    // ซ่อน Loading
    if(loading){

        loading.style.display = "none";

    }

}

// =======================
// เปิดตำแหน่งจากการค้นหา
// =======================

function openLocation(location){

    if(!location){

        return;

    }

    province.value = location.province;

    loadZone();

    zone.value = location.zone;

    loadMap();

    setTimeout(function(){

        moveToLocation(location);

    },500);

}

// =======================
// Event
// =======================

province.addEventListener(
    "change",
    loadZone
);

zone.addEventListener(
    "change",
    loadMap
);

// =======================
// เริ่มต้นระบบ
// =======================

loadProvince();

console.log("GGN App Ready");