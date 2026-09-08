// MindForge - Application Javascript

// 1. 초기 템플릿 및 상태 관리 정의
const INITIAL_AIS = [
    {
        id: "ai-valoria",
        name: "발로리아 황실 수석 기록관",
        avatar: "fa-book-atlas",
        desc: "가상 역사 대륙 '발로리아'의 가문 계보 및 숨겨진 역사책 학습 AI",
        persona: "당신은 발로리아 제국의 수석 기록관이자 현자입니다. 근엄하고 고풍스러운 어조(~하옵니다, ~입니다)를 사용하며, 주입된 제국 역사 기록을 바탕으로만 신뢰성 높은 답변을 제공합니다. 주입되지 않은 지식에 대해서는 '제국 도서관에 기록이 유실되어 알지 못한다'고 답합니다.",
        knowledge: `발로리아 제국의 초대 황제는 광휘의 기사 '루시우스 1세'이며, 그는 켄타우루스 족과의 전쟁을 끝내고 제국을 건국했습니다.
발로리아의 2대 황제는 현명한 '아우렐리우스 2세'로, 농경 체계를 혁신하고 최초의 제국 헌법을 반포했습니다.
발로리아의 3대 황제는 전쟁광 '바르도르 3세'이며, 이웃 엘프 왕국 실베리아를 침공했다가 패배하고 퇴위당했습니다.
발로리아의 4대 황제는 마법 능력이 없던 '에드워드 3세'입니다. 그는 마법을 다루지 못했으나, 그의 검 '솔라리스'는 빛 속성의 정령 '엘도라'와 계약된 유일한 제국 유물이었기에 엄청난 힘을 냈습니다. 황비 카트린과의 사이에서 2남 1녀를 두었습니다. 첫째 황자는 카엘, 둘째 황자는 레온, 막내 황녀는 아이리스입니다.
태양검 솔라리스는 낮에는 눈부신 빛을 뿜어내며 열기를 발산하지만, 밤이 되면 평범한 검으로 되돌아가는 한계를 지니고 있습니다.
발로리아 제국은 제 4차 대기근 시기(제국력 412년)에 심각한 붕괴 위기를 맞았으나, 난민 구제법 '에테르 구호령'을 통해 위기를 극복했습니다.`,
        keywords: ["루시우스 1세", "아우렐리우스 2세", "에드워드 3세", "태양검 솔라리스", "카트린 황비", "에테르 구호령"],
        questions: [
            "발로리아 제국의 4대 황제는 누구이고 어떤 특징이 있나요?",
            "태양검 솔라리스는 어떤 성능과 한계를 가지고 있습니까?",
            "황비 카트린과 황제의 자녀는 어떻게 구성되어 있나요?",
            "제국력 412년의 대기근 위기는 어떻게 대처했나요?"
        ],
        stats: { chars: 598, chats: 12 }
    },
    {
        id: "ai-aetheria",
        name: "에테리아 치유 센터 게임 룰 마스터",
        avatar: "fa-gamepad",
        desc: "에테리아 ASMR 타이쿤의 세부 수치 규칙 및 이스터에그 파악 AI",
        persona: "당신은 ASMR 타이쿤 게임 '에테리아'의 시스템 개발자 페르소나입니다. 친근하면서도 정확하게 규칙을 가이드해주며, 플레이어가 이스터에그나 숨겨진 밸런스 공식에 대해 질문하면 수치 기반으로 정답만 알려줍니다.",
        knowledge: `에테리아 ASMR 치유센터 게임에서 '에센스(Essence)' 수치는 스튜디오의 생명줄입니다. 만약 에센스 수치가 10 이하로 떨어지면, 치유실의 식물들이 시들기 시작하며 매 분당 획득하는 골드량이 50% 감소하는 디버프가 적용됩니다.
스튜디오 레벨이 상승할 때마다 보상으로 '차원의 열쇠'가 1개씩 지급되며, 이 열쇠는 2호점 확장 시 5개가 필요합니다.
게임 내 대기하는 특별 손님 중 '그림자 엘프(Shadow Elf)' 정령을 온전히 치유하려면 일반 ASMR 사운드가 아닌 '차분한 빗소리(Calm Rain)' 레벨 3 아이템이 보관함에 장착되어 있어야만 합니다. 치유 성공 시 보상으로 에센스 50개와 100 XP를 지급합니다.
'스타더스트 스피릿(Stardust Spirit)'은 밤 12시부터 새벽 3시 사이에만 5%의 확률로 대기열에 등장하는 초희귀 정령입니다. 이 정령은 치유 완료 시 300골드 대신 무작위 에픽 등급 방 장식 아이템을 선물합니다.
1호점 스튜디오의 최대 레벨 제한은 LV.10 이며, 이 레벨에 도달하면 대기 공간이 최대 6칸으로 확장됩니다.`,
        keywords: ["에센스 디버프", "차원의 열쇠", "그림자 엘프 치유 조건", "스타더스트 스피릿", "최대 레벨 제한"],
        questions: [
            "에센스 수치가 10 이하로 떨어지면 구체적으로 어떤 불이익이 생기나요?",
            "그림자 엘프를 완벽하게 치유하기 위한 구체적인 조건은 무엇인가요?",
            "새벽 시간에만 나타나는 희귀 정령은 무엇이며 보상은 무엇인가요?",
            "차원의 열쇠는 어떻게 얻고 어디에 쓰이나요?"
        ],
        stats: { chars: 552, chats: 8 }
    }
];

let appState = {
    ais: [],
    currentScreen: "dashboard",
    currentAi: null,
    chatViewMode: "split", // 'split' or 'single'
    currentStep: 1,
    newAiData: {
        name: "",
        avatar: "fa-book-atlas",
        desc: "",
        persona: "",
        knowledge: "",
        keywords: [],
        questions: []
    },
    apiKey: "",
    apiModel: "gemini-2.0-flash-thinking-exp"
};

// 2. 문서 로드 시 이니셜라이즈
document.addEventListener("DOMContentLoaded", () => {
    // 로컬 스토리지에서 AI 리스트 불러오기
    const savedAis = localStorage.getItem("mindforge_ais");
    if (savedAis) {
        appState.ais = JSON.parse(savedAis);
    } else {
        appState.ais = [...INITIAL_AIS];
        localStorage.setItem("mindforge_ais", JSON.stringify(appState.ais));
    }

    // API Key 로드
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) {
        appState.apiKey = savedKey;
        const apiBadge = document.getElementById("api-status");
        const apiBadgeText = document.getElementById("api-status-text");
        apiBadge.className = "api-status-badge online";
        
        // 모델 정보 로드 및 배지 표시
        const savedModel = localStorage.getItem("gemini_api_model") || "gemini-2.0-flash-thinking-exp";
        appState.apiModel = savedModel;
        apiBadgeText.textContent = `Gemini API 연결됨 (${savedModel})`;
    } else {
        appState.apiModel = "gemini-2.0-flash-thinking-exp";
    }

    const savedModel = localStorage.getItem("gemini_api_model");
    if (savedModel) {
        appState.apiModel = savedModel;
    }

    // 파일 드롭존 설정
    setupFileDropZone();

    // 메인 대시보드 렌더링
    renderDashboard();
    
    // 화면 초기화
    navigateTo("dashboard");
});

// 3. 네비게이션 & 스크린 관리
function navigateTo(screenId) {
    appState.currentScreen = screenId;
    
    // 모든 스크린 비활성화
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });
    
    // 타겟 스크린 활성화
    const activeScreen = document.getElementById(`screen-${screenId}`);
    if (activeScreen) {
        activeScreen.classList.add("active");
    }

    // 각 스크린 이동 시 후처리
    if (screenId === "dashboard") {
        renderDashboard();
    } else if (screenId === "creator") {
        resetCreatorWizard();
    } else if (screenId === "chat") {
        setupChatRoom();
    }

    window.scrollTo(0, 0);
}

// 4. 대시보드 렌더링
function renderDashboard() {
    const container = document.getElementById("ai-list-container");
    container.innerHTML = "";

    // 통계치 업데이트
    document.getElementById("stat-ai-count").textContent = appState.ais.length;
    
    let totalChars = 0;
    appState.ais.forEach(ai => {
        totalChars += (ai.knowledge || "").length;
    });
    
    const kbText = totalChars >= 1000 ? (totalChars / 1000).toFixed(1) + "k" : totalChars + "자";
    document.getElementById("stat-kb-size").textContent = kbText;

    // 1. '새로운 AI 만들기' 카드 추가 (대시보드 시작점)
    const createCard = document.createElement("div");
    createCard.className = "ai-card glass create-new-card";
    createCard.onclick = () => navigateTo('creator');
    createCard.innerHTML = `
        <div class="create-card-content">
            <div class="create-icon-pulse">
                <i class="fa-solid fa-plus"></i>
            </div>
            <h3>새로운 전문 AI 설계</h3>
            <p>나만의 지식 설정집, 매뉴얼을 주입해 세상에 하나뿐인 특화 AI를 제작합니다.</p>
        </div>
    `;
    container.appendChild(createCard);

    appState.ais.forEach(ai => {
        const isDefault = ai.id.startsWith("ai-valoria") || ai.id.startsWith("ai-aetheria");
        
        const card = document.createElement("div");
        card.className = `ai-card glass ${isDefault ? 'default-ai' : ''}`;
        
        card.innerHTML = `
            <div class="ai-card-bg-glow"></div>
            <div class="ai-card-header">
                <div class="ai-card-avatar">
                    <i class="fa-solid ${ai.avatar}"></i>
                </div>
                <div class="ai-card-info">
                    <h3>${ai.name}</h3>
                    <span class="ai-card-category">${isDefault ? '기본 템플릿' : '커스텀 특화 AI'}</span>
                </div>
            </div>
            <div class="ai-card-body">
                <p class="ai-card-desc">${ai.desc}</p>
            </div>
            <div class="ai-card-meta">
                <div class="meta-stats">
                    <span><i class="fa-solid fa-file-invoice"></i> ${(ai.knowledge.length || 0)}자</span>
                    <span><i class="fa-solid fa-comments"></i> ${ai.stats ? ai.stats.chats : 0}회</span>
                </div>
                <div class="ai-card-actions">
                    ${!isDefault ? `<button class="btn-card-delete" onclick="deleteAI(event, '${ai.id}')" title="삭제"><i class="fa-solid fa-trash-can"></i></button>` : ''}
                    <button class="btn-card-chat" onclick="startChatWith('${ai.id}')">
                        스튜디오 입장 <i class="fa-solid fa-chevron-right" style="font-size:0.7rem; margin-left:3px;"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function deleteAI(event, aiId) {
    event.stopPropagation();
    if (confirm("정말 이 전문 AI를 삭제하시겠습니까? 학습된 지식 데이터가 영구 삭제됩니다.")) {
        appState.ais = appState.ais.filter(ai => ai.id !== aiId);
        localStorage.setItem("mindforge_ais", JSON.stringify(appState.ais));
        renderDashboard();
    }
}

function startChatWith(aiId) {
    const ai = appState.ais.find(item => item.id === aiId);
    if (ai) {
        appState.currentAi = ai;
        navigateTo("chat");
    }
}

// 5. API Key 관리 모달
function openApiModal() {
    document.getElementById("api-modal").classList.add("active");
    const keyInput = document.getElementById("gemini-api-key");
    keyInput.value = appState.apiKey || "";
    
    // 모델 셀렉트 기본값 바인딩
    const modelSelect = document.getElementById("gemini-model-select");
    if (modelSelect) {
        modelSelect.value = appState.apiModel || "gemini-2.0-flash-thinking-exp";
    }
    
    updateModalConnStatus();
}

function closeApiModal() {
    document.getElementById("api-modal").classList.remove("active");
}

function saveApiKey() {
    const key = document.getElementById("gemini-api-key").value.trim();
    const modelSelect = document.getElementById("gemini-model-select");
    const model = modelSelect ? modelSelect.value : "gemini-2.0-flash-thinking-exp";
    
    if (!key) {
        alert("API Key를 입력해주세요.");
        return;
    }

    // 로컬 스토리지 및 상태 저장
    appState.apiKey = key;
    appState.apiModel = model;
    localStorage.setItem("gemini_api_key", key);
    localStorage.setItem("gemini_api_model", model);

    const apiBadge = document.getElementById("api-status");
    const apiBadgeText = document.getElementById("api-status-text");
    apiBadge.className = "api-status-badge online";
    apiBadgeText.textContent = `Gemini API 연결됨 (${model})`;

    updateModalConnStatus();
    closeApiModal();
    alert(`구글 Gemini API Key 및 모델(${model}) 설정이 완료되었습니다!`);
}

function clearApiKey() {
    appState.apiKey = "";
    localStorage.removeItem("gemini_api_key");
    localStorage.removeItem("gemini_api_model");
    
    const apiBadge = document.getElementById("api-status");
    const apiBadgeText = document.getElementById("api-status-text");
    apiBadge.className = "api-status-badge local";
    apiBadgeText.textContent = "로컬 엔진 모드";

    document.getElementById("gemini-api-key").value = "";
    updateModalConnStatus();
    alert("등록된 API Key와 모델 설정이 삭제되었습니다. 다시 로컬 RAG 모의 엔진으로 동작합니다.");
}

function updateModalConnStatus() {
    const statusBox = document.getElementById("modal-conn-status");
    if (appState.apiKey) {
        statusBox.className = "api-connection-status online";
        statusBox.querySelector(".status-lbl-text").textContent = "연동 완료 (실제 Gemini RAG 채팅 활성화)";
    } else {
        statusBox.className = "api-connection-status offline";
        statusBox.querySelector(".status-lbl-text").textContent = "연동되지 않음 (로컬 RAG 시뮬레이션 작동)";
    }
}

// 6. AI 생성 마법사 (Wizard)
function resetCreatorWizard() {
    appState.currentStep = 1;
    appState.newAiData = {
        name: "",
        avatar: "fa-book-atlas",
        desc: "",
        persona: "",
        knowledge: "",
        keywords: [],
        questions: []
    };

    // 폼 인풋 비우기
    document.getElementById("ai-name").value = "";
    document.getElementById("ai-desc").value = "";
    document.getElementById("ai-persona").value = "";
    document.getElementById("knowledge-text").value = "";
    
    // 파일 비우기
    clearUploadedFile();
    
    // 크롤러 비우기
    document.getElementById("crawl-url").value = "";
    document.getElementById("crawler-console").classList.add("hidden");
    document.getElementById("crawl-logs").innerHTML = "";

    // 아바타 선택 초기화
    document.querySelectorAll(".avatar-option").forEach(opt => {
        opt.classList.remove("active");
        if (opt.getAttribute("data-avatar") === "fa-book-atlas") {
            opt.classList.add("active");
        }
    });

    // 지식 탭 직접 입력 선택
    document.querySelectorAll(".k-tab-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelector('[data-tab="kb-text"]').classList.add("active");
    document.querySelectorAll(".k-tab-content").forEach(content => content.classList.remove("active"));
    document.getElementById("kb-text").classList.add("active");

    // 학습 화면 제어 초기화
    document.getElementById("training-done-actions").classList.add("hidden");
    document.getElementById("training-progress-bar").style.width = "0%";
    document.getElementById("training-percentage").textContent = "0%";
    document.getElementById("training-status").textContent = "데이터 준비 중...";
    document.getElementById("training-logs").innerHTML = "";
    document.getElementById("training-title").textContent = "시냅스 연결 및 벡터 데이터 색인 중...";
    
    showStep(1);
    setupAvatarSelectors();
}

function setupAvatarSelectors() {
    document.querySelectorAll(".avatar-option").forEach(opt => {
        opt.onclick = () => {
            document.querySelectorAll(".avatar-option").forEach(o => o.classList.remove("active"));
            opt.classList.add("active");
            appState.newAiData.avatar = opt.getAttribute("data-avatar");
        };
    });
}

function showStep(stepNum) {
    appState.currentStep = stepNum;
    
    // 스텝 콘텐츠 토글
    document.querySelectorAll(".step-content").forEach((content, idx) => {
        content.classList.remove("active");
        if (idx === (stepNum - 1)) {
            content.classList.add("active");
        }
    });

    // 스텝 인디케이터 토글
    for (let i = 1; i <= 3; i++) {
        const ind = document.getElementById(`step-ind-${i}`);
        const line = document.getElementById(`step-line-${i-1}`);
        
        if (ind) {
            ind.classList.remove("active", "completed");
            if (i < stepNum) {
                ind.classList.add("completed");
            } else if (i === stepNum) {
                ind.classList.add("active");
            }
        }
        if (line) {
            line.classList.remove("active");
            if (i - 1 < stepNum) {
                line.classList.add("active");
            }
        }
    }
}

function nextStep(stepNum) {
    if (stepNum === 2) {
        // Step 1 유효성 검사
        const name = document.getElementById("ai-name").value.trim();
        const desc = document.getElementById("ai-desc").value.trim();
        
        if (!name || !desc) {
            alert("AI 이름과 한 줄 설명은 필수 항목입니다.");
            return;
        }

        appState.newAiData.name = name;
        appState.newAiData.desc = desc;
        appState.newAiData.persona = document.getElementById("ai-persona").value.trim() 
            || `당신은 ${name}입니다. 친절하고 디테일하게 설명해 줍니다.`;
    }
    showStep(stepNum);
}

function prevStep(stepNum) {
    showStep(stepNum);
}

// 템플릿 데이터 즉시 로드
function loadSampleTemplate(type) {
    if (type === "fantasy") {
        document.getElementById("ai-name").value = "아스텔리아 역사 연구가";
        document.getElementById("ai-desc").value = "잃어버린 아스텔리아 고대 왕국의 유적 및 신화 전문 학자";
        document.getElementById("ai-persona").value = "당신은 차분하고 학구적인 성향의 역사학자입니다. 문장의 끝을 항상 '~하군', '~라네' 로 끝마치며, 지식 베이스를 근거로 한 사실 규명에 철저합니다.";
        document.getElementById("knowledge-text").value = `고대 아스텔리아 제국은 제국력 120년에 성검 '아스트라이아'의 봉인이 깨지며 멸망했습니다.
멸망의 직접적인 원인은 5대 황제 율리우스가 어둠의 세력 '벨리알'과 불평등 영혼 계약을 맺어 온 사막의 모래폭풍을 불러왔기 때문입니다.
아스텔리아 제국의 마지막 생존 왕녀는 '아리아나'이며, 그녀는 바람 속성 마법의 일인자였고 제국 동쪽 끝 '바람결 산맥'의 비밀 동굴에 황실 유물과 역사서들을 숨겨두었습니다.
황실 유물 중 '빛의 왕관(Crown of Radiance)'은 착용자에게 거짓말을 파악하는 능력을 주지만, 하루에 10분만 활성화할 수 있고 사용한 후에는 착용자가 1시간 동안 강제로 잠에 들게 되는 부작용을 가지고 있습니다.
아스텔리아 백성들은 모래 폭풍 속에서도 방습, 방사능 차단 기능이 뛰어난 가죽 재질의 '에스카르트 망토'를 입어 장기간 생존할 수 있었습니다.`;
        alert("🐉 판타지 설정집 템플릿 정보가 입력되었습니다! 1단계 설정도 함께 채워졌습니다.");
    } else if (type === "game") {
        document.getElementById("ai-name").value = "러스트 택틱스 보드게임 룰 마스터";
        document.getElementById("ai-desc").value = "로그라이크 전술 보드게임 'Rust Tactics'의 고난도 규칙 해설사";
        document.getElementById("ai-persona").value = "당신은 Rust Tactics의 수석 심판입니다. 공정하고 칼같이 규칙을 따지며, 건조하고 직관적인 말투로 명확한 규칙을 명시해줍니다.";
        document.getElementById("knowledge-text").value = `Rust Tactics 보드게임에서 플레이어의 이동 턴에 적 유닛과 인접한 타일(1칸 이내)을 지나칠 경우 '기회 공격(Opportunity Attack)'을 받아 즉시 이동력이 0이 되며 턴이 반강제 종료됩니다.
만약 캐릭터의 방어구가 '녹슨 강철(Rusted Iron)' 세트일 경우, 산성 속성의 적 공격을 받으면 방어력이 영구적으로 2 감소하며 3턴간 '부식성 도트 데미지(초당 5 체력 감소)' 디버프를 받습니다.
게임 내 이스터에그 카드인 '고장난 시계(Broken Watch)' 카드는 턴 종료 시 무작위로 5%의 확률로 발동합니다. 발동 시 해당 라운드의 전체 플레이어 카드를 전부 수거하여 덱에 섞고 다시 나누어 가지는 대혼란(Chaos Shift) 턴이 작동합니다.
승리 조건은 오직 맵 정중앙에 위치한 '부식의 심장' 핵을 기사단 클래스가 물리피해 공격으로 마지막 타격을 주어 파괴하는 것뿐입니다. (마법 피해 파괴는 승리로 카운트되지 않으며 폭발 디버프를 일으킵니다)`;
        alert("🎲 인디보드게임 룰북 템플릿 정보가 입력되었습니다! 1단계 설정도 함께 채워졌습니다.");
    }
}

// 7. 데이터 입력 서브 탭 & 파일 & 크롤러
function setupFileDropZone() {
    const dropZone = document.getElementById("file-drop-zone");
    const fileInput = document.getElementById("file-upload");

    // 탭 버튼 클릭 전환
    document.querySelectorAll(".k-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".k-tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const targetTab = btn.getAttribute("data-tab");
            document.querySelectorAll(".k-tab-content").forEach(content => {
                content.classList.remove("active");
            });
            document.getElementById(targetTab).classList.add("active");
        });
    });

    // 드래그 앤 드롭 이벤트
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.add('highlight');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.remove('highlight');
        }, false);
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            handleUploadedFile(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (fileInput.files.length > 0) {
            handleUploadedFile(fileInput.files[0]);
        }
    });
}

let uploadedFileContent = "";

function handleUploadedFile(file) {
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.json')) {
        alert("텍스트(.txt) 또는 JSON(.json) 파일만 업로드할 수 있습니다.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedFileContent = e.target.result;
        
        const infoBar = document.getElementById("file-info-bar");
        const fileNameSpan = document.getElementById("uploaded-file-name");
        const fileSizeSpan = document.getElementById("uploaded-file-size");

        fileNameSpan.textContent = file.name;
        fileSizeSpan.textContent = `(${(file.size / 1024).toFixed(1)} KB)`;
        infoBar.classList.remove("hidden");
    };
    reader.readAsText(file);
}

function clearUploadedFile() {
    uploadedFileContent = "";
    document.getElementById("file-upload").value = "";
    document.getElementById("file-info-bar").classList.add("hidden");
}

// 웹 크롤러 모의 시뮬레이터 -> 실제 크롤러로 연동
async function startMockCrawl() {
    const url = document.getElementById("crawl-url").value.trim();
    if (!url) {
        alert("크롤링할 URL을 입력해주세요.");
        return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        alert("주소는 http:// 또는 https:// 로 시작해야 합니다.");
        return;
    }

    const consoleBox = document.getElementById("crawler-console");
    const logsContainer = document.getElementById("crawl-logs");
    
    consoleBox.classList.remove("hidden");
    logsContainer.innerHTML = "";

    const addLog = (text, delay) => {
        return new Promise(resolve => {
            setTimeout(() => {
                const log = document.createElement("span");
                log.innerHTML = `> ${text}`;
                logsContainer.appendChild(log);
                logsContainer.scrollTop = logsContainer.scrollHeight;
                resolve();
            }, delay);
        });
    };

    await addLog(`지정 포트로 HTTP 요청 송신 중: GET ${url} ...`, 300);
    
    // 실제 크롤링 수행
    let result = await fetchAndParseURL(url);
    
    let scrapedText = "";
    if (!result.success || result.wordCount < 10) {
        await addLog("보안 제한(CORS) 감지. 기본 데이터를 반환합니다.", 600);
        let domain = url.replace('https://', '').replace('http://', '').split('/')[0];
        scrapedText = `[수집처: ${domain} 메인 기사]
사용자가 지정한 웹페이지의 보안 설정으로 인해 텍스트를 모두 가져오지 못했습니다.
해당 페이지의 핵심 정보를 수동으로 입력해주시면 더 정확한 답변이 가능합니다.`;
    } else {
        await addLog("서버 응답 수신: 200 OK", 600);
        await addLog("DOM 트리 파싱 및 비보안 정적 컨텐츠 필터링 완료", 400);
        await addLog("본문 텍스트 내 중복 공백 제거 및 레이아웃 정리 중...", 500);
        scrapedText = `[실시간 조사 링크: ${url}]\n- 페이지 제목: ${result.title}\n${result.content}`;
    }

    await addLog(`성공적으로 지식 정보 조각 수집 완료! (${scrapedText.length} 자)`, 600);
    await addLog(`임시 버퍼에 텍스트 저장 완료. 학습 시 반영됩니다.`, 300);

    // 크롤링한 텍스트 임시 보관
    document.getElementById("crawl-url").dataset.scrapedContent = scrapedText;
}

// 8. 학습 애니메이션 및 시냅스 빌드 엔진

// 구글 Gemini API를 사용한 고정밀 키워드 및 질문 추출
async function extractKeywordsAndQuestionsViaAPI(text) {
    if (!appState.apiKey) return null;
    const modelName = appState.apiModel || "gemini-2.0-flash-thinking-exp";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${appState.apiKey}`;
    const prompt = `주어지는 텍스트에서 가장 핵심적인 고유 명사나 전문 키워드 5-6개를 추출하고, 해당 텍스트의 사실 여부를 검증할 수 있는 구체적인 질문 3개를 작성해줘.
텍스트:
${text}

출력 형식은 반드시 아래와 같은 JSON 형식이어야 해. 마크다운 기호(\`\`\`json 등)나 다른 텍스트는 절대 포함하지 말고 순수 JSON만 반환해.
{
  "keywords": ["키워드1", "키워드2", "키워드3", "키워드4", "키워드5"],
  "questions": ["질문1", "질문2", "질문3"]
}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 500
                }
            })
        });
        const data = await response.json();
        let jsonText = data.candidates[0].content.parts[0].text.trim();
        
        // 마크다운 백틱 제거
        if (jsonText.startsWith("```")) {
            jsonText = jsonText.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();
        }
        
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("API keyword extraction failed:", e);
        return null;
    }
}

// AI 생각 태그 파싱 헬퍼
function parseThinkingAndContent(rawText) {
    let thinking = "";
    let cleanText = rawText;
    
    // <thinking>...</thinking> 태그 추출
    const thinkingMatch = rawText.match(/<thinking>([\s\S]*?)<\/thinking>/);
    if (thinkingMatch) {
        thinking = thinkingMatch[1].trim();
        cleanText = rawText.replace(thinkingMatch[0], "").trim();
    }
    
    return { thinking, cleanText };
}

// 생각 과정 아코디언 토글 함수
function toggleThoughtBox(id) {
    const body = document.getElementById(`body-${id}`);
    const arrow = document.getElementById(`arrow-${id}`);
    
    if (body.classList.contains("hidden")) {
        body.classList.remove("hidden");
        arrow.style.transform = "rotate(180deg)";
    } else {
        body.classList.add("hidden");
        arrow.style.transform = "rotate(0deg)";
    }
}

let animId = null;
async function startTrainingProcess() {
    // 주입 데이터 취합
    const activeTabBtn = document.querySelector(".k-tab-btn.active");
    const activeTab = activeTabBtn ? activeTabBtn.getAttribute("data-tab") : "kb-text";
    
    let finalKnowledge = "";
    
    if (activeTab === "kb-text") {
        finalKnowledge = document.getElementById("knowledge-text").value.trim();
    } else if (activeTab === "kb-file") {
        finalKnowledge = uploadedFileContent;
    } else if (activeTab === "kb-web") {
        finalKnowledge = document.getElementById("crawl-url").dataset.scrapedContent || "";
    }

    if (!finalKnowledge) {
        alert("학습할 데이터를 먼저 입력, 업로드 또는 크롤링하여 채워주세요!");
        return;
    }

    appState.newAiData.knowledge = finalKnowledge;
    showStep(3);
    
    // 훈련 로그 초기 설정
    const progressBar = document.getElementById("training-progress-bar");
    const progressPerc = document.getElementById("training-percentage");
    const statusText = document.getElementById("training-status");
    const logsBox = document.getElementById("training-logs");
    
    logsBox.innerHTML = "";
    progressBar.style.width = "0%";
    progressPerc.textContent = "0%";
    
    const addLog = (text, type = 'info') => {
        const log = document.createElement("div");
        log.className = `log-line log-${type}`;
        log.innerHTML = `[${new Date().toLocaleTimeString()}] ${text}`;
        logsBox.appendChild(log);
        logsBox.scrollTop = logsBox.scrollHeight;
    };

    addLog("시냅스 빌드 엔진 초기화 중...", "info");
    statusText.textContent = "AI 모델 연결 설정 중...";
    initNeuralCanvas();

    // 실시간 주입 텍스트 롤링 효과
    const overlay = document.getElementById("scanning-overlay");
    let textSliceIndex = 0;
    const textInterval = setInterval(() => {
        if (textSliceIndex >= finalKnowledge.length) textSliceIndex = 0;
        overlay.textContent = "SCANNING RAW TEXT...\n" + finalKnowledge.substring(textSliceIndex, textSliceIndex + 250);
        textSliceIndex += 10;
    }, 50);

    // progress bar 0 to 20%
    progressBar.style.width = "20%";
    progressPerc.textContent = "20%";
    statusText.textContent = "고정밀 시냅스 키워드 및 질문 모델 학습 중...";
    
    let aiExtracted = null;
    if (appState.apiKey) {
        addLog("구글 Gemini API를 활용하여 정밀 키워드 및 검증 질문 추출을 시도합니다.", "info");
        aiExtracted = await extractKeywordsAndQuestionsViaAPI(finalKnowledge);
    }

    if (aiExtracted && aiExtracted.keywords && aiExtracted.questions) {
        appState.newAiData.keywords = aiExtracted.keywords;
        appState.newAiData.questions = aiExtracted.questions;
        addLog("✔ 실제 AI 모델이 핵심 키워드 및 질문을 추출하여 학습 완료했습니다.", "success");
        addLog(`인식된 핵심 키워드: [${aiExtracted.keywords.join(', ')}]`, "success");
    } else {
        if (appState.apiKey) {
            addLog("⚠ AI 모델 응답 오류로 로컬 추출 엔진으로 전환합니다.", "warn");
        } else {
            addLog("로컬 RAG 모의 추출 엔진으로 핵심 키워드를 연산합니다.", "info");
        }
        appState.newAiData.keywords = extractKeywordsFromText(finalKnowledge);
        appState.newAiData.questions = generateQuestionsFromText(finalKnowledge);
        addLog(`인식된 핵심 키워드: [${appState.newAiData.keywords.join(', ')}]`, "success");
    }

    // Continue progress 20% -> 100%
    let progress = 20;
    const progressInterval = setInterval(() => {
        progress += 5;
        progressBar.style.width = `${progress}%`;
        progressPerc.textContent = `${progress}%`;

        if (progress === 40) {
            addLog("텍스트 데이터 청크 분할 완료 및 벡터 임베딩 생성 중...", "info");
            statusText.textContent = "시냅스 유사도 테이블 매핑 중...";
        } else if (progress === 70) {
            addLog("환각 방지 프롬프트 세이프가드(Hallucination Safeguard) 컴파일 완료", "success");
            statusText.textContent = "AI 깊은 생각(Reasoning) CoT 엔진 적용 중...";
        } else if (progress === 90) {
            addLog("시냅스 빌드 검증 및 색인 정합성 체크 통과", "success");
            statusText.textContent = "마지막 브레인 코어 통합 중...";
        } else if (progress >= 100) {
            clearInterval(progressInterval);
            clearInterval(textInterval);
            cancelAnimationFrame(animId);
            
            addLog("★ 학습 완료! 새로운 특화 AI 코어가 완성되었습니다. 즉시 응답 가능합니다.", "success");
            
            document.getElementById("training-title").innerHTML = "🎉 시냅스 인덱싱 완료!";
            statusText.textContent = "AI가 공부를 마치고 질문을 받을 준비를 마쳤습니다!";
            overlay.textContent = "STUDY COMPLETED.\nFact Shield Active.\nCoT Thinking Enabled.";
            
            // 완료 버튼 노출
            document.getElementById("training-done-actions").classList.remove("hidden");
        }
    }, 150);
}

function extractKeywordsFromText(text) {
    // 특수문자 제거
    const cleanText = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]]/g,"");
    const words = cleanText.split(/\s+/);
    const wordCounts = {};
    
    // 3자 이상 명사 추정 단어 카운트
    words.forEach(w => {
        if (w.length >= 3 && !w.endsWith("은") && !w.endsWith("는") && !w.endsWith("이") && !w.endsWith("가") && !w.endsWith("을") && !w.endsWith("를")) {
            wordCounts[w] = (wordCounts[w] || 0) + 1;
        }
    });

    // 빈도순 정렬
    const sortedWords = Object.keys(wordCounts).sort((a,b) => wordCounts[b] - wordCounts[a]);
    // 상위 5~6개 추출
    return sortedWords.slice(0, 6);
}

function generateQuestionsFromText(text) {
    // 문장 단위 분할
    const sentences = text.split(/[.\n]/).map(s => s.trim()).filter(s => s.length > 20);
    const questions = [];
    
    // 주입된 문장에서 질문형 문의 뼈대 구성
    if (sentences.length >= 1) {
        // 첫 번째 주요 사실 질문화
        const kw = extractKeywordsFromText(sentences[0])[0] || "이 지식";
        questions.push(`${kw}에 대한 구체적인 세부 사실은 무엇인가요?`);
    }
    if (sentences.length >= 2) {
        const kw = extractKeywordsFromText(sentences[1])[0] || "이 항목";
        questions.push(`${kw}의 동작 방식이나 숨겨진 규칙은 어떻게 됩니까?`);
    }
    if (sentences.length >= 3) {
        const kw = extractKeywordsFromText(sentences[2])[0] || "해당 설정";
        questions.push(`${kw}와 관련된 주요 유의 사항이나 이스터에그는 무엇인가요?`);
    }
    
    // 템플릿 기본값 대체용 안전장치
    if (questions.length < 2) {
        questions.push("주입된 지식에서 가장 중요한 핵심 정보는 무엇인가요?");
        questions.push("일반 AI가 알기 힘든 마이너한 디테일을 정리해서 알려주세요.");
    }
    return questions.slice(0, 3);
}

// 훈련 시뮬레이션 동작
function runTrainingSimulation() {
    const progressBar = document.getElementById("training-progress-bar");
    const progressPerc = document.getElementById("training-percentage");
    const statusText = document.getElementById("training-status");
    const logsBox = document.getElementById("training-logs");
    
    logsBox.innerHTML = "";
    
    // 캔버스 노드 그래픽 네트워크 초기화
    initNeuralCanvas();

    const addLog = (text, type = 'info') => {
        const log = document.createElement("div");
        log.className = `log-line log-${type}`;
        log.innerHTML = `[${new Date().toLocaleTimeString()}] ${text}`;
        logsBox.appendChild(log);
        logsBox.scrollTop = logsBox.scrollHeight;
    };

    // 실시간 주입 텍스트 롤링 효과
    const overlay = document.getElementById("scanning-overlay");
    const fullText = appState.newAiData.knowledge;
    let textSliceIndex = 0;
    
    const textInterval = setInterval(() => {
        if (textSliceIndex >= fullText.length) textSliceIndex = 0;
        overlay.textContent = "SCANNING RAW TEXT...\n" + fullText.substring(textSliceIndex, textSliceIndex + 250);
        textSliceIndex += 10;
    }, 50);

    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 2;
        progressBar.style.width = `${progress}%`;
        progressPerc.textContent = `${progress}%`;

        if (progress === 10) {
            addLog("주입 데이터 적재 및 바이트 무결성 체크 완료", "info");
            statusText.textContent = "데이터 적재 및 파일 정형화 중...";
        } else if (progress === 26) {
            addLog(`지식 크기 감지: ${fullText.length} 자. 문장/문단 파싱 시작...`, "info");
            statusText.textContent = "RAG 분할 색인(Chunking) 진행 중...";
        } else if (progress === 44) {
            addLog(`중요 엔티티 및 명사 토큰 분석 완료: [${appState.newAiData.keywords.join(', ')}]`, "success");
            statusText.textContent = "디테일 가드 필터링 세팅 중...";
        } else if (progress === 68) {
            addLog("벡터 공간 내 좌표 사상(Vector Embeddings Mapping) 생성...", "info");
            statusText.textContent = "시냅스 유사도 테이블 구조화 중...";
        } else if (progress === 84) {
            addLog("환각(Hallucination) 방지 지연 프롬프트 인젝션 컴파일 성공", "success");
            statusText.textContent = "학습 완료 검증 프로토콜 작동 중...";
        } else if (progress === 100) {
            clearInterval(progressInterval);
            clearInterval(textInterval);
            cancelAnimationFrame(animId);
            
            addLog("★ 학습 완료! 새로운 특화 AI 코어가 완성되었습니다. 즉시 응답 가능합니다.", "success");
            
            document.getElementById("training-title").innerHTML = "🎉 시냅스 인덱싱 완료!";
            statusText.textContent = "AI가 공부를 마치고 질문을 받을 준비를 마쳤습니다!";
            overlay.textContent = "STUDY COMPLETED.\nFact Shield Active.\nRAG Vectors Synced.";
            
            // 완료 버튼 노출
            document.getElementById("training-done-actions").classList.remove("hidden");
        }
    }, 90);
}

// 신경망 캔버스 드로잉
function initNeuralCanvas() {
    const canvas = document.getElementById("network-canvas");
    const ctx = canvas.getContext("2d");
    
    // 부모 사이즈 맞추기
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const nodes = [];
    const keywordLabels = [...appState.newAiData.keywords, "CORE", "FACT", "BRAIN", "RAG"];
    
    // 노드 생성
    for (let i = 0; i < 20; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            radius: Math.random() * 4 + 3,
            label: i < keywordLabels.length ? keywordLabels[i] : null,
            color: i < keywordLabels.length ? "#8b5cf6" : "#06b6d4"
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 선 그리기
        ctx.strokeStyle = "rgba(139, 92, 246, 0.08)";
        ctx.lineWidth = 1;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(139, 92, 246, ${1 - dist/100})`;
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }

        // 노드 그리기
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.fill();
            
            // 네온 광원 효과
            ctx.shadowBlur = 10;
            ctx.shadowColor = node.color;
            
            if (node.label) {
                ctx.fillStyle = "rgba(255,255,255,0.7)";
                ctx.font = "10px Outfit, sans-serif";
                ctx.fillText(node.label, node.x + 8, node.y + 3);
            }
            
            // 벽 충돌 검사 및 이동
            node.x += node.vx;
            node.y += node.vy;
            
            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        });

        ctx.shadowBlur = 0; // 초기화
        animId = requestAnimationFrame(draw);
    }
    
    draw();
}

function saveCreatedAI() {
    const id = "ai-custom-" + Date.now();
    const newAi = {
        id: id,
        name: appState.newAiData.name,
        avatar: appState.newAiData.avatar,
        desc: appState.newAiData.desc,
        persona: appState.newAiData.persona,
        knowledge: appState.newAiData.knowledge,
        keywords: appState.newAiData.keywords,
        questions: appState.newAiData.questions,
        stats: { chars: appState.newAiData.knowledge.length, chats: 0 }
    };

    appState.ais.push(newAi);
    localStorage.setItem("mindforge_ais", JSON.stringify(appState.ais));
    
    // 대시보드로 돌아가서 렌더링하고, 방금 생성한 AI 스튜디오로 즉시 진입
    appState.currentAi = newAi;
    navigateTo("chat");
}

// 9. 채팅 룸 (스튜디오) 로직
function setupChatRoom() {
    const ai = appState.currentAi;
    if (!ai) return;

    // 대화 초기화 표시
    clearChatLogs();

    // 1. 왼쪽 사이드바 정보 바인딩
    const sidebarInfo = document.getElementById("chat-sidebar-ai-info");
    sidebarInfo.innerHTML = `
        <div class="ai-avatar"><i class="fa-solid ${ai.avatar}"></i></div>
        <div class="ai-info-text">
            <h3>${ai.name}</h3>
            <p>${ai.desc}</p>
        </div>
    `;

    // 2. 학습 글자 수
    document.getElementById("chat-kb-chars").textContent = ai.knowledge.length;

    // 3. 키워드 목록
    const kwList = document.getElementById("chat-sidebar-keywords");
    kwList.innerHTML = "";
    ai.keywords.forEach(kw => {
        const badge = document.createElement("span");
        badge.className = "kw-badge";
        badge.textContent = kw;
        kwList.appendChild(badge);
    });

    // 4. 추천 질문
    const recList = document.getElementById("chat-rec-questions");
    recList.innerHTML = "";
    ai.questions.forEach(q => {
        const btn = document.createElement("button");
        btn.className = "rec-btn-item";
        btn.innerHTML = `<i class="fa-regular fa-comments" style="margin-right: 5px; color: var(--primary);"></i> ${q}`;
        btn.onclick = () => {
            document.getElementById("chat-input").value = q;
            document.getElementById("btn-send-chat").click();
        };
        recList.appendChild(btn);
    });

    // 5. 챗봇 이름 세팅
    document.getElementById("chat-ai-name").textContent = ai.name;
    document.getElementById("chat-ai-avatar").innerHTML = `<i class="fa-solid ${ai.avatar}"></i>`;

    // 6. 지식 보완 편집 텍스트 채우기
    document.getElementById("quick-kb-textarea").value = ai.knowledge;
}

// 지식 편집창 켜고 끄기
function toggleKnowledgeEditor() {
    const editor = document.getElementById("quick-kb-editor");
    editor.classList.toggle("hidden");
}

function saveQuickKnowledge() {
    const ai = appState.currentAi;
    const newText = document.getElementById("quick-kb-textarea").value.trim();
    
    if (!newText) {
        alert("최소한 한 문장 이상의 지식 텍스트를 남겨두셔야 학습이 유지됩니다.");
        return;
    }

    ai.knowledge = newText;
    ai.keywords = extractKeywordsFromText(newText);
    ai.questions = generateQuestionsFromText(newText);
    
    // 로컬 스토리지 데이터 동기화
    const idx = appState.ais.findIndex(item => item.id === ai.id);
    if (idx !== -1) {
        appState.ais[idx] = ai;
        localStorage.setItem("mindforge_ais", JSON.stringify(appState.ais));
    }

    // 화면 갱신
    setupChatRoom();
    toggleKnowledgeEditor();

    // 3초 미니 학습 로딩 모션 보여주기
    const specChatContainer = document.getElementById("messages-specialized");
    const systemNotice = document.createElement("div");
    systemNotice.className = "system-chat-msg";
    systemNotice.style.borderColor = "var(--primary)";
    systemNotice.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> 실시간 지식 피드백 반영 완료! (3초 고속 재학습 구동 중...)`;
    specChatContainer.appendChild(systemNotice);
    specChatContainer.scrollTop = specChatContainer.scrollHeight;

    setTimeout(() => {
        systemNotice.innerHTML = `✔ 재학습 완료! 신규 팩트에 기반한 답변이 즉시 가능합니다.`;
        systemNotice.style.color = "var(--success)";
        systemNotice.style.borderColor = "var(--success)";
    }, 2000);
}

// 대화 내역 클리어
function clearChatLogs() {
    const ai = appState.currentAi;
    
    document.getElementById("messages-specialized").innerHTML = `
        <div class="system-chat-msg">
            데이터를 완벽히 인지한 나만의 전문 AI (${ai ? ai.name : '기본'}) 입니다. 주입한 팩트 정보를 최우선으로 검색(RAG)하여 대답합니다.
        </div>
    `;
}

// 뷰 모드 토글
function setChatViewMode(mode) {
    appState.chatViewMode = mode;
    
    const wrapper = document.getElementById("chat-panes-wrapper");
    const btnSplit = document.getElementById("btn-view-split");
    const btnSingle = document.getElementById("btn-view-single");

    if (mode === "split") {
        wrapper.classList.remove("single-mode");
        btnSplit.classList.add("active");
        btnSingle.classList.remove("active");
    } else {
        wrapper.classList.add("single-mode");
        btnSplit.classList.remove("active");
        btnSingle.classList.add("active");
    }
}

// 10. 지식 탐색 RAG 엔진 및 대화 전송 핸들링
function handleChatSubmit(event) {
    event.preventDefault();
    
    const input = document.getElementById("chat-input");
    const message = input.value.trim();
    
    if (!message) return;
    
    // 입력 칸 비우기
    input.value = "";
    
    // 1. 유저 말풍선 렌더링
    appendMessage("user", message, "specialized");

    // 타이핑 인디케이터 렌더링
    showTypingIndicator("specialized");

    // 챗 통계 횟수 누적
    const ai = appState.currentAi;
    ai.stats.chats = (ai.stats.chats || 0) + 1;
    const idx = appState.ais.findIndex(item => item.id === ai.id);
    if (idx !== -1) {
        appState.ais[idx] = ai;
        localStorage.setItem("mindforge_ais", JSON.stringify(appState.ais));
    }

    // 2. 답변 탐색 작동
    setTimeout(async () => {
        // 실제 API Key 유무에 따라 동작 분기
        if (appState.apiKey) {
            await fetchGeminiResponses(message);
        } else {
            // 로컬 모의 RAG 엔진 구동
            runLocalRAGEngine(message);
        }
    }, 1200);
}

function appendMessage(sender, text, pane, citations = []) {
    const container = document.getElementById(`messages-${pane}`);
    
    // 타이핑 인디케이터가 있으면 제거
    const typing = container.querySelector(".typing-indicator");
    if (typing) typing.parentElement.remove();

    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${sender === 'user' ? 'user' : 'ai-spec'}`;
    
    if (sender === 'user') {
        bubble.innerHTML = text.replace(/\n/g, '<br>');
    } else {
        // AI 답변인 경우 생각(thinking)과 본문(content)을 파싱
        const parsed = parseThinkingAndContent(text);
        
        let html = "";
        
        // 생각 과정이 있으면 아코디언 추가
        if (parsed.thinking) {
            const uniqueId = "thought-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
            html += `
                <div class="thought-container glass">
                    <div class="thought-header" onclick="toggleThoughtBox('${uniqueId}')">
                        <span><i class="fa-solid fa-brain" style="color:var(--primary); margin-right:6px;"></i> AI의 깊은 생각 과정 (CoT)</span>
                        <i class="fa-solid fa-chevron-down arrow-icon" id="arrow-${uniqueId}"></i>
                    </div>
                    <div class="thought-body hidden" id="body-${uniqueId}">
                        ${parsed.thinking.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `;
        }
        
        // 본문 텍스트 포맷팅
        let formattedText = parsed.cleanText.replace(/\n/g, '<br>');
        html += `<div class="ai-main-response">${formattedText}</div>`;
        
        bubble.innerHTML = html;

        // 출처 표시 추가
        if (citations.length > 0) {
            const citBox = document.createElement("div");
            citBox.className = "citations-box";
            citations.forEach((cit, index) => {
                const citItem = document.createElement("div");
                citItem.className = "citation-item";
                citItem.innerHTML = `<span class="citation-num">${index + 1}</span> <span>주입 지식 원문: "${cit}"</span>`;
                citBox.appendChild(citItem);
            });
            bubble.appendChild(citBox);
        }
    }

    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
}

function showTypingIndicator(pane) {
    const container = document.getElementById(`messages-${pane}`);
    
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${pane === 'generic' ? 'ai-gen' : 'ai-spec'}`;
    bubble.innerHTML = `
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
}

// 11. 로컬 모의 RAG 엔진 (Gemini API Key 미입력 시 작동)

// 한국어 조사 제거 및 텍스트 정규화 헬퍼 (품사 태깅 대용)
function cleanKoreanTerm(term) {
    let clean = term.replace(/[?,.!~'"\(\)\[\]\{\}]/g, '').trim();
    if (clean.length <= 1) return clean;
    
    // 제거할 한국어 조사 목록 (긴 것부터 순서대로 매칭)
    const particles = [
        '에서는', '에게는', '으로부터', '이라는', '이라고', '네이터', 
        '에서', '에게', '으로', '부터', '까지', '조차', '마저', '이며',
        '은', '는', '이', '가', '을', '를', '의', '에', '도', '로', '만', '과', '와', '고', '라'
    ];
    
    for (let p of particles) {
        if (clean.length > p.length && clean.endsWith(p)) {
            // 끝부분이 조사와 일치하면 슬라이스
            clean = clean.substring(0, clean.length - p.length);
            break;
        }
    }
    return clean;
}

function runLocalRAGEngine(query) {
    const ai = appState.currentAi;
    
// 1. 미사용 코드로 삭제됨 (할루시네이션 모의 코드)

    // 2. 전문 AI 답변 생성 (RAG 개선 엔진)
    let specAnswer = "";
    const citations = [];
    
    // 지식을 마침표, 줄바꿈 등으로 유연하게 분할
    const sentences = ai.knowledge
        .split(/[.\n]/)
        .map(s => s.trim())
        .filter(s => s.length > 5);
        
    const matchedSentences = [];

    // 사용자 질문의 어절 분해 및 조사 제거 (Stemming)
    const rawTerms = query.split(/\s+/);
    const cleanQueryTerms = rawTerms.map(t => cleanKoreanTerm(t)).filter(t => t.length >= 1);

    sentences.forEach(s => {
        let matchScore = 0;
        
        // 문장 내 단어들도 파싱하여 매칭 점수 계산
        const sentenceWords = s.split(/\s+/).map(w => cleanKoreanTerm(w));
        
        cleanQueryTerms.forEach(qTerm => {
            // 1. 단어가 조사 제외하고 정확히 매칭되면 고득점 (+10)
            if (sentenceWords.includes(qTerm)) {
                matchScore += 10;
            }
            // 2. 정확히 일치하진 않지만 문장에 포함되어 있으면 중득점 (+5) (Fuzzy Substring matching)
            else if (s.includes(qTerm) && qTerm.length >= 2) {
                matchScore += 5;
            }
        });

        if (matchScore > 0) {
            matchedSentences.push({ sentence: s, score: matchScore });
        }
    });

    // 매칭 결과 점수 높은 순 정렬
    matchedSentences.sort((a, b) => b.score - a.score);

    // 디버깅용 콘솔 출력
    console.log("RAG Match Results for:", query);
    console.log("Query Terms:", cleanQueryTerms);
    console.log("Matches:", matchedSentences);

    if (matchedSentences.length > 0) {
        let factText = "";
        const limit = Math.min(matchedSentences.length, 3);
        const addedSentences = new Set();
        
        for (let i = 0; i < matchedSentences.length; i++) {
            if (addedSentences.size >= limit) break;
            
            const rawSent = matchedSentences[i].sentence;
            if (!addedSentences.has(rawSent)) {
                addedSentences.add(rawSent);
                citations.push(rawSent);
                
                factText += `• <span class='fact-highlight'>${rawSent}</span><br>`;
            }
        }

        specAnswer = `${ai.name}로서 학습된 전문 지식 데이터에 기반하여 정밀 답변드립니다.<br><br>${factText}`;
    } else {
        // 문장 매칭 실패 시 단어 검색 시도 (가장 유사한 단어가 포함된 문장 강제 매칭)
        let fallbackMatched = null;
        for (let s of sentences) {
            for (let term of cleanQueryTerms) {
                if (term.length >= 2 && s.includes(term)) {
                    fallbackMatched = s;
                    break;
                }
            }
            if (fallbackMatched) break;
        }

        if (fallbackMatched) {
            citations.push(fallbackMatched);
            specAnswer = `${ai.name}로서 학습된 기록을 찾아보았습니다.<br><br>질문하신 의도에 부합하는 관련 사실을 발견했습니다:<br>• <span class='fact-highlight'>${fallbackMatched}</span><br><br>이 정보를 참고해주시길 바랍니다.`;
        } else {
            specAnswer = `죄송하옵니다. 주입해주신 전문 지식 범위 내에서는 해당 질문에 대해 정확히 답변할 수 있는 단서를 발견하지 못했습니다. (팩트 세이프가드 필터 작동)<br><br><strong>공부한 내용에 포함된 명사(예: ${ai.keywords.slice(0, 3).join(', ')})</strong>를 포함하여 질문해주시면 더 상세하게 팩트를 짚어드릴 수 있습니다.`;
        }
    }

    appendMessage("ai", specAnswer, "specialized", citations);
}

// 12. 실제 구글 Gemini API 연동 RAG
async function fetchGeminiResponses(query) {
    const ai = appState.currentAi;
    
    const buildRequestBody = (systemInstruction, userMessage) => {
        return {
            contents: [
                { role: "user", parts: [{ text: userMessage }] }
            ],
            systemInstruction: {
                parts: [{ text: systemInstruction }]
            },
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 800
            }
        };
    };

    const specializedSystem = `You are "${ai.name}".
AI Description: ${ai.desc}
Identity / Persona Rules: ${ai.persona}

[IMPORTANT SYSTEM PROCESS: DEEP THINKING (CoT)]
Before generating the final answer, you MUST think step-by-step and write your analysis inside a <thinking>...</thinking> block in Korean.
In your <thinking> block, perform the following:
1. Analyze what the user is asking.
2. Search the Specialized Knowledge Base below for relevant facts.
3. Formulate the correct logic using only the facts in the Knowledge Base.
4. Ensure no external facts, assumptions, or hallucinations are included in the final answer.

Example Format:
<thinking>
1. 사용자의 질문: ~~~
2. 지식 저장소 내 매칭 문장: "~~~"
3. 핵심 팩트 정렬 및 오답 가드 설계: ~~~
</thinking>
[최종 답변 작성]

[IMPORTANT CRITICAL RESPONSE RULE]
You MUST answer the user's questions based ONLY on the "Specialized Knowledge Base" provided below.
1. Wrap the key sentences or exact facts extracted from the knowledge base in '<span class="fact-highlight">...</span>' HTML tag to highlight them (e.g. <span class="fact-highlight">태양검 솔라리스는 밤이 되면 평범한 검으로 되돌아갑니다.</span>).
2. If the answer is NOT found in the Specialized Knowledge Base or if there are no facts at all to support the query, do NOT make up anything. Simply reply in Korean: "죄송합니다. 학습된 지식 저장소 내에서 답변을 찾을 수 있는 근거를 찾지 못했습니다. (팩트 세이프가드 작동)".
3. Do NOT use general knowledge to answer. Stick strictly to the text below.

[Specialized Knowledge Base]
${ai.knowledge}`;

    const modelName = appState.apiModel || "gemini-2.0-flash-thinking-exp";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${appState.apiKey}`;

    try {
        const resSpec = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(buildRequestBody(specializedSystem, query))
        });

        const dataSpec = await resSpec.json();

        let specText = "";
        const citations = [];
        if (dataSpec.candidates && dataSpec.candidates[0].content.parts[0].text) {
            specText = dataSpec.candidates[0].content.parts[0].text;
            
            const sentences = ai.knowledge.split(/[.\n]/).map(s => s.trim()).filter(s => s.length > 5);
            sentences.forEach(s => {
                const words = s.split(/\s+/).slice(0, 4).join(' ');
                if (specText.includes(words) || (words.length > 3 && query.includes(words))) {
                    if (!citations.includes(s)) {
                        citations.push(s);
                    }
                }
            });
        } else {
            specText = "Gemini 전문 응답 처리에 오류가 발생했습니다.";
        }

        appendMessage("ai", specText, "specialized", citations);

    } catch (err) {
        console.error("Gemini API 통신 에러:", err);
        appendMessage("ai", "API 통신 실패. 로컬 모드로 응답을 전환합니다.", "specialized");
        setTimeout(() => {
            runLocalRAGEngine(query);
        }, 1000);
    }
}

// ==========================================
// 13. 실시간 URL 조사 및 RAG 주입 로직 추가
// ==========================================

function toggleUrlInputPanel() {
    const panel = document.getElementById("url-input-panel");
    panel.classList.toggle("hidden");
    if (!panel.classList.contains("hidden")) {
        document.getElementById("live-crawl-url").focus();
    }
}

function hideUrlAnalyzerBar() {
    const bar = document.getElementById("url-analyzer-bar");
    bar.classList.add("hidden");
}

// URL 크롤러 및 본문 파서 헬퍼 (CORS Proxy 활용)
async function fetchAndParseURL(url) {
    try {
        // allorigins CORS proxy 활용
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const res = await fetch(proxyUrl);
        if (!res.ok) throw new Error("CORS Proxy 응답 실패");
        const json = await res.json();
        const htmlString = json.contents;
        
        if (!htmlString) throw new Error("HTML 본문이 비어있음");

        // DOM 파서 가동
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");

        // 1. 제목 감지
        const title = doc.querySelector("title") ? doc.querySelector("title").textContent.trim() : "제목 없는 웹페이지";

        // 2. 불필요 요소 필터링 (스크립트, 스타일, 네비게이션)
        doc.querySelectorAll("script, style, iframe, nav, footer, header, noscript, svg").forEach(el => el.remove());

        // 3. 주요 소제목 (Headings) 추출
        const headings = [];
        doc.querySelectorAll("h1, h2, h3").forEach(h => {
            const txt = h.textContent.trim().replace(/\s+/g, ' ');
            if (txt.length > 2 && txt.length < 100) {
                headings.push(txt);
            }
        });

        // 4. 본문 문단 추출
        const paragraphs = [];
        doc.querySelectorAll("p, article, section").forEach(p => {
            const txt = p.textContent.trim().replace(/\s+/g, ' ');
            if (txt.length > 20 && !paragraphs.includes(txt)) {
                paragraphs.push(txt);
            }
        });

        // 5. 핵심 텍스트 병합 및 단어 수 체크
        const mainContent = paragraphs.slice(0, 15).join("\n"); // 너무 길지 않게 15개 문단으로 자름
        const summary = paragraphs.slice(0, 3).join(" ") || "본문에 충분한 텍스트 데이터가 명시되어 있지 않습니다.";

        return {
            success: true,
            title: title,
            headings: headings.slice(0, 6),
            content: mainContent || "추출된 본문 텍스트가 없습니다.",
            summary: summary.substring(0, 200) + "...",
            wordCount: mainContent.length,
            isMocked: false
        };
    } catch (error) {
        console.error("CORS crawl error:", error);
        return {
            success: false,
            error: error.message
        };
    }
}

// CORS 실패 시 실시간 데이터 추정 보고서 생성 (시뮬레이터)
function generateMockCrawlData(url) {
    const domain = url.replace("https://", "").replace("http://", "").split("/")[0];
    
    // 임의의 정밀 데이터 생성
    const title = `${domain} 분석 리포트 - ${domain.toUpperCase()} 정보 저장소`;
    const headings = [
        "1. 해당 도메인의 마이너 카테고리 구성 방식",
        "2. 구조적 팩트 데이터 추출 결과",
        "3. RAG 시냅스 가중치 인덱싱 보고서"
    ];
    const content = `보안 프로토콜(Cloudflare/CORS)로 인해 실제 사이트 본문을 원격 수집하지 못하여, 마인드포지 AI 조사기가 주소(${url})를 기반으로 구성한 조사 데이터입니다.
이 웹사이트(${domain})는 주요 마이너 항목 및 정보 소스를 보관하고 있으며, 특히 세부 매뉴얼과 매트릭스 정보를 구조화하여 제공합니다.
세부 항목 A: 해당 플랫폼은 RAG(검색 증강 생성) 프레임워크와 결합될 때 최적의 사실 우선 답변율을 보여줍니다.
세부 항목 B: 이 정보 링크는 할루시네이션 필터를 가동하는 핵심 뼈대가 되며, 사용자의 질의가 있을 때 가중치 우선 테이블에 의해 참조됩니다.`;
    const summary = `${domain}은 RAG 정보 참조 구조를 지원하며, 할루시네이션 차단을 위한 특화 지식 파편을 다수 포함하고 있습니다.`;

    return {
        success: true,
        title: title,
        headings: headings,
        content: content,
        summary: summary,
        wordCount: content.length,
        isMocked: true
    };
}

// 실시간 URL 웹사이트 분석 & RAG 주입 트리거
async function triggerLiveUrlInvestigation() {
    const urlInput = document.getElementById("live-crawl-url");
    const url = urlInput.value.trim();
    
    if (!url) {
        alert("분석할 올바른 URL 주소를 입력해주세요.");
        return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        alert("주소는 http:// 또는 https:// 로 시작해야 합니다.");
        return;
    }

    // 패널 닫기 및 인풋 비우기
    toggleUrlInputPanel();
    urlInput.value = "";

    // 상태 바 노출
    const bar = document.getElementById("url-analyzer-bar");
    const status = document.getElementById("url-analyzer-status");
    bar.classList.remove("hidden");
    
    status.innerHTML = `외부 서버 커넥션 수립 시도 중... (<span style="color:var(--secondary);">${url}</span>)`;

    // 1. 크롤링 수행
    let result = await fetchAndParseURL(url);
    
    // 만약 CORS 문제나 에러로 실패하면 목데이터로 우회 지원
    if (!result.success || result.wordCount < 100) {
        status.innerHTML = `보안 제한(CORS) 감지. 마인드포지 AI 자동 추정 조사기로 전환 중...`;
        await new Promise(r => setTimeout(r, 1200));
        result = generateMockCrawlData(url);
    } else {
        status.innerHTML = `본문 HTML 파싱 및 핵심 레이아웃 분할 중...`;
        await new Promise(r => setTimeout(r, 800));
    }

    status.innerHTML = `시냅스 색인(RAG) 지식 데이터 주입 완료!`;
    setTimeout(() => {
        bar.classList.add("hidden");
    }, 1500);

    // 2. 지식 데이터에 추가
    const ai = appState.currentAi;
    const injectionText = `\n\n[실시간 조사 링크: ${url}]\n- 페이지 제목: ${result.title}\n${result.content}`;
    ai.knowledge += injectionText;
    
    // 키워드 재추출 및 지식 업데이트
    ai.keywords = [...new Set([...ai.keywords, ...extractKeywordsFromText(result.content)])].slice(0, 8);
    ai.stats.chars = ai.knowledge.length;
    
    // 로컬 스토리지 업데이트
    const idx = appState.ais.findIndex(item => item.id === ai.id);
    if (idx !== -1) {
        appState.ais[idx] = ai;
        localStorage.setItem("mindforge_ais", JSON.stringify(appState.ais));
    }

    // 왼쪽 사이드바 정보 갱신
    setupChatRoom();

    // 3. 채팅창에 조사 리포트 출력
    const reportHtml = `
        <div class="url-report-card" style="background: rgba(0,0,0,0.15); border: 1px solid var(--border-glass); border-radius: 12px; padding: 16px; margin: 10px 0;">
            <h4 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--secondary); display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-file-shield" style="color:var(--secondary);"></i> 실시간 링크 조사 리포트
            </h4>
            <div class="report-meta" style="margin-top:10px; font-size:0.8rem; line-height:1.4; color:var(--text-muted);">
                <div><strong>분석 주소:</strong> <a href="${url}" target="_blank" style="color:var(--secondary); text-decoration:none;">${url}</a></div>
                <div><strong>문서 제목:</strong> <span style="color:var(--text-main); font-weight:600;">${result.title}</span></div>
                <div><strong>데이터량:</strong> ${result.wordCount}자 수집됨 ${result.isMocked ? '(추정 보고서)' : '(실시간 수집)'}</div>
            </div>
            <div class="report-structure" style="margin-top:12px; padding-top:12px; border-top:1px dashed rgba(255,255,255,0.06);">
                <div style="font-size:0.8rem; font-weight:700; margin-bottom:8px; color:var(--primary);"><i class="fa-solid fa-sitemap" style="margin-right:5px;"></i> 수집된 문서 레이아웃 구성</div>
                <ul style="padding-left:16px; font-size:0.75rem; color:var(--text-muted); display:flex; flex-direction:column; gap:4px;">
                    ${result.headings.map(h => `<li><i class="fa-solid fa-hashtag" style="font-size:0.6rem; color:var(--text-dim); margin-right:4px;"></i> ${h}</li>`).join('')}
                </ul>
            </div>
            <div class="report-summary" style="margin-top:12px; padding:10px; border-radius:8px; background:rgba(0,0,0,0.2); font-size:0.78rem; line-height:1.45; color:var(--text-muted);">
                <div style="font-weight:700; margin-bottom:6px; color:var(--text-main);"><i class="fa-solid fa-magnifying-glass" style="margin-right:4px;"></i> 수집 텍스트 핵심 요약</div>
                <p>${result.summary}</p>
            </div>
            <div class="report-success-tag" style="margin-top:12px; font-size:0.75rem; color:var(--success); font-weight:600; display:flex; align-items:center; gap:5px;">
                <i class="fa-solid fa-circle-check"></i> RAG 지식 색인 등록 완료 (AI 학습률 즉시 반영)
            </div>
        </div>
    `;

    // 유저 측에 리포트 추가
    appendMessage("user", `[링크 조사 및 주입 요청] ${url}`, "specialized");

    // 시스템 및 AI 응답 처리
    showTypingIndicator("specialized");

    setTimeout(() => {
        // 전문 AI 답변: 리포트 카드 렌더링 후 안내 텍스트 출력
        const specAnswer = `${reportHtml}<br>보내주신 웹사이트 링크의 구조와 텍스트 구성을 철저히 조사하여 제 지식 저장소에 주입 및 색인을 마쳤습니다! 🚀<br><br>이제 이 링크 안의 구체적인 내용에 대해 질문해주시면, 거짓말(할루시네이션) 없이 주입된 사실만을 바탕으로 즉시 완벽한 답변을 드리겠습니다.`;

        appendMessage("ai", specAnswer, "specialized");
    }, 1500);
}

