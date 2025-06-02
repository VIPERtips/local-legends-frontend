
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SimpleLocationSelectorProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string; city?: string; state?: string; zipCode?: string }) => void;
  initialLocation?: { lat: number; lng: number };
}

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const SimpleLocationSelector: React.FC<SimpleLocationSelectorProps> = ({
  onLocationSelect,
  initialLocation
}) => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load saved location from localStorage on mount
  React.useEffect(() => {
    const savedLocation = localStorage.getItem('lastSelectedLocation');
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        setAddress(parsed.address || '');
        setCity(parsed.city || '');
        setState(parsed.state || '');
        setZipCode(parsed.zipCode || '');
      } catch (error) {
        console.log('Error loading saved location:', error);
      }
    }
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location services. Please enter your location manually.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Use approximate location without external API
        const locationData = {
          lat,
          lng,
          address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          city: '',
          state: '',
          zipCode: ''
        };

        // Save to localStorage
        localStorage.setItem('lastSelectedLocation', JSON.stringify(locationData));
        
        onLocationSelect(locationData);
        setAddress(locationData.address);
        
        toast({
          title: "Location detected",
          description: "Current location has been set. Please fill in the address details.",
        });
        
        setLoading(false);
      },
      (error) => {
        console.log('Location access denied or failed:', error);
        toast({
          title: "Location access denied",
          description: "Please enter your location manually below.",
        });
        setLoading(false);
      },
      {
        timeout: 10000,
        enableHighAccuracy: false
      }
    );
  };

  const handleManualLocationSubmit = () => {
    if (!address || !city || !state || !zipCode) {
      toast({
        title: "Missing information",
        description: "Please fill in all location fields.",
        variant: "destructive",
      });
      return;
    }

    // Generate approximate coordinates based on state (fallback coordinates)
    const stateCoordinates: { [key: string]: { lat: number; lng: number } } = {
      'California': { lat: 36.7783, lng: -119.4179 },
      'Texas': { lat: 31.9686, lng: -99.9018 },
      'Florida': { lat: 27.7663, lng: -81.6868 },
      'New York': { lat: 42.1657, lng: -74.9481 },
      'Pennsylvania': { lat: 41.2033, lng: -77.1945 },
      // Add more states as needed, using state centers
    };

    const coords = stateCoordinates[state] || { lat: 39.8283, lng: -98.5795 }; // Default to US center

    const locationData = {
      ...coords,
      address: `${address}, ${city}, ${state} ${zipCode}`,
      city,
      state,
      zipCode
    };

    // Save to localStorage
    localStorage.setItem('lastSelectedLocation', JSON.stringify(locationData));
    
    onLocationSelect(locationData);
    
    toast({
      title: "Location set",
      description: "Your location has been saved successfully!",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <MapPin className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Set Your Location</h3>
      </div>

      <Button 
        onClick={getCurrentLocation} 
        disabled={loading} 
        className="w-full mb-4"
        variant="outline"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Getting location...
          </>
        ) : (
          <>
            <MapPin className="mr-2 h-4 w-4" />
            Use Current Location
          </>
        )}
      </Button>

      <div className="border-t pt-4">
        <p className="text-sm text-gray-600 mb-4">Or enter your location manually:</p>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main Street"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="San Francisco"
                required
              />
            </div>

            <div>
              <Label htmlFor="state">State *</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((stateName) => (
                    <SelectItem key={stateName} value={stateName}>
                      {stateName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="12345"
              maxLength={10}
              required
            />
          </div>

          <Button 
            onClick={handleManualLocationSubmit}
            className="w-full"
          >
            Set Location
          </Button>
        </div>
      </div>

      {(address || city || state || zipCode) && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-1">Current Location:</h4>
          <p className="text-green-700 text-sm">
            {address && `${address}, `}
            {city && `${city}, `}
            {state} {zipCode}
          </p>
        </div>
      )}
    </div>
  );
};

export default SimpleLocationSelector;
