import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { branches, devices, subscribers } from "@/lib/mock-data";

function makeIcon(online: number, offline: number, inactive: boolean) {
  const total = online + offline;
  const color = inactive ? "#94a3b8" : offline > 0 && online === 0 ? "#ef4444" : offline > 0 ? "#f59e0b" : "#10b981";
  const html = `
    <div style="position:relative;display:flex;align-items:center;justify-content:center;">
      <div style="width:34px;height:34px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 4px 10px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:12px;font-family:system-ui;">${total}</div>
      ${!inactive ? `<span style="position:absolute;inset:0;border-radius:50%;border:2px solid ${color};animation:bpulse 1.8s ease-out infinite;"></span>` : ""}
    </div>
    <style>@keyframes bpulse{0%{transform:scale(1);opacity:.9}100%{transform:scale(2.2);opacity:0}}</style>
  `;
  return L.divIcon({ html, className: "", iconSize: [34, 34], iconAnchor: [17, 17] });
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    map.fitBounds(points as L.LatLngBoundsLiteral, { padding: [40, 40] });
  }, [map, points]);
  return null;
}

export default function BranchMapInner({ subscriberFilter = "all" }: { subscriberFilter?: string }) {
  const data = useMemo(() => {
    const filtered = subscriberFilter === "all" ? branches : branches.filter((b) => b.subscriberId === subscriberFilter);
    return filtered.map((b) => {
      const branchDevices = devices.filter((d) => d.branch === b.name);
      const online = branchDevices.filter((d) => d.online && d.active).length;
      const offline = branchDevices.filter((d) => !d.online || !d.active).length;
      const sub = subscribers.find((s) => s.id === b.subscriberId);
      return { ...b, branchDevices, online, offline, sub };
    });
  }, [subscriberFilter]);

  const points = data.map((b) => [b.lat, b.lng] as [number, number]);

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <MapContainer center={[25, 30]} zoom={3} scrollWheelZoom style={{ height: 560, width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <FitBounds points={points} />
        {data.map((b) => (
          <Marker key={b.id} position={[b.lat, b.lng]} icon={makeIcon(b.online, b.offline, b.status === "Inactive")}>
            <Popup>
              <div style={{ minWidth: 220, fontFamily: "system-ui" }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{b.name}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>{b.location}</div>
                <div style={{ fontSize: 12, marginBottom: 4 }}><strong>Subscriber:</strong> {b.sub?.company}</div>
                <div style={{ fontSize: 12, marginBottom: 4 }}><strong>Manager:</strong> {b.manager}</div>
                <div style={{ fontSize: 12, marginBottom: 8 }}><strong>Users:</strong> {b.users}</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <span style={{ background: "#10b98122", color: "#047857", padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600 }}>● {b.online} Online</span>
                  <span style={{ background: "#ef444422", color: "#b91c1c", padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600 }}>● {b.offline} Offline</span>
                </div>
                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 6 }}>
                  {b.branchDevices.map((d) => (
                    <div key={d.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "2px 0" }}>
                      <span>{d.name}</span>
                      <span style={{ color: d.online && d.active ? "#059669" : "#dc2626", fontWeight: 600 }}>
                        {d.online && d.active ? "Online" : "Offline"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
