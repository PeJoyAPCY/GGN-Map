// =========================================
// GGN MAP V1.4
// app.js
// =========================================

// ---------- Element ----------

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

// ---------- Mobile Drawer ----------

const sidebar =
    document.getElementById("sidebar");

const menuToggle =
    document.getElementById("menuToggle");

const closeSidebar =
    document.getElementById("closeSidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");

// =========================================
// Drawer
// =========================================

function openDrawer(){

    if(!sidebar) return;

    sidebar.classList.add("show");

    sidebarOverlay.classList.add("show");

}

function closeDrawer(){

    if(!sidebar) return;

    sidebar.classList.remove("show");

    sidebarOverlay.classList.remove("show");

}

// เปิด Drawer

if(menuToggle){

    menuToggle.addEventListener(

        "click",

        openDrawer

    );

}

// ปิด Drawer

if(closeSidebar){

    closeSidebar.addEventListener(

        "click",

        closeDrawer

    );

}

// แตะพื้นหลัง

if(sidebarOverlay){

    sidebarOverlay.addEventListener(

        "click",

        closeDrawer

    );

}
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

    window.currentMap =
        data;

    if (window.hidePopup) {

        window.hidePopup();

    }

    loading.style.display =
        "block";

    mapFrame.src =
        data.map;

    totalUnit.textContent =
        data.total;

    await loadKML(

        data.kml,

        p,

        z

    );

    loading.style.display =
        "none";

    // ซ่อนผลค้นหาเมื่อเปลี่ยนพื้นที่

    const searchResult =
        document.getElementById("searchResult");

    if (searchResult) {

        searchResult.style.display =
            "none";

    }

    // มือถือปิด Drawer หลังเลือกจังหวัด/โซน

    closeDrawer();

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
// Desktop Resize
// =========================================

window.addEventListener(

    "resize",

    function () {

        if (window.innerWidth > 768) {

            closeDrawer();

        }

    }

);

// =========================================
// Export
// =========================================

window.openDrawer =
    openDrawer;

window.closeDrawer =
    closeDrawer;

// =========================================
// Start
// =========================================

async function startApp(){

    await loadAllLocationsMaster();

    async function startApp() {

    await loadAllLocationsMaster();

    loadProvince();

}

startApp();

    console.log("=================================");

    console.log("GGN MAP V1.4");

    console.log("Responsive Ready");

    console.log("=================================");

}

startApp();