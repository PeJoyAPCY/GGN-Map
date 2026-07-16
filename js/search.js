// =========================================
// GGN Operations Map
// search.js
// ระบบค้นหาทั่วประเทศ
// =========================================

let currentResults = [];

const searchInput =
    document.getElementById("searchInput");

const searchResult =
    document.getElementById("searchResult");

const searchBtn =
    document.getElementById("searchBtn");

const clearBtn =
    document.getElementById("clearSearch");

// =========================================
// ค้นหา
// =========================================

function performSearch() {

    const keyword =
        searchInput.value
        .trim()
        .toLowerCase();

    searchResult.innerHTML = "";

    if (!keyword) {

        currentResults = [];

        return;

    }

    currentResults =
        masterLocations.filter(item => {

            return (

                item.name
                .toLowerCase()
                .includes(keyword)

                ||

                item.description
                .toLowerCase()
                .includes(keyword)

            );

        });

    renderResults();

}

// =========================================
// แสดงผลลัพธ์
// =========================================

function renderResults() {

    if (currentResults.length === 0) {

        searchResult.innerHTML =

        `<div class="no-result">

            ไม่พบข้อมูล

        </div>`;

        return;

    }

    let html =

    `<div class="result-count">

        พบ ${currentResults.length} รายการ

    </div>`;

    currentResults.forEach((item,index)=>{

        html +=

        `

        <div

            class="result-item"

            data-index="${index}"

        >

            <div class="result-title">

                ${item.name}

            </div>

            <div class="result-location">

                ${item.province}

                |

                ${item.zone}

            </div>

        </div>

        `;

    });

    searchResult.innerHTML = html;

    document
    .querySelectorAll(".result-item")
    .forEach(item=>{

        item.addEventListener(

            "click",

            resultClick

        );

    });

}

// =========================================
// คลิกผลลัพธ์
// =========================================

function resultClick(e){

    const index =
        e.currentTarget.dataset.index;

    const item =
        currentResults[index];

    zoomToLocation(item);

    showPopup(item);

}

// =========================================
// Zoom Google My Map
// =========================================

function zoomToLocation(item){

    if(!window.currentMap)
        return;

    const url =
        new URL(window.currentMap.map);

    url.searchParams.set(

        "ll",

        `${item.lat},${item.lng}`

    );

    url.searchParams.set(

        "z",

        "17"

    );

    mapFrame.src =
        url.toString();

}

// =========================================
// ล้างการค้นหา
// =========================================

function clearSearch(){

    searchInput.value="";

    currentResults=[];

    searchResult.innerHTML="";

}

// =========================================
// Event
// =========================================

function initSearch(){

    searchInput.addEventListener(

        "input",

        performSearch

    );

    searchInput.addEventListener(

        "keypress",

        e=>{

            if(e.key==="Enter")

                performSearch();

        }

    );

    if(searchBtn){

        searchBtn.addEventListener(

            "click",

            performSearch

        );

    }

    if(clearBtn){

        clearBtn.addEventListener(

            "click",

            clearSearch

        );

    }

}