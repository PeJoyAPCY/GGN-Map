// =========================================
// search.js V2
// Global Search
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

        currentResults = [];

        searchResult.innerHTML =
            '<p class="empty">พิมพ์ชื่อหน่วยงานเพื่อค้นหา</p>';

        searchResult.style.display =
            "none";

        if (window.hidePopup) {

            hidePopup();

        }

        return;

    }

    currentResults = allLocations.filter(item => {

        if (item.searchText) {

            return item.searchText.includes(keyword);

        }

        return (

            ((item.name || "") +

                " " +

                (item.description || ""))

            .toLowerCase()

            .includes(keyword)

        );

    });

    currentResults.sort((a, b) => {

        if (a.province !== b.province) {

            return a.province.localeCompare(

                b.province,

                "th"

            );

        }

        if (a.zone !== b.zone) {

            return a.zone.localeCompare(

                b.zone,

                "th"

            );

        }

        return a.name.localeCompare(

            b.name,

            "th"

        );

    });

    renderSearchResult();

}

// =========================================
// Render Result
// =========================================

function renderSearchResult() {

    if (!searchResult)
        return;

    if (currentResults.length === 0) {

        searchResult.innerHTML =

            '<p class="empty">ไม่พบข้อมูล</p>';

        searchResult.style.display =

            "block";

        if (window.hidePopup) {

            hidePopup();

        }

        return;

    }

    let html = `

        <div class="result-count">

            พบ ${currentResults.length} รายการ

        </div>

    `;

    currentResults.forEach((item, index) => {

        html += `

            <div
                class="result-item"
                data-index="${index}">

                <div class="result-title">

                    ${item.name}

                </div>

                <div class="result-sub">

                    📍 ${item.province}

                    |

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
// Select Location
// =========================================

async function selectLocation(item) {

    if (!item)
        return;

    selectedLocation = item;

    try {

        loading.style.display = "block";

        // เปลี่ยนจังหวัด/โซน
        const ok = await changeMap(

            item.province,

            item.zone

        );

            if (!ok) {

                return;

        }

        await zoomToLocation(item);

    }

    catch (error) {

        console.error(

            "Select Location Error",

            error

        );

        loading.style.display =
            "none";

    }

}

// =========================================
// Click Result
// =========================================

function bindSearchResult() {

    document

        .querySelectorAll(

            ".result-item"

        )

        .forEach(element => {

            element.onclick = async function () {

                document

                    .querySelectorAll(

                        ".result-item"

                    )

                    .forEach(item => {

                        item.classList.remove(

                            "active"

                        );

                    });

                this.classList.add(

                    "active"

                );

                const index =

                    Number(

                        this.dataset.index

                    );

                const item =

                    currentResults[index];

                await selectLocation(

                    item

                );

            };

        });

}

// =========================================
// Event
// =========================================

function initSearch() {

    // ปุ่มค้นหา
    if (searchBtn) {

        searchBtn.addEventListener(

            "click",

            searchLocation

        );

    }

    // พิมพ์ค้นหา
    if (searchInput) {

        searchInput.addEventListener(

            "input",

            searchLocation

        );

        searchInput.addEventListener(

            "keydown",

            function (e) {

                if (e.key === "Enter") {

                    e.preventDefault();

                    searchLocation();

                }

                if (e.key === "Escape") {

                    clearSearch();

                }

            }

        );

    }

    // ปุ่มล้าง
    if (clearBtn) {

        clearBtn.addEventListener(

            "click",

            clearSearch

        );

    }

}

// =========================================
// Clear Search
// =========================================

function clearSearch() {

    if (searchInput) {

        searchInput.value = "";

        searchInput.focus();

    }

    currentResults = [];

    selectedLocation = null;

    if (searchResult) {

        searchResult.innerHTML =

            '<p class="empty">พิมพ์ชื่อหน่วยงานเพื่อค้นหา</p>';

        searchResult.style.display =

            "none";

    }

    if (window.hidePopup) {

        hidePopup();

    }

    document

        .querySelectorAll(".result-item")

        .forEach(item => {

            item.classList.remove("active");

        });

}

// =========================================
// Export
// =========================================

window.searchLocation =
    searchLocation;

window.initSearch =
    initSearch;

window.clearSearch =
    clearSearch;

window.selectLocation =
    selectLocation;