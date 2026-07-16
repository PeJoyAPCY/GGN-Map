// =========================================
// kml.js
// Load KML
// =========================================
let kmlLoaded = false;

async function loadKML(
    filePath,
    province,
    zone,
    clear = false
) {
    if (clear) {

    allLocations = [];

    }

    try {

        console.log(
            "Loading :",
            filePath
        );

        const response =
            await fetch(filePath);

        if (!response.ok) {

            throw new Error(
                response.status
            );

        }

        const text =
            await response.text();

        const xml =
            new DOMParser()

            .parseFromString(

                text,

                "application/xml"

            );

        const parserError =
            xml.querySelector(
                "parsererror"
            );

        if (parserError) {

            console.error(

                parserError.textContent

            );

            return;

        }

        const placemarks =

            Array.from(

                xml.getElementsByTagName("*")

            )

            .filter(node =>

                node.localName ===
                "Placemark"

            );

        console.log(

            "Placemark :",

            placemarks.length

        );

        placemarks.forEach(place => {

            const elements =

                Array.from(

                    place.getElementsByTagName("*")

                );

            const getNode = name =>

                elements.find(

                    item =>

                        item.localName === name

                );

            const coordNode =
                getNode("coordinates");

            if (!coordNode)
                return;

            const coords =
                coordNode.textContent

                    .trim()

                    .split(",");

            if (coords.length < 2)
                return;

            const lat =
                parseFloat(coords[1]);

            const lng =
                parseFloat(coords[0]);

            if (

                isNaN(lat) ||

                isNaN(lng)

            ) return;

            allLocations.push({

                id:
                    province + "_" +
                    zone + "_" +
                    lat + "_" +
                    lng,

                name:

                    getNode("name")
                        ?.textContent
                        .trim()

                    || "",

                description:

                    getNode("description")
                        ?.textContent
                        .trim()

                    || "",

                lat,

                lng,

                province,

                zone

            });

        });

        console.log(

            "Total :",

            allLocations.length

        );

        const totalUnit =

            document.getElementById(

                "totalUnit"

            );

        if (totalUnit) {

            totalUnit.textContent =

                allLocations.length;

        }

        if (searchResult) {

            searchResult.innerHTML =

                '<p class="empty">พิมพ์ชื่อหน่วยงานเพื่อค้นหา</p>';

            searchResult.style.display =

                "none";

        }

    }

    catch (error) {

        console.error(error);

        if (searchResult) {

            searchResult.innerHTML =

                '<p class="empty">โหลดข้อมูลไม่สำเร็จ</p>';

        }

    }

}

// =========================================
// Load All KML
// =========================================

async function loadAllKML(force = false) {
      
        if(kmlLoaded){

        return;

        }

    allLocations = [];

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

    console.log(

        "โหลด KML ทั้งหมด",

        allLocations.length,

        "รายการ"

    );
    
    kmlLoaded = true;

}

// =========================================
// Export
// =========================================

window.loadKML = loadKML;
window.loadAllKML = loadAllKML;