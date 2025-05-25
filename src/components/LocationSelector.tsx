
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Locate } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationSelectorProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  }) => void;
  initialLocation?: {
    lat: number;
    lng: number;
  };
}

interface LocationData {
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

// Component to handle map clicks
function LocationMarker({ position, onPositionChange }: {
  position: LatLng | null;
  onPositionChange: (latlng: LatLng) => void;
}) {
  useMapEvents({
    click: (e) => {
      onPositionChange(e.latlng);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  onLocationSelect,
  initialLocation
}) => {
  const [position, setPosition] = useState<LatLng | null>(
    initialLocation ? new LatLng(initialLocation.lat, initialLocation.lng) : null
  );
  const [locationData, setLocationData] = useState<LocationData>({
    lat: 0,
    lng: 0,
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [manualEdit, setManualEdit] = useState(false);

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPosition = new LatLng(latitude, longitude);
          setPosition(newPosition);
          reverseGeocode(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to San Francisco if location access is denied
          const defaultPosition = new LatLng(37.7749, -122.4194);
          setPosition(defaultPosition);
        }
      );
    }
  };

  // Simple reverse geocoding using Nominatim (free OpenStreetMap service)
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.address) {
        const address = data.address;
        setLocationData({
          lat,
          lng,
          address: `${address.house_number || ''} ${address.road || ''}`.trim() || data.display_name.split(',')[0],
          city: address.city || address.town || address.village || '',
          state: address.state || '',
          zipCode: address.postcode || ''
        });
        setManualEdit(false);
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      // Allow manual entry if geocoding fails
      setLocationData({
        lat,
        lng,
        address: '',
        city: '',
        state: '',
        zipCode: ''
      });
      setManualEdit(true);
    }
  };

  const handleMapClick = (latlng: LatLng) => {
    setPosition(latlng);
    reverseGeocode(latlng.lat, latlng.lng);
  };

  const handleConfirmLocation = () => {
    if (position && locationData.address && locationData.city && locationData.state) {
      onLocationSelect(locationData);
    }
  };

  const handleInputChange = (field: keyof LocationData, value: string) => {
    setLocationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    if (!initialLocation) {
      getCurrentLocation();
    }
  }, [initialLocation]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Select Business Location</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Click on the map to set your business location, or use your current location.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Button
            type="button"
            onClick={getCurrentLocation}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Locate className="h-4 w-4" />
            <span>Use Current Location</span>
          </Button>
          <Button
            type="button"
            onClick={() => setManualEdit(!manualEdit)}
            variant="outline"
          >
            {manualEdit ? 'Use Map' : 'Manual Entry'}
          </Button>
        </div>

        {!manualEdit && (
          <div className="h-64 w-full rounded-lg overflow-hidden border">
            <MapContainer
              center={position || [37.7749, -122.4194]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker position={position} onPositionChange={handleMapClick} />
            </MapContainer>
          </div>
        )}

        {/* Address Form */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              value={locationData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter street address"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={locationData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="City"
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={locationData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="State"
                required
              />
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                value={locationData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                placeholder="ZIP Code"
                required
              />
            </div>
          </div>
        </div>

        {position && (
          <div className="text-sm text-gray-600">
            <p>Coordinates: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}</p>
          </div>
        )}

        <Button
          type="button"
          onClick={handleConfirmLocation}
          disabled={!position || !locationData.address || !locationData.city || !locationData.state}
          className="w-full"
        >
          Confirm Location
        </Button>
      </CardContent>
    </Card>
  );
};

export default LocationSelector;
