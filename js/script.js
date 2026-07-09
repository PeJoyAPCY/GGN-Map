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

async function loadKML(filePath, province, zone){

    try{

        const response = await fetch(filePath);

        if(!response.ok){

            throw new Error("ไม่สามารถโหลดไฟล์ KML");

        }

        const text = await response.text();

        const parser = new DOMParser();

        const xml = parser.parseFromString(text,"text/xml");

        const placemarks = xml.getElementsByTagName("Placemark");

        // ล้างข้อมูลเดิม
        allLocations = [];

        for(let i=0;i<placemarks.length;i++){

            const placemark = placemarks[i];

            const name = placemark
                .getElementsByTagName("name")[0]
                ?.textContent
                ?.trim();

            if(!name){

                continue;

            }

            let lat = 0;
            let lng = 0;

            const coordinate = placemark
                .getElementsByTagName("coordinates")[0]
                ?.textContent
                ?.trim();

            if(coordinate){

                const c = coordinate.split(",");

                lng = parseFloat(c[0]);

                lat = parseFloat(c[1]);

            }

            allLocations.push({

                name,
                lat,
                lng,
                province,
                zone

            });

        }

        console.log(
            "โหลด KML สำเร็จ",
            province,
            zone,
            allLocations.length,
            "จุด"
        );

    }
    catch(err){

        console.error(err);

    }

}

// ======================================
// จัดรูปแบบข้อความ
// ======================================

function normalize(text){

    return text
        .toLowerCase()
        .replace(/\s+/g,"")
        .trim();

}

// ======================================
// ไฮไลต์ข้อความ
// ======================================

function highlight(text, keyword){

    if(keyword===""){

        return text;

    }

    const regex = new RegExp(keyword,"ig");

    return text.replace(regex,function(match){

        return `<b>${match}</b>`;

    });

}

// ======================================
// ค้นหา
// ======================================

function searchLocation(){

    const keyword = normalize(searchInput.value);

    searchResult.innerHTML = "";

    if(keyword===""){

        searchResult.style.display="none";

        return;

    }

    let result = allLocations.filter(location=>{

        return normalize(location.name)
            .includes(keyword);

    });

    result.sort((a,b)=>{

        const aa = normalize(a.name).startsWith(keyword);

        const bb = normalize(b.name).startsWith(keyword);

        return bb-aa;

    });

    if(result.length===0){

        searchResult.innerHTML=`

            <div class="empty">

                ไม่พบข้อมูล

            </div>

        `;

        searchResult.style.display="block";

        return;

    }

    const total=document.createElement("div");

    total.className="search-total";

    total.innerHTML=`พบ ${result.length} รายการ`;

    searchResult.appendChild(total);

    result.slice(0,20).forEach(location=>{

        const item=document.createElement("div");

        item.className="search-item";

        item.innerHTML=`

            <div class="item-title">

                📍 ${highlight(location.name,keyword)}

            </div>

            <div class="item-sub">

                ${location.province} • ${location.zone}

            </div>

        `;

        item.onclick=function(){

            moveToLocation(location);

        };

        searchResult.appendChild(item);

    });

    searchResult.style.display="block";

}

// ======================================
// เปิดตำแหน่ง
// ======================================

function moveToLocation(location){

    searchInput.value = location.name;

    searchResult.style.display = "none";

    if(location.lat===0 && location.lng===0){

        alert("ไม่พบพิกัดของจุดนี้");

        return;

    }

    const url=`https://www.google.com/maps?q=${location.lat},${location.lng}`;

    window.open(url,"_blank");

}

// ======================================
// Event
// ======================================

searchInput.addEventListener("input",searchLocation);

searchInput.addEventListener("keydown",function(e){

    if(e.key==="Enter"){

        e.preventDefault();

        const keyword=normalize(searchInput.value);

        const result=allLocations.filter(location=>{

            return normalize(location.name)
                .includes(keyword);

        });

        if(result.length){

            moveToLocation(result[0]);

        }

    }

    if(e.key==="Escape"){

        searchResult.style.display="none";

    }

});

// คลิกนอกพื้นที่ให้ปิดผลค้นหา
document.addEventListener("click",function(e){

    if(
        !searchResult.contains(e.target) &&
        e.target!==searchInput
    ){

        searchResult.style.display="none";

    }

});

console.log("GGN Search Ready");