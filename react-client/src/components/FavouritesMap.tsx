import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, Popup, useMapEvents } from "react-leaflet";
import React, { useEffect, useState } from "react";
import { HotChocolate } from '../domain/domain';

interface Coords {
    lat: number,
    lng: number,
};

// Default coordinates set to Oslo central station
const zoom : number = 15;

const icon : L.DivIcon = L.divIcon({
    className: "hot-chocolate-icon",
    iconSize: [30, 30],
    iconAnchor: [0, 0],
    popupAnchor: [15, 0]
});

export default function FavoritesMap() {
    const [initialPosition, setInitialPosition] = useState<[number, number]>([59.91174337077401, 10.750425582038146]);
    const [markersList, setMarkersList] = useState<Array<Coords>>([]);

    // asks the user for their location information to center the map
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude]);
        });
    }, []);

    const Markers = () => {
        useMapEvents({
            click(e) {
                const lat: number = e.latlng.lat;
                const lng: number = e.latlng.lng;
                const newList: Array<Coords> = markersList.concat({lat, lng});
                setMarkersList(newList);  
                console.log(markersList);           
            },            
        });
        return null;
    }

    return (
        <MapContainer center={initialPosition} zoom={zoom} scrollWheelZoom={true} >
            <TileLayer
                attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Markers/>
            {markersList.map((coord, idx) => 
                <Marker
                    key={`${idx}-${coord.lat}-${coord.lng}`}
                    position={[coord.lat, coord.lng]}
                    interactive={false}
                    icon={icon}
                />
            )}
        </MapContainer>
        )
};