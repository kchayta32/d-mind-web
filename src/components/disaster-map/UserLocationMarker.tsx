
import React, { useEffect, useState } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Create a custom user location icon
const userLocationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="white" stroke-width="3"/>
      <circle cx="12" cy="12" r="3" fill="white"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

interface UserLocationMarkerProps {
  showLocation: boolean;
}

export const UserLocationMarker: React.FC<UserLocationMarkerProps> = ({ showLocation }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const map = useMap();

  useEffect(() => {
    if (!showLocation) {
      setPosition(null);
      setError(null);
      return;
    }

    if (!navigator.geolocation) {
      setError('การระบุตำแหน่งไม่รองรับในเบราว์เซอร์นี้');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (location) => {
        const { latitude, longitude } = location.coords;
        const newPosition: [number, number] = [latitude, longitude];
        setPosition(newPosition);
        setError(null);
        
        // Center map on user location
        map.setView(newPosition, 10);
      },
      (error) => {
        console.error('Geolocation error:', error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('การเข้าถึงตำแหน่งถูกปฏิเสธ');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('ไม่สามารถระบุตำแหน่งได้');
            break;
          case error.TIMEOUT:
            setError('หมดเวลาในการระบุตำแหน่ง');
            break;
          default:
            setError('เกิดข้อผิดพลาดในการระบุตำแหน่ง');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [showLocation, map]);

  if (!showLocation || !position) {
    return null;
  }

  if (error) {
    console.error('Location error:', error);
    return null;
  }

  return (
    <Marker position={position} icon={userLocationIcon}>
      <Popup>
        <div className="text-center">
          <div className="font-semibold text-blue-600">ตำแหน่งของคุณ</div>
          <div className="text-sm text-gray-600 mt-1">
            <div>ละติจูด: {position[0].toFixed(6)}</div>
            <div>ลองจิจูด: {position[1].toFixed(6)}</div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};
