import { NextResponse } from "next/server";

export async function GET(request) {

  const { searchParams } = new URL(request.url);
  const API_URL = searchParams.get("url");

  try {

    const response = await fetch(API_URL);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      return NextResponse.json(
        { error: `API Status ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();

    if (!data || !data.Items) {
      console.error("API returned no Items array");
      return NextResponse.json(
        { error: "No data items found" },
        { status: 404 },
      );
    }

    const locations = data.Items.map((item) => {
      const lat =
        item.Latitude ||
        item.GpsInfo?.[0]?.Latitude ||
        item.GpsPoints?.position?.Latitude;

      const lng =
        item.Longitude ||
        item.GpsInfo?.[0]?.Longitude ||
        item.GpsPoints?.position?.Longitude;

      return {
        id: item.Id,
        coords: {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        },
      };
    }).filter((loc) => !isNaN(loc.coords.lat) && !isNaN(loc.coords.lng));

    return NextResponse.json(locations);

  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tourism data" },
      { status: 500 },
    );
  }
}
