import { NextResponse } from "next/server";

export async function GET() {
  const locationData = {
    name: "NOI Techpark",
    address: "Via Alessandro Volta, 13A",
    city: "Bolzano",
    coords: {
      lat: 46.4777,
      lng: 11.3303,
    },
  };

  return NextResponse.json(locationData);
}