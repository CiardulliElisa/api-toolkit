"use client";

import React, { useRef, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";

const Map = ({ locations }) => {

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [zoom] = useState(10);

  // Initialize the map skeleton (runs once on mount)
  useEffect(() => {

    // If the div isn't ready or map already exists, do nothing
    if (!mapContainer.current || map.current) return;

    // Create the map instance
    map.current = new L.Map(mapContainer.current, {
      center: [20, 0],
      zoom: 2,
    });

    // Add style to map
    new MaptilerLayer({
      apiKey: "sM7PRFpW3UrpaMixCLPu",
      style: "basic",
    }).addTo(map.current);

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Handle Markers and View Logic: runs whenever 'locations' array changes
  useEffect(() => {
    
    // Wait until the map is initialized
    if (!map.current) return;

    // Clear existing markers before adding new ones
    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.current.removeLayer(layer);
      }
    });

    // If no locations provided, the map stays empty but visible.
    if (!locations || locations.length === 0) return;

    // Custom marker
    const customIcon = L.divIcon({
      html: '<span style="font-size: 30px; text-shadow: 2px 2px 5px rgba(0,0,0,0.3);">📍</span>',
      className: "customIcon",
      iconAnchor: [15, 30], // Centers the tip of the pin
    });

    const points = [];

    // Add marker for each location
    locations.forEach((loc) => {
      if (loc.coords?.lat && loc.coords?.lng) {
        L.marker([loc.coords.lat, loc.coords.lng], { icon: customIcon }).addTo(
          map.current,
        );
        // Save all coordinates to calculate map bounds later
        points.push([loc.coords.lat, loc.coords.lng]);
      }
    });

    // Calculate bounds to zoom into map correctly
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.current.fitBounds(bounds, {
        padding: [50, 50],
        animate: true,
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
