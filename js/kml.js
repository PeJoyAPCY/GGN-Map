
/* =========================================
   GGN MAP - KML LOADER
   VERSION: 2.0.0
   =========================================

   CHANGE:
   - โหลด KML ล่าสุดจาก Google My Maps ก่อน
   - ใช้ forcekml=true เพื่อขอข้อมูล KML
   - ใช้ไฟล์ KML ในโปรเจกต์เป็น fallback
   - คงโครงสร้าง allLocations เดิม
   - รองรับการโหลดใหม่ด้วย loadAllKML(true)
   - ไม่แก้ระบบ Search / Popup / Zoom

========================================= */

let kmlLoaded = false;


// =========================================
// GET ONLINE KML URL
// =========================================

function getOnlineKMLUrl(province, zone) {
    const mapData = maps?.[province]?.[zone];

    if (!mapData?.map) {
        throw new Error(
            `ไม่พบ URL แผนที่: ${province} / ${zone}`
        );
    }

    const mapUrl = new URL(
        mapData.map,
        window.location.href
    );

    const mid = mapUrl.searchParams.get("mid");

    if (!mid) {
        throw new Error(
            `ไม่พบ Map ID: ${province} / ${zone}`
        );
    }

    return (
        "https://www.google.com/maps/d/kml?mid=" +
        encodeURIComponent(mid) +
        "&forcekml=true"
    );
}


// =========================================
// PARSE KML XML
// =========================================

function parseKMLText(text, province, zone) {
    const xml = new DOMParser().parseFromString(
        text,
        "application/xml"
    );

    const parserError = xml.querySelector("parsererror");

    if (parserError) {
        throw new Error("รูปแบบ XML ไม่ถูกต้อง");
    }

    if (xml.documentElement?.localName !== "kml") {
        throw new Error("ข้อมูลที่ได้รับไม่ใช่ KML");
    }

    const placemarks = Array.from(
        xml.getElementsByTagName("*")
    ).filter(node => node.localName === "Placemark");

    if (placemarks.length === 0) {
        throw new Error("ไม่พบ Placemark ใน KML");
    }

    const locations = [];

    placemarks.forEach(place => {
        const elements = Array.from(
            place.getElementsByTagName("*")
        );

        const getNode = name =>
            elements.find(item => item.localName === name);

        const coordNode = getNode("coordinates");

        if (!coordNode) return;

        // รองรับพิกัดที่มีช่องว่างหรือขึ้นบรรทัดใหม่
        const coordinateText = coordNode.textContent.trim();
        const firstCoordinate = coordinateText.split(/\s+/)[0];

        const coords = firstCoordinate.split(",");

        if (coords.length < 2) return;

        const lng = parseFloat(coords[0]);
        const lat = parseFloat(coords[1]);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            return;
        }

        locations.push({
            id: province + "_" + zone + "_" + lat + "_" + lng,
            name: getNode("name")?.textContent.trim() || "",
            description:
                getNode("description")?.textContent.trim() || "",
            lat,
            lng,
            province,
            zone
        });
    });

    if (locations.length === 0) {
        throw new Error("ไม่พบข้อมูลพิกัดที่ใช้งานได้");
    }

    return locations;
}


// =========================================
// FETCH AND PARSE KML
// =========================================

async function fetchKML(url, province, zone) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("HTTP " + response.status);
    }

    const contentType =
        response.headers.get("content-type") || "";

    if (
        contentType.includes("application/vnd.google-earth.kmz") ||
        contentType.includes("application/zip")
    ) {
        throw new Error(
            "ได้รับ KMZ แทน KML ที่อ่านได้โดยตรง"
        );
    }

    const text = await response.text();

    return parseKMLText(text, province, zone);
}

//load KML for a specific province and zone

async function loadKML(
    filePath,
    province,
    zone,
    clear = false
) {
    if (clear) {
        allLocations = [];
    }

    console.log(
        `[GGN Map] กำลังโหลดออนไลน์ ${province} / ${zone}`
    );

    try {
        const onlineUrl = getOnlineKMLUrl(
            province,
            zone
        );

        const locations = await fetchKML(
            onlineUrl,
            province,
            zone
        );

        allLocations.push(...locations);

        console.log(
            `[GGN Map] Online OK: ${province} / ${zone}`,
            locations.length,
            "จุด"
        );

        return locations.length;

    } catch (error) {
        console.error(
            `[GGN Map] โหลดออนไลน์ไม่สำเร็จ: ${province} / ${zone}`,
            error
        );

        return 0;
    }
}


// =========================================
// LOAD ALL MAPS
// =========================================

async function loadAllKML(force = false) {
    if (kmlLoaded && !force) {
        return;
    }

    allLocations = [];
    kmlLoaded = false;

    const jobs = [];

    for (const province in maps) {
        for (const zone in maps[province]) {
            const data = maps[province][zone];

            jobs.push(
                loadKML(
                    data.kml,
                    province,
                    zone,
                    false
                )
            );
        }
    }

    await Promise.all(jobs);

    const totalUnit = document.getElementById("totalUnit");

    if (totalUnit) {
        totalUnit.textContent = allLocations.length;
    }

    if (typeof searchResult !== "undefined" && searchResult) {
        searchResult.innerHTML =
            '<p class="empty">พิมพ์ชื่อหน่วยงานเพื่อค้นหา</p>';

        searchResult.style.display = "none";
    }

    kmlLoaded = true;

    console.log(
        "[GGN Map] โหลดข้อมูลเสร็จสิ้น:",
        allLocations.length,
        "จุด"
    );
}


// =========================================
// GLOBAL EXPORTS
// =========================================

window.loadKML = loadKML;
window.loadAllKML = loadAllKML;