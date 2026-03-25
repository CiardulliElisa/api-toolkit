import { NextResponse } from "next/server";

const latRegex = /lat/i;
const lngRegex = /lng|long/i;
const coordValueRegex = /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;

//Check all fields to find where the coordinates are stored
function checkAllFields(obj, coords = { lat: null, lng: null }, prefix = "") {
  Object.entries(obj).forEach(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    // Handle nested objects
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      checkAllFields(value, coords, path);
    }
    // Handle arrays
    else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          checkAllFields(item, coords, `${path}[${index}]`);
        } else {
          processValue(path, item, coords);
        }
      });
    }
    // Handle values
    else {
      processValue(path, value, coords);
    }
  });
  return coords;
}

//Check path for latitude and longitude strings
function processValue(key, value, coords) {
  if (value === null) return;
  const valStr = String(value);
  //Check if value contains a coordinate DD.DDDDDD
  if (coordValueRegex.test(valStr)) {
    if (latRegex.test(key) && !coords.lat) {
      coords.lat = key;
    } else if (lngRegex.test(key) && !coords.lng) {
      coords.lng = key;
    }
  }
}

function getValueByPath(obj, path) {
  if (!path) return null;
  const cleanPath = path.replace(/\[(\d+)\]/g, ".$1");
  return cleanPath.split(".").reduce((acc, part) => {
    return acc && acc[part] !== undefined ? acc[part] : null;
  }, obj);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const API_URL = searchParams.get("url");

  if (!API_URL) {
    return NextResponse.json(
      { error: "URL parameter is missing" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      return NextResponse.json(
        { error: `API Status ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    let recordsArray = null;

    //Find the array of records
    if (Array.isArray(data)) {
      recordsArray = data;
    } else {
      const arrayKey = Object.keys(data).find((key) =>
        Array.isArray(data[key]),
      );
      recordsArray = arrayKey ? data[arrayKey] : null;
    }

    //Check if there are any records
    if (!recordsArray || recordsArray.length === 0) {
      return NextResponse.json(
        { error: "No data records found" },
        { status: 404 },
      );
    }

    // Find the path to the coordinates by using the first record as template
    const coordinatePaths = checkAllFields(recordsArray[0]);

    // Map the records using the discovered coordinates paths
    const locations = recordsArray
      .map((item) => {
        console.log("Coordinate paths: ", coordinatePaths.lat);
        const rawLat = coordinatePaths.lat
          ? getValueByPath(item, coordinatePaths.lat)
          : null;
        console.log("Raw latitude: ", rawLat);
        const rawLng = coordinatePaths.lng
          ? getValueByPath(item, coordinatePaths.lng)
          : null;
        console.log("Raw longitude: ", rawLng);

        return {
          coords: {
            lat: parseFloat(rawLat),
            lng: parseFloat(rawLng),
          },
        };
      })
      .filter((loc) => !isNaN(loc.coords.lat) && !isNaN(loc.coords.lng));
    return NextResponse.json(locations);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch or process data" },
      { status: 500 },
    );
  }
}
