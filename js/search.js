// =========================================
// search.js
// Search Location
// =========================================

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
// Search
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

        searchResult.style.display =
            "none";

        hidePopup();

        return;

    }

    currentResults =
        allLocationsMaster.filter(item => {

        return (

            (item.name || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (item.description || "")
                .toLowerCase()
                .includes(keyword)

        );

    });

    if (currentResults.length === 0) {

        searchResult.innerHTML =
            '<p class="empty">ไม่พบข้อมูล</p>';

        searchResult.style.display =
            "block";

        hidePopup();

        return;

    }

    let html = `

        <div class="result-count">

            พบ ${currentResults.length} รายการ

        </div>

    `;

    currentResults.forEach(item => {

        html += `

            <div
                class="result-item">

                <div class="result-title">

                    ${item.name}

                </div>

                <div class="result-sub">

                    จังหวัด :

                    ${item.province}

                    |

                    โซน :

                    ${item.zone}

                </div>

            </div>

        `;

    });

    searchResult.innerHTML =
        html;

    searchResult.style.display =
        "block";

    bindSearchResult();

}

// =========================================
// Click Result
// =========================================

function bindSearchResult() {

    document

        .querySelectorAll(".result-item")

        .forEach((element, index) => {

            element.onclick = function () {

                document

                    .querySelectorAll(".result-item")

                    .forEach(item => {

                        item.classList.remove("active");

                    });

                this.classList.add("active");

                const item =
                    currentResults[index];

                selectedLocation =
                    item;

            // เปลี่ยนจังหวัด

                province.value =
                    item.province;

            // โหลดรายการโซนใหม่

                loadZone();

            // เปลี่ยนโซน

                zone.value =
                    item.zone;

            // โหลดแผนที่ของโซนนั้น

                loadMap().then(() => {

                    const mapData =
                        maps[item.province][item.zone];

                    const url =
                        new URL(
                            mapData.map
                        );

                    url.searchParams.set(
                        "ll",
                        `${item.lat},${item.lng}`
                    );

                    url.searchParams.set(
                        "z",
                        "17"
                    );

                    loading.style.display =
                        "block";

                    mapFrame.onload = () => {

                        loading.style.display =
                            "none";

                        mapFrame.scrollIntoView({

                            behavior: "smooth",

                            block: "center"

                        });

                        showPopup(item);

                    };

                    mapFrame.src =
                        url.toString();

            });

}

// =========================================
// Event
// =========================================

function initSearch() {

    if (searchBtn) {

        searchBtn.onclick =
            searchLocation;

    }

    if (searchInput) {

        searchInput.oninput =
            searchLocation;

        searchInput.onkeydown =
            function (e) {

                if (e.key === "Enter") {

                    e.preventDefault();

                    searchLocation();

                }

            };

    }

    if (clearBtn) {

        clearBtn.onclick =
            function () {

                searchInput.value = "";

                currentResults = [];

                selectedLocation = null;

                searchResult.innerHTML =
                    '<p class="empty">พิมพ์ชื่อหน่วยงานเพื่อค้นหา</p>';

                searchResult.style.display =
                    "none";

                hidePopup();

                searchInput.focus();

            };

    }

}

// =========================================
// Export
// =========================================

window.searchLocation =
    searchLocation;

window.initSearch =
    initSearch;

window.loadAllLocations =
    loadAllLocations;