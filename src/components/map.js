"use client";

import React, { useRef, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

import L from "leaflet";

import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";

const Map = ({ locations }) => {

  /* delete L.Icon.Default.prototype._getIconUrl;
  
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  }); */

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [zoom] = useState(10);

  useEffect(() => {
    
    if (
      !locations ||
      locations.length === 0 ||
      map.current ||
      !mapContainer.current
    )
      return;

    const firstLocation = locations[0].coords;

    map.current = new L.Map(mapContainer.current, {
      center: L.latLng(firstLocation.lat, firstLocation.lng),
      zoom: zoom,
    });

    new MaptilerLayer({
      apiKey: "sM7PRFpW3UrpaMixCLPu",
      style: "basic",
    }).addTo(map.current);

    const customIcon = L.divIcon({
      html: '<span style="font-size: 30px;">📍</span>',
      className: "customIcon",
      iconAnchor: [15, 30],
    });

    const points = [];

    locations.forEach((loc) => {
      L.marker([loc.coords.lat, loc.coords.lng], { icon: customIcon }).addTo(
        map.current,
      );
      points.push([loc.coords.lat, loc.coords.lng]);
    });

    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.current.fitBounds(bounds, {
        padding: [50, 50],
      });
    }

  }, [locations]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default Map;