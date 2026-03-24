import { NextResponse } from "next/server";

export async function GET() {

  const API_URL =
    "https://tourism.opendatahub.com/v1/Accommodation?pagesize=250&pagenumber=1&language=en";

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
      return {
        id: item.Id,
        coords: {
          lat: item.Latitude || 0,
          lng: item.Longitude || 0,
        },
      };
    });

    return NextResponse.json(locations);

  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tourism data" },
      { status: 500 },
    );
  }
}
