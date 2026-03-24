"use client";

import React, { useRef, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

import L from "leaflet";

import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";

const Map = ({ latlng }) => {

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
  const [zoom] = useState(15);

  useEffect(() => {
    if (map.current) return;

    map.current = new L.Map(mapContainer.current, {
      center: L.latLng(latlng.lat, latlng.lng),
      zoom: zoom,
    });

    const mtLayer = new MaptilerLayer({
      apiKey: "sM7PRFpW3UrpaMixCLPu",
      style: "basic",
    }).addTo(map.current);

    const customIcon = L.divIcon({
      html: '<span style="font-size: 30px;">📍</span>',
      className: "customIcon",
      iconAnchor: [12, 24],
    });

    L.marker([latlng.lat, latlng.lng], { icon: customIcon }).addTo(map.current);

    /* L.marker([latlng.lat, latlng.lng]).addTo(map.current); */

  }, [latlng]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default Map;