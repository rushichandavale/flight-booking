import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const cityCoordinates = {
  pune: [73.8567, 18.5204],
  mumbai: [72.8777, 19.0760],
  delhi: [77.1025, 28.7041],
  bangalore: [77.5946, 12.9716],
  chennai: [80.2707, 13.0827],
};

function FlightMap({ from, to }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapError, setMapError] = useState('');

  useEffect(() => {
    if (!from || !to) {
      console.log('Missing from/to:', { from, to });
      setMapError('Invalid flight route.');
      return;
    }

    const fromCoord = cityCoordinates[from.toLowerCase()];
    const toCoord = cityCoordinates[to.toLowerCase()];
    console.log('FlightMap coordinates:', { from: fromCoord, to: toCoord });

    if (!fromCoord || !toCoord) {
      console.log('Invalid coordinates for:', from, to);
      setMapError('Invalid city coordinates.');
      return;
    }

    if (mapRef.current && !mapInstanceRef.current) {
      try {
        console.log('Initializing Leaflet map for:', from, '→', to);
        console.log('Map container dimensions:', {
          width: mapRef.current.offsetWidth,
          height: mapRef.current.offsetHeight,
        });

        // Initialize map
        const map = L.map(mapRef.current, {
          center: [20.5937, 78.9629], // Center on India [lat, lng]
          zoom: 5,
          minZoom: 2,
          maxZoom: 18,
        });

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Force resize after initialization
        setTimeout(() => {
          map.invalidateSize();
          console.log('Map resized after initialization:', {
            width: mapRef.current.offsetWidth,
            height: mapRef.current.offsetHeight,
          });
        }, 0);

        // Log map initialization
        console.log('Leaflet map initialized, center:', map.getCenter());

        // Add markers
        const fromMarker = L.marker([fromCoord[1], fromCoord[0]], {
          icon: L.divIcon({
            className: 'custom-marker',
            html: '<div style="background-color: red; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
            iconSize: [12, 12],
          }),
          title: from,
        }).addTo(map);

        const toMarker = L.marker([toCoord[1], toCoord[0]], {
          icon: L.divIcon({
            className: 'custom-marker',
            html: '<div style="background-color: blue; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
            iconSize: [12, 12],
          }),
          title: to,
        }).addTo(map);

        // Add popups
        fromMarker.bindPopup(from);
        toMarker.bindPopup(to);

        // Add polyline
        L.polyline([[fromCoord[1], fromCoord[0]], [toCoord[1], toCoord[0]]], {
          color: 'blue',
          weight: 3,
          dashArray: '5, 10',
        }).addTo(map);

        // Zoom to fit
        const bounds = L.latLngBounds([fromCoord[1], fromCoord[0]], [toCoord[1], toCoord[0]]);
        map.fitBounds(bounds, { padding: [50, 50] });

        mapInstanceRef.current = map;

        // Resize observer
        const resizeObserver = new ResizeObserver(() => {
          if (mapInstanceRef.current && mapRef.current) {
            console.log('Resizing Leaflet map to:', {
              width: mapRef.current.offsetWidth,
              height: mapRef.current.offsetHeight,
            });
            mapInstanceRef.current.invalidateSize();
          }
        });
        resizeObserver.observe(mapRef.current);

        return () => {
          resizeObserver.disconnect();
          if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
          }
        };
      } catch (error) {
        console.error('Leaflet map initialization failed:', error);
        setMapError('Map initialization error.');
      }
    } else if (!mapRef.current) {
      console.log('Map container not ready');
      setMapError('Map container not found.');
    }
  }, [from, to]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        id="flight-map"
        ref={mapRef}
        className="w-full h-full rounded-lg shadow-md border border-gray-200"
        style={{ minHeight: '600px', maxHeight: '600px', maxWidth: '100%' }}
      ></div>
      {mapError && (
        <p className="text-red-500 text-sm mt-2 text-center">{mapError}</p>
      )}
    </div>
  );
}

export default FlightMap;