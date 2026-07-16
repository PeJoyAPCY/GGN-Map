// =========================================
// GGN Operations Map
// kml.js
// โหลดข้อมูล KML ทั้งหมด
// =========================================

let masterLocations = [];

// โหลด KML 1 ไฟล์
async function loadKML(filePath, province, zone) {

    try {

        const response = await fetch(filePath);

        if (!response.ok) {

            throw new Error(filePath);

        }

        const text = await response.text();

        const xml =
            new DOMParser().parseFromString(
                text,
                "text/xml"
            );

        if (xml.querySelector("parsererror")) {

            console.error("KML Parse Error :", filePath);

            return;

        }

        const placemarks =
            xml.getElementsByTagName("Placemark");

        for (const place of placemarks) {

            const name =
                place.getElementsByTagName("name")[0]
                ?.textContent
                ?.trim() || "";

            const description =
                place.getElementsByTagName("description")[0]
                ?.textContent
                ?.trim() || "";

            const coordinateText =
                place.getElementsByTagName("coordinates")[0]
                ?.textContent
                ?.trim() || "";

            if (!coordinateText)
                continue;

            const coord =
                coordinateText.split(",");

            const lng =
                parseFloat(coord[0]);

            const lat =
                parseFloat(coord[1]);

            masterLocations.push({

                name,

                description,

                province,

                zone,

                lat,

                lng,

                coordinates: coordinateText

            });

        }

        console.log(
            province,
            zone,
            placemarks.length,
            "Locations Loaded"
        );

    }

    catch (err) {

        console.error(
            "Load Error :",
            filePath,
            err
        );

    }

}

// โหลดทุกจังหวัด
async function loadAllPlaces() {

    masterLocations = [];

    for (const province in maps) {

        for (const zone in maps[province]) {

            const item =
                maps[province][zone];

            await loadKML(

                item.kml,

                province,

                zone

            );

        }

    }

    console.log(

        "Total :",

        masterLocations.length,

        "Locations"

    );

}