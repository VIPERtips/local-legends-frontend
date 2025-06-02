
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationSelectorProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number };
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  onLocationSelect,
  initialLocation = { lat: 40.7128, lng: -74.0060 }
}) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const geocode = async (searchAddress: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const formattedAddress = data[0].display_name;
        
        setSelectedLocation({ lat, lng });
        setAddress(formattedAddress);
        onLocationSelect({ lat, lng, address: formattedAddress });
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const geocodedAddress = await reverseGeocode(lat, lng);
          
          setSelectedLocation({ lat, lng });
          setAddress(geocodedAddress);
          onLocationSelect({ lat, lng, address: geocodedAddress });
          setLoading(false);
        },
        (error) => {
          console.error('Location access denied:', error);
          setLoading(false);
        }
      );
    }
  };

  const MapEvents = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        const geocodedAddress = await reverseGeocode(lat, lng);
        
        setSelectedLocation({ lat, lng });
        setAddress(geocodedAddress);
        onLocationSelect({ lat, lng, address: geocodedAddress });
      },
    });
    return null;
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      geocode(address.trim());
    }
  };

  useEffect(() => {
    const initializeAddress = async () => {
      if (initialLocation && !address) {
        const geocodedAddress = await reverseGeocode(initialLocation.lat, initialLocation.lng);
        setAddress(geocodedAddress);
      }
    };
    initializeAddress();
  }, [initialLocation, address]);

  const mapCenter: [number, number] = [selectedLocation.lat, selectedLocation.lng];
  const markerPosition: [number, number] = [selectedLocation.lat, selectedLocation.lng];

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="address-search">Search for an address</Label>
        <form onSubmit={handleAddressSubmit} className="flex space-x-2 mt-2">
          <Input
            id="address-search"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address or city"
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </div>

      <Button onClick={getCurrentLocation} disabled={loading} className="w-full">
        {loading ? 'Getting location...' : 'Use Current Location'}
      </Button>

      <div className="border rounded-lg overflow-hidden">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '300px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={markerPosition} />
          <MapEvents />
        </MapContainer>
      </div>

      <div className="text-sm text-gray-600">
        <strong>Selected Location:</strong>
        <br />
        {address || `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`}
      </div>
    </div>
  );
};

export default LocationSelector;
