import { NextResponse } from "next/server";

export async function GET() {

  const API_URL =
    "https://tourism.opendatahub.com/v1/MetaData?pagesize=2500&pagenumber=1&language=en";

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

    const apis = data.Items.map((item) => {
      return {
        id: item.Id,
        url: item.ApiUrl,
        title: item.Shortname
      };
    });

    return NextResponse.json(apis);

  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tourism data" },
      { status: 500 },
    );
  }
}
