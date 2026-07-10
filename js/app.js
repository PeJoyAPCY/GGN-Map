// =========================================
// GGN MAP V2
// app.js
// =========================================

const province = document.getElementById("province");
const zone = document.getElementById("zone");

const mapFrame = document.getElementById("mapFrame");
// ให้ไฟล์อื่นเรียกใช้ได้
window.mapFrame = mapFrame;

const totalUnit = document.getElementById("totalUnit");

const openMap = document.getElementById("openMap");

const loading = document.getElementById("loading");
window.loading = loading;

// -----------------------------------------
// โหลดจังหวัด
// -----------------------------------------

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

// -----------------------------------------
// โหลดโซน
// -----------------------------------------

function loadZone() {

    const p = province.value;

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

// -----------------------------------------
// โหลดแผนที่
// -----------------------------------------

async function loadMap() {

    const p = province.value;
    const z = zone.value;

    const data = maps[p][z];
    // เก็บข้อมูลแผนที่ปัจจุบัน
    window.currentMap = data;

    if (!data) return;

    loading.style.display = "block";

    mapFrame.src = data.map;

    totalUnit.innerText = data.total;

    await loadKML(
        data.kml,
        p,
        z
    );

    loading.style.display = "none";

    openMap.onclick = () => {

        window.open(
            data.viewer,
            "_blank"
        );

    };

}

// -----------------------------------------

province.addEventListener(
    "change",
    loadZone
);

zone.addEventListener(
    "change",
    loadMap
);

// -----------------------------------------

loadProvince();

console.log("GGN App Ready");