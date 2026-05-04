import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Actual neighborhood centroids in Dallas
const COORDS = {
  'Downtown Dallas': [32.7767, -96.7970],
  'Uptown':          [32.7983, -96.8081],
  'Deep Ellum':      [32.7838, -96.7857],
};

function neighborhoodPin(name, highlight) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        background:${highlight ? '#004AC6' : '#fff'};
        color:${highlight ? '#fff' : '#004AC6'};
        border:${highlight ? 'none' : '2px solid #004AC6'};
        padding:6px 13px;border-radius:999px;
        font-size:11px;font-weight:700;font-family:Manrope,sans-serif;
        box-shadow:0 4px 14px rgba(0,0,0,0.18);
        white-space:nowrap;
      ">${name}</div>
    `,
    iconSize: [148, 30],
    iconAnchor: [74, 30],
    popupAnchor: [0, -34],
  });
}

export default function NeighborhoodMap({ neighborhoods }) {
  return (
    <MapContainer
      center={[32.787, -96.800]}
      zoom={13}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {neighborhoods.map(n => {
        const coords = COORDS[n.name];
        if (!coords) return null;
        return (
          <Marker key={n.name} position={coords} icon={neighborhoodPin(n.name, n.highlight)}>
            <Popup>
              <div style={{ fontFamily: 'Manrope,sans-serif', minWidth: 150 }}>
                <p style={{ fontWeight: 700, fontSize: 13, margin: '0 0 4px' }}>{n.name}</p>
                <p style={{ fontSize: 11, color: '#6675A7', margin: '0 0 2px' }}>Avg rent: {n.avgRent}/mo</p>
                <p style={{ fontSize: 11, color: '#6675A7', margin: 0 }}>Safety: {n.safetyScore}/100</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
