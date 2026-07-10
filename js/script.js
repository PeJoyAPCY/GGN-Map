// =========================================
// GGN MAP V2
// script.js
// ระบบค้นหาหน่วยงาน
// =========================================

let allLocations = [];

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

// =========================================
// โหลดข้อมูล KML
// =========================================

async function loadKML(filePath, province, zone) {

    allLocations = [];

    if (searchInput) {

        searchInput.value = "";

    }

    if (searchResult) {

        searchResult.innerHTML =
            '<p class="empty">กำลังโหลดข้อมูล...</p>';

    }

    try {

        console.log("Loading :", filePath);

        const response = await fetch(filePath);

        if (!response.ok) {

            throw new Error(response.status);

        }

        const text = await response.text();

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

        const placemarks =
            Array.from(
                xml.getElementsByTagName("*")
            ).filter(node =>
                node.localName === "Placemark"
            );

        console.log("KML Loaded");
        console.log(placemarks.length);

        for (const place of placemarks) {

            const elements =
                Array.from(
                    place.getElementsByTagName("*")
                );

            const nameNode =
                elements.find(node =>
                    node.localName === "name"
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
            ) continue;

            allLocations.push({

                name,

                lat,

                lng,

                province,

                zone

            });

        }

        console.log(
            "Total :",
            allLocations.length
        );

        const totalUnit = document.getElementById("totalUnit");

            if (totalUnit) {
            totalUnit.textContent = allLocations.length;

        }

        if (searchResult) {

            searchResult.innerHTML =
                '<p class="empty">พิมพ์ชื่อหน่วยงานเพื่อค้นหา</p>';

        }

    } catch (error) {

        console.error(error);

        if (searchResult) {

            searchResult.innerHTML =
                '<p class="empty">โหลดข้อมูลไม่สำเร็จ</p>';

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

    if (keyword === "") {

        searchResult.innerHTML =
            '<p class="empty">พิมพ์ชื่อหน่วยงานเพื่อค้นหา</p>';

        return;

    }

    const results = allLocations.filter(item => {

            return (item.name || "")
                .toLowerCase()
                .includes(keyword);

    });

    if (results.length === 0) {

        searchResult.innerHTML = `

            <p class="empty">

                ไม่พบข้อมูล

            </p>

        `;

        return;

    }

    let html = "";

    html += `

        <div class="result-count">

            พบ ${results.length} รายการ

        </div>

    `;

    results.forEach(item => {

        html += `

        <div
            class="result-item"
            data-lat="${item.lat}"
            data-lng="${item.lng}">

            <strong>

                ${item.name}

            </strong>

            <br>

            <small>

                จังหวัด :
                ${item.province}

                |

                โซน :
                ${item.zone}

            </small>

        </div>

        `;

    });

    searchResult.innerHTML = html;

    document

        .querySelectorAll(".result-item")

        .forEach(item => {

            item.addEventListener(

                "click",

                function () {

                    const lat =
                        this.dataset.lat;

                    const lng =
                        this.dataset.lng;

                    window.open(

                        `https://www.google.com/maps?q=${lat},${lng}`,

                        "_blank"

                    );

                }

            );

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

            searchResult.innerHTML =
                '<p class="empty">พิมพ์ชื่อหน่วยงานเพื่อค้นหา</p>';

            searchInput.focus();

        }
    );

}

// =========================================
// Export
// =========================================

window.loadKML = loadKML;
window.searchLocation = searchLocation;

console.log("=================================");
console.log("GGN MAP V2");
console.log("Search System Ready");
console.log("Locations :", allLocations.length);
console.log("=================================");