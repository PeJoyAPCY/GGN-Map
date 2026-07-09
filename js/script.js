// ======================================
// GGN Operations Map
// script.js
// ระบบค้นหาหน่วยงานจากไฟล์ KML
// ======================================

let allLocations = [];

const searchInput = document.getElementById("searchInput");
const searchResult = document.getElementById("searchResult");

// ======================================
// โหลดข้อมูล KML
// ======================================

async function loadKML(filePath, province, zone) {

    console.log("กำลังโหลด KML :", filePath);

    allLocations = [];

    try {

        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`โหลดไฟล์ไม่สำเร็จ (${response.status})`);
        }

        const text = await response.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");

        const placemarks = xml.getElementsByTagName("Placemark");

        for (let p of placemarks) {

            const name =
                p.getElementsByTagName("name")[0]?.textContent.trim() || "";

            const coord =
                p.getElementsByTagName("coordinates")[0]?.textContent.trim();

            if (!coord) continue;

            const parts = coord.split(",");

            const lng = parseFloat(parts[0]);
            const lat = parseFloat(parts[1]);

            allLocations.push({
                name,
                lat,
                lng,
                province,
                zone
            });
        }

        console.log("โหลด KML สำเร็จ");
        console.log("จำนวนข้อมูล :", allLocations.length);
        console.table(allLocations);

    } catch (err) {

        console.error("โหลด KML ไม่สำเร็จ :", err);

    }
}

// ======================================
// ค้นหา
// ======================================

function searchLocation() {

    const keyword = searchInput.value.trim().toLowerCase();

    if (!keyword) {

        searchResult.innerHTML = "";
        return;

    }

    const results = allLocations.filter(item =>
        item.name.toLowerCase().includes(keyword)
    );

    if (results.length === 0) {

        searchResult.innerHTML = `
            <div class="result-item">
                ไม่พบข้อมูล
            </div>
        `;
        return;
    }

    searchResult.innerHTML = "";

    results.forEach(item => {

        const div = document.createElement("div");

        div.className = "result-item";

        div.innerHTML = `
            <strong>${item.name}</strong><br>
            ${item.province} ${item.zone}
        `;

        div.onclick = () => {

            map.setCenter({
                lat: item.lat,
                lng: item.lng
            });

            map.setZoom(17);

            searchResult.innerHTML = "";
            searchInput.value = "";

        };

        searchResult.appendChild(div);

    });

}

// ======================================
// Event
// ======================================

searchInput.addEventListener("input", searchLocation);

console.log("GGN Search Ready");