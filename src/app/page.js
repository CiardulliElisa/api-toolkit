"use client";

import dynamic from "next/dynamic";
import { Card, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";

const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
});

export default function Home() {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
   fetch("/api/data")
     .then((response) => response.json())
     .then((data) => {
       setLocations(data);
       setIsLoading(false);
     })
     .catch(() => setIsLoading(false));
 }, []);

  return (
    <main className="w-screen h-screen bg-gray-100 p-10 flex justify-center">
      <Card className="h-full shadow-xl overflow-hidden w-full">
        <Card.Body className="p-0 flex flex-col h-full p-2">
          <div className="p-4 bg-white border-b">
            <Card.Title className="text-center m-0 text-gray-700">
              Api Title
            </Card.Title>
          </div>
          <div className="flex-grow relative w-full bg-gray-200">
            <Map locations={locations} />
            {isLoading && (
              <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm transition-opacity">
                <Spinner
                  animation="border"
                  variant="black"
                  role="status"
                  className="mb-3"
                >
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="text-black-600 font-semibold animate-pulse">
                  Fetching Data...
                </p>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </main>
  );
}
