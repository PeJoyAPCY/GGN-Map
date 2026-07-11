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

            const descriptionNode =
                elements.find(node =>
                node.localName === "description"
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

            const description =
                descriptionNode
                ? descriptionNode.textContent.trim()
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

                description,

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
        console.log(allLocations[0]);

        const totalUnit = document.getElementById("totalUnit");

            if (totalUnit) {
            totalUnit.textContent = allLocations.length;

        }

        if (searchResult) {

        searchResult.innerHTML =
            '<p class="empty">พิมพ์ชื่อหน่วยงานเพื่อค้นหา</p>';

        searchResult.style.display = "none";

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

        searchResult.style.display = "none";

        return;

    }

    const results = allLocations.filter(item => {

        const name =
            (item.name || "").toLowerCase();

        const description =
            (item.description || "").toLowerCase();

        return (
            name.includes(keyword) ||
            description.includes(keyword)
        );

    });

    console.log("Keyword =", keyword);
    console.log("Locations =", allLocations.length);
    console.log("Results =", results);

    if (results.length === 0) {

        searchResult.innerHTML = `

            <p class="empty">

                ไม่พบข้อมูล

            </p>

        `;
        searchResult.style.display = "block";

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
                class="result-item active"
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

                <div class="result-description">
                    ${item.description || ""}
                </div>

            </div>

            `;

        });

    searchResult.innerHTML = html;
    searchResult.style.display = "block";

    // =========================================
// Event เมื่อคลิกผลการค้นหา
// =========================================

    document
        .querySelectorAll(".result-item")
            .forEach(item => {

                item.addEventListener("click", function () {

                    // -------------------------------
                    // ไฮไลต์รายการที่เลือก
                    // -------------------------------

                    document
                        .querySelectorAll(".result-item")
                        .forEach(result => {

                            result.classList.remove("active");

                        });

                    this.classList.add("active");

                    // -------------------------------
                    // อ่านค่าพิกัด
                    // -------------------------------

                    const lat = this.dataset.lat;
                    const lng = this.dataset.lng;

                    console.log("Latitude :", lat);
                    console.log("Longitude:", lng);

                    // -------------------------------
                    // ตรวจสอบว่าเลือกจังหวัด/โซนแล้วหรือยัง
                    // -------------------------------

                    if (!window.currentMap) {

                        alert("กรุณาเลือกจังหวัดและโซนก่อน");

                        return;

                    }

                    // -------------------------------
                    // สร้าง URL ใหม่ของ Google My Maps
                    // -------------------------------

                    const url = new URL(window.currentMap.map);

                    url.searchParams.set(
                        "ll",
                        `${lat},${lng}`
                    );

                    url.searchParams.set(
                        "z",
                        "17"
                    );

                    console.log("Open Map :", url.toString());

                    // -------------------------------
                    // แสดง Loading
                    // -------------------------------

                    window.loading.style.display = "block";

                    // -------------------------------
                    // เมื่อแผนที่โหลดเสร็จ
                    // -------------------------------

                    window.mapFrame.onload = () => {

                        window.loading.style.display = "none";

                        // เลื่อนหน้าจอไปที่แผนที่

                        window.mapFrame.scrollIntoView({

                            behavior: "smooth",

                            block: "center"

                        });

                    };

                    // -------------------------------
                    // โหลดแผนที่
                    // -------------------------------

                    window.mapFrame.src = url.toString();

                });

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

            searchResult.style.display = "none";

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