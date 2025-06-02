import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, AttributionControl, useMapEvents, useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { MapOptions } from 'leaflet';


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
  const mapRef = useRef<L.Map | null>(null);

  function MapEvents({
    onMapClick,
    initialLocation,
  }: {
    onMapClick: (lat: number, lng: number) => void;
    initialLocation: { lat: number; lng: number };
  }) {
    const map = useMap();
  
    useEffect(() => {
      map.invalidateSize();
    }, [map]);
  
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        onMapClick(lat, lng);
      },
    });
  
    // Set initial view
    useEffect(() => {
      map.setView([initialLocation.lat, initialLocation.lng], 13);
    }, [initialLocation, map]);
  
    return null;
  }

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
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
  }, []);

  const geocode = useCallback(async (searchAddress: string) => {
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
        
        // Update map view to new location
        if (mapRef.current) {
          mapRef.current.setView([lat, lng], 13);
        }
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
    } finally {
      setLoading(false);
    }
  }, [onLocationSelect]);

  const getCurrentLocation = useCallback(() => {
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
          
          // Update map view to current location
          if (mapRef.current) {
            mapRef.current.setView([lat, lng], 13);
          }
          setLoading(false);
        },
        (error) => {
          console.error('Location access denied:', error);
          setLoading(false);
        }
      );
    }
  }, [reverseGeocode, onLocationSelect]);

  const handleAddressSubmit = useCallback(() => {
    if (address.trim()) {
      geocode(address.trim());
    }
  }, [address, geocode]);

  useEffect(() => {
    const initializeAddress = async () => {
      if (initialLocation) {
        const geocodedAddress = await reverseGeocode(initialLocation.lat, initialLocation.lng);
        setAddress(geocodedAddress);
      }
    };
    initializeAddress();
  }, [initialLocation, reverseGeocode]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddressSubmit();
    }
  };

  // Handle map click events directly through the map instance
  const handleMapCreated = (map: L.Map) => {
    mapRef.current = map;
    
    // Add click event listener to the map
    map.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      const geocodedAddress = await reverseGeocode(lat, lng);
      
      setSelectedLocation({ lat, lng });
      setAddress(geocodedAddress);
      onLocationSelect({ lat, lng, address: geocodedAddress });
    });
    
    // Ensure map renders correctly
    map.invalidateSize();
  };

  // Handle map click
  const handleMapClick = useCallback(
    async (lat: number, lng: number) => {
      const geocodedAddress = await reverseGeocode(lat, lng);
      setSelectedLocation({ lat, lng });
      setAddress(geocodedAddress);
      onLocationSelect({ lat, lng, address: geocodedAddress });
    },
    [reverseGeocode, onLocationSelect]
  );

  // Update map view when location changes
  const updateMapView = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.setView(
        [selectedLocation.lat, selectedLocation.lng],
        13
      );
    }
  }, [selectedLocation]);

  useEffect(() => {
    updateMapView();
  }, [selectedLocation, updateMapView]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="address-search">Search for an address</Label>
        <div className="flex space-x-2 mt-2">
          <Input
            id="address-search"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter address or city"
            className="flex-1"
          />
          <Button 
            type="button" 
            onClick={handleAddressSubmit} 
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>

      <Button onClick={getCurrentLocation} disabled={loading} className="w-full">
        {loading ? 'Getting location...' : 'Use Current Location'}
      </Button>

      <div className="border rounded-lg overflow-hidden">
      <MapContainer
  {...({
    
    center: [selectedLocation.lat, selectedLocation.lng],
    zoom: 13,
    style: { height: '300px', width: '100%' },
    whenCreated: handleMapCreated
  } as MapOptions)}
>

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
           
          />
          <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
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

