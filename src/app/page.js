"use client";

import dynamic from "next/dynamic";
import { Card } from "react-bootstrap";
import { useState, useEffect } from "react";

const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
});

export default function Home() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    fetch("/api/data")
      .then((response) => response.json())
      .then((data) => {
        setLocation(data);
      });
  }, []);

  if (!location) {
    return <div className="p-10 text-center">Loading Bolzano Data...</div>;
  }

  return (
    <main className="w-screen h-screen bg-gray-100 p-10 flex justify-center">
      <Card className="h-full shadow-xl overflow-hidden w-full">
        <Card.Body className="p-0 flex flex-col h-full p-2">
          <div className="p-4 bg-white border-b">
            <Card.Title className="text-center m-0">
              {location.name} - {location.city}
            </Card.Title>
          </div>
          <div className="flex-grow relative w-full bg-gray-200">
            <Map latlng={location.coords} />
          </div>
        </Card.Body>
      </Card>
    </main>
  );
}
