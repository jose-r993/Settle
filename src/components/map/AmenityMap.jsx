import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Spread amenities radially at correct distances from the listing center.
// 1 mile ≈ 0.01449° lat; lng correction uses Dallas latitude (32.8°).
function amenityCoords([lat, lng], distanceMiles, index) {
  const angles = [55, 140, 225, 320, 10];
  const rad = (angles[index % angles.length] * Math.PI) / 180;
  const latOff = (distanceMiles / 69.0) * Math.cos(rad);
  const lngOff = (distanceMiles / (69.0 * Math.cos((lat * Math.PI) / 180))) * Math.sin(rad);
  return [lat + latOff, lng + lngOff];
}

const homeIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      background:#004AC6;color:#fff;
      width:38px;height:38px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 4px 16px rgba(0,74,198,0.45);
    ">
      <span class="material-symbols-outlined" style="font-size:20px;font-variation-settings:'FILL' 1">home_work</span>
    </div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -22],
});

function amenityIcon(iconName) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        background:#fff;border-radius:50%;
        width:30px;height:30px;
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 2px 8px rgba(0,0,0,0.18);
      ">
        <span class="material-symbols-outlined" style="font-size:15px;color:#004AC6">${iconName}</span>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -18],
  });
}

export default function AmenityMap({ listing }) {
  if (!listing?.coords) return null;

  return (
    <MapContainer
      center={listing.coords}
      zoom={15}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      <Marker position={listing.coords} icon={homeIcon}>
        <Popup>
          <div style={{ fontFamily: 'Manrope,sans-serif' }}>
            <p style={{ fontWeight: 700, fontSize: 12, margin: '0 0 2px' }}>{listing.name}</p>
            <p style={{ color: '#6675A7', fontSize: 11, margin: 0 }}>{listing.address}</p>
          </div>
        </Popup>
      </Marker>

      {listing.amenities.map((amenity, i) => {
        const dist = parseFloat(amenity.distance);
        const pos = amenityCoords(listing.coords, dist, i);
        return (
          <Marker key={amenity.name} position={pos} icon={amenityIcon(amenity.icon)}>
            <Popup>
              <div style={{ fontFamily: 'Manrope,sans-serif' }}>
                <p style={{ fontWeight: 700, fontSize: 12, margin: '0 0 2px' }}>{amenity.name}</p>
                <p style={{ color: '#6675A7', fontSize: 11, margin: 0 }}>{amenity.distance} away</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
