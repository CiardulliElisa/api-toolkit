"use client";

import dynamic from "next/dynamic";
import { Card, Spinner, Dropdown } from "react-bootstrap";
import { useState, useEffect } from "react";

const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
});

export default function Home() {
  const [locations, setLocations] = useState([]);
  const [apis, setApis] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedApi, setSelectedApi] = useState("Select an API...");

  const handleApiSelect = (api) => {
    setSelectedApi(api.title);
    setIsLoading(true);
    const fetchUrl = `/api/data?url=${api.url}`;
    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        setLocations(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Data fetch error:", err);
        setLocations([]);
        setIsLoading(false);
      });
  };

  /* Fetch apis to fill the dropdown menu */
  useEffect(() => {
    fetch("/api/metadata")
      .then((response) => response.json())
      .then((data) => {
        setApis(data);
      });
  }, []);

  return (
    <main className="w-screen h-screen bg-gray-100 p-10 flex justify-center">
      {/* Card containing the map tool */}
      <Card className="h-full shadow-xl overflow-hidden w-full">
        <Card.Body className="p-0 flex flex-col h-full p-2 justify-center items-center">
          <div className="p-4 bg-white border-b">
            {/* Dropdown to pick the API to analyse */}
            <Dropdown className="w-auto">
              <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                {selectedApi}
              </Dropdown.Toggle>
              <Dropdown.Menu className="max-h-60 overflow-y-auto">
                {apis.length === 0 ? (
                  <Dropdown.Item disabled>APIs Loading</Dropdown.Item>
                ) : (
                  apis.map((api) => (
                    <Dropdown.Item
                      key={api.id}
                      onClick={() => handleApiSelect(api)}
                    >
                      {api.title}
                    </Dropdown.Item>
                  ))
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="flex-grow relative w-full">
            <Map locations={locations || []} />
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
