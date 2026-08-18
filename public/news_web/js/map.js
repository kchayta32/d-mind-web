/* ==============================================================================
   DisasterWatch TH - Interactive Leaflet Map
   ============================================================================== */

let mapInstance = null;
let mapMarkers = [];

function initDisasterMap() {
    const mapElement = document.getElementById("disasterMap");
    if (!mapElement) return;

    // Center on Thailand & SE Asia
    if (!mapInstance) {
        mapInstance = L.map('disasterMap').setView([13.7563, 100.5018], 6);

        // Light CartoDB Positron / OSM tiles for clean bright theme
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 18,
            subdomains: 'abcd'
        }).addTo(mapInstance);
    }

    loadMapMarkers();
}

function loadMapMarkers() {
    if (!mapInstance) return;

    fetch("/api/map-data")
        .then(res => res.json())
        .then(data => {
            if (data.status === "success" && data.points) {
                // Clear existing markers
                mapMarkers.forEach(m => mapInstance.removeLayer(m));
                mapMarkers = [];

                data.points.forEach(pt => {
                    const lat = pt.lat;
                    const lng = pt.lng;
                    if (!lat || !lng) return;

                    // Determine color based on severity
                    let color = "#0284c7"; // Blue
                    let pulseClass = "pulse-blue";
                    const sev = (pt.severity || "").toLowerCase();

                    if (sev.includes("วิกฤต") || sev.includes("รุนแรง") || (pt.magnitude && pt.magnitude >= 5.5)) {
                        color = "#dc2626"; // Red
                        pulseClass = "pulse-red";
                    } else if (sev.includes("เตือน") || (pt.magnitude && pt.magnitude >= 4.0)) {
                        color = "#f59e0b"; // Orange
                        pulseClass = "pulse-orange";
                    }

                    // Create circle marker
                    const marker = L.circleMarker([lat, lng], {
                        radius: pt.magnitude ? Math.max(6, pt.magnitude * 2.2) : 8,
                        fillColor: color,
                        color: "#ffffff",
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.85
                    });

                    // Build popup content
                    const popupContent = `
                        <div style="font-family: 'Prompt', sans-serif; min-width: 180px; max-width: 260px;">
                            <div style="font-size: 0.75rem; font-weight: 700; color: ${color}; text-transform: uppercase; margin-bottom: 3px;">
                                ${pt.category === 'natural' ? '🌊 ภัยธรรมชาติ' : '🔥 ภัยพิบัติฉุกเฉิน'} • ${pt.severity || 'เฝ้าระวัง'}
                            </div>
                            <h4 style="font-size: 0.95rem; margin: 0 0 6px; color: #0f172a; line-height: 1.3;">${pt.title}</h4>
                            <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 4px;">
                                📍 ${pt.location || 'พิกัด: ' + lat.toFixed(2) + ', ' + lng.toFixed(2)}
                            </div>
                            ${pt.magnitude ? `<div style="font-size: 0.82rem; font-weight: 600; color: #0369a1;">ขนาด: ${pt.magnitude} Richter</div>` : ''}
                            <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 4px;">
                                แหล่งข้อมูล: ${pt.source || 'TMD/USGS'}
                            </div>
                        </div>
                    `;

                    marker.bindPopup(popupContent);
                    marker.addTo(mapInstance);
                    mapMarkers.push(marker);
                });
            }
        })
        .catch(err => {
            console.error("Error loading map points:", err);
        });
}

function refreshMapSize() {
    if (mapInstance) {
        setTimeout(() => {
            mapInstance.invalidateSize();
        }, 200);
    }
}
