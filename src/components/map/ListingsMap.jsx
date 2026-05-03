import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const safetyLevel = (score) => score >= 85 ? 'high' : score >= 75 ? 'medium' : 'lower';

const PIN_STYLE = {
  high:   { bg: '#f0fdf4', text: '#16a34a', dot: '#22c55e' },
  medium: { bg: '#fefce8', text: '#ca8a04', dot: '#eab308' },
  lower:  { bg: '#fff7ed', text: '#ea580c', dot: '#f97316' },
};

function pricePin(listing) {
  const { bg, text, dot } = PIN_STYLE[safetyLevel(listing.safetyScore)];
  return L.divIcon({
    className: '',
    html: `
      <div style="
        display:flex;align-items:center;gap:5px;
        background:${bg};color:${text};
        padding:5px 11px;border-radius:999px;
        font-size:11px;font-weight:700;font-family:Manrope,sans-serif;
        box-shadow:0 4px 14px rgba(0,0,0,0.18);
        white-space:nowrap;border:1.5px solid ${dot}55;
        cursor:pointer;
      ">
        <span style="width:7px;height:7px;border-radius:50%;background:${dot};flex-shrink:0;display:inline-block;"></span>
        ${listing.price}
      </div>
    `,
    iconSize: [88, 28],
    iconAnchor: [44, 28],
    popupAnchor: [0, -32],
  });
}

export default function ListingsMap({ listings, onNavigate }) {
  return (
    <MapContainer
      center={[32.792, -96.800]}
      zoom={12}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {listings.map(listing => (
        <Marker
          key={listing.id}
          position={listing.coords}
          icon={pricePin(listing)}
          eventHandlers={{ click: () => onNavigate?.(`/listing/${listing.id}`) }}
        >
          <Popup>
            <div style={{ fontFamily: 'Manrope,sans-serif', minWidth: 160 }}>
              <p style={{ fontWeight: 700, fontSize: 13, margin: '0 0 2px' }}>{listing.name}</p>
              <p style={{ color: '#6675A7', fontSize: 11, margin: '0 0 5px' }}>{listing.neighborhood}</p>
              <p style={{ fontWeight: 800, fontSize: 15, margin: 0 }}>
                {listing.price}
                <span style={{ fontSize: 10, fontWeight: 500, color: '#6675A7' }}>/mo</span>
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
