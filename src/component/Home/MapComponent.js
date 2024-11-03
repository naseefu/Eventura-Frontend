import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "80%",
  height: "350px",
  borderRadius: "15px",
  overflow: "hidden",
  marginTop:"30px"
};

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

function MapComponent({ placeName }) {
  const [places, setPlaces] = useState([]);
  
  useEffect(() => {
    if (!placeName) return;

    const geocodePlaces = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            placeName
          )}&key=api_key`
        );
        const data = await response.json();

        if (data.status === "OK" && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          setPlaces([
            {
              id: placeName,
              name: placeName,
              lat: location.lat,
              lng: location.lng,
            },
          ]);
        } else {
          console.error("Geocoding API error: ", data.status);
        }
      } catch (error) {
        console.error("Error fetching geocoding data: ", error);
      }
    };

    geocodePlaces();
  }, [placeName]);

  return (
    <LoadScript googleMapsApiKey="api_key">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={5}
        center={places.length > 0 ? places[0] : defaultCenter}
      >
        {places.map((place) => (
          <Marker
            key={place.id}
            position={{ lat: place.lat, lng: place.lng }}
            label={place.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default MapComponent;
