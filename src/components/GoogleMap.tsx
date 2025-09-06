import { useState, useCallback, useRef } from "react";
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox, HeatmapLayer } from "@react-google-maps/api";
import { MapPin, Navigation } from "lucide-react";

const libraries: ("places" | "visualization")[] = ["places", "visualization"];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 28.6139,
  lng: 77.2090,
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

// Placeholder heatmap coordinates
const heatmapCoordinates = [
  { lat: 28.6139, lng: 77.2090 },
  { lat: 28.6149, lng: 77.2100 },
  { lat: 28.6129, lng: 77.2080 },
  { lat: 28.6159, lng: 77.2110 },
  { lat: 28.6119, lng: 77.2070 },
];

interface GoogleMapComponentProps {
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
}

const GoogleMapComponent = ({ onLocationSelect }: GoogleMapComponentProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState([center]);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [heatmapData, setHeatmapData] = useState<google.maps.LatLng[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    // Create heatmap data after Google Maps API is loaded
    const heatmapPoints = heatmapCoordinates.map(coord => 
      new google.maps.LatLng(coord.lat, coord.lng)
    );
    setHeatmapData(heatmapPoints);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onSearchBoxLoad = useCallback((ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
  }, []);

  const onPlacesChanged = useCallback(() => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        if (place.geometry && place.geometry.location) {
          const newLocation = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          
          setMarkers([newLocation]);
          
          if (map) {
            map.panTo(newLocation);
            map.setZoom(15);
          }

          if (onLocationSelect) {
            onLocationSelect(newLocation);
          }
        }
      }
    }
  }, [searchBox, map, onLocationSelect]);

  // Since we're using a placeholder API key, show a demo map instead
  return (
    <div className="h-full w-full relative bg-gray-800 rounded-2xl overflow-hidden">
      {/* Demo Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900"></div>
      
      {/* Search Box */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-card border border-border rounded-xl p-3 shadow-lg flex items-center gap-3">
          <input
            type="text"
            placeholder="Search for a location... (Demo Mode)"
            className="flex-1 bg-transparent border-none outline-none text-card-foreground placeholder:text-muted-foreground"
            disabled
          />
          <MapPin className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      {/* Demo Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-8 bg-card/80 backdrop-blur-sm rounded-2xl border border-border max-w-md">
          <Navigation className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-card-foreground mb-2">
            Demo Map Mode
          </h3>
          <p className="text-muted-foreground mb-4">
            This is a demo version of the SafeCity interactive map. To enable full functionality with real Google Maps, add your Google Maps API key.
          </p>
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Features available in full version:</p>
            <ul className="text-left space-y-1">
              <li>• Interactive Google Maps</li>
              <li>• Location search with autocomplete</li>
              <li>• Crime heatmap overlay</li>
              <li>• Custom location markers</li>
              <li>• Real-time safety updates</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Demo Markers */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-8 h-8 bg-primary rounded-full border-4 border-white shadow-lg animate-pulse"></div>
      </div>
      <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
      </div>
      <div className="absolute bottom-1/3 right-1/3 transform translate-x-1/2 translate-y-1/2">
        <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-white shadow-lg"></div>
      </div>
    </div>
  );
};

export default GoogleMapComponent;