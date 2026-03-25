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
  const [hasSearched, setHasSearched] = useState(false);

  const handleApiSelect = (api) => {
    setSelectedApi(api.title);
    setIsLoading(true);
    const fetchUrl = `/api/data?url=${api.url}`;
    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        setLocations(data);
        setIsLoading(false);
        setHasSearched(true)
      })
      .catch((err) => {
        console.error("Data fetch error:", err);
        setLocations([]);
        setIsLoading(false);
        setHasSearched(true)
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
      <Card className="h-full shadow-xl overflow-hidden w-full">
        <Card.Body className="p-0 flex flex-col h-full p-2">
          {/* FIX: Increased z-index and relative positioning for the header */}
          <div className="p-4 bg-white border-b relative z-[2000] flex justify-center w-full">
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

          {/* Map Area */}
          <div className="flex-grow relative w-full">
            <Map locations={locations || []} />

            {/* Loading Spinner (z-1000) */}
            {isLoading && (
              <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
                <Spinner animation="border" variant="black" className="mb-3" />
                <p className="font-semibold animate-pulse">Fetching Data...</p>
              </div>
            )}

            {/* No Data Overlay (z-1001) */}
            {!isLoading && hasSearched && locations.length === 0 && (
              <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                <div className="bg-white p-6 rounded-xl shadow-2xl border text-center max-w-sm mx-4 animate-in fade-in zoom-in">
                  <div className="text-4xl mb-3">📍</div>
                  <h3 className="text-lg font-bold mb-2">No Location Data</h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any valid coordinates in the{" "}
                    <strong>{selectedApi}</strong> dataset.
                  </p>
                  <button
                    onClick={() => setHasSearched(false)}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </main>
  );
}
