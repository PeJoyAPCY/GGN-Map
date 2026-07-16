// =========================================
// script.js
// GGN MAP V2
// =========================================
let allPlaces = [];

let allLocations = [];

let masterLocations = [];

let currentResults = [];

let selectedLocation = null;

async function loadAllPlaces(){

    masterLocations = [];

    for(let province in maps){

        for(let zone in maps[province]){

            const kmlFile = maps[province][zone].kml;

            try{

                const response = await fetch(kmlFile);

                const text = await response.text();

                const xml = new DOMParser()
                    .parseFromString(text,"text/xml");

                const placemarks =
                    xml.getElementsByTagName("Placemark");

                for(let p of placemarks){

                    const name =
                        p.getElementsByTagName("name")[0]
                        ?.textContent || "";

                    const description =
                        p.getElementsByTagName("description")[0]?.textContent || "";

                    const coordinates =
                        p.getElementsByTagName("coordinates")[0]?.textContent || "";

                    const coord = coordinates.split(",");

                    masterLocations.push({
                        name:name,
                        description:description,
                        province:province,
                        zone:zone,
                        lat:parseFloat(coord[1]),
                        lng:parseFloat(coord[0]),
                        coordinates:coordinates
                    });

                }

            }catch(err){

                console.log(err);

            }

        }

    }

    console.log(masterLocations);

}

// =========================================
// Init
// =========================================

(async()=>{
await loadAllPlaces();
initPopup();
initSearch();
})();

console.log("=================================");

console.log("GGN MAP V2");

console.log("Modules Loaded");

console.log("=================================");