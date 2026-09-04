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
        "พยากรณ์อากาศในกรุงเทพมหานครและปริมณฑลเป็นอย่างไร",
        "มีรายงานแผ่นดินไหวล่าสุดเกิดขึ้นที่ไหนและขนาดเท่าไหร่บ้าง",
        "ข้อมูลค่าความชื้นและการตรวจจับฝนจากเซ็นเซอร์เป็นอย่างไร",
        "ขอข้อมูลผู้ประสบภัยจากตาราง victim_reports",
        "สรุปข้อมูลการเตรียมตัวรับมือภัยพิบัติในตาราง documents",
        "ข้อเสนอแนะในการปรับปรุงระบบจากแบบประเมิน satisfaction_surveys มีอะไรบ้าง",
        "ตาราง demo_app_surveys มีความคิดเห็นเกี่ยวกับ UX อย่างไรบ้าง"
    ]
};

// Application State
let currentState = {
    activeTab: 'chat-tab',
    currentQueryId: null,
    selectedHistoryQueryId: null,
    isQuerying: false,
    stats: null,
    history: [],
    chartInstance: null,
    timerInterval: null,
    overallStartTime: null
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    setupTheme();
    setupTabNavigation();
    setupModeSelector();
    setupEventListeners();
    refreshSuggestions();
    loadStats();
    loadHistory();
});

// Theme Manager (Dark/Light mode toggle initialization)
function setupTheme() {
    const themeBtn = document.getElementById("theme-toggle-btn");
    const savedTheme = localStorage.getItem("theme") || "dark";
    if (savedTheme === "light") {
        document.body.classList.remove("dark-mode");
        document.body.classList.add("light-mode");
        themeBtn.innerHTML = `<i class="fa-solid fa-moon"></i> <span>โหมดมืด</span>`;
    } else {
        document.body.classList.remove("light-mode");
        document.body.classList.add("dark-mode");
        themeBtn.innerHTML = `<i class="fa-solid fa-sun"></i> <span>โหมดสว่าง</span>`;
    }
}

// Tab Navigation Manager
function setupTabNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");

    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const tabId = btn.getAttribute("data-tab");
            
            navButtons.forEach(b => b.classList.remove("active"));
            tabPanels.forEach(p => p.classList.remove("active"));
            
            btn.classList.add("active");
            document.getElementById(tabId).classList.add("active");
            
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
    container.innerHTML = "";
    
    SUGGESTIONS[mode].forEach(s => {
        const tag = document.createElement("div");
        tag.className = "tag";
        tag.textContent = s;
        tag.addEventListener("click", () => {
            if (!currentState.isQuerying) {
                document.getElementById("query-input").value = s;
            }
        });
        container.appendChild(tag);
    });
}

function getSelectedMode() {
    return document.querySelector("input[name='query-mode']:checked").value;
}

// Setup Event Listeners for action elements
function setupEventListeners() {
    // Send Question Button
    document.getElementById("send-btn").addEventListener("click", handleSendQuery);
    
    // Clear History Button
    document.getElementById("clear-history-btn").addEventListener("click", handleClearHistory);
    
    // Delete Current Active Query Button
    document.getElementById("delete-current-btn").addEventListener("click", () => {
        if (currentState.selectedHistoryQueryId) {
            const q = currentState.history.find(h => h.id === currentState.selectedHistoryQueryId);
            const queryText = q ? q.query_text : "คำถามนี้";
            handleDeleteQuery(currentState.selectedHistoryQueryId, queryText);
        }
    });
    
    // Refresh Supabase Cache Button
    document.getElementById("refresh-supabase-btn").addEventListener("click", handleRefreshSupabase);
    
    // Graph Controls Change
    document.getElementById("graph-metric").addEventListener("change", renderChart);
    document.getElementById("graph-type").addEventListener("change", renderChart);

    // Theme Toggle Button click handler
    document.getElementById("theme-toggle-btn").addEventListener("click", () => {
        const isDark = document.body.classList.contains("dark-mode");
        const themeBtn = document.getElementById("theme-toggle-btn");
        
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

// Toast System
function showToast(message, type = 'info') {
    const toast = document.getElementById("toast");
    const icon = document.getElementById("toast-icon");
    const msgSpan = document.getElementById("toast-message");
    
    toast.className = `toast toast-${type}`;
    msgSpan.textContent = message;
    
    // Icon mapping
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
    const queryText = queryInput.value.trim();
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
    ragPanel.classList.add("hidden");
    ragList.innerHTML = "";
    
    // Initialize LLM grid cards
    initializeLLMGrid();
    
    // Start Overall Timer
    startTimer();
    
    try {
        // Step 1: Start Query on server
        const startResponse = await fetch("/api/start_query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: queryText, mode: mode })
        });
        
        if (!startResponse.ok) {
            throw new Error(`Server status: ${startResponse.status}`);
        }
        
        const startData = await startResponse.json();
        currentState.currentQueryId = startData.query_id;
        
        // Show RAG Matches if Mode 1 or Mode 2
        if (startData.matches && startData.matches.length > 0) {
            ragPanel.classList.remove("hidden");
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
                ragList.appendChild(matchDiv);
            });
        } else if (mode === "mode1" || mode === "mode2") {
            ragPanel.classList.remove("hidden");
            ragList.innerHTML = `<div style="font-size:0.8rem;color:var(--text-muted);font-style:italic;">ไม่พบข้อมูลอ้างอิงตรงกับคำค้นหาใน Supabase</div>`;
        }
        
        // Step 2: Query 10 LLM models in parallel (asynchronously)
        const modelPromises = Object.keys(MODELS).map(idx => {
            return askModel(currentState.currentQueryId, idx);
        });
        
        // Wait for all models to resolve
        await Promise.all(modelPromises);
        
        showToast("ประมวลผลคำถามเสร็จสมบูรณ์ทั้ง 8 โมเดลแล้ว!", "success");
        
    } catch (err) {
        console.error("Error querying models:", err);
        showToast("เกิดข้อผิดพลาดในการประมวลผล: " + err.message, "error");
    } finally {
        stopTimer();
        currentState.isQuerying = false;
        toggleInputState(false);
        loadStats(); // Update stats cards and badges
    }
}

// Start visual execution timer
function startTimer() {
    const timerBox = document.getElementById("timer-box");
    const timerVal = document.getElementById("total-timer");
    timerBox.classList.remove("hidden");
    
    currentState.overallStartTime = Date.now();
    currentState.timerInterval = setInterval(() => {
        const elapsed = (Date.now() - currentState.overallStartTime) / 1000;
        timerVal.textContent = elapsed.toFixed(2);
    }, 50);
}

// Stop execution timer
function stopTimer() {
    if (currentState.timerInterval) {
        clearInterval(currentState.timerInterval);
        currentState.timerInterval = null;
    }
    const elapsed = (Date.now() - currentState.overallStartTime) / 1000;
    document.getElementById("total-timer").textContent = elapsed.toFixed(2);
}

// Toggle loading controls for inputs
function toggleInputState(disabled) {
    document.getElementById("send-btn").disabled = disabled;
    document.getElementById("query-input").disabled = disabled;
    document.querySelectorAll("input[name='query-mode']").forEach(radio => {
        radio.disabled = disabled;
    });
    
    const sendBtnSpan = document.querySelector("#send-btn span");
    if (disabled) {
        sendBtnSpan.textContent = "กำลังประมวลผลคำถาม...";
        document.getElementById("send-btn").style.opacity = "0.7";
    } else {
        sendBtnSpan.textContent = "ส่งคำถาม (8 โมเดล)";
        document.getElementById("send-btn").style.opacity = "1";
    }
}

// Initialize clean placeholders in LLM Response cards
function initializeLLMGrid() {
    const grid = document.getElementById("llm-grid-container");
    grid.innerHTML = "";
    
    Object.keys(MODELS).forEach(idx => {
        const model = MODELS[idx];
        const card = document.createElement("div");
        card.className = "model-card";
        card.id = `model-card-${idx}`;
        
        // Cohesive top stripe using the model's graph color
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

// Request details for an individual model asynchronously
async function askModel(queryId, modelIndex) {
    const indicator = document.getElementById(`status-indicator-${modelIndex}`);
    const loaderText = document.querySelector(`#loader-${modelIndex} .loader-text`);
    
    // Set status to loading
    indicator.className = "status-indicator status-loading";
    loaderText.textContent = "กำลังพิมพ์คำตอบ...";
    
    try {
        const response = await fetch("/api/ask_model", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query_id: queryId, model_index: modelIndex })
        });
        
        const data = await response.json();
        
        // Remove loader and placeholder
        const bodyDiv = document.getElementById(`card-body-${modelIndex}`);
        bodyDiv.innerHTML = "";
        
        const footerLatency = document.querySelector(`#latency-${modelIndex} span`);
        const ratingWidget = document.getElementById(`rating-widget-${modelIndex}`);
        
        // Format latency display (ms or seconds)
        const latencySecs = data.latency_ms / 1000;
        footerLatency.textContent = `${latencySecs.toFixed(2)}s`;
        
        if (data.status_code === 200) {
            indicator.className = "status-indicator status-success";
            
            // Format response with highlighting for table references in RAG Mode
            let text = data.response_text;
            // Bold match table names in Thai (e.g. ตาราง documents หรือ ตาราง incident_reports)
            text = text.replace(/(ตาราง\s+[a-zA-Z0-9_]+)/g, '<strong style="color:var(--primary-light);">$1</strong>');
            
            bodyDiv.innerHTML = `<div class="response-text">${text}</div>`;
            
            // Show interactive ratings stars widget
            ratingWidget.classList.remove("hidden");
            setupEvaluationListeners(queryId, modelIndex, MODELS[modelIndex].name, data.is_correct, data.is_hallucinated);
            
        } else {
            indicator.className = "status-indicator status-error";
            bodyDiv.innerHTML = `<div class="error-text">${data.response_text}</div>`;
        }
        
    } catch (err) {
        console.error(`Error with model ${modelIndex}:`, err);
        indicator.className = "status-indicator status-error";
        const bodyDiv = document.getElementById(`card-body-${modelIndex}`);
        bodyDiv.innerHTML = `<div class="error-text">Network Error: ${err.message}</div>`;
    }
}

// Evaluation buttons change events
function setupEvaluationListeners(queryId, modelIndex, modelName, initialCorrect = 1, initialHallucinated = 0) {
    const correctBtn1 = document.getElementById(`btn-correct-1-${modelIndex}`);
    const correctBtn0 = document.getElementById(`btn-correct-0-${modelIndex}`);
    const hallucinatedBtn1 = document.getElementById(`btn-hallucinated-1-${modelIndex}`);
    const hallucinatedBtn0 = document.getElementById(`btn-hallucinated-0-${modelIndex}`);

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

    try {
        const response = await fetch("/api/rate_response", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            const displayModel = getModelDisplayName(modelName);
            showToast(`ประเมินผลสำหรับ ${displayModel} เรียบร้อยแล้ว`, "success");
            if (onSuccessCallback) onSuccessCallback();
            loadStats();
        } else {
            showToast("ไม่สามารถประเมินผลคะแนนได้", "error");
        }
    } catch (err) {
        console.error("Error rating:", err);
        showToast("เครือข่ายขัดข้องในการประเมินผล", "error");
    }
}

// Load statistics from database
async function loadStats() {
    try {
        const resp = await fetch("/api/stats");
        const stats = await resp.json();
        currentState.stats = stats;
        
        // Update top-bar statistics indicators
        document.getElementById("total-queries-badge").textContent = stats.total_questions;
        document.getElementById("mode1-queries-badge").textContent = stats.mode1_count;
        document.getElementById("mode2-queries-badge").textContent = stats.mode2_count;
        
        // Update analytics screen details if data is present
        if (stats.total_questions > 0 && Object.keys(stats.models).length > 0) {
            let topAccModel = "-";
            let topAccVal = 0;
            let topSpeedModel = "-";
            let topSpeedVal = Infinity;
            let sumRating = 0;
            let countRating = 0;
            
            Object.keys(stats.models).forEach(name => {
                const m = stats.models[name];
                
                // Find model display name
                const display = getModelDisplayName(name);
                
                if (m.avg_accuracy > topAccVal) {
                    topAccVal = m.avg_accuracy;
                    topAccModel = display;
                }
                
                if (m.avg_latency < topSpeedVal && m.avg_latency > 0) {
                    topSpeedVal = m.avg_latency;
                    topSpeedModel = display;
                }
                
                sumRating += m.avg_accuracy;
                countRating++;
            });
            
            document.getElementById("top-accuracy-model").textContent = topAccModel;
            document.getElementById("top-accuracy-value").textContent = `ค่าเฉลี่ย: ${topAccVal.toFixed(1)}%`;
            
            document.getElementById("top-speed-model").textContent = topSpeedModel;
            document.getElementById("top-speed-value").textContent = `ความเร็วเฉลี่ย: ${(topSpeedVal / 1000).toFixed(2)}s`;
            
            const overallAvg = sumRating / countRating;
            document.getElementById("overall-rating-avg").textContent = `${overallAvg.toFixed(1)} %`;
        } else {
            // Reset placeholders
            document.getElementById("top-accuracy-model").textContent = "-";
            document.getElementById("top-accuracy-value").textContent = "ค่าเฉลี่ย: 0.0%";
            document.getElementById("top-speed-model").textContent = "-";
            document.getElementById("top-speed-value").textContent = "ความเร็วเฉลี่ย: 0ms";
            document.getElementById("overall-rating-avg").textContent = "0 %";
        }

        // Render compliance evaluation table
        renderEvaluationTable(stats);
    } catch (err) {
        console.error("Error loading stats:", err);
    }
}

// Render the detailed evaluation board table comparing model metrics to standard criteria
function renderEvaluationTable(stats) {
    const tbody = document.getElementById("evaluation-table-body");
    if (!tbody) return;
    tbody.innerHTML = "";
    
    if (!stats || !stats.models || Object.keys(stats.models).length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 30px;">
                    ไม่มีข้อมูลผลลัพธ์โมเดลที่จะประเมินผลในฐานข้อมูล
                </td>
            </tr>
        `;
        return;
    }
    
    // Sort model IDs to display in a fixed order (1 to 10)
    const sortedModelIds = Object.keys(MODELS).sort((a, b) => parseInt(a) - parseInt(b));
    
    sortedModelIds.forEach(id => {
        const modelMeta = MODELS[id];
        const mName = modelMeta.name;
        const mStats = stats.models[mName];
        
        if (!mStats) {
            tbody.innerHTML += `
                <tr>
                    <td class="model-name-cell">${modelMeta.display}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td><span class="status-badge" style="background: rgba(255,255,255,0.05); color: var(--text-muted); border: 1px dashed var(--border-glass)">ไม่มีข้อมูล</span></td>
                </tr>
            `;
            return;
        }
        
        const acc = mStats.avg_accuracy;
        const latencySec = mStats.avg_latency / 1000;
        const hallucination = mStats.avg_hallucination;
        
        // Pass/Fail Checks
        const isAccPass = acc >= 85;
        const isLatencyPass = latencySec <= 5;
        const isHallucinationPass = hallucination <= 10;
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
                        <div class="eval-progress-fill eval-progress-fill-blue" style="width: ${acc}%"></div>
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
                        <div class="eval-progress-fill eval-progress-fill-amber" style="width: ${hallucination}%"></div>
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
    const metric = document.getElementById("graph-metric").value;
    const type = document.getElementById("graph-type").value;
    const canvas = document.getElementById("performance-chart");
    
    if (!currentState.stats || Object.keys(currentState.stats.models).length === 0) {
        // Render empty chart if no data
        return;
    }
    
    const stats = currentState.stats;
    const labels = [];
    const datasetData = [];
    
    // Sort models by display index for consistency
    const sortedModelIds = Object.keys(MODELS).sort((a,b) => parseInt(a) - parseInt(b));
    
    sortedModelIds.forEach(id => {
        const m = MODELS[id];
        const mStats = stats.models[m.name];
        labels.push(m.display);
        
        if (mStats) {
            if (metric === "accuracy") {
                datasetData.push(mStats.avg_accuracy);
            } else if (metric === "hallucination") {
                datasetData.push(mStats.avg_hallucination);
            } else {
                // Latency in seconds
                datasetData.push(mStats.avg_latency / 1000);
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
            bgColors = 'rgba(37, 99, 235, 0.15)';
        } else if (metric === "hallucination") {
            borderColors = '#f59e0b';
            bgColors = 'rgba(245, 158, 11, 0.15)';
        } else {
            borderColors = '#10b981';
            bgColors = 'rgba(16, 185, 129, 0.15)';
        }
    }
    
    const pointBgColors = sortedModelIds.map(id => MODEL_COLORS[id].border);
    
    // Destroy existing chart to avoid overlay issues
    if (currentState.chartInstance) {
        currentState.chartInstance.destroy();
    }
    
    currentState.chartInstance = new Chart(canvas, {
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
                pointHoverBorderColor: pointBgColors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: textColor, font: { family: 'Prompt' } }
                },
                tooltip: {
                    titleFont: { family: 'Prompt' },
                    bodyFont: { family: 'Prompt' }
                }
            },
            scales: type !== 'radar' ? {
                y: {
                    beginAtZero: true,
                    max: (metric === "accuracy" || metric === "hallucination") ? 100 : undefined,
                    grid: { color: gridColor },
                    ticks: { color: textMuted, font: { family: 'Prompt' } }
                },
                x: {
                    grid: { color: gridColor },
                    ticks: { color: textMuted, font: { family: 'Prompt' } }
                }
            } : {
                r: {
                    grid: { color: radarGridColor },
                    angleLines: { color: radarGridColor },
                    pointLabels: { color: textMuted, font: { family: 'Prompt', size: 10 } },
                    ticks: { backdropColor: 'transparent', color: textMuted },
                    max: (metric === "accuracy" || metric === "hallucination") ? 100 : undefined,
                    min: 0,
                    reverse: metric === "latency"
                }
            }
        }
    });
}

// Fetch query logs from server
async function loadHistory() {
    try {
        const response = await fetch("/api/history");
        const history = await response.json();
        currentState.history = history;
        
        const container = document.getElementById("history-list-container");
        container.innerHTML = "";
        
        if (history.length === 0) {
            container.innerHTML = `<div style="text-align:center;padding:40px 0;color:var(--text-muted);font-style:italic;">ไม่มีประวัติการถามตอบในขณะนี้</div>`;
            return;
        }
        
        history.forEach((h, index) => {
            const date = new Date(h.timestamp);
            const timeStr = date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + " น.";
            
            const item = document.createElement("div");
            item.className = "history-item";
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
                <div class="history-item-text">${h.query_text}</div>
            `;
            
            item.addEventListener("click", () => {
                // Remove active classes
                document.querySelectorAll(".history-item").forEach(el => el.classList.remove("active"));
                item.classList.add("active");
                renderHistoryDetails(h);
            });
            
            const delBtn = item.querySelector(".delete-item-btn");
            delBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                handleDeleteQuery(h.id, h.query_text);
            });
            
            container.appendChild(item);
        });
        
    } catch (err) {
        console.error("Error loading history:", err);
    }
}

// Render historical comparison query details panel
function renderHistoryDetails(historyItem) {
    currentState.selectedHistoryQueryId = historyItem.id;
    document.getElementById("history-detail-empty").classList.add("hidden");
    const content = document.getElementById("history-detail-content");
    content.classList.remove("hidden");
    
    // Header
    const modeBadge = document.getElementById("detail-mode-badge");
    modeBadge.className = `mode-badge badge-${historyItem.mode}`;
    modeBadge.textContent = historyItem.mode === "mode1" ? "โหมด 1: ตอบคำถามทั่วไป" : "โหมด 2: อิงข้อมูล Supabase (RAG)";
    
    document.getElementById("detail-query-text").textContent = historyItem.query_text;
    
    const date = new Date(historyItem.timestamp);
    document.getElementById("detail-timestamp").textContent = "บันทึกเมื่อ: " + date.toLocaleString('th-TH');
    
    // Dynamic response grid items
    const grid = document.getElementById("detail-responses-grid");
    grid.innerHTML = "";
    
    // Sort responses to match MODELS structure indices
    const sortedResponses = [...historyItem.responses];
    sortedResponses.sort((a, b) => {
        let idxA = getModelIndexByName(a.model_name);
        let idxB = getModelIndexByName(b.model_name);
        return idxA - idxB;
    });
    
    sortedResponses.forEach(r => {
        const idx = getModelIndexByName(r.model_name);
        const display = getModelDisplayName(r.model_name);
        const provider = MODELS[idx] ? MODELS[idx].provider : "thaillm";
        
        const responseDiv = document.createElement("div");
        responseDiv.className = "detail-response-item";
        
        const latencySecs = r.latency_ms / 1000;
        
        responseDiv.innerHTML = `
            <div class="detail-item-header">
                <span class="detail-item-name">${display}</span>
                <span class="detail-item-meta">
                    ความเร็ว: ${latencySecs.toFixed(2)}s | สถานะ: HTTP ${r.status_code}
                </span>
            </div>
            <div class="detail-item-body">${r.response_text}</div>
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
                btnHistCorrect1.classList.add("active");
                btnHistCorrect0.classList.remove("active");
            } else if (correctVal === 0) {
                btnHistCorrect1.classList.remove("active");
                btnHistCorrect0.classList.add("active");
            }

            if (hallucinatedVal === 1) {
                btnHistHallucinated1.classList.add("active");
                btnHistHallucinated0.classList.remove("active");
            } else if (hallucinatedVal === 0) {
                btnHistHallucinated1.classList.remove("active");
                btnHistHallucinated0.classList.add("active");
            }
        }

        btnHistCorrect1.onclick = () => saveEvaluation(historyItem.id, r.model_name, 1, null, () => updateHistButtonsVisuals(1, null));
        btnHistCorrect0.onclick = () => saveEvaluation(historyItem.id, r.model_name, 0, null, () => updateHistButtonsVisuals(0, null));
        btnHistHallucinated1.onclick = () => saveEvaluation(historyItem.id, r.model_name, null, 1, () => updateHistButtonsVisuals(null, 1));
        btnHistHallucinated0.onclick = () => saveEvaluation(historyItem.id, r.model_name, null, 0, () => updateHistButtonsVisuals(null, 0));
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
    document.getElementById("history-detail-content").classList.add("hidden");
    document.getElementById("history-detail-empty").classList.remove("hidden");
    currentState.selectedHistoryQueryId = null;
}

async function handleDeleteQuery(queryId, queryText) {
    const snippet = queryText.length > 50 ? queryText.substring(0, 50) + "..." : queryText;
    if (!confirm(`คุณต้องการลบคำถาม: "${snippet}" ใช่หรือไม่?`)) {
        return;
    }
    
    try {
        const response = await fetch("/api/delete_query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query_id: queryId })
        });
        
        if (response.ok) {
            showToast("ลบรายการคำถามสำเร็จ", "success");
            
            if (currentState.selectedHistoryQueryId === queryId) {
                resetHistoryDetailsView();
            }
            
            loadHistory();
            loadStats();
        } else {
            showToast("ลบคำถามไม่สำเร็จ", "error");
        }
    } catch (err) {
        console.error("Error deleting query:", err);
        showToast("เกิดข้อผิดพลาดในการลบคำถาม", "error");
    }
}

// Clear history from server
async function handleClearHistory() {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการล้างประวัติการถามตอบทั้งหมด? ข้อมูลการเปรียบเทียบและการประเมินโมเดลจะหายไป")) {
        return;
    }
    
    try {
        const response = await fetch("/api/clear", { method: "POST" });
        if (response.ok) {
            showToast("ล้างประวัติคำถามและการประเมินโมเดลสำเร็จ", "success");
            
            // Reset history panel details view
            document.getElementById("history-detail-content").classList.add("hidden");
            document.getElementById("history-detail-empty").classList.remove("hidden");
            
            loadHistory();
            loadStats();
        } else {
            showToast("ล้างประวัติไม่สำเร็จ", "error");
        }
    } catch (err) {
        console.error("Error clearing history:", err);
        showToast("เกิดข้อผิดพลาดในการติดต่อระบบเพื่อล้างข้อมูล", "error");
    }
}

// Update local cache of Supabase database values
async function handleRefreshSupabase() {
    const btnIcon = document.querySelector("#refresh-supabase-btn i");
    btnIcon.classList.add("fa-spin");
    
    try {
        const response = await fetch("/api/refresh_supabase", { method: "POST" });
        if (response.ok) {
            showToast("อัปเดตและแคชตารางข้อมูลทั้งหมดจาก Supabase สำเร็จ", "success");
        } else {
            showToast("ไม่สามารถอัปเดตข้อมูล Supabase ได้", "error");
        }
    } catch (err) {
        console.error("Error refreshing Supabase:", err);
        showToast("เครือข่ายขัดข้องในการอัปเดต Supabase", "error");
    } finally {
        btnIcon.classList.remove("fa-spin");
    }
}
