import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { io, Socket } from "socket.io-client";
import { MapContainer, Marker, TileLayer, Popup, useMapEvents } from "react-leaflet";
import React, { useEffect, useState } from "react";
import { Coords } from '../utils/interfaces';
import { _INITIAL_MAP_ZOOM } from "../utils/constants";

const icon : L.DivIcon = L.divIcon({
    className: "hot-chocolate-icon",
    iconSize: [30, 30],
    iconAnchor: [0, 0],
    popupAnchor: [15, 0]
});

const mapLocation = (location: any) => {
    return {
        ...location
    }
};

const socket = io();

const FavoritesMap = () => {
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
                socket.emit('location:create', {lat, lng})
            },            
        });
        return null;
    }

    socket.on('location:create', location => {
        const newList: Array<Coords> = markersList.concat({lat: location.lat, lng: location.lng});
        setMarkersList(newList);
    })

    return (
        <MapContainer center={initialPosition} zoom={_INITIAL_MAP_ZOOM} scrollWheelZoom={true} >
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

export default FavoritesMap;