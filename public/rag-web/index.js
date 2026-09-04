// Model Dictionary to match indices (8 Models)
const MODELS = {
    1: { name: "openthaigpt-thaillm-8b-instruct-v7.2", display: "OpenThaiGPT 8B v7.2", provider: "thaillm" },
    2: { name: "pathumma-thaillm-qwen3-8b-think-3.0.0", display: "Pathumma 8B Think 3.0", provider: "thaillm" },
    3: { name: "typhoon-s-thaillm-8b-instruct", display: "Typhoon-S 8B Instruct", provider: "thaillm" },
    4: { name: "ollama/gpt-oss:120b-cloud", display: "GPT-OSS 120B (Ollama)", provider: "ollama" },
    5: { name: "ollama/nemotron-3-super:cloud", display: "Nemotron-3 Super (Ollama)", provider: "ollama" },
    6: { name: "ollama/gemma4", display: "Gemma 4 31B (Ollama)", provider: "ollama" },
    7: { name: "openrouter/deepseek-r1:free", display: "DeepSeek R1 (OpenRouter)", provider: "openrouter" },
    8: { name: "openrouter/llama-3.3-70b:free", display: "Llama 3.3 70B (OpenRouter)", provider: "openrouter" }
};

// Distinct premium colors for each of the 8 models
const MODEL_COLORS = {
    1: { border: '#f97316', bg: 'rgba(249, 115, 22, 0.75)' }, // OpenThaiGPT: Orange
    2: { border: '#eab308', bg: 'rgba(234, 179, 8, 0.75)' },  // Pathumma: Yellow
    3: { border: '#10b981', bg: 'rgba(16, 185, 129, 0.75)' }, // Typhoon: Green
    4: { border: '#06b6d4', bg: 'rgba(6, 182, 212, 0.75)' },  // GPT-OSS: Cyan
    5: { border: '#6366f1', bg: 'rgba(99, 102, 241, 0.75)' }, // Nemotron: Indigo
    6: { border: '#f43f5e', bg: 'rgba(244, 63, 94, 0.75)' },  // Gemma: Rose
    7: { border: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.75)' }, // DeepSeek R1: Purple
    8: { border: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.75)' }  // Llama 3.3: Sky Blue
};

// Suggestions Data
const SUGGESTIONS = {
    mode1: [
        "แต่งกลอนสี่แนะแนวป้องกันน้ำท่วม",
        "ทฤษฎีสัมพัทธภาพของไอน์สไตน์ย่อใน 3 บรรทัด",
        "ขอไอเดียตั้งชื่อร้านชาบูสไตล์ฟิวชั่น 5 ชื่อ",
        "เขียนโค้ด Python เรียงลำดับตัวเลขแบบ Quicksort"
    ],
    mode2: [
        "ใน schema public มีตารางอะไรบ้าง และมีข้อมูลอะไรบ้าง",
        "พยากรณ์อากาศในกรุงเทพมหานครและปริมณฑลเป็นอย่างไร",
        "ข้อมูลค่าความชื้นและการตรวจจับฝนจากเซ็นเซอร์ from_rain_sensor เป็นอย่างไร",
        "ค่าฝุ่นละออง PM2.5 และคุณภาพอากาศล่าสุดจากตาราง pm_logs มีเท่าไร",
        "มีรายงานแผ่นดินไหวล่าสุดเกิดขึ้นที่ไหนและขนาดเท่าไหร่บ้าง",
        "ขอข้อมูลผู้ประสบภัยจากตาราง victim_reports และรายงานเหตุการณ์ incident_reports",
        "สรุปข้อมูลการเตรียมตัวรับมือภัยพิบัติในตาราง documents",
        "ข้อเสนอแนะในการปรับปรุงระบบจากแบบประเมิน satisfaction_surveys มีอะไรบ้าง",
        "ตาราง demo_app_surveys มีความคิดเห็นเกี่ยวกับ UX อย่างไรบ้าง"
    ]
};

const STORAGE_KEY = 'dmind_rag_history_v3';

function getLocalHistory() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.warn("Error reading local history:", e);
        return [];
    }
}

function saveLocalHistory(hist) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(hist));
    } catch (e) {
        console.warn("Error saving local history:", e);
    }
}

// Application State
let currentState = {
    activeTab: 'chat-tab',
    currentQueryId: null,
    currentQueryText: "",
    currentMode: "mode1",
    currentContext: "",
    selectedHistoryQueryId: null,
    isQuerying: false,
    stats: null,
    history: getLocalHistory(),
    chartInstance: null,
    timerInterval: null,
    overallStartTime: null
};

// Base URL resolution for both Web server and file:/// direct browsing
function getApiBaseUrl() {
    const customUrl = localStorage.getItem("custom_api_base_url");
    if (customUrl) return customUrl.replace(/\/+$/, "");
    if (window.location.protocol === "file:") {
        return "https://d-mind-six.vercel.app";
    }
    return "";
}

async function apiFetch(endpoint, options = {}) {
    const baseUrl = getApiBaseUrl();
    const url = baseUrl ? `${baseUrl}${endpoint}` : endpoint;
    return fetch(url, options);
}

// Calculate comprehensive statistics from history list
function computeStatsFromHistory(historyList) {
    const stats = {
        total_questions: historyList.length,
        mode1_count: historyList.filter(h => h.mode === 'mode1').length,
        mode2_count: historyList.filter(h => h.mode === 'mode2').length,
        models: {}
    };

    // Ensure all 8 models have a clean base entry
    Object.keys(MODELS).forEach(idx => {
        const m = MODELS[idx];
        stats.models[m.name] = {
            avg_rating: 0,
            avg_accuracy: 0,
            avg_latency: 0,
            avg_hallucination: 0,
            count: 0
        };
    });

    if (historyList.length === 0) return stats;

    Object.keys(MODELS).forEach(idx => {
        const m = MODELS[idx];
        const mName = m.name;
        
        let sumCorrect = 0;
        let sumHallucinated = 0;
        let sumLatency = 0;
        let count = 0;

        historyList.forEach(item => {
            if (item.responses && Array.isArray(item.responses)) {
                const resp = item.responses.find(r => r.model_name === mName || r.model_index == idx);
                if (resp && (resp.status_code === 200 || !resp.status_code)) {
                    count++;
                    sumCorrect += (resp.is_correct === 1 ? 1 : (resp.is_correct === 0 ? 0 : 1));
                    sumHallucinated += (resp.is_hallucinated === 1 ? 1 : 0);
                    const lat = Number(resp.latency_ms) || 0;
                    sumLatency += lat;
                }
            }
        });

        if (count > 0) {
            stats.models[mName] = {
                avg_rating: (sumCorrect / count) * 100,
                avg_accuracy: (sumCorrect / count) * 100,
                avg_latency: sumLatency / count,
                avg_hallucination: (sumHallucinated / count) * 100,
                count: count
            };
        }
    });

    return stats;
}

// Initialize Application
function initApp() {
    setupTheme();
    setupTabNavigation();
    setupModeSelector();
    setupEventListeners();
    setupServerModal();
    refreshSuggestions();
    loadStats();
    loadHistory();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}

// Theme Manager (Dark/Light mode toggle initialization)
function setupTheme() {
    const themeBtn = document.getElementById("theme-toggle-btn");
    const savedTheme = localStorage.getItem("theme") || "dark";
    if (savedTheme === "light") {
        document.body.classList.remove("dark-mode");
        document.body.classList.add("light-mode");
        if (themeBtn) themeBtn.innerHTML = `<i class="fa-solid fa-moon"></i> <span>โหมดมืด</span>`;
    } else {
        document.body.classList.remove("light-mode");
        document.body.classList.add("dark-mode");
        if (themeBtn) themeBtn.innerHTML = `<i class="fa-solid fa-sun"></i> <span>โหมดสว่าง</span>`;
    }
}

// Tab Navigation Manager
function setupTabNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn[data-tab]");
    const tabPanels = document.querySelectorAll(".tab-panel");

    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const tabId = btn.getAttribute("data-tab");
            if (!tabId) return;
            const targetPanel = document.getElementById(tabId);
            if (!targetPanel) return;
            
            navButtons.forEach(b => b.classList.remove("active"));
            tabPanels.forEach(p => p.classList.remove("active"));
            
            btn.classList.add("active");
            targetPanel.classList.add("active");
            
            currentState.activeTab = tabId;
            
            if (tabId === 'analytics-tab') {
                loadStats().then(() => renderChart());
            } else if (tabId === 'history-tab') {
                loadHistory();
            }
        });
    });
}

// Mode Selection Handler
function setupModeSelector() {
    const radioButtons = document.querySelectorAll("input[name='query-mode']");
    radioButtons.forEach(radio => {
        radio.addEventListener("change", () => {
            refreshSuggestions();
        });
    });
}

// Populate Suggestions depending on Mode selected
function refreshSuggestions() {
    const mode = getSelectedMode();
    const container = document.getElementById("suggestion-tags-container");
    if (!container) return;
    container.innerHTML = "";
    
    SUGGESTIONS[mode].forEach(s => {
        const tag = document.createElement("div");
        tag.className = "tag";
        tag.textContent = s;
        tag.addEventListener("click", () => {
            if (!currentState.isQuerying) {
                const queryInput = document.getElementById("query-input");
                if (queryInput) queryInput.value = s;
            }
        });
        container.appendChild(tag);
    });
}

function getSelectedMode() {
    const checked = document.querySelector("input[name='query-mode']:checked");
    return checked ? checked.value : "mode1";
}

// Setup Event Listeners for action elements
function setupEventListeners() {
    // Send Question Button
    const sendBtn = document.getElementById("send-btn");
    if (sendBtn) sendBtn.addEventListener("click", handleSendQuery);
    
    // Clear History Button
    const clearBtn = document.getElementById("clear-history-btn");
    if (clearBtn) clearBtn.addEventListener("click", handleClearHistory);
    
    // Delete Current Active Query Button
    const deleteCurrBtn = document.getElementById("delete-current-btn");
    if (deleteCurrBtn) {
        deleteCurrBtn.addEventListener("click", () => {
            if (currentState.selectedHistoryQueryId) {
                const q = currentState.history.find(h => h.id === currentState.selectedHistoryQueryId);
                const queryText = q ? q.query_text : "คำถามนี้";
                handleDeleteQuery(currentState.selectedHistoryQueryId, queryText);
            }
        });
    }
    
    // Refresh Supabase Cache Button
    const refreshBtn = document.getElementById("refresh-supabase-btn");
    if (refreshBtn) refreshBtn.addEventListener("click", handleRefreshSupabase);
    
    // Graph Controls Change
    const graphMetric = document.getElementById("graph-metric");
    const graphType = document.getElementById("graph-type");
    if (graphMetric) graphMetric.addEventListener("change", renderChart);
    if (graphType) graphType.addEventListener("change", renderChart);

    // Theme Toggle Button click handler
    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            const isDark = document.body.classList.contains("dark-mode");
            
            if (isDark) {
                document.body.classList.remove("dark-mode");
                document.body.classList.add("light-mode");
                themeBtn.innerHTML = `<i class="fa-solid fa-moon"></i> <span>โหมดมืด</span>`;
                localStorage.setItem("theme", "light");
            } else {
                document.body.classList.remove("light-mode");
                document.body.classList.add("dark-mode");
                themeBtn.innerHTML = `<i class="fa-solid fa-sun"></i> <span>โหมดสว่าง</span>`;
                localStorage.setItem("theme", "dark");
            }
            
            // Re-render chart if it exists to update font and grid colors for current theme
            if (currentState.activeTab === 'analytics-tab') {
                renderChart();
            }
        });
    }
}

// Setup Server Configuration Modal
function setupServerModal() {
    const modal = document.getElementById("server-modal");
    const settingsBtn = document.getElementById("server-settings-btn");
    const closeBtn = document.getElementById("close-modal-btn");
    const cancelBtn = document.getElementById("cancel-modal-btn");
    const saveBtn = document.getElementById("save-modal-btn");
    const setCloudBtn = document.getElementById("set-cloud-btn");
    const setLocalBtn = document.getElementById("set-local-btn");
    const testBtn = document.getElementById("test-connection-btn");
    const input = document.getElementById("server-url-input");
    const statusMsg = document.getElementById("connection-status-msg");

    if (!modal || !settingsBtn) return;

    function openModal() {
        const savedUrl = localStorage.getItem("custom_api_base_url");
        if (savedUrl) {
            input.value = savedUrl;
        } else if (window.location.protocol === "file:") {
            input.value = "https://d-mind-six.vercel.app";
        } else {
            input.value = window.location.origin;
        }
        statusMsg.textContent = "";
        statusMsg.className = "";
        modal.classList.remove("hidden");
    }

    function closeModal() {
        modal.classList.add("hidden");
    }

    settingsBtn.addEventListener("click", openModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
    
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    function testConnection(overrideUrl) {
        const targetUrl = (overrideUrl !== undefined ? overrideUrl : input.value.trim()).replace(/\/+$/, "");
        statusMsg.style.color = "var(--text-muted)";
        statusMsg.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังทดสอบการเชื่อมต่อ...';
        
        if (window.location.protocol === 'https:' && targetUrl.startsWith('http:')) {
            statusMsg.style.color = "#f43f5e";
            statusMsg.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> เบราว์เซอร์บล็อกการเชื่อมต่อ HTTP จากหน้า HTTPS (Mixed Content) กรุณาใช้ Cloud Backend หรือเปิดผ่าน localhost';
            return;
        }

        const testEndpoint = targetUrl ? `${targetUrl}/api/health` : "/api/health";
        fetch(testEndpoint, { method: "GET" })
            .then(async (res) => {
                if (res.ok) {
                    const data = await res.json();
                    statusMsg.style.color = "#10b981";
                    statusMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> เชื่อมต่อสำเร็จ! (สถานะ: ${data.status || 'OK'})`;
                } else {
                    statusMsg.style.color = "#f43f5e";
                    statusMsg.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ไม่สามารถเชื่อมต่อได้ (HTTP ${res.status})`;
                }
            })
            .catch((err) => {
                statusMsg.style.color = "#f43f5e";
                statusMsg.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> เชื่อมต่อล้มเหลว (${err.message})`;
            });
    }

    if (setCloudBtn) {
        setCloudBtn.addEventListener("click", () => {
            input.value = "https://d-mind-six.vercel.app";
            testConnection("https://d-mind-six.vercel.app");
        });
    }

    if (setLocalBtn) {
        setLocalBtn.addEventListener("click", () => {
            input.value = "http://localhost:8080";
            testConnection("http://localhost:8080");
        });
    }

    if (testBtn) {
        testBtn.addEventListener("click", () => testConnection());
    }

    if (saveBtn) {
        saveBtn.addEventListener("click", () => {
            const url = (input.value.trim() || "").replace(/\/+$/, "");
            if (url) {
                localStorage.setItem("custom_api_base_url", url);
            } else {
                localStorage.removeItem("custom_api_base_url");
            }
            showToast("บันทึกการตั้งค่า API Base URL เรียบร้อยแล้ว", "success");
            closeModal();
            loadStats();
            loadHistory();
        });
    }
}

// Toast System
function showToast(message, type = 'info') {
    const toast = document.getElementById("toast");
    const icon = document.getElementById("toast-icon");
    const msgSpan = document.getElementById("toast-message");
    if (!toast || !icon || !msgSpan) return;
    
    toast.className = `toast toast-${type}`;
    msgSpan.textContent = message;
    
    if (type === 'success') {
        icon.className = "fa-solid fa-circle-check";
    } else if (type === 'error') {
        icon.className = "fa-solid fa-circle-exclamation";
    } else {
        icon.className = "fa-solid fa-circle-info";
    }
    
    toast.classList.remove("hidden");
    
    setTimeout(() => {
        toast.classList.add("hidden");
    }, 4000);
}

// Handle trigger when sending a query
async function handleSendQuery() {
    const queryInput = document.getElementById("query-input");
    const queryText = queryInput ? queryInput.value.trim() : "";
    const mode = getSelectedMode();
    
    if (!queryText) {
        showToast("กรุณาพิมพ์คำถามก่อนส่ง", "error");
        return;
    }
    
    if (currentState.isQuerying) return;
    
    currentState.isQuerying = true;
    toggleInputState(true);
    
    // Reset RAG matches view
    const ragPanel = document.getElementById("rag-matches-panel");
    const ragList = document.getElementById("rag-matches-list");
    if (ragPanel) ragPanel.classList.add("hidden");
    if (ragList) ragList.innerHTML = "";
    
    // Initialize LLM grid cards
    initializeLLMGrid();
    
    // Start Overall Timer
    startTimer();
    
    try {
        // Step 1: Start Query on server
        const startResponse = await apiFetch("/api/start_query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: queryText, mode: mode })
        });
        
        let startData = {};
        if (startResponse.ok) {
            startData = await startResponse.json();
            currentState.currentQueryId = startData.query_id;
            currentState.currentQueryText = queryText;
            currentState.currentMode = mode;
            currentState.currentContext = startData.context || "";
        } else {
            currentState.currentQueryId = Date.now();
            currentState.currentQueryText = queryText;
            currentState.currentMode = mode;
            currentState.currentContext = "";
        }
        
        // Show RAG Matches if Mode 1 or Mode 2
        if (startData.matches && startData.matches.length > 0) {
            if (ragPanel) ragPanel.classList.remove("hidden");
            startData.matches.forEach(m => {
                const matchDiv = document.createElement("div");
                matchDiv.className = "match-item";
                matchDiv.innerHTML = `
                    <div class="match-meta">
                        <span class="match-table"><i class="fa-solid fa-table"></i> ${m.table}</span>
                        <span class="match-cols">คอลัมน์: ${m.columns.join(", ")}</span>
                    </div>
                    <div class="match-summary">${m.summary}</div>
                `;
                if (ragList) ragList.appendChild(matchDiv);
            });
        } else if (mode === "mode1" || mode === "mode2") {
            if (ragPanel) ragPanel.classList.remove("hidden");
            if (ragList) ragList.innerHTML = `<div style="font-size:0.8rem;color:var(--text-muted);font-style:italic;">ไม่พบข้อมูลอ้างอิงตรงกับคำค้นหาใน Supabase</div>`;
        }
        
        // Step 2: Query 8 LLM models in parallel (asynchronously)
        const modelPromises = Object.keys(MODELS).map(idx => {
            return askModel(currentState.currentQueryId, idx, queryText, mode, currentState.currentContext);
        });
        
        // Wait for all 8 models to resolve and collect results
        const modelResults = await Promise.all(modelPromises);
        
        // Package into history item and save locally
        const newHistoryItem = {
            id: currentState.currentQueryId || Date.now(),
            query_text: queryText,
            mode: mode,
            timestamp: new Date().toISOString(),
            responses: modelResults
        };

        currentState.history = [newHistoryItem, ...currentState.history.filter(h => h.id !== newHistoryItem.id)];
        saveLocalHistory(currentState.history);

        showToast("ประมวลผลคำถามเสร็จสมบูรณ์ทั้ง 8 โมเดลแล้ว!", "success");
        
    } catch (err) {
        console.error("Error querying models:", err);
        showToast("เกิดข้อผิดพลาดในการประมวลผล: " + err.message, "error");
    } finally {
        stopTimer();
        currentState.isQuerying = false;
        toggleInputState(false);
        loadStats(); // Update stats cards, evaluation table, and graphs
    }
}

// Start visual execution timer
function startTimer() {
    const timerBox = document.getElementById("timer-box");
    const timerVal = document.getElementById("total-timer");
    if (timerBox) timerBox.classList.remove("hidden");
    
    currentState.overallStartTime = Date.now();
    currentState.timerInterval = setInterval(() => {
        const elapsed = (Date.now() - currentState.overallStartTime) / 1000;
        if (timerVal) timerVal.textContent = elapsed.toFixed(2);
    }, 50);
}

// Stop execution timer
function stopTimer() {
    if (currentState.timerInterval) {
        clearInterval(currentState.timerInterval);
        currentState.timerInterval = null;
    }
    const elapsed = (Date.now() - (currentState.overallStartTime || Date.now())) / 1000;
    const timerVal = document.getElementById("total-timer");
    if (timerVal) timerVal.textContent = elapsed.toFixed(2);
}

// Toggle loading controls for inputs
function toggleInputState(disabled) {
    const sendBtn = document.getElementById("send-btn");
    const queryInput = document.getElementById("query-input");
    if (sendBtn) sendBtn.disabled = disabled;
    if (queryInput) queryInput.disabled = disabled;
    document.querySelectorAll("input[name='query-mode']").forEach(radio => {
        radio.disabled = disabled;
    });
    
    const sendBtnSpan = document.querySelector("#send-btn span");
    if (sendBtnSpan) {
        if (disabled) {
            sendBtnSpan.textContent = "กำลังประมวลผลคำถาม...";
            if (sendBtn) sendBtn.style.opacity = "0.7";
        } else {
            sendBtnSpan.textContent = "ส่งคำถาม (8 โมเดล)";
            if (sendBtn) sendBtn.style.opacity = "1";
        }
    }
}

// Initialize clean placeholders in LLM Response cards
function initializeLLMGrid() {
    const grid = document.getElementById("llm-grid-container");
    if (!grid) return;
    grid.innerHTML = "";
    
    Object.keys(MODELS).forEach(idx => {
        const model = MODELS[idx];
        const card = document.createElement("div");
        card.className = "model-card";
        card.id = `model-card-${idx}`;
        
        const color = MODEL_COLORS[idx] ? MODEL_COLORS[idx].border : '#4b5563';
        card.style.borderTop = `4px solid ${color}`;
        
        card.innerHTML = `
            <div class="card-header">
                <div class="model-title-block">
                    <h4>${model.display}</h4>
                    <span class="provider-badge badge-${model.provider}">${model.provider === 'thaillm' ? 'ThaiLLM API' : model.provider === 'openrouter' ? 'OpenRouter' : model.provider === 'google' ? 'Google API' : 'Ollama Cloud'}</span>
                </div>
                <div class="card-status-block">
                    <span class="status-indicator status-waiting" id="status-indicator-${idx}"></span>
                </div>
            </div>
            <div class="card-body" id="card-body-${idx}">
                <div class="loader-wrapper" id="loader-${idx}">
                    <div class="spinner"></div>
                    <span class="loader-text">รอสัญญาณเริ่ม...</span>
                </div>
                <div class="placeholder-text">เตรียมประมวลผล</div>
            </div>
            <div class="card-footer" style="flex-direction: column; align-items: stretch; gap: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <div class="latency-info" id="latency-${idx}">
                        <i class="fa-regular fa-clock"></i> <span>-</span>
                    </div>
                </div>
                <div class="evaluation-widget hidden" id="rating-widget-${idx}">
                    <div class="eval-row">
                        <span class="eval-label">ความถูกต้อง:</span>
                        <div class="eval-btn-group">
                            <button class="eval-btn eval-btn-success active" id="btn-correct-1-${idx}"><i class="fa-solid fa-check"></i> ถูก</button>
                            <button class="eval-btn eval-btn-danger" id="btn-correct-0-${idx}"><i class="fa-solid fa-xmark"></i> ผิด</button>
                        </div>
                    </div>
                    <div class="eval-row">
                        <span class="eval-label">อัตราการหลอน:</span>
                        <div class="eval-btn-group">
                            <button class="eval-btn eval-btn-warning" id="btn-hallucinated-1-${idx}"><i class="fa-solid fa-triangle-exclamation"></i> หลอน</button>
                            <button class="eval-btn eval-btn-info active" id="btn-hallucinated-0-${idx}"><i class="fa-solid fa-shield-halved"></i> ไม่หลอน</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Helper to escape HTML characters in text
function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Request details for an individual model asynchronously
async function askModel(queryId, modelIndex, queryText = "", mode = "mode1", context = "") {
    const indicator = document.getElementById(`status-indicator-${modelIndex}`);
    const loaderText = document.querySelector(`#loader-${modelIndex} .loader-text`);
    const modelStart = Date.now();
    
    // Set status to loading
    if (indicator) indicator.className = "status-indicator status-loading";
    if (loaderText) loaderText.textContent = "กำลังพิมพ์คำตอบ...";
    
    let result = {
        id: Date.now() + parseInt(modelIndex),
        model_index: parseInt(modelIndex),
        model_name: MODELS[modelIndex].name,
        display_name: MODELS[modelIndex].display,
        response_text: "",
        latency_ms: 0,
        status_code: 500,
        is_correct: 1,
        is_hallucinated: 0
    };

    try {
        const payload = {
            query_id: queryId,
            model_index: modelIndex,
            query: queryText || (currentState.currentQueryText || ""),
            mode: mode || (currentState.currentMode || "mode1"),
            context: context || (currentState.currentContext || "")
        };

        const response = await apiFetch("/api/ask_model", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        
        let data = {};
        try {
            data = await response.json();
        } catch (e) {
            data = {
                status_code: response.status,
                error: `HTTP ${response.status}: ${response.statusText || 'Server Response Error'}`
            };
        }
        
        const elapsedMs = (typeof data.latency_ms === "number" && !isNaN(data.latency_ms) && data.latency_ms > 0)
            ? data.latency_ms
            : (Date.now() - modelStart);

        let text = data.response_text;
        if (text === undefined || text === null || text === "") {
            if (data.error) {
                text = typeof data.error === 'string' ? data.error : (data.error.message || JSON.stringify(data.error));
            } else if (data.message) {
                text = data.message;
            } else if (!response.ok) {
                text = `เกิดข้อผิดพลาดในการเชื่อมต่อ (HTTP ${response.status})`;
            } else {
                text = "(โมเดลไม่ส่งข้อความตอบกลับกลับมา)";
            }
        }

        const isSuccess = response.ok && (data.status_code === 200 || !data.status_code);
        const statusCode = isSuccess ? 200 : (data.status_code || response.status || 500);
        const isCorrect = (data.is_correct !== undefined) ? data.is_correct : (isSuccess ? 1 : 0);
        const isHallucinated = (data.is_hallucinated !== undefined) ? data.is_hallucinated : 0;

        result = {
            id: data.response_id || (Date.now() + parseInt(modelIndex)),
            model_index: parseInt(modelIndex),
            model_name: MODELS[modelIndex].name,
            display_name: MODELS[modelIndex].display,
            response_text: text,
            latency_ms: elapsedMs,
            status_code: statusCode,
            is_correct: isCorrect,
            is_hallucinated: isHallucinated
        };

        // Remove loader and placeholder
        const bodyDiv = document.getElementById(`card-body-${modelIndex}`);
        const footerLatency = document.querySelector(`#latency-${modelIndex} span`);
        const ratingWidget = document.getElementById(`rating-widget-${modelIndex}`);
        
        if (footerLatency) {
            footerLatency.textContent = `${(elapsedMs / 1000).toFixed(2)}s`;
        }
        
        if (bodyDiv) {
            bodyDiv.innerHTML = "";
            if (isSuccess) {
                if (indicator) indicator.className = "status-indicator status-success";
                
                // Format response with highlighting for table references in RAG Mode
                let formattedText = String(text).replace(/(ตาราง\s+[a-zA-Z0-9_]+)/g, '<strong style="color:var(--primary-light);">$1</strong>');
                
                // Format <think> reasoning tags into collapsible block
                if (formattedText.includes('<think>')) {
                    if (formattedText.includes('</think>')) {
                        formattedText = formattedText.replace(/<think>([\s\S]*?)<\/think>/gi, (match, p1) => {
                            return `<details class="think-box"><summary><i class="fa-solid fa-brain"></i> กระบวนการคิดวิเคราะห์ (Reasoning)</summary><div class="think-content">${p1.trim().replace(/\n/g, '<br>')}</div></details>`;
                        });
                    } else {
                        formattedText = formattedText.replace(/<think>([\s\S]*)/gi, (match, p1) => {
                            return `<details class="think-box" open><summary><i class="fa-solid fa-brain"></i> กระบวนการคิดวิเคราะห์ (Reasoning)</summary><div class="think-content">${p1.trim().replace(/\n/g, '<br>')}</div></details>`;
                        });
                    }
                }
                
                bodyDiv.innerHTML = `<div class="response-text">${formattedText}</div>`;
                
                // Show interactive ratings stars widget
                if (ratingWidget) ratingWidget.classList.remove("hidden");
                setupEvaluationListeners(queryId, modelIndex, MODELS[modelIndex].name, isCorrect, isHallucinated);
            } else {
                if (indicator) indicator.className = "status-indicator status-error";
                bodyDiv.innerHTML = `<div class="error-text">${escapeHtml(text)}</div>`;
            }
        }
        
    } catch (err) {
        console.error(`Error with model ${modelIndex}:`, err);
        const elapsedMs = Date.now() - modelStart;
        result = {
            id: Date.now() + parseInt(modelIndex),
            model_index: parseInt(modelIndex),
            model_name: MODELS[modelIndex].name,
            display_name: MODELS[modelIndex].display,
            response_text: `ข้อผิดพลาดในการเชื่อมต่อ: ${err.message}`,
            latency_ms: elapsedMs,
            status_code: 500,
            is_correct: 0,
            is_hallucinated: 0
        };
        if (indicator) indicator.className = "status-indicator status-error";
        const bodyDiv = document.getElementById(`card-body-${modelIndex}`);
        const footerLatency = document.querySelector(`#latency-${modelIndex} span`);
        if (footerLatency) footerLatency.textContent = `${(elapsedMs / 1000).toFixed(2)}s`;
        if (bodyDiv) bodyDiv.innerHTML = `<div class="error-text">ข้อผิดพลาดในการเชื่อมต่อ: ${escapeHtml(err.message)}</div>`;
    }

    return result;
}

// Evaluation buttons change events
function setupEvaluationListeners(queryId, modelIndex, modelName, initialCorrect = 1, initialHallucinated = 0) {
    const correctBtn1 = document.getElementById(`btn-correct-1-${modelIndex}`);
    const correctBtn0 = document.getElementById(`btn-correct-0-${modelIndex}`);
    const hallucinatedBtn1 = document.getElementById(`btn-hallucinated-1-${modelIndex}`);
    const hallucinatedBtn0 = document.getElementById(`btn-hallucinated-0-${modelIndex}`);

    if (!correctBtn1 || !correctBtn0 || !hallucinatedBtn1 || !hallucinatedBtn0) return;

    function updateButtonsVisuals(correctVal, hallucinatedVal) {
        if (correctVal === 1) {
            correctBtn1.classList.add("active");
            correctBtn0.classList.remove("active");
        } else if (correctVal === 0) {
            correctBtn1.classList.remove("active");
            correctBtn0.classList.add("active");
        }

        if (hallucinatedVal === 1) {
            hallucinatedBtn1.classList.add("active");
            hallucinatedBtn0.classList.remove("active");
        } else if (hallucinatedVal === 0) {
            hallucinatedBtn1.classList.remove("active");
            hallucinatedBtn0.classList.add("active");
        }
    }

    // Set initial visual states
    updateButtonsVisuals(initialCorrect, initialHallucinated);

    correctBtn1.onclick = () => saveEvaluation(queryId, modelName, 1, null, () => updateButtonsVisuals(1, null));
    correctBtn0.onclick = () => saveEvaluation(queryId, modelName, 0, null, () => updateButtonsVisuals(0, null));
    hallucinatedBtn1.onclick = () => saveEvaluation(queryId, modelName, null, 1, () => updateButtonsVisuals(null, 1));
    hallucinatedBtn0.onclick = () => saveEvaluation(queryId, modelName, null, 0, () => updateButtonsVisuals(null, 0));
}

async function saveEvaluation(queryId, modelName, isCorrect, isHallucinated, onSuccessCallback) {
    const payload = {
        query_id: queryId,
        model_name: modelName
    };
    if (isCorrect !== null) payload.is_correct = isCorrect;
    if (isHallucinated !== null) payload.is_hallucinated = isHallucinated;

    // Update in local history immediately
    if (currentState.history && currentState.history.length > 0) {
        let updated = false;
        currentState.history.forEach(item => {
            if (item.id === queryId || !queryId) {
                if (item.responses && Array.isArray(item.responses)) {
                    const r = item.responses.find(resp => resp.model_name === modelName);
                    if (r) {
                        if (isCorrect !== null) r.is_correct = isCorrect;
                        if (isHallucinated !== null) r.is_hallucinated = isHallucinated;
                        updated = true;
                    }
                }
            }
        });
        if (updated) {
            saveLocalHistory(currentState.history);
        }
    }

    try {
        const response = await apiFetch("/api/rate_response", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        
        const displayModel = getModelDisplayName(modelName);
        showToast(`ประเมินผลสำหรับ ${displayModel} เรียบร้อยแล้ว`, "success");
        if (onSuccessCallback) onSuccessCallback();
        loadStats();
    } catch (err) {
        console.warn("Backend rate response error (saved locally):", err);
        const displayModel = getModelDisplayName(modelName);
        showToast(`บันทึกการประเมินผลสำหรับ ${displayModel} เรียบร้อยแล้ว`, "success");
        if (onSuccessCallback) onSuccessCallback();
        loadStats();
    }
}

// Load statistics from database & calculate from local history
async function loadStats() {
    // 1. Calculate base stats from current client history
    const localStats = computeStatsFromHistory(currentState.history);
    let finalStats = localStats;

    try {
        const resp = await apiFetch("/api/stats");
        if (resp.ok) {
            const serverStats = await resp.json();
            if (serverStats && serverStats.models) {
                finalStats = {
                    total_questions: Math.max(serverStats.total_questions || 0, localStats.total_questions || 0),
                    mode1_count: Math.max(serverStats.mode1_count || 0, localStats.mode1_count || 0),
                    mode2_count: Math.max(serverStats.mode2_count || 0, localStats.mode2_count || 0),
                    models: {}
                };

                // Merge all 8 models across server and client
                Object.keys(MODELS).forEach(idx => {
                    const mName = MODELS[idx].name;
                    const sModel = serverStats.models[mName];
                    const lModel = localStats.models[mName];

                    if (lModel && lModel.count > 0 && (!sModel || lModel.count >= (sModel.count || 0))) {
                        finalStats.models[mName] = lModel;
                    } else if (sModel && sModel.count > 0) {
                        finalStats.models[mName] = sModel;
                    } else {
                        finalStats.models[mName] = lModel || { avg_rating: 0, avg_accuracy: 0, avg_latency: 0, avg_hallucination: 0, count: 0 };
                    }
                });
            }
        }
    } catch (err) {
        console.warn("Using client-side stats due to server stats lookup:", err);
    }

    currentState.stats = finalStats;
    
    // Update top-bar statistics indicators
    const totalQueriesEl = document.getElementById("total-queries-badge");
    const mode1QueriesEl = document.getElementById("mode1-queries-badge");
    const mode2QueriesEl = document.getElementById("mode2-queries-badge");
    if (totalQueriesEl) totalQueriesEl.textContent = finalStats.total_questions;
    if (mode1QueriesEl) mode1QueriesEl.textContent = finalStats.mode1_count;
    if (mode2QueriesEl) mode2QueriesEl.textContent = finalStats.mode2_count;
    
    // Update analytics screen details
    let topAccModel = "-";
    let topAccVal = 0;
    let topSpeedModel = "-";
    let topSpeedVal = Infinity;
    let sumRating = 0;
    let countRating = 0;
    
    Object.keys(MODELS).forEach(idx => {
        const m = MODELS[idx];
        const mStats = finalStats.models[m.name];
        
        if (mStats && mStats.count > 0) {
            if (mStats.avg_accuracy > topAccVal) {
                topAccVal = mStats.avg_accuracy;
                topAccModel = m.display;
            }
            
            if (mStats.avg_latency < topSpeedVal && mStats.avg_latency > 0) {
                topSpeedVal = mStats.avg_latency;
                topSpeedModel = m.display;
            }
            
            sumRating += mStats.avg_accuracy;
            countRating++;
        }
    });

    const topAccModelEl = document.getElementById("top-accuracy-model");
    const topAccValEl = document.getElementById("top-accuracy-value");
    const topSpeedModelEl = document.getElementById("top-speed-model");
    const topSpeedValEl = document.getElementById("top-speed-value");
    const overallRatingEl = document.getElementById("overall-rating-avg");
    
    if (countRating > 0) {
        if (topAccModelEl) topAccModelEl.textContent = topAccModel;
        if (topAccValEl) topAccValEl.textContent = `ค่าเฉลี่ย: ${topAccVal.toFixed(1)}%`;
        
        if (topSpeedModelEl) topSpeedModelEl.textContent = topSpeedModel;
        if (topSpeedValEl) topSpeedValEl.textContent = (topSpeedVal < Infinity) ? `ความเร็วเฉลี่ย: ${(topSpeedVal / 1000).toFixed(2)}s` : "ความเร็วเฉลี่ย: 0.00s";
        
        const overallAvg = sumRating / countRating;
        if (overallRatingEl) overallRatingEl.textContent = `${overallAvg.toFixed(1)} %`;
    } else {
        if (topAccModelEl) topAccModelEl.textContent = "-";
        if (topAccValEl) topAccValEl.textContent = "ค่าเฉลี่ย: 0.0%";
        if (topSpeedModelEl) topSpeedModelEl.textContent = "-";
        if (topSpeedValEl) topSpeedValEl.textContent = "ความเร็วเฉลี่ย: 0ms";
        if (overallRatingEl) overallRatingEl.textContent = "0 %";
    }

    // Render compliance evaluation table
    renderEvaluationTable(finalStats);
    
    // Re-render chart if analytics tab is active
    renderChart();
}

// Render the detailed evaluation board table comparing model metrics to standard criteria
function renderEvaluationTable(stats) {
    const tbody = document.getElementById("evaluation-table-body");
    if (!tbody) return;
    tbody.innerHTML = "";
    
    // Sort model IDs to display in a fixed order (1 to 8)
    const sortedModelIds = Object.keys(MODELS).sort((a, b) => parseInt(a) - parseInt(b));
    
    sortedModelIds.forEach(id => {
        const modelMeta = MODELS[id];
        const mName = modelMeta.name;
        const mStats = (stats && stats.models) ? stats.models[mName] : null;
        
        if (!mStats || mStats.count === 0) {
            tbody.innerHTML += `
                <tr>
                    <td class="model-name-cell">${modelMeta.display}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td><span class="status-badge" style="background: rgba(255,255,255,0.05); color: var(--text-muted); border: 1px dashed var(--border-glass)">รอการทดสอบ</span></td>
                </tr>
            `;
            return;
        }
        
        const acc = Number(mStats.avg_accuracy) || 0;
        const latencySec = (Number(mStats.avg_latency) || 0) / 1000;
        const hallucination = Number(mStats.avg_hallucination) || 0;
        
        // Pass/Fail Checks
        const isAccPass = acc >= 85;
        const isLatencyPass = latencySec <= 5.00;
        const isHallucinationPass = hallucination <= 10.0;
        const isOverallPass = isAccPass && isLatencyPass && isHallucinationPass;
        
        const accBadge = isAccPass 
            ? `<span class="status-badge status-badge-pass"><i class="fa-solid fa-circle-check"></i> ผ่าน</span>`
            : `<span class="status-badge status-badge-fail"><i class="fa-solid fa-circle-xmark"></i> ไม่ผ่าน</span>`;
            
        const latencyBadge = isLatencyPass 
            ? `<span class="status-badge status-badge-pass"><i class="fa-solid fa-circle-check"></i> ผ่าน</span>`
            : `<span class="status-badge status-badge-fail"><i class="fa-solid fa-circle-xmark"></i> ไม่ผ่าน</span>`;
            
        const hallucinationBadge = isHallucinationPass 
            ? `<span class="status-badge status-badge-pass"><i class="fa-solid fa-circle-check"></i> ผ่าน</span>`
            : `<span class="status-badge status-badge-fail"><i class="fa-solid fa-circle-xmark"></i> ไม่ผ่าน</span>`;
            
        const overallBadge = isOverallPass 
            ? `<span class="status-badge status-badge-overall-pass"><i class="fa-solid fa-square-check"></i> ผ่านเกณฑ์ทั้งหมด</span>`
            : `<span class="status-badge status-badge-overall-fail"><i class="fa-solid fa-triangle-exclamation"></i> ไม่ผ่านเกณฑ์</span>`;
            
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="model-name-cell">${modelMeta.display}</td>
            <td>
                <div class="eval-progress-bar-container">
                    <div class="eval-progress-bar">
                        <div class="eval-progress-fill eval-progress-fill-blue" style="width: ${Math.min(100, Math.max(0, acc))}%"></div>
                    </div>
                    <span class="eval-progress-label">${acc.toFixed(1)}%</span>
                    ${accBadge}
                </div>
            </td>
            <td>
                <span class="eval-latency-val">${latencySec.toFixed(2)}s</span>
                ${latencyBadge}
            </td>
            <td>
                <div class="eval-progress-bar-container">
                    <div class="eval-progress-bar">
                        <div class="eval-progress-fill eval-progress-fill-amber" style="width: ${Math.min(100, Math.max(0, hallucination))}%"></div>
                    </div>
                    <span class="eval-progress-label">${hallucination.toFixed(1)}%</span>
                    ${hallucinationBadge}
                </div>
            </td>
            <td>${overallBadge}</td>
        `;
        tbody.appendChild(row);
    });
}

// Translate raw model name to display name
function getModelDisplayName(rawName) {
    for (const key in MODELS) {
        if (MODELS[key].name === rawName) {
            return MODELS[key].display;
        }
    }
    return rawName;
}

// Chart.js render engine
function renderChart() {
    const metricSelect = document.getElementById("graph-metric");
    const typeSelect = document.getElementById("graph-type");
    const canvas = document.getElementById("performance-chart");
    
    if (!canvas) return;
    const metric = metricSelect ? metricSelect.value : "accuracy";
    const type = typeSelect ? typeSelect.value : "bar";
    
    const stats = currentState.stats || { models: {} };
    const labels = [];
    const datasetData = [];
    
    // Sort models by display index for consistency (1 to 8)
    const sortedModelIds = Object.keys(MODELS).sort((a, b) => parseInt(a) - parseInt(b));
    
    sortedModelIds.forEach(id => {
        const m = MODELS[id];
        const mStats = (stats.models && stats.models[m.name]) ? stats.models[m.name] : null;
        labels.push(m.display);
        
        if (mStats && mStats.count > 0) {
            if (metric === "accuracy") {
                datasetData.push(Number(mStats.avg_accuracy) || 0);
            } else if (metric === "hallucination") {
                datasetData.push(Number(mStats.avg_hallucination) || 0);
            } else {
                // Latency in seconds
                datasetData.push((Number(mStats.avg_latency) || 0) / 1000);
            }
        } else {
            datasetData.push(0);
        }
    });
    
    const isLight = document.body.classList.contains("light-mode");
    const textColor = isLight ? '#0f172a' : '#f3f4f6';
    const textMuted = isLight ? '#64748b' : '#9ca3af';
    const gridColor = isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.05)';
    const radarGridColor = isLight ? 'rgba(15, 23, 42, 0.15)' : 'rgba(255, 255, 255, 0.1)';

    let datasetLabel = "ความแม่นยำเฉลี่ย (%)";
    if (metric === "latency") {
        datasetLabel = "ความเร็วเฉลี่ย (วินาที)";
    } else if (metric === "hallucination") {
        datasetLabel = "อัตราการหลอนของเอไอ (%)";
    }
    
    let bgColors, borderColors;
    if (type === 'bar' || type === 'doughnut') {
        bgColors = sortedModelIds.map(id => MODEL_COLORS[id].bg);
        borderColors = sortedModelIds.map(id => MODEL_COLORS[id].border);
    } else {
        if (metric === "accuracy") {
            borderColors = '#2563eb';
            bgColors = 'rgba(37, 99, 235, 0.2)';
        } else if (metric === "hallucination") {
            borderColors = '#f59e0b';
            bgColors = 'rgba(245, 158, 11, 0.2)';
        } else {
            borderColors = '#10b981';
            bgColors = 'rgba(16, 185, 129, 0.2)';
        }
    }
    
    const pointBgColors = sortedModelIds.map(id => MODEL_COLORS[id].border);
    
    // Destroy existing chart to avoid overlay issues
    if (currentState.chartInstance) {
        currentState.chartInstance.destroy();
        currentState.chartInstance = null;
    }
    
    const ctx = canvas.getContext('2d');
    currentState.chartInstance = new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: datasetLabel,
                data: datasetData,
                backgroundColor: bgColors,
                borderColor: borderColors,
                borderWidth: 2,
                pointBackgroundColor: pointBgColors,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: pointBgColors,
                tension: 0.3,
                fill: type === 'line'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: type === 'doughnut' || type === 'radar',
                    labels: { color: textColor, font: { family: 'Prompt', size: 12 } }
                },
                tooltip: {
                    titleFont: { family: 'Prompt' },
                    bodyFont: { family: 'Prompt' },
                    callbacks: {
                        label: function(context) {
                            let val = context.raw;
                            if (metric === "latency") {
                                return ` ความเร็วเฉลี่ย: ${val.toFixed(2)} วินาที`;
                            } else if (metric === "hallucination") {
                                return ` อัตราการหลอน: ${val.toFixed(1)}%`;
                            } else {
                                return ` ความแม่นยำเฉลี่ย: ${val.toFixed(1)}%`;
                            }
                        }
                    }
                }
            },
            scales: type !== 'radar' && type !== 'doughnut' ? {
                y: {
                    beginAtZero: true,
                    max: (metric === "accuracy" || metric === "hallucination") ? 100 : undefined,
                    grid: { color: gridColor },
                    ticks: { 
                        color: textMuted, 
                        font: { family: 'Prompt' },
                        callback: function(value) {
                            if (metric === "accuracy" || metric === "hallucination") return value + '%';
                            return value + 's';
                        }
                    }
                },
                x: {
                    grid: { color: gridColor },
                    ticks: { color: textMuted, font: { family: 'Prompt', size: 11 } }
                }
            } : (type === 'radar' ? {
                r: {
                    grid: { color: radarGridColor },
                    angleLines: { color: radarGridColor },
                    pointLabels: { color: textMuted, font: { family: 'Prompt', size: 11 } },
                    ticks: { backdropColor: 'transparent', color: textMuted },
                    max: (metric === "accuracy" || metric === "hallucination") ? 100 : undefined,
                    min: 0
                }
            } : undefined)
        }
    });
}

// Fetch query logs from server & synchronize with local history
async function loadHistory() {
    let combinedHistory = [...currentState.history];

    try {
        const response = await apiFetch("/api/history");
        if (response.ok) {
            const serverHistory = await response.json();
            if (Array.isArray(serverHistory) && serverHistory.length > 0) {
                serverHistory.forEach(sItem => {
                    const idx = combinedHistory.findIndex(l => l.id === sItem.id);
                    if (idx >= 0) {
                        combinedHistory[idx] = { ...combinedHistory[idx], ...sItem };
                    } else {
                        combinedHistory.push(sItem);
                    }
                });
            }
        }
    } catch (err) {
        console.warn("Using local history due to server lookup:", err);
    }
    
    // Sort newest first
    combinedHistory.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
    currentState.history = combinedHistory;
    saveLocalHistory(combinedHistory);
    
    const container = document.getElementById("history-list-container");
    if (!container) return;
    container.innerHTML = "";
    
    if (combinedHistory.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:40px 0;color:var(--text-muted);font-style:italic;">ไม่มีประวัติการถามตอบในขณะนี้</div>`;
        return;
    }
    
    combinedHistory.forEach((h, index) => {
        const date = new Date(h.timestamp);
        const timeStr = isNaN(date.getTime()) ? "" : date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + " น.";
        
        const item = document.createElement("div");
        item.className = `history-item ${currentState.selectedHistoryQueryId === h.id ? 'active' : ''}`;
        item.innerHTML = `
            <div class="history-item-header">
                <span class="mode-badge badge-${h.mode}">${h.mode === "mode1" ? "ทั่วไป" : "RAG"}</span>
                <div class="history-item-meta">
                    <span class="history-item-date">${timeStr}</span>
                    <button class="delete-item-btn" title="ลบรายการนี้">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
            <div class="history-item-text">${escapeHtml(h.query_text)}</div>
        `;
        
        item.addEventListener("click", () => {
            document.querySelectorAll(".history-item").forEach(el => el.classList.remove("active"));
            item.classList.add("active");
            renderHistoryDetails(h);
        });
        
        const delBtn = item.querySelector(".delete-item-btn");
        if (delBtn) {
            delBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                handleDeleteQuery(h.id, h.query_text);
            });
        }
        
        container.appendChild(item);
    });
}

// Render historical comparison query details panel
function renderHistoryDetails(historyItem) {
    currentState.selectedHistoryQueryId = historyItem.id;
    const emptyState = document.getElementById("history-detail-empty");
    const content = document.getElementById("history-detail-content");
    if (emptyState) emptyState.classList.add("hidden");
    if (content) content.classList.remove("hidden");
    
    // Header
    const modeBadge = document.getElementById("detail-mode-badge");
    if (modeBadge) {
        modeBadge.className = `mode-badge badge-${historyItem.mode}`;
        modeBadge.textContent = historyItem.mode === "mode1" ? "โหมด 1: ตอบคำถามทั่วไป" : "โหมด 2: อิงข้อมูล Supabase (RAG)";
    }
    
    const queryTextEl = document.getElementById("detail-query-text");
    if (queryTextEl) queryTextEl.textContent = historyItem.query_text;
    
    const date = new Date(historyItem.timestamp);
    const dateText = isNaN(date.getTime()) ? "" : date.toLocaleString('th-TH');
    const timestampEl = document.getElementById("detail-timestamp");
    if (timestampEl) timestampEl.textContent = "บันทึกเมื่อ: " + dateText;
    
    // Dynamic response grid items
    const grid = document.getElementById("detail-responses-grid");
    if (!grid) return;
    grid.innerHTML = "";
    
    const responses = historyItem.responses || [];
    const sortedResponses = [...responses];
    sortedResponses.sort((a, b) => {
        let idxA = getModelIndexByName(a.model_name);
        let idxB = getModelIndexByName(b.model_name);
        return idxA - idxB;
    });
    
    sortedResponses.forEach(r => {
        const idx = getModelIndexByName(r.model_name);
        const display = getModelDisplayName(r.model_name);
        
        const responseDiv = document.createElement("div");
        responseDiv.className = "detail-response-item";
        
        const latencySecs = (typeof r.latency_ms === 'number' && !isNaN(r.latency_ms)) ? (r.latency_ms / 1000).toFixed(2) + 's' : '-';
        let bodyText = r.response_text || '(ไม่มีข้อความตอบกลับ)';
        if (bodyText.includes('<think>')) {
            if (bodyText.includes('</think>')) {
                bodyText = bodyText.replace(/<think>([\s\S]*?)<\/think>/gi, (match, p1) => {
                    return `<details class="think-box"><summary><i class="fa-solid fa-brain"></i> กระบวนการคิดวิเคราะห์ (Reasoning)</summary><div class="think-content">${p1.trim().replace(/\n/g, '<br>')}</div></details>`;
                });
            } else {
                bodyText = bodyText.replace(/<think>([\s\S]*)/gi, (match, p1) => {
                    return `<details class="think-box" open><summary><i class="fa-solid fa-brain"></i> กระบวนการคิดวิเคราะห์ (Reasoning)</summary><div class="think-content">${p1.trim().replace(/\n/g, '<br>')}</div></details>`;
                });
            }
        }
        
        responseDiv.innerHTML = `
            <div class="detail-item-header">
                <span class="detail-item-name">${display}</span>
                <span class="detail-item-meta">
                    ความเร็ว: ${latencySecs} | สถานะ: HTTP ${r.status_code || 200}
                </span>
            </div>
            <div class="detail-item-body">${bodyText}</div>
            <div class="card-footer" style="padding: 10px 0 0 0; border: none; background: transparent; flex-direction: column; align-items: stretch; gap: 8px;">
                <div class="evaluation-widget">
                    <div class="eval-row">
                        <span class="eval-label">ความถูกต้องย้อนหลัง:</span>
                        <div class="eval-btn-group">
                            <button class="eval-btn eval-btn-success ${r.is_correct === 1 ? 'active' : ''}" id="btn-hist-correct-1-${r.id}"><i class="fa-solid fa-check"></i> ถูก</button>
                            <button class="eval-btn eval-btn-danger ${r.is_correct === 0 ? 'active' : ''}" id="btn-hist-correct-0-${r.id}"><i class="fa-solid fa-xmark"></i> ผิด</button>
                        </div>
                    </div>
                    <div class="eval-row">
                        <span class="eval-label">การหลอนย้อนหลัง:</span>
                        <div class="eval-btn-group">
                            <button class="eval-btn eval-btn-warning ${r.is_hallucinated === 1 ? 'active' : ''}" id="btn-hist-hallucinated-1-${r.id}"><i class="fa-solid fa-triangle-exclamation"></i> หลอน</button>
                            <button class="eval-btn eval-btn-info ${r.is_hallucinated === 0 ? 'active' : ''}" id="btn-hist-hallucinated-0-${r.id}"><i class="fa-solid fa-shield-halved"></i> ไม่หลอน</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        grid.appendChild(responseDiv);
        
        // Listeners for history editing rating
        const btnHistCorrect1 = responseDiv.querySelector(`#btn-hist-correct-1-${r.id}`);
        const btnHistCorrect0 = responseDiv.querySelector(`#btn-hist-correct-0-${r.id}`);
        const btnHistHallucinated1 = responseDiv.querySelector(`#btn-hist-hallucinated-1-${r.id}`);
        const btnHistHallucinated0 = responseDiv.querySelector(`#btn-hist-hallucinated-0-${r.id}`);

        function updateHistButtonsVisuals(correctVal, hallucinatedVal) {
            if (correctVal === 1) {
                if (btnHistCorrect1) btnHistCorrect1.classList.add("active");
                if (btnHistCorrect0) btnHistCorrect0.classList.remove("active");
            } else if (correctVal === 0) {
                if (btnHistCorrect1) btnHistCorrect1.classList.remove("active");
                if (btnHistCorrect0) btnHistCorrect0.classList.add("active");
            }

            if (hallucinatedVal === 1) {
                if (btnHistHallucinated1) btnHistHallucinated1.classList.add("active");
                if (btnHistHallucinated0) btnHistHallucinated0.classList.remove("active");
            } else if (hallucinatedVal === 0) {
                if (btnHistHallucinated1) btnHistHallucinated1.classList.remove("active");
                if (btnHistHallucinated0) btnHistHallucinated0.classList.add("active");
            }
        }

        if (btnHistCorrect1) btnHistCorrect1.onclick = () => saveEvaluation(historyItem.id, r.model_name, 1, null, () => updateHistButtonsVisuals(1, null));
        if (btnHistCorrect0) btnHistCorrect0.onclick = () => saveEvaluation(historyItem.id, r.model_name, 0, null, () => updateHistButtonsVisuals(0, null));
        if (btnHistHallucinated1) btnHistHallucinated1.onclick = () => saveEvaluation(historyItem.id, r.model_name, null, 1, () => updateHistButtonsVisuals(null, 1));
        if (btnHistHallucinated0) btnHistHallucinated0.onclick = () => saveEvaluation(historyItem.id, r.model_name, null, 0, () => updateHistButtonsVisuals(null, 0));
    });
}

function getModelIndexByName(name) {
    for (const key in MODELS) {
        if (MODELS[key].name === name) {
            return parseInt(key);
        }
    }
    return 1;
}

function resetHistoryDetailsView() {
    const content = document.getElementById("history-detail-content");
    const emptyState = document.getElementById("history-detail-empty");
    if (content) content.classList.add("hidden");
    if (emptyState) emptyState.classList.remove("hidden");
    currentState.selectedHistoryQueryId = null;
}

async function handleDeleteQuery(queryId, queryText) {
    const snippet = queryText.length > 50 ? queryText.substring(0, 50) + "..." : queryText;
    if (!confirm(`คุณต้องการลบคำถาม: "${snippet}" ใช่หรือไม่?`)) {
        return;
    }
    
    // Remove locally
    currentState.history = currentState.history.filter(h => h.id !== queryId);
    saveLocalHistory(currentState.history);

    if (currentState.selectedHistoryQueryId === queryId) {
        resetHistoryDetailsView();
    }

    try {
        await apiFetch("/api/delete_query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query_id: queryId })
        });
        showToast("ลบรายการคำถามสำเร็จ", "success");
    } catch (err) {
        console.warn("Deleted locally:", err);
        showToast("ลบรายการคำถามสำเร็จ (ในเครื่อง)", "success");
    } finally {
        loadHistory();
        loadStats();
    }
}

// Clear history from server and localStorage
async function handleClearHistory() {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการล้างประวัติการถามตอบทั้งหมด? ข้อมูลการเปรียบเทียบและการประเมินโมเดลจะหายไป")) {
        return;
    }
    
    currentState.history = [];
    saveLocalHistory([]);
    
    resetHistoryDetailsView();

    try {
        await apiFetch("/api/clear", { method: "POST" });
        showToast("ล้างประวัติคำถามและการประเมินโมเดลสำเร็จ", "success");
    } catch (err) {
        console.warn("Cleared locally:", err);
        showToast("ล้างประวัติในเครื่องสำเร็จ", "success");
    } finally {
        loadHistory();
        loadStats();
    }
}

// Update local cache of Supabase database values
async function handleRefreshSupabase() {
    const btnIcon = document.querySelector("#refresh-supabase-btn i");
    if (btnIcon) btnIcon.classList.add("fa-spin");
    
    try {
        const response = await apiFetch("/api/refresh_supabase", { method: "POST" });
        if (response.ok) {
            showToast("อัปเดตและแคชตารางข้อมูลทั้งหมดจาก Supabase สำเร็จ", "success");
        } else {
            showToast("ไม่สามารถอัปเดตข้อมูล Supabase ได้", "error");
        }
    } catch (err) {
        console.error("Error refreshing Supabase:", err);
        showToast("เครือข่ายขัดข้องในการอัปเดต Supabase", "error");
    } finally {
        if (btnIcon) btnIcon.classList.remove("fa-spin");
    }
}
