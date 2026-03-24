"use client";

import React, { useRef, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

import L from "leaflet";

import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const center = {
    lng: 11.3303,
    lat: 46.4777
  };
  const [zoom] = useState(12);

  useEffect(() => {
    if (map.current) return;

    map.current = new L.Map(mapContainer.current, {
      center: L.latLng(center.lat, center.lng),
      zoom: zoom,
    });

    const mtLayer = new MaptilerLayer({
      apiKey: "sM7PRFpW3UrpaMixCLPu",
    }).addTo(map.current);
    
  }, [center.lng, center.lat, zoom]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default Map;