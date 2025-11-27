import React, { useEffect } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ChecklistItem, MapRegion } from '../types';


import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;


function MapController({ focusedItem }: { focusedItem: ChecklistItem | null }) {
    const map = useMap();

    useEffect(() => {
        if (focusedItem && focusedItem.coordinates) {
            map.flyTo(focusedItem.coordinates, 2);
        }
    }, [focusedItem, map]);

    return null;
}

interface InteractiveMapProps {
    activeMapRegion: MapRegion;
    items: ChecklistItem[];
    focusedItem: ChecklistItem | null;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ activeMapRegion, items, focusedItem }) => {

    const bounds: L.LatLngBoundsExpression = [[0, 0], [1000, 1000]];


    const mapImages: Record<string, string> = {
        white_orchard: 'https://img.game8.co/3248145/1f2608107931f6d84d7d92558f88755a.png/show',
        velen: 'https://via.placeholder.com/1000x1000/2a4858/ffffff?text=Velen+Map',
        skellige: 'https://via.placeholder.com/1000x1000/1a2a3a/ffffff?text=Skellige+Map',
        kaer_morhen: 'https://via.placeholder.com/1000x1000/3a2a1a/ffffff?text=Kaer+Morhen+Map',
        toussaint: 'https://via.placeholder.com/1000x1000/4a1a1a/ffffff?text=Toussaint+Map'
    };

    const currentMapImage = mapImages[activeMapRegion] || mapImages.white_orchard;

    return (
        <div className="w-full h-full bg-[#0a0a0a] relative z-0">
            <MapContainer
                crs={L.CRS.Simple}
                bounds={bounds}
                center={[500, 500]}
                zoom={0}
                minZoom={-1}
                maxZoom={2}
                style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
                attributionControl={false}
            >
                <ImageOverlay
                    url={currentMapImage}
                    bounds={bounds}
                />

                {items.map(item => {
                    if (!item.coordinates) return null;
                    return (
                        <Marker key={item.id} position={item.coordinates}>
                            <Popup>
                                <div className="text-black">
                                    <h3 className="font-bold">{item.title}</h3>
                                    <p className="text-xs">{item.shortDesc}</p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                <MapController focusedItem={focusedItem} />
            </MapContainer>
        </div>
    );
};

export default InteractiveMap;
