const province = document.getElementById("province");
const zone = document.getElementById("zone");
const mapFrame = document.getElementById("mapFrame");
const totalUnit = document.getElementById("totalUnit");
const openMap = document.getElementById("openMap");

// =======================
// โหลดจังหวัด
// =======================

function loadProvince(){

    province.innerHTML="";

    Object.keys(maps).forEach(p=>{

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

    zone.innerHTML="";

    const p=province.value;

    if(!maps[p]) return;

    Object.keys(maps[p]).forEach(z=>{

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

function loadMap(){

    const p=province.value;

    const z=zone.value;

    if(!maps[p] || !maps[p][z]){

        return;

    }

    const data=maps[p][z];

    mapFrame.src=data.map;

    totalUnit.textContent=data.total;

    openMap.onclick=()=>{

        window.open(data.viewer,"_blank");

    };

    if(typeof loadKML==="function"){

        loadKML(data.kml);

    }

}

// =======================
// เปิดจากการค้นหา
// =======================

function openLocation(location){

    province.value=location.province;

    loadZone();

    zone.value=location.zone;

    loadMap();

    setTimeout(()=>{

        moveToLocation(location);

    },700);

}

// =======================
// Event
// =======================

province.addEventListener("change",loadZone);

zone.addEventListener("change",loadMap);

loadProvince();