// =========================================
// GGN MAP V2
// script.js
// ระบบค้นหาหน่วยงาน
// =========================================

let allLocations = [];

const searchInput = document.getElementById("searchInput");
const searchResult = document.getElementById("searchResult");

// =========================================
// โหลด KML
// =========================================

async function loadKML(filePath, province, zone) {

    allLocations = [];

    searchResult.innerHTML =
        '<p class="empty">กำลังโหลดข้อมูล...</p>';

    try {

        console.log("Loading :", filePath);

        const response = await fetch(filePath);

        if (!response.ok) {

            throw new Error(response.status);

        }

        const text = await response.text();

        const xml = new DOMParser().parseFromString(
            text,
            "text/xml"
        );

        const placemarks =
            xml.getElementsByTagName("Placemark");

        for (const place of placemarks) {

            const nameNode =
                place.getElementsByTagName("name")[0];

            const coordNode =
                place.getElementsByTagName("coordinates")[0];

            if (!coordNode) continue;

            const name =
                nameNode ?
                nameNode.textContent.trim() :
                "";

            const coordinate =
                coordNode.textContent.trim();

            const parts =
                coordinate.split(",");

            const lng =
                parseFloat(parts[0]);

            const lat =
                parseFloat(parts[1]);

            allLocations.push({

                name,

                lat,

                lng,

                province,

                zone

            });

        }

        console.log("KML Loaded");

        console.log(allLocations.length);

        document.getElementById("totalUnit").innerText =
            allLocations.length;

        searchResult.innerHTML =
            '<p class="empty">พิมพ์ชื่อหน่วยงานเพื่อค้นหา</p>';

    }

    catch (error) {

        console.error(error);

        searchResult.innerHTML =
            '<p class="empty">โหลดข้อมูลไม่สำเร็จ</p>';

    }

}
// =========================================
// ค้นหา
// =========================================

function searchLocation() {

    const keyword = searchInput.value
        .trim()
        .toLowerCase();

    if (keyword === "") {

        searchResult.innerHTML =
            '<p class="empty">พิมพ์ชื่อหน่วยงานเพื่อค้นหา</p>';

        return;

    }

    const result = allLocations.filter(item =>
        item.name.toLowerCase().includes(keyword)
    );

    if (result.length === 0) {

        searchResult.innerHTML =
            '<p class="empty">ไม่พบข้อมูล</p>';

        return;

    }

    let html = "";

    result.forEach(item => {

        html += `
        <div class="result-item"
             data-lat="${item.lat}"
             data-lng="${item.lng}">

            <strong>${item.name}</strong><br>

            <small>
                ${item.province}
                ${item.zone}
            </small>

        </div>
        `;

    });

    searchResult.innerHTML = html;

    document
        .querySelectorAll(".result-item")
        .forEach(card => {

            card.onclick = function () {

                const lat =
                    this.dataset.lat;

                const lng =
                    this.dataset.lng;

                window.open(

                    `https://www.google.com/maps?q=${lat},${lng}`,

                    "_blank"

                );

            };

        });

}

// =========================================
// Event
// =========================================

searchInput.addEventListener(

    "input",

    searchLocation

);

console.log("GGN Search Ready");