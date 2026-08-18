/* ==============================================================================
   DisasterWatch TH - Main Application Frontend Logic
   ============================================================================== */

// Global State
let currentCategory = "all";
let currentSeverity = "";
let currentSource = "";
let searchQuery = "";
let allNewsData = [];
let categoryChartInstance = null;
let severityChartInstance = null;
let searchDebounceTimer = null;

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
    initClock();
    loadStats();
    loadNewsData();
    loadSchemaSql();
});

// ==============================================================================
// Clock & Utilities
// ==============================================================================
function initClock() {
    const updateTime = () => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateStr = now.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
        const clockEl = document.getElementById("clockText");
        if (clockEl) {
            clockEl.textContent = `${dateStr} ${timeStr}`;
        }
    };
    updateTime();
    setInterval(updateTime, 1000);
}

function timeAgo(isoDate) {
    if (!isoDate) return "เมื่อสักครู่";
    try {
        const date = new Date(isoDate);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return "เมื่อสักครู่";
        if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
        if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
        if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
        return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
    } catch (e) {
        return "ล่าสุด";
    }
}

// ==============================================================================
// Data Fetching & Rendering
// ==============================================================================
function loadStats() {
    fetch("/api/stats")
        .then(res => res.json())
        .then(data => {
            if (data.status === "success" && data.stats) {
                const s = data.stats;
                document.getElementById("statTotal").textContent = s.total_news || 0;
                document.getElementById("statNatural").textContent = s.counts?.natural_disasters || 0;
                document.getElementById("statHazard").textContent = s.counts?.disaster_hazards || 0;
                document.getElementById("statForecast").textContent = s.counts?.weather_forecasts || 0;

                if (s.last_updated) {
                    const dt = new Date(s.last_updated);
                    document.getElementById("lastSyncTime").innerHTML = `
                        <i class="fa-solid fa-clock-rotate-left"></i> อัปเดตล่าสุด: ${dt.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                    `;
                }

                // Update charts if analytics tab is active
                updateAnalyticsCharts(s);
            }
        })
        .catch(err => console.error("Error loading stats:", err));
}

function loadNewsData() {
    const loadingEl = document.getElementById("loadingState");
    const emptyEl = document.getElementById("emptyState");
    const gridEl = document.getElementById("newsGrid");
    const countEl = document.getElementById("resultsCount");

    loadingEl.style.display = "flex";
    emptyEl.style.display = "none";
    gridEl.innerHTML = "";

    const params = new URLSearchParams();
    if (currentCategory !== "all" && currentCategory !== "map" && currentCategory !== "analytics") {
        params.append("category", currentCategory);
    }
    if (currentSeverity) params.append("severity", currentSeverity);
    if (currentSource) params.append("source", currentSource);
    if (searchQuery) params.append("search", searchQuery);
    params.append("limit", "100");

    fetch(`/api/news?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
            loadingEl.style.display = "none";
            if (data.status === "success" && data.data) {
                allNewsData = data.data;
                countEl.textContent = `${allNewsData.length} รายการ`;

                if (allNewsData.length === 0) {
                    emptyEl.style.display = "block";
                } else {
                    renderNewsGrid(allNewsData);
                    checkUrgentAlerts(allNewsData);
                }
            }
        })
        .catch(err => {
            loadingEl.style.display = "none";
            emptyEl.style.display = "block";
            showToast("เกิดข้อผิดพลาดในการโหลดข้อมูลข่าวสาร", "error");
            console.error("Error fetching news:", err);
        });
}

function renderNewsGrid(items) {
    const gridEl = document.getElementById("newsGrid");
    gridEl.innerHTML = "";

    items.forEach((item, idx) => {
        const card = createNewsCard(item, idx);
        gridEl.appendChild(card);
    });
}

function createNewsCard(item, index) {
    const card = document.createElement("div");
    card.className = "news-card";

    // Category styling
    const catClass = item.category_id === "natural" ? "badge-cat-natural" :
                     item.category_id === "hazard" ? "badge-cat-hazard" : "badge-cat-forecast";
    
    // Severity styling
    const sev = item.severity_level || item.warning_level || "เฝ้าระวัง";
    let sevClass = "severity-watch";
    if (sev.includes("วิกฤต") || sev.includes("รุนแรง") || sev.includes("ฉุกเฉิน")) {
        sevClass = "severity-critical";
    } else if (sev.includes("เตือน")) {
        sevClass = "severity-warning";
    } else if (sev.includes("ปกติ")) {
        sevClass = "severity-normal";
    }

    const eventTimeStr = timeAgo(item.event_time || item.incident_time || item.created_at);
    const locationStr = item.province || item.location_name || item.target_region || "ประเทศไทย";
    const imageSrc = item.image_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800";

    card.innerHTML = `
        <div class="card-img-wrap">
            <img class="card-img" src="${imageSrc}" alt="${item.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800'">
            <div class="card-badges">
                <span class="badge-pill ${catClass}">${item.category_icon || '🌊'} ${item.category_label || 'ข่าวสาร'}</span>
                <span class="badge-pill ${sevClass}">${sev}</span>
            </div>
        </div>
        <div class="card-body">
            <div class="card-meta">
                <span><i class="fa-regular fa-clock"></i> ${eventTimeStr}</span>
                <span><i class="fa-solid fa-location-dot"></i> ${locationStr}</span>
                ${item.magnitude ? `<span><i class="fa-solid fa-gauge-high"></i> M ${item.magnitude}</span>` : ''}
            </div>
            <h3 class="card-title">${item.title}</h3>
            <p class="card-desc">${item.summary || item.description || ''}</p>
            <div class="card-footer">
                <span class="source-tag">
                    <i class="fa-solid fa-tower-broadcast"></i> ${item.source_name || 'ศูนย์ข่าว'}
                </span>
                <span class="btn-read-more" onclick="openDetailModal(${index})">
                    อ่านฉบับเต็ม <i class="fa-solid fa-arrow-right"></i>
                </span>
            </div>
        </div>
    `;

    return card;
}

function checkUrgentAlerts(items) {
    const banner = document.getElementById("urgentBanner");
    const marquee = document.getElementById("urgentMarquee");
    
    // Find urgent / critical items
    const urgentItems = items.filter(x => {
        const s = (x.severity_level || x.warning_level || "").toLowerCase();
        return s.includes("วิกฤต") || s.includes("รุนแรง") || (x.magnitude && x.magnitude >= 5.0);
    });

    if (urgentItems.length > 0) {
        const text = urgentItems.slice(0, 4).map(x => `⚠️ ${x.title} (${x.source_name})`).join("  •  ");
        marquee.textContent = text;
        banner.style.display = "flex";
    } else {
        banner.style.display = "none";
    }
}

// ==============================================================================
// Tabs & Filters
// ==============================================================================
function selectTab(btn, category) {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = category;

    const newsView = document.getElementById("newsView");
    const mapView = document.getElementById("mapView");
    const analyticsView = document.getElementById("analyticsView");
    const filterSection = document.getElementById("filterSection");
    const titleEl = document.getElementById("currentCategoryTitle");

    if (category === "map") {
        newsView.style.display = "none";
        analyticsView.style.display = "none";
        mapView.style.display = "block";
        filterSection.style.display = "none";
        initDisasterMap();
        refreshMapSize();
    } else if (category === "analytics") {
        newsView.style.display = "none";
        mapView.style.display = "none";
        analyticsView.style.display = "block";
        filterSection.style.display = "none";
        loadStats();
    } else {
        newsView.style.display = "block";
        mapView.style.display = "none";
        analyticsView.style.display = "none";
        filterSection.style.display = "flex";

        const titles = {
            "all": "รายการข่าวสารและแจ้งเตือนทั้งหมด",
            "natural": "🌋 รายการข้อมูลภัยธรรมชาติ (Natural Disasters)",
            "hazard": "🔥 รายการภัยพิบัติและเหตุฉุกเฉิน (Disaster Hazards)",
            "forecast": "🌦️ พยากรณ์อากาศและเตือนภัยล่วงหน้า (Weather Forecasts)"
        };
        titleEl.textContent = titles[category] || titles["all"];

        loadNewsData();
    }
}

function filterCategory(cat) {
    const targetBtn = document.querySelector(`.tab-btn[data-category="${cat}"]`);
    if (targetBtn) {
        selectTab(targetBtn, cat);
    }
}

function onSearchChange() {
    clearTimeout(searchDebounceTimer);
    const input = document.getElementById("searchInput");
    const clearBtn = document.getElementById("searchClear");
    searchQuery = input.value.trim();

    clearBtn.style.display = searchQuery ? "block" : "none";

    searchDebounceTimer = setTimeout(() => {
        loadNewsData();
    }, 350);
}

function clearSearch() {
    const input = document.getElementById("searchInput");
    input.value = "";
    searchQuery = "";
    document.getElementById("searchClear").style.display = "none";
    loadNewsData();
}

function onFilterChange() {
    currentSeverity = document.getElementById("severitySelect").value;
    currentSource = document.getElementById("sourceSelect").value;
    loadNewsData();
}

function clearAllFilters() {
    document.getElementById("searchInput").value = "";
    document.getElementById("severitySelect").value = "";
    document.getElementById("sourceSelect").value = "";
    searchQuery = "";
    currentSeverity = "";
    currentSource = "";
    document.getElementById("searchClear").style.display = "none";
    filterCategory("all");
}

// ==============================================================================
// Manual Web Scraping Trigger
// ==============================================================================
function triggerManualScrape() {
    const btn = document.getElementById("btnScrape");
    const icon = document.getElementById("scrapeIcon");

    btn.disabled = true;
    icon.classList.add("fa-spin");
    showToast("กำลังเริ่มดึงข้อมูลจาก TMD, Air4Thai, USGS, GDACS...", "info");

    fetch("/api/scrape", { method: "POST" })
        .then(res => res.json())
        .then(data => {
            btn.disabled = false;
            icon.classList.remove("fa-spin");

            if (data.status === "success") {
                const sum = data.summary || {};
                showToast(`ดึงข้อมูลสำเร็จ! พบข่าวใหม่ ${sum.total_inserted || 0} รายการ (บันทึกลง Supabase แล้ว)`, "success");
                loadStats();
                loadNewsData();
                loadMapMarkers();
            } else if (data.status === "already_running") {
                showToast("ระบบกำลังดึงข้อมูลอยู่ในขณะนี้ กรุณารอสักครู่", "info");
            } else {
                showToast("การดึงข้อมูลเสร็จสิ้น", "info");
                loadNewsData();
            }
        })
        .catch(err => {
            btn.disabled = false;
            icon.classList.remove("fa-spin");
            showToast("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์", "error");
            console.error("Scrape error:", err);
        });
}

// ==============================================================================
// Modals (Detail & Supabase DB)
// ==============================================================================
function openDetailModal(index) {
    const item = allNewsData[index];
    if (!item) return;

    const modal = document.getElementById("detailModal");
    const badgesEl = document.getElementById("modalBadges");
    const titleEl = document.getElementById("modalTitle");
    const metaEl = document.getElementById("modalMeta");
    const descEl = document.getElementById("modalDesc");
    const imgEl = document.getElementById("modalImage");
    const gridEl = document.getElementById("modalDetailsGrid");
    const linkEl = document.getElementById("modalSourceLink");

    titleEl.textContent = item.title;
    descEl.textContent = item.detail || item.description || item.summary || "";
    imgEl.src = item.image_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800";
    linkEl.href = item.source_url || "#";

    const sev = item.severity_level || item.warning_level || "เฝ้าระวัง";
    badgesEl.innerHTML = `
        <span class="badge-pill badge-cat-natural">${item.category_icon || '🌊'} ${item.category_label || 'ข่าวสาร'}</span>
        <span class="badge-pill severity-watch">${sev}</span>
    `;

    metaEl.innerHTML = `
        <span><i class="fa-regular fa-clock"></i> ${timeAgo(item.event_time || item.incident_time || item.created_at)}</span> &nbsp;•&nbsp;
        <span><i class="fa-solid fa-tower-broadcast"></i> แหล่งที่มา: ${item.source_name || 'ทางการ'}</span>
    `;

    let detailsHtml = `
        <div><strong>ตารางฐานข้อมูล:</strong> <code>${item.table_source || 'natural_disasters'}</code></div>
        <div><strong>สถานที่ / ภาค:</strong> ${item.province || item.location_name || item.target_region || '-'}</div>
    `;

    if (item.magnitude) {
        detailsHtml += `<div><strong>ขนาดแผ่นดินไหว:</strong> ${item.magnitude} Richter (ลึก ${item.depth_km || 10} กม.)</div>`;
    }
    if (item.latitude && item.longitude) {
        detailsHtml += `<div><strong>พิกัด (Lat, Lng):</strong> ${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}</div>`;
    }
    if (item.temperature_max) {
        detailsHtml += `<div><strong>อุณหภูมิสูงสุด/ต่ำสุด:</strong> ${item.temperature_max}°C / ${item.temperature_min}°C</div>`;
    }
    if (item.rainfall_probability) {
        detailsHtml += `<div><strong>โอกาสเกิดฝน:</strong> ${item.rainfall_probability}</div>`;
    }

    gridEl.innerHTML = detailsHtml;
    modal.style.display = "flex";
}

function closeDetailModal() {
    document.getElementById("detailModal").style.display = "none";
}

function openDbModal() {
    document.getElementById("dbModal").style.display = "flex";
    checkTableStatuses();
}

function closeDbModal() {
    document.getElementById("dbModal").style.display = "none";
}

function checkTableStatuses() {
    fetch("/api/db-status")
        .then(res => res.json())
        .then(data => {
            if (data.status === "success" && data.tables) {
                const t = data.tables;
                updateBadge("tblStatusNatural", t.natural_disasters);
                updateBadge("tblStatusHazard", t.disaster_hazards);
                updateBadge("tblStatusForecast", t.weather_forecasts);
            }
        })
        .catch(err => console.error("Error checking table statuses:", err));
}

function updateBadge(elId, exists) {
    const el = document.getElementById(elId);
    if (!el) return;
    if (exists) {
        el.textContent = "✅ สร้างตารางแล้ว (Active)";
        el.className = "table-badge badge-normal";
        el.style.background = "#dcfce7";
        el.style.color = "#16a34a";
    } else {
        el.textContent = "⏳ รอรัน SQL บน Supabase";
        el.className = "table-badge badge-amber";
        el.style.background = "#fef3c7";
        el.style.color = "#d97706";
    }
}

function syncSupabaseTables() {
    const btn = document.getElementById("btnSyncDb");
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> กำลังตรวจสอบและซิงค์ข้อมูล...`;

    fetch("/api/sync-supabase", { method: "POST" })
        .then(res => res.json())
        .then(data => {
            btn.disabled = false;
            btn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> ตรวจสอบ & ซิงค์ข้อมูลเข้า Supabase`;
            checkTableStatuses();

            const t = data.tables_status || {};
            const allCreated = t.natural_disasters && t.disaster_hazards && t.weather_forecasts;
            if (allCreated) {
                showToast("ซิงค์ข้อมูลเข้า Supabase สำเร็จครบทุกตารางแล้ว!", "success");
            } else {
                showToast("ยังไม่พบตารางบน Supabase กรุณารัน SQL Schema ด้านล่างก่อน", "info");
            }
            loadStats();
        })
        .catch(err => {
            btn.disabled = false;
            btn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> ตรวจสอบ & ซิงค์ข้อมูลเข้า Supabase`;
            showToast("เกิดข้อผิดพลาดในการเชื่อมต่อ", "error");
        });
}

function loadSchemaSql() {
    fetch("/api/schema-sql")
        .then(res => res.json())
        .then(data => {
            if (data.status === "success" && data.sql) {
                document.getElementById("sqlCodeView").textContent = data.sql;
            }
        })
        .catch(err => console.error("Error loading schema SQL:", err));
}

function copySqlSchema() {
    const code = document.getElementById("sqlCodeView").textContent;
    navigator.clipboard.writeText(code).then(() => {
        const btnText = document.getElementById("copyBtnText");
        btnText.textContent = "คัดลอกเรียบร้อย!";
        setTimeout(() => {
            btnText.textContent = "คัดลอก SQL";
        }, 2000);
        showToast("คัดลอก SQL Schema เรียบร้อยแล้ว", "success");
    });
}

// Close modals when clicking overlay
window.onclick = function(e) {
    const detailModal = document.getElementById("detailModal");
    const dbModal = document.getElementById("dbModal");
    if (e.target === detailModal) detailModal.style.display = "none";
    if (e.target === dbModal) dbModal.style.display = "none";
};

// ==============================================================================
// Analytics & Charts (Chart.js)
// ==============================================================================
function updateAnalyticsCharts(stats) {
    const ctxCat = document.getElementById("categoryChart");
    const ctxSev = document.getElementById("severityChart");
    if (!ctxCat || !ctxSev) return;

    // 1. Category Chart
    const counts = stats.counts || {};
    const catData = [
        counts.natural_disasters || 0,
        counts.disaster_hazards || 0,
        counts.weather_forecasts || 0
    ];

    if (categoryChartInstance) {
        categoryChartInstance.destroy();
    }

    categoryChartInstance = new Chart(ctxCat, {
        type: 'doughnut',
        data: {
            labels: ['ภัยธรรมชาติ (natural_disasters)', 'ภัยพิบัติฉุกเฉิน (disaster_hazards)', 'พยากรณ์อากาศ (weather_forecasts)'],
            datasets: [{
                data: catData,
                backgroundColor: ['#0284c7', '#f59e0b', '#06b6d4'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { font: { family: 'Prompt' } } }
            }
        }
    });

    // 2. Severity Bar Chart
    const sev = stats.severity || {};
    const sevData = [
        sev["วิกฤต/รุนแรง"] || 0,
        sev["เตือนภัย"] || 0,
        sev["เฝ้าระวัง"] || 0,
        sev["ปกติ"] || 0
    ];

    if (severityChartInstance) {
        severityChartInstance.destroy();
    }

    severityChartInstance = new Chart(ctxSev, {
        type: 'bar',
        data: {
            labels: ['วิกฤต/รุนแรง', 'เตือนภัย', 'เฝ้าระวัง', 'ปกติ'],
            datasets: [{
                label: 'จำนวนเหตุการณ์',
                data: sevData,
                backgroundColor: ['#dc2626', '#f59e0b', '#0284c7', '#16a34a'],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
                x: { grid: { display: false } }
            }
        }
    });
}

// ==============================================================================
// Toast Notifications
// ==============================================================================
function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const icon = type === "success" ? "fa-circle-check text-green-500" :
                 type === "error" ? "fa-circle-xmark text-red-500" : "fa-circle-info text-blue-500";

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
        toast.style.transition = "all 0.3s ease";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
