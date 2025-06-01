
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

  const mapCenter = position ? [position.lat, position.lng] : [37.7749, -122.4194];

  return (
    <Card className="w-full bg-gradient-to-br from-purple-50 to-blue-50 border-0 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Select Business Location</span>
        </CardTitle>
        <p className="text-purple-100 text-sm">
          Click on the map to set your business location, or use your current location.
        </p>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="flex space-x-3">
          <Button
            type="button"
            onClick={getCurrentLocation}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <Locate className="h-4 w-4" />
            <span>Use Current Location</span>
          </Button>
          <Button
            type="button"
            onClick={() => setManualEdit(!manualEdit)}
            variant="outline"
            className="border-2 border-purple-200 hover:border-purple-400"
          >
            {manualEdit ? 'Use Map' : 'Manual Entry'}
          </Button>
        </div>

        {!manualEdit && (
          <div className="h-64 w-full rounded-xl overflow-hidden border-2 border-purple-200 shadow-lg">
            <MapContainer
              center={mapCenter as [number, number]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker position={position} onPositionChange={handleMapClick} />
            </MapContainer>
          </div>
        )}

        {/* Address Form */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="address" className="text-gray-700 font-medium">Street Address *</Label>
            <Input
              id="address"
              value={locationData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter street address"
              className="border-2 border-purple-200 focus:border-purple-400 rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city" className="text-gray-700 font-medium">City *</Label>
              <Input
                id="city"
                value={locationData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="City"
                className="border-2 border-purple-200 focus:border-purple-400 rounded-lg"
                required
              />
            </div>
            <div>
              <Label htmlFor="state" className="text-gray-700 font-medium">State *</Label>
              <Input
                id="state"
                value={locationData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="State"
                className="border-2 border-purple-200 focus:border-purple-400 rounded-lg"
                required
              />
            </div>
            <div>
              <Label htmlFor="zipCode" className="text-gray-700 font-medium">ZIP Code *</Label>
              <Input
                id="zipCode"
                value={locationData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                placeholder="ZIP Code"
                className="border-2 border-purple-200 focus:border-purple-400 rounded-lg"
                required
              />
            </div>
          </div>
        </div>

        {position && (
          <div className="text-sm text-purple-600 bg-purple-100 p-3 rounded-lg">
            <p>📍 Coordinates: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}</p>
          </div>
        )}

        <Button
          type="button"
          onClick={handleConfirmLocation}
          disabled={!position || !locationData.address || !locationData.city || !locationData.state}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
        >
          ✨ Confirm Location
        </Button>
      </CardContent>
    </Card>
  );
};

export default LocationSelector;
