// =========================================
// GGN MAP V2.1
// app.js
// =========================================

// =========================================
// Element
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

window.mapFrame =
    mapFrame;

window.loading =
    loading;

// =========================================
// Mobile Drawer
// =========================================

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

function openDrawer() {

    if (!sidebar)
        return;

    sidebar.classList.add("show");

    if (sidebarOverlay) {

        sidebarOverlay.classList.add("show");

    }

}

function closeDrawer() {

    if (!sidebar)
        return;

    sidebar.classList.remove("show");

    if (sidebarOverlay) {

        sidebarOverlay.classList.remove("show");

    }

}

// =========================================
// Drawer Event
// =========================================

if (menuToggle) {

    menuToggle.addEventListener(

        "click",

        openDrawer

    );

}

if (closeSidebar) {

    closeSidebar.addEventListener(

        "click",

        closeDrawer

    );

}

if (sidebarOverlay) {

    sidebarOverlay.addEventListener(

        "click",

        closeDrawer

    );

}

// =========================================
// Wait Map Loaded
// =========================================

async function waitMapLoaded(url) {

    loading.style.display =
        "block";

    await new Promise(resolve => {

        mapFrame.onload = () => {

            loading.style.display =
                "none";

            resolve();

        };

        mapFrame.src =
            url;

    });

}

// =========================================
// Zoom To Location
// =========================================

async function zoomToLocation(item) {

    if (!window.currentMap)
        return;

    const url = new URL(

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

    await waitMapLoaded(

        url.toString()

    );

    if (window.showPopup) {

        showPopup(item);

    }

    mapFrame.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}

window.zoomToLocation =
    zoomToLocation;

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

    province.selectedIndex = 0;

    renderZone();

    zone.selectedIndex = 0;

    loadMap();

}

// =========================================
// โหลดโซน
// =========================================

function renderZone() {

    const p = province.value;

    zone.innerHTML = "";

    if (!maps[p]) {

        return;

    }

    Object.keys(maps[p]).forEach(name => {

        zone.innerHTML += `

            <option value="${name}">

                ${name}

            </option>

        `;

    });

}

function loadZone() {

    renderZone();

    zone.selectedIndex = 0;

    loadMap();

}

// =========================================
// โหลดแผนที่
// =========================================

async function loadMap() {

    const p = province.value;

    const z = zone.value;

    const data = maps[p]?.[z];

    if (!data) {

        return false;

    }

    window.currentMap = {

        ...data,

        province: p,

        zone: z

    };

    if (window.hidePopup) {

        hidePopup();

    }

    await waitMapLoaded(

        data.map

    );

    if (totalUnit) {

        totalUnit.textContent =

            data.total;

    }

    closeDrawer();

    return true;

}

// =========================================
// Change Map
// =========================================

async function changeMap(

    provinceName,

    zoneName

) {

    if (

        !maps[provinceName] ||

        !maps[provinceName][zoneName]

    ) {

        return false;

    }

    province.value = provinceName;

    renderZone();

    zone.value = zoneName;

    return await loadMap();

}

// =========================================
// Initial
// =========================================

async function init() {

    loading.style.display =

        "block";

    await loadAllKML();

    loadProvince();

}

window.changeMap =
    changeMap;

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

    () => {

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

window.loadProvince =
    loadProvince;

window.renderZone =
    renderZone;

window.loadZone =
    loadZone;

window.loadMap =
    loadMap;

window.changeMap =
    changeMap;

window.waitMapLoaded =
    waitMapLoaded;

window.zoomToLocation =
    zoomToLocation;

// =========================================
// Start
// =========================================

(async function () {

    try {

        console.log("=================================");

        console.log("GGN MAP V2.1");

        console.log("Loading KML...");

        console.log("=================================");

        await init();

        if (window.initSearch) {

            initSearch();

        }

        console.log(

            "KML Loaded :",

            allLocations.length,

            "Locations"

        );

        console.log(

            "GGN MAP Ready"

        );

    }

    catch (error) {

        console.error(

            "Application Start Error",

            error

        );

        if (loading) {

            loading.style.display =
                "none";

        }

    }

})();