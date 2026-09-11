/**
 * Etheria: ASMR Studio Tycoon - Streaming(YouTube) & UI Bugfix Update
 */

const state = {
    essence: 0,
    level: 1,
    xp: 0,
    nextLevelXp: 25,
    stability: 80,
    currentDb: 35,
    spirits: { wind: 0, water: 0 },
    currentTool: null,
    visitors: [],
    unlockedRooms: ['crystal'],

    // 방송(유튜브) 시스템용 데이터
    videos: [],

    // 알림 시스템 데이터
    notifications: [],
    unreadNotifs: 0,

    // 도감 (Reviews) 시스템 데이터
    collectedReviews: [],
    claimedReviewRewards: [],

    // 편의성 설정
    highestStage: 1,
    settings: {
        bgmVolume: 50,
        sfxVolume: 50,
        volume: 50,
        autoSave: false,
        graphics: 'high',
        language: 'ko'
    },

    buffs: {
        healSpeedMultiplier: 1.0,
        essenceMultiplier: 1.0,
        xpMultiplier: 1.0
    },
    upgradesOwned: { incense: 0, mic: 0, book: 0 },

    inventory: {},
    activeTemporaryBuffs: [],
    fireLevel: 1,

    activeHealingTarget: null,
    lastVisitorSpawnTime: Date.now(),
    stage: 1,

    // 가상 시계 및 저녁 러시 시스템
    gameTimeMinutes: 480, // 기본 08:00 (오전 8시)
    isEveningRush: false
};

const ROOMS = [
    // Stage 1 (1호점: 에테르노아 온실 본점 - 마법)
    { stage: 1, id: 'crystal', name: '수정 탭핑 방', minLevel: 1, icon: '💎', desc: '초보자를 위한 맑은 공명실', costEssence: 0, costXp: 0, rewardBase: 2 },
    { stage: 1, id: 'potion', name: '물약 믹싱룸', minLevel: 2, icon: '🧪', desc: '유리와 액체의 조화', costEssence: 25, costXp: 0, rewardBase: 6 },
    { stage: 1, id: 'waterbowl', name: '수중 꽃열매 믹싱룸', minLevel: 3, icon: '🌸', desc: '찰랑거리는 물과 팅글', costEssence: 160, costXp: 0, rewardBase: 18 },
    { stage: 1, id: 'sand', name: '키네틱 샌드', minLevel: 5, icon: '🏜️', desc: '사각사각 모래 자르기', costEssence: 1000, costXp: 0, rewardBase: 55 },
    { stage: 1, id: 'chimes', name: '우주 풍경종', minLevel: 8, icon: '🎐', desc: '끝없이 퍼지는 금속 잔향', costEssence: 7500, costXp: 0, rewardBase: 170 },
    { stage: 1, id: 'musicbox', name: '태엽 오르골', minLevel: 13, icon: '🎶', desc: '규칙적인 태엽과 맑은 선율', costEssence: 55000, costXp: 0, rewardBase: 520 },
    { stage: 1, id: 'rainwindow', name: '비 내리는 창문', minLevel: 20, icon: '🌧️', desc: '포근한 빗방울 백색소음', costEssence: 400000, costXp: 0, rewardBase: 1800 },

    // Stage 2 (2호점: 자연 숲 지점)
    { stage: 2, id: 'woodblock', name: '나무 블록 탭핑', minLevel: 1, icon: '🪵', desc: '자연의 투박한 울림', costEssence: 0, costXp: 0, rewardBase: 30 },
    { stage: 2, id: 'leaves', name: '마른 나뭇잎 바스락', minLevel: 2, icon: '🍂', desc: '기분 좋은 바스락거림', costEssence: 400, costXp: 0, rewardBase: 90 },
    { stage: 2, id: 'campfire', name: '모닥불 타닥타닥', minLevel: 3, icon: '🔥', desc: '포근하고 따뜻한 백색소음', costEssence: 2500, costXp: 0, rewardBase: 270 },
    { stage: 2, id: 'singingbowl', name: '싱잉보울', minLevel: 5, icon: '🥣', desc: '깊고 긴 치유의 공명', costEssence: 18000, costXp: 0, rewardBase: 800 },
    { stage: 2, id: 'birdsong', name: '새소리 백색소음', minLevel: 8, icon: '🐦', desc: '숲속 아침의 잔잔한 지저귐', costEssence: 130000, costXp: 0, rewardBase: 2500 },
    { stage: 2, id: 'stream', name: '계곡 물소리', minLevel: 13, icon: '🏞️', desc: '빠르게 흐르는 경쾌한 물소리', costEssence: 950000, costXp: 0, rewardBase: 7800 },
    { stage: 2, id: 'crickets', name: '풀벌레 소리', minLevel: 20, icon: '🦗', desc: '밤의 숲을 연상케 하는 잔잔한 마찰음', costEssence: 7500000, costXp: 0, rewardBase: 27000 },

    // Stage 3 (3호점: 심해 바다 지점)
    { stage: 3, id: 'bubbles', name: '심해 물거품', minLevel: 1, icon: '🫧', desc: '끝없이 올라오는 공기방울', costEssence: 0, costXp: 0, rewardBase: 500 },
    { stage: 3, id: 'submarine', name: '잠수함 진동', minLevel: 2, icon: '🚢', desc: '낮고 깊은 기계식 백색소음', costEssence: 6500, costXp: 0, rewardBase: 1500 },
    { stage: 3, id: 'whale', name: '고래의 메아리', minLevel: 3, icon: '🐋', desc: '아득하게 퍼지는 바다의 노래', costEssence: 45000, costXp: 0, rewardBase: 4500 },
    { stage: 3, id: 'waterflow', name: '심해 해류', minLevel: 5, icon: '🌊', desc: '무겁게 흐르는 깊은 바다 소리', costEssence: 320000, costXp: 0, rewardBase: 13500 },
    { stage: 3, id: 'coral', name: '산호초 마찰', minLevel: 8, icon: '🪸', desc: '자글자글한 백색소음 긁기', costEssence: 2400000, costXp: 0, rewardBase: 42000 },
    { stage: 3, id: 'oxygentank', name: '잠수부 산소통', minLevel: 13, icon: '🤿', desc: '규칙적인 쉬익- 하는 호흡 소리', costEssence: 18000000, costXp: 0, rewardBase: 130000 },
    { stage: 3, id: 'caveecho', name: '해저 동굴 공명', minLevel: 20, icon: '🕳️', desc: '깊게 울리는 동굴의 반향음', costEssence: 140000000, costXp: 0, rewardBase: 450000 },

    // Stage 4 (4호점: 미래/기계 지점)
    { stage: 4, id: 'keyboard', name: '기계식 키보드', minLevel: 1, icon: '⌨️', desc: '경쾌한 청축 타이핑', costEssence: 0, costXp: 0, rewardBase: 8000 },
    { stage: 4, id: 'glitch', name: '홀로그램 글리치', minLevel: 2, icon: '🌀', desc: '미래지향적 전자 팅글', costEssence: 110000, costXp: 0, rewardBase: 24000 },
    { stage: 4, id: 'spaceship', name: '우주선 엔진 룸', minLevel: 3, icon: '🚀', desc: '웅장한 저주파 백색소음', costEssence: 750000, costXp: 0, rewardBase: 72000 },
    { stage: 4, id: 'serverfan', name: '서버룸 쿨러', minLevel: 5, icon: '🖥️', desc: '부드럽고 묵직한 기계식 쿨러 소리', costEssence: 5500000, costXp: 0, rewardBase: 220000 },
    { stage: 4, id: 'servomotor', name: '로봇 구동음', minLevel: 8, icon: '🦾', desc: '낮게 징- 울리는 서보 모터', costEssence: 40000000, costXp: 0, rewardBase: 680000 },
    { stage: 4, id: 'datatransfer', name: '데이터 전송음', minLevel: 13, icon: '💽', desc: '레트로한 모뎀 틱틱거림', costEssence: 300000000, costXp: 0, rewardBase: 2100000 },
    { stage: 4, id: 'zerogpod', name: '무중력 캡슐', minLevel: 20, icon: '🌌', desc: '공명하는 진공관 사운드', costEssence: 2500000000, costXp: 0, rewardBase: 7500000 },

    // Stage 5 (5호점: 에테르노아 왕성 지점)
    { stage: 5, id: 'quill', name: '깃펜 사각사각', minLevel: 1, icon: '🪶', desc: '낡은 양피지 위를 스치는 소리', costEssence: 0, costXp: 0, rewardBase: 150000 },
    { stage: 5, id: 'parchment', name: '마법서 페이지', minLevel: 2, icon: '📜', desc: '오래된 종이의 기분 좋은 바스락', costEssence: 2000000, costXp: 0, rewardBase: 450000 },
    { stage: 5, id: 'teacup', name: '오후의 찻잔', minLevel: 3, icon: '☕', desc: '도자기와 은수저의 맑은 부딪힘', costEssence: 14000000, costXp: 0, rewardBase: 1350000 },
    { stage: 5, id: 'royalchimes', name: '황금 샹들리에', minLevel: 5, icon: '✨', desc: '마법의 성 전체를 울리는 웅장한 공명', costEssence: 100000000, costXp: 0, rewardBase: 4200000 },
    { stage: 5, id: 'velvet', name: '벨벳 커튼 스치기', minLevel: 8, icon: '🧣', desc: '옷감이 두껍게 스치는 묵직한 소리', costEssence: 750000000, costXp: 0, rewardBase: 13000000 },
    { stage: 5, id: 'chess', name: '체스 말 부딪힘', minLevel: 13, icon: '♟️', desc: '나무와 대리석이 맞닿는 달칵 소리', costEssence: 6000000000, costXp: 0, rewardBase: 40000000 },
    { stage: 5, id: 'royalfire', name: '왕실 벽난로', minLevel: 20, icon: '🏰', desc: '장작보다 깊고 풍성한 벽난로 소리', costEssence: 48000000000, costXp: 0, rewardBase: 140000000 },

    // Stage 6 (6호점: 천상 성소 지점)
    { stage: 6, id: 'harp', name: '천상의 하프', minLevel: 1, icon: '🪕', desc: '영혼을 울리는 맑고 투명한 현악기 소리', costEssence: 0, costXp: 0, rewardBase: 3000000 },
    { stage: 6, id: 'clouds', name: '구름 산책', minLevel: 2, icon: '☁️', desc: '푹신푹신하고 부드러운 구름을 밟는 소리', costEssence: 40000000, costXp: 0, rewardBase: 9000000 },
    { stage: 6, id: 'halo', name: '천사의 광배', minLevel: 3, icon: '😇', desc: '빛이 공명하며 만들어내는 성스러운 백색소음', costEssence: 280000000, costXp: 0, rewardBase: 27000000 },
    { stage: 6, id: 'gate', name: '천국의 문', minLevel: 5, icon: '🏛️', desc: '거대한 황금 문이 열리며 퍼지는 장엄한 메아리', costEssence: 2000000000, costXp: 0, rewardBase: 85000000 },
    { stage: 6, id: 'choir', name: '천상 정령의 합창', minLevel: 8, icon: '👼', desc: '성스러운 정령들이 부르는 은은한 아카펠라', costEssence: 15000000000, costXp: 0, rewardBase: 260000000 },
    { stage: 6, id: 'starlight', name: '별빛 세례', minLevel: 13, icon: '✨', desc: '쏟아지는 별빛들이 부딪히며 내는 영롱한 소리', costEssence: 120000000000, costXp: 0, rewardBase: 800000000 },
    { stage: 6, id: 'sanctuary', name: '에테리아 성소', minLevel: 20, icon: '💒', desc: '모든 스트레스를 정화하는 궁극의 치유 파동', costEssence: 1000000000000, costXp: 0, rewardBase: 2800000000 }
];



const PRESCRIPTION_GUIDE = {
    'none': {
        name: '가벼운 피로 & 일상 스트레스',
        symptomDesc: '일상적인 피로와 긴장감으로 머리가 묵직한 상태입니다.',
        rxSoundDesc: '경쾌한 탭핑음과 부드러운 촉각 ASMR (수정, 나무, 모래, 깃펜, 하프 등)',
        recommendedRooms: ['crystal', 'sand', 'woodblock', 'leaves', 'bubbles', 'coral', 'keyboard', 'datatransfer', 'quill', 'parchment', 'harp', 'clouds'],
        bonusSpeed: 1.5,
        bonusReward: 1.3
    },
    'normal': {
        name: '불면증 & 만성 수면부족',
        symptomDesc: '잡념과 불안으로 며칠째 깊은 잠을 이루지 못하고 있습니다.',
        rxSoundDesc: '포근한 빗소리, 오르골 선율, 싱잉보울, 풀벌레 백색소음 등',
        recommendedRooms: ['rainwindow', 'musicbox', 'crickets', 'singingbowl', 'submarine', 'oxygentank', 'spaceship', 'zerogpod', 'royalfire', 'velvet', 'clouds', 'halo'],
        bonusSpeed: 1.5,
        bonusReward: 1.3
    },
    'mild_dep': {
        name: '번아웃 & 무기력증',
        symptomDesc: '열정과 에너지가 방전되어 깊은 무력감에 빠져 있습니다.',
        rxSoundDesc: '따스한 온기와 활력을 불어넣는 물약, 모닥불, 계곡물, 찻잔 소리 등',
        recommendedRooms: ['potion', 'waterbowl', 'campfire', 'stream', 'whale', 'waterflow', 'glitch', 'servomotor', 'teacup', 'chess', 'halo', 'starlight'],
        bonusSpeed: 1.5,
        bonusReward: 1.3
    },
    'severe_dep': {
        name: '중증 우울증 & 심적 고통',
        symptomDesc: '마음의 에테르가 상처받아 극심한 슬픔과 고립감을 겪고 있습니다.',
        rxSoundDesc: '영혼을 맑게 씻어내는 우주 풍경종, 새소리, 샹들리에, 천상 합창 등',
        recommendedRooms: ['chimes', 'waterbowl', 'birdsong', 'stream', 'whale', 'coral', 'serverfan', 'spaceship', 'royalchimes', 'teacup', 'choir', 'starlight'],
        bonusSpeed: 1.5,
        bonusReward: 1.3
    },
    'ptsd': {
        name: '외상 후 스트레스 (PTSD)',
        symptomDesc: '과거의 트라우마가 덮쳐 극도의 공포와 심장 박동 불안을 호소합니다.',
        rxSoundDesc: '깊은 진동 이완과 심리적 안식처를 주는 싱잉보울, 수정 정화, 성소 소리 등',
        recommendedRooms: ['crystal', 'rainwindow', 'singingbowl', 'campfire', 'whale', 'caveecho', 'zerogpod', 'spaceship', 'royalfire', 'royalchimes', 'sanctuary', 'gate'],
        bonusSpeed: 1.5,
        bonusReward: 1.3
    }
};

const STRESS_EFFECTS = [
    { id: 'none', nameKey: 'stress_none', probability: 0.55, speedMod: 1.0 },
    { id: 'normal', nameKey: 'stress_normal', probability: 0.25, speedMod: 0.9 },
    { id: 'mild_dep', nameKey: 'stress_mild_dep', probability: 0.125, speedMod: 0.7 },
    { id: 'severe_dep', nameKey: 'stress_severe_dep', probability: 0.05, speedMod: 0.4 },
    { id: 'ptsd', nameKey: 'stress_ptsd', probability: 0.025, speedMod: 0.2 }
];

const INVENTORY_ITEMS = {
    'potion_small': { id: 'potion_small', nameKey: 'item_potion_small', icon: '🧪', descKey: 'item_desc_small', buffDuration: 30, buffMulti: 1.2, type: 'all' },
    'potion_medium': { id: 'potion_medium', nameKey: 'item_potion_medium', icon: '🍷', descKey: 'item_desc_medium', buffDuration: 60, buffMulti: 1.5, type: 'all' },
    'potion_large': { id: 'potion_large', nameKey: 'item_potion_large', icon: '💎', descKey: 'item_desc_large', buffDuration: 120, buffMulti: 2.0, type: 'all' },
    'potion_special': { id: 'potion_special', nameKey: 'item_potion_special', icon: '✨', descKey: 'item_desc_special', buffDuration: 300, buffMulti: 5.0, type: 'all' },
    'money_bag': { id: 'money_bag', nameKey: 'item_money_bag', icon: '💰', descKey: 'item_desc_money', buffDuration: 180, buffMulti: 3.0, type: 'essence' },
    'promo_bell': { id: 'promo_bell', nameKey: 'item_promo_bell', icon: '🔔', descKey: 'item_desc_promo', buffDuration: 300, buffMulti: 1.0, type: 'severe_chance' },
    'coin_small': { id: 'coin_small', nameKey: 'item_coin_small', icon: '🪙', descKey: 'item_desc_coin_small', buffDuration: 60, buffMulti: 1.5, type: 'essence' },
    'silver_pouch': { id: 'silver_pouch', nameKey: 'item_silver_pouch', icon: '👛', descKey: 'item_desc_silver_pouch', buffDuration: 120, buffMulti: 2.0, type: 'essence' },
    'flower_perfume': { id: 'flower_perfume', nameKey: 'item_flower_perfume', icon: '🌸', descKey: 'item_desc_flower_perfume', buffDuration: 180, buffMulti: 2.0, type: 'heal' }
};

// --- 1시간 주기 비밀 보물상점 풀 ---
const SECRET_SHOP_ITEMS_POOL = [
    { id: 'elixir_essence', name: '별빛 에센스 영약', icon: '🧪', desc: '30분 동안 에센스 획획득량 2배 증가!', costType: 'essence', baseCost: 5000, duration: 1800, effect: { type: 'essenceMultiplier', val: 2.0 } },
    { id: 'scroll_spirit', name: '정령의 축복 주문서', icon: '🕊️', desc: '30분 동안 치유 진행 속도 2배 가속!', costType: 'essence', baseCost: 10000, duration: 1800, effect: { type: 'healSpeedMultiplier', val: 2.0 } },
    { id: 'script_tingle', name: '고대 팅글 양피지', icon: '📜', desc: '1시간 동안 경험치(XP) 획득량 3배 증가!', costType: 'xp', baseCost: 3000, duration: 3600, effect: { type: 'xpMultiplier', val: 3.0 } },
    { id: 'tea_moonlight', name: '달빛 릴랙스 허브티', icon: '🍵', desc: '현재 대기 중인 모든 손님의 스트레스 즉시 -50 완화!', costType: 'essence', baseCost: 3000, duration: 0, effect: { type: 'sootheVisitors', val: 50 } },
    { id: 'crystal_rainbow', name: '치유의 무지개 결정', icon: '💎', desc: '즉시 대량의 에센스 보따리를 획득합니다!', costType: 'xp', baseCost: 2000, duration: 0, effect: { type: 'instantEssence', val: 50000 } }
];

function getRoomsForCurrentStage() {
    return ROOMS.filter(r => r.stage === state.stage);
}

function getStageBaseXp(stage) {
    const s = parseInt(stage) || 1;
    if (s === 1) return 25; // 1호점: 약 12~13회 탭으로 LV.2 달성 (기존 밸런스 유지)
    const stageRoom1 = ROOMS.find(r => r.stage === s && r.minLevel === 1);
    const baseReward = stageRoom1 ? stageRoom1.rewardBase : 2;
    // 2호점 이후: 첫 코너 약 15회 탭 시 2레벨 달성하여 초반 급발진 레벨업 방지
    return Math.floor(baseReward * 15);
}

function calculateNextLevelXp(stage, level) {
    const baseXp = getStageBaseXp(stage);
    const lvl = Math.max(1, parseInt(level) || 1);
    return Math.floor(baseXp * Math.pow(1.5, lvl - 1));
}

const TRANSLATIONS = {
    ko: {
        start_button: "소리 온실 입장",
        tutorial_button: "게임 방법",
        rooms_title: "ASMR 코너 (Recording Rooms)",
        tab_manage: "경영",
        tab_upgrade: "강화",
        tab_stream: "방송",
        tab_reviews: "도감",
        tab_settings: "설정",
        reviews_title: "에테르노아 SNS 후기 도감",
        reviews_desc: "손님들을 치유하고 남겨진 후기들을 수집하여 특별한 보상을 받아보세요.",
        reviews_unknown: "??? (치료를 완료하여 후기를 수집하세요)",
        claim_reward: "보상 받기",
        reward_claimed: "획득 완료!",

        // Stage 1 Reviews
        review_crystal: "투명한 수정 탭핑 소리에 마음이 편안해졌어요. 정말 맑은 소리네요!",
        review_potion: "유리병이 달그락거리고 액체가 섞이는 소리가 너무 기분 좋아요.",
        review_waterbowl: "물소리와 꽃잎이 찰랑이는 느낌이 정말 환상적입니다.",
        review_sand: "모래가 사각사각 잘리는 소리를 들으니 스트레스가 다 날아가네요.",
        review_chimes: "우주 풍경종의 잔향이 머릿속을 맑게 비워주는 기분이에요.",
        review_musicbox: "태엽이 감기고 풀리는 소리에 잠이 솔솔 옵니다.",
        review_rainwindow: "창문을 때리는 빗방울 소리에 푹 잤어요. 백색소음 최고!",

        // Stage 2 Reviews
        review_woodblock: "나무가 부딪히는 투박한 소리가 묘하게 안정을 주네요.",
        review_leaves: "마른 나뭇잎 사이를 걷는 듯한 바스락거림이 참 좋습니다.",
        review_campfire: "따뜻한 모닥불 앞에서 불멍하는 기분이었어요. 타닥타닥 소리 굿!",
        review_singingbowl: "싱잉볼의 깊고 긴 울림이 긴장을 완화해주어서 정말 좋았어요.",
        review_birdsong: "아침 숲속에 온 것처럼 상쾌한 새소리에 힐링했습니다.",
        review_stream: "빠르게 흐르는 계곡 물소리에 잡념이 다 씻겨 내려갔어요.",
        review_crickets: "밤의 숲을 연상케 하는 잔잔한 풀벌레 소리 덕분에 편안해졌습니다.",

        // Stage 3 Reviews
        review_keyboard: "도각도각거리는 키보드 소리가 일할 때 듣기 딱 좋네요.",
        review_scissors: "사각사각 가위질 소리가 귀를 간지럽히는 느낌이에요.",
        review_makeup: "브러쉬가 스치는 부드러운 소리에 마음이 차분해집니다.",
        review_slime: "슬라임이 쫀득하게 섞이는 소리, 완전 팅글 대박!",
        review_soap: "비누를 깎는 사각거림이 너무 중독성 있어요.",
        review_woodcarving: "나무가 섬세하게 깎이는 소리에 집중력이 확 올라갑니다.",
        review_icetype: "얼음이 부딪히는 청량한 소리가 더위를 싹 가시게 해요.",

        // Stage 4 Reviews
        review_bubble: "물속에서 공기방울이 터지는 뽀글거림이 신기하네요.",
        review_whale: "고래의 신비로운 울음소리가 마치 심해에 있는 듯한 기분을 줘요.",
        review_jellyfish: "해파리가 부드럽게 유영하는 물결 소리에 넋을 잃었어요.",
        review_sub: "잠수함의 낮게 깔리는 엔진 소음이 묘한 안정감을 줍니다.",
        review_coral: "산호초 사이를 스치는 바스락거리는 소리가 매력적이에요.",
        review_oxygentank: "규칙적인 산소 호흡 소리에 맞춰 저도 모르게 심호흡을 하게 되네요.",
        review_caveecho: "해저 동굴의 깊은 울림이 온몸을 감싸는 듯합니다.",

        // Stage 5 Reviews
        review_quill: "낡은 양피지 위를 스치는 깃펜 소리가 마음을 차분하게 해요.",
        review_parchment: "오래된 마법서를 넘기는 바스락거림이 정말 기분 좋습니다.",
        review_teacup: "도자기 찻잔과 은수저가 부딪히는 맑은 소리에 우아해지는 기분이에요.",
        review_royalchimes: "거대한 황금 샹들리에의 웅장한 공명이 압도적이네요.",
        review_velvet: "두꺼운 벨벳 커튼이 스치는 묵직한 소리가 포근합니다.",
        review_chess: "체스 말이 대리석에 부딪히는 달칵 소리가 참 경쾌해요.",
        review_royalfire: "왕실의 거대한 벽난로 소리는 왠지 더 깊고 풍성하게 들립니다.",

        // Stage 6 Reviews
        review_harp: "천상의 하프 소리에 영혼까지 정화되는 느낌을 받았어요.",
        review_clouds: "푹신한 구름을 밟는 소리가 이렇게 부드러울 줄 몰랐네요.",
        review_halo: "천사의 광배에서 뿜어져 나오는 성스러운 백색소음이 경이롭습니다.",
        review_gate: "거대한 천국의 문이 열리며 퍼지는 장엄한 메아리에 전율이 돋았어요.",
        review_choir: "정령들의 은은한 아카펠라 화음에 마음이 완전히 녹아내렸습니다.",
        review_starlight: "별빛들이 쏟아지며 부딪히는 영롱한 소리는 그저 아름다워요.",
        review_sanctuary: "이곳의 치유 파동은 설명할 수 없을 만큼 완벽한 평온을 줍니다.",
        visitor_title: "대기 중인 지친 정령들",
        visitor_desc: "정령을 직접 치유하여 막대한 보상을 획득하세요.",
        shop_title: "영혼 상점 (버프 & 자동화)",
        stream_title: "에테르노아 튜브 (힐링 채널)",
        stream_desc: "영상을 업로드하여 지속적인 조회수(경험치)와 후원금(정수)을 얻으세요!",
        upload_slots: "업로드 슬롯:",
        slots_info: "(레벨당 1개)",
        select_topic: "ASMR 주제 선택:",
        upload_button: "새 영상 업로드 🎥",
        uploaded_videos: "업로드된 영상 목록",
        settings_title: "환경 설정",
        setting_volume: "🔊 마스터 볼륨",
        setting_bgm_volume: "🎵 배경음악 볼륨",
        setting_sfx_volume: "🔊 효과음 (상호작용) 볼륨",
        setting_autosave: "💾 자동 저장 기능",
        setting_graphics: "✨ 그래픽 (화질)",
        setting_language: "🌐 언어 / Language",
        graphics_high: "높음 (모든 효과 켜짐)",
        graphics_low: "낮음 (배터리/저사양용)",
        save_button: "현재 상태 수동 저장",
        back_to_studio: "스튜디오로 복귀",
        stability_index: "안정 지수",
        healing_instruction: "ASMR 도구와 상호작용하여 치유를 완료하세요!",
        growth_gauge: "성장 게이지",
        notif_center_title: "알림 센터",
        clear_notifs_button: "알림 모두 지우기",
        upgrade_max: "한 번에 강화 ⚡",
        auto_heal_button: "자동 치유 시작 ⚡",
        auto_heal_active: "자동 치유 중... ⏸️",

        store_branch: "{stage}호점 온실",
        store_branch_1: "달빛 마법 공방 🔮",
        store_branch_2: "속삭이는 비밀의 숲 🍃",
        store_branch_3: "푸른 심해 유적 아쿠아 🌊",
        store_branch_4: "네온 미래 사이버 연구소 ⚡",
        store_branch_5: "에테르노아 달빛 왕성 🏰",
        store_branch_6: "영원의 별빛 천상 성소 🌌",
        store_selector_locked: "🔒 {stage}호점 (확장 필요)",
        rank_tag: "온실의 수호자",

        prestige_title: "✨ {stage}호점 확장 오픈! ✨",
        prestige_desc1: "모든 코너를 해금했습니다! 확장을 통해 더욱 고급스러운 스튜디오와 새로운 ASMR 코너들,<br><b>모든 보상 영구 x5배</b> 혜택을 누리세요.",
        prestige_desc2: "⚠️ 주의: 정수, 레벨, 경험치, 해금된 방이 모두 초기화됩니다. (버프 유지)",
        prestige_req: "요구: 정수 {costE} / 경험치 {costX}",
        prestige_button: "🚀 {stage}호점으로 확장하기",

        video_default_title: "[ASMR] 편안한 {room} 1시간",
        views_text: "조회수: <span class=\"video-stat-val\">{views}</span> (XP)",
        earnings_text: "수익: <span class=\"video-stat-val\">✨{earnings}</span>",
        no_videos_msg: "업로드된 영상이 없습니다.<br>영상을 올려 패시브 수익을 창출하세요!",
        slots_exceeded: "업로드 한도를 초과했습니다. 레벨을 올려 슬롯을 늘리세요! (현재 최대 {slots}개)",
        upload_complete: "🎥 '{title}' 영상 업로드 완료!",
        superchat_alert: "🎉 [{title}] 영상에서 슈퍼챗 터짐! ✨{donation}",

        game_saved_manual: "게임 진행 상황이 수동으로 저장되었습니다.",
        save_load_prestige: "축하합니다! 에테르노아 {stage}호점으로 확장되었습니다! 🎉 이제부터 보상이 크게 증가합니다!",
        insufficient_resources: "정수 또는 경험치가 부족합니다.",
        upgrade_complete_alert: "업그레이드 완료!",
        insufficient_essence: "정수가 부족합니다.",
        healing_complete_alert: "🎉 치유 완료! ✨{essence} / 🌟{xp} 획득",
        visitor_waiting_alert: "알림: [{difficulty}] {name}이(가) 치유를 기다립니다. {avatar}",
        session_interrupted: "치유 세션이 중단되었습니다.",
        level_up_alert: "LV.{level} 달성! 상위 정령이 방문할 수 있습니다.",
        no_unread_notifs: "새로운 알림이 없습니다.",
        unlocked_alert: "{room} 해금 완료!",
        healing_focus_title: "{name} 집중 치유 중...",
        branch_travel_alert: "✨ 에테르노아 {stage}호점으로 이동했습니다. 이전 자원과 버프가 초기화되었습니다.",
        reward_base_text: "기본 보상: x{reward}",
        cost_req_essence: "✨ {cost}",
        cost_req_xp: "🌟 {cost} XP",
        unlock_button: "해금하기",
        level_required: "레벨 부족",
        treat_button: "직접 치유",

        upgrade_wind_name: "자동 치유 정령",
        upgrade_wind_desc: "초당 정수 자동 획득",
        upgrade_incense_name: "평온의 향초",
        upgrade_incense_desc: "치유 진행 속도 +20%",
        upgrade_mic_name: "황금 마이크",
        upgrade_mic_desc: "정수(돈) 획득량 +50%",
        upgrade_book_name: "지혜의 책",
        upgrade_book_desc: "경험치 획득량 +50%",

        diff_easy: "쉬움",
        diff_medium: "보통",
        diff_hard: "어려움",

        visitor_fairy: "지친 꼬마 요정",
        visitor_squirrel: "잠 못 드는 다람쥐",
        visitor_bear: "스트레스 받은 곰돌이",
        visitor_leaf_fairy: "예민한 나뭇잎 요정",
        visitor_ghost: "불면증 유령",
        visitor_forest_spirit: "길 잃은 숲의 정령",
        visitor_android: "과부하된 안드로이드",
        visitor_bug_ai: "버그 걸린 AI",
        visitor_hologram: "해킹당한 홀로그램",
        visitor_mermaid: "심연의 인어",
        visitor_kraken: "상처입은 해왕류",
        visitor_submarine_spirit: "가라앉은 잠수함 정령",
        visitor_knight: "몰락한 왕국의 기사",
        visitor_queen: "권태로운 여왕",
        visitor_dragon: "별빛을 잃은 우주 용",
        visitor_angel: "타락한 천사",
        visitor_pegasus: "날개 다친 페가수스",
        visitor_god: "지쳐버린 창조주",

        room_crystal_name: "수정 탭핑 방",
        room_potion_name: "물약 믹싱룸",
        room_waterbowl_name: "수중 꽃열매 믹싱룸",
        room_sand_name: "키네틱 샌드",
        room_chimes_name: "우주 풍경종",
        room_musicbox_name: "태엽 오르골",
        room_rainwindow_name: "비 내리는 창문",
        room_woodblock_name: "나무 블록 탭핑",
        room_leaves_name: "마른 나뭇잎 바스락",
        room_campfire_name: "모닥불 타닥타닥",
        room_singingbowl_name: "싱잉보울",
        room_birdsong_name: "새소리 백색소음",
        room_stream_name: "계곡 물소리",
        room_crickets_name: "풀벌레 소리",
        room_keyboard_name: "기계식 키보드",
        room_glitch_name: "홀로그램 글리치",
        room_spaceship_name: "우주선 엔진 룸",
        room_serverfan_name: "서버룸 쿨러",
        room_servomotor_name: "로봇 구동음",
        room_datatransfer_name: "데이터 전송음",
        room_zerogpod_name: "무중력 캡슐",
        room_bubbles_name: "심해 물거품",
        room_submarine_name: "잠수함 진동",
        room_whale_name: "고래의 메아리",
        room_waterflow_name: "심해 해류",
        room_coral_name: "산호초 마찰",
        room_oxygentank_name: "잠수부 산소통",
        room_caveecho_name: "해저 동굴 공명",
        room_quill_name: "깃펜 사각사각",
        room_parchment_name: "마법서 페이지",
        room_teacup_name: "오후의 찻잔",
        room_royalchimes_name: "황금 샹들리에",
        room_velvet_name: "벨벳 커튼 스치기",
        room_chess_name: "체스 말 부딪힘",
        room_royalfire_name: "왕실 벽난로",
        room_harp_name: "천상의 하프",
        room_clouds_name: "구름 산책",
        room_halo_name: "천사의 광배",
        room_gate_name: "천국의 문",
        room_choir_name: "천상 정령의 합창",
        room_starlight_name: "별빛 세례",
        room_sanctuary_name: "에테르노아 성소",

        instruction_stage_1: "<b>조작 방법:</b> 클릭하거나 마우스를 드래그하여 에테르노아의 소리를 들어보세요.",
        instruction_mixing: "<b>조작 방법:</b> 마우스를 클릭한 채로 둥글게 드래그하여 저어보세요.",
        instruction_stage_2: "<b>조작 방법:</b> 클릭(톡톡), 더블클릭(강하게 치기), 마우스 휠(바람 불기) 등 다양하게 상호작용 해보세요. (Space 키 사용 가능)",
        instruction_stage_3: "<b>조작 방법:</b> 마우스 휠을 굴리거나, 우클릭, 더블클릭으로 기계음을 제어하세요. 키보드(A~Z) 입력도 지원합니다.",
        instruction_stage_4: "<b>조작 방법:</b> 휠 스크롤(해류 만들기), 더블클릭(큰 물방울), 우클릭 등 심해의 소리를 제어해보세요. (Q, W, E 키 지원)",
        instruction_stage_5: "<b>조작 방법:</b> 마우스 우클릭, 더블클릭, 휠 스크롤, 방향키(상하좌우)로 고풍스러운 소리를 만들어보세요.",
        instruction_default: "클릭, 우클릭, 더블클릭, 마우스 휠, 드래그 등을 자유롭게 시도해보세요.",

        tab_inventory: "보관함",
        stress_none: "증상 없음",
        stress_normal: "일반 스트레스",
        stress_mild_dep: "경증 우울증",
        stress_severe_dep: "중증 우울증",
        stress_ptsd: "PTSD",
        inventory_title: "아이템 보관함",
        inventory_empty: "보관함이 비어있습니다.",
        item_use_confirm: "정말로 이 아이템을 사용하시겠습니까?",
        btn_use: "사용하기",
        btn_later: "나중에",
        item_potion_small: "작은 치유의 물약",
        item_desc_small: "30초 동안 획득량이 1.2배 증가합니다.",
        item_potion_medium: "중간 치유의 물약",
        item_desc_medium: "60초 동안 획득량이 1.5배 증가합니다.",
        item_potion_large: "큰 치유의 물약",
        item_desc_large: "120초 동안 획득량이 2배 증가합니다.",
        item_potion_special: "기적의 에센스",
        item_desc_special: "300초 동안 획득량이 5배 증가합니다.",
        item_money_bag: "가득 찬 돈주머니",
        item_desc_money: "180초 동안 정수(돈) 획득량이 3배 증가합니다.",
        item_promo_bell: "홍보용 종",
        item_desc_promo: "300초 동안 중증 증상의 손님 방문 확률이 증가합니다.",
        item_coin_small: "작은 동전",
        item_desc_coin_small: "60초 동안 정수(돈) 획득량이 1.5배 증가합니다.",
        item_silver_pouch: "은화 담긴 주머니",
        item_desc_silver_pouch: "120초 동안 정수(돈) 획득량이 2배 증가합니다.",
        item_flower_perfume: "꽃향수",
        item_desc_flower_perfume: "180초 동안 치유 속도와 치유량이 2배 증가합니다.",
        buff_applied: "[{itemName}] 버프가 적용되었습니다!"
    },
    en: {
        start_button: "Enter Conservatory",
        tutorial_button: "How to Play",
        rooms_title: "ASMR Corners (Recording Rooms)",
        tab_manage: "Manage",
        tab_upgrade: "Upgrade",
        tab_stream: "Stream",
        tab_settings: "Settings",
        visitor_title: "Weary Spirits Waiting",
        visitor_desc: "Heal the spirits directly to earn massive rewards.",
        shop_title: "Soul Shop (Buffs & Automation)",
        stream_title: "Aeternoia Tube (Sound Channel)",
        stream_desc: "Upload videos to get passive views (XP) and donations (Essence)!",
        upload_slots: "Upload Slots:",
        slots_info: "(1 per Level)",
        select_topic: "Select ASMR Topic:",
        upload_button: "Upload New Video 🎥",
        uploaded_videos: "Uploaded Video List",
        settings_title: "Settings",
        setting_volume: "🔊 Master Volume",
        setting_bgm_volume: "🎵 BGM Volume",
        setting_sfx_volume: "🔊 Sound Effects Volume",
        setting_autosave: "💾 Auto Save",
        setting_graphics: "✨ Graphics Quality",
        setting_language: "🌐 Language",
        graphics_high: "High (All Effects On)",
        graphics_low: "Low (For Battery/Low-end)",
        save_button: "Manual Save Game",
        back_to_studio: "Back to Studio",
        stability_index: "Stability Index",
        healing_instruction: "Interact with ASMR tools to complete the healing!",
        growth_gauge: "Growth Gauge",
        notif_center_title: "Notification Center",
        clear_notifs_button: "Clear All Notifications",
        upgrade_max: "Upgrade Max ⚡",
        auto_heal_button: "Start Auto-Heal ⚡",
        auto_heal_active: "Auto-Healing... ⏸️",

        store_branch: "Aeternoia Conservatory",
        store_branch_1: "Moonlight Magic Atelier 🔮",
        store_branch_2: "Whispering Secret Forest 🍃",
        store_branch_3: "Deep Sea Ruins Aqua 🌊",
        store_branch_4: "Neon Cyber Lab ⚡",
        store_branch_5: "Aeternoia Royal Castle 🏰",
        store_branch_6: "Celestial Starlight Sanctuary 🌌",
        store_selector_locked: "🔒 Branch {stage} (Expansion Required)",
        rank_tag: "Conservatory Master",

        prestige_title: "✨ Open Branch {stage} Expansion! ✨",
        prestige_desc1: "All corners unlocked! Expand to enjoy a more luxurious studio, brand new ASMR corners, and a **permanent x5 reward multiplier**.",
        prestige_desc2: "⚠️ Warning: Essence, level, XP, and unlocked rooms will reset. (Buffs will persist)",
        prestige_req: "Required: Essence {costE} / XP {costX}",
        prestige_button: "🚀 Expand to Branch {stage}",

        video_default_title: "[ASMR] Relaxing {room} 1 Hour",
        views_text: "Views: <span class=\"video-stat-val\">{views}</span> (XP)",
        earnings_text: "Earnings: <span class=\"video-stat-val\">✨{earnings}</span>",
        no_videos_msg: "No videos uploaded yet.<br>Upload videos to start earning passive rewards!",
        slots_exceeded: "Upload limit exceeded. Level up to expand slots! (Current Max: {slots})",
        upload_complete: "🎥 Video '{title}' upload complete!",
        superchat_alert: "🎉 Super Chat exploded in [{title}]! ✨{donation}",

        game_saved_manual: "Game progress saved manually.",
        save_load_prestige: "Congratulations! Expanded to Aeternoia Branch {stage}! 🎉 Rewards are greatly increased!",
        insufficient_resources: "Insufficient Essence or XP.",
        upgrade_complete_alert: "Upgrade complete!",
        insufficient_essence: "Insufficient Essence.",
        healing_complete_alert: "🎉 Healing complete! Gained ✨{essence} / 🌟{xp}",
        visitor_waiting_alert: "Alert: [{difficulty}] {name} is waiting for healing. {avatar}",
        session_interrupted: "Healing session interrupted.",
        level_up_alert: "Reached LV.{level}! Higher spirits can now visit.",
        no_unread_notifs: "No new notifications.",
        unlocked_alert: "{room} unlocked!",
        healing_focus_title: "Focus Healing {name}...",
        branch_travel_alert: "✨ Moved to Aeternoia Branch {stage}. Current resources and buffs have been reset.",
        reward_base_text: "Base Reward: x{reward}",
        cost_req_essence: "✨ {cost}",
        cost_req_xp: "🌟 {cost} XP",
        unlock_button: "Unlock",
        level_required: "Level Low",
        treat_button: "Heal Directly",

        upgrade_wind_name: "Auto-Healing Spirit",
        upgrade_wind_desc: "Automatically earn essence per second",
        upgrade_incense_name: "Tranquil Incense",
        upgrade_incense_desc: "Healing progress speed +20%",
        upgrade_mic_name: "Golden Microphone",
        upgrade_mic_desc: "Essence earnings +50%",
        upgrade_book_name: "Book of Wisdom",
        upgrade_book_desc: "XP earnings +50%",

        diff_easy: "Easy",
        diff_medium: "Normal",
        diff_hard: "Hard",

        visitor_fairy: "Exhausted Little Fairy",
        visitor_squirrel: "Sleepless Squirrel",
        visitor_bear: "Stressed Teddy Bear",
        visitor_leaf_fairy: "Sensitive Leaf Elf",
        visitor_ghost: "Insomniac Ghost",
        visitor_forest_spirit: "Lost Forest Spirit",
        visitor_android: "Overloaded Android",
        visitor_bug_ai: "Bugged AI",
        visitor_hologram: "Hacked Hologram",
        visitor_mermaid: "Abyssal Mermaid",
        visitor_kraken: "Injured Sea Beast",
        visitor_submarine_spirit: "Sunken Submarine Spirit",
        visitor_knight: "Knight of Fallen Kingdom",
        visitor_queen: "Bored Queen",
        visitor_dragon: "Starlight-Lost Space Dragon",

        room_crystal_name: "Crystal Tapping Room",
        room_potion_name: "Potion Mixing Room",
        room_waterbowl_name: "Water Bowl Petals",
        room_sand_name: "Kinetic Sand Cut",
        room_chimes_name: "Cosmic Chimes",
        room_musicbox_name: "Wind-up Music Box",
        room_rainwindow_name: "Rainy Window",
        room_woodblock_name: "Wood Block Tapping",
        room_leaves_name: "Dry Leaves Rustling",
        room_campfire_name: "Crackling Campfire",
        room_singingbowl_name: "Singing Bowl",
        room_birdsong_name: "Forest Birdsong",
        room_stream_name: "Mountain Stream",
        room_crickets_name: "Cricket Chirping",
        room_keyboard_name: "Mechanical Keyboard",
        room_glitch_name: "Hologram Glitch",
        room_spaceship_name: "Spaceship Engine",
        room_serverfan_name: "Server Room Fan",
        room_servomotor_name: "Servo Motor",
        room_datatransfer_name: "Data Transfer",
        room_zerogpod_name: "Zero-G Capsule",
        room_bubbles_name: "Deep Sea Bubbles",
        room_submarine_name: "Submarine Vibration",
        room_whale_name: "Whale Echoes",
        room_waterflow_name: "Deep Ocean Current",
        room_coral_name: "Coral Rustle",
        room_oxygentank_name: "Oxygen Tank",
        room_caveecho_name: "Underwater Cave Echo",
        room_quill_name: "Writing Quill",
        room_parchment_name: "Spellbook Pages",
        room_teacup_name: "Afternoon Teacup",
        room_royalchimes_name: "Golden Chandelier",
        room_velvet_name: "Velvet Curtain",
        room_chess_name: "Chess Clink",
        room_royalfire_name: "Royal Fireplace",

        instruction_stage_1: "<b>Controls:</b> Click (tap), right-click (flick), drag (rub), mouse wheel (roll) to play. Number keys (1, 2, 3) are also supported.",
        instruction_stage_2: "<b>Controls:</b> Click (tap), double-click (hard hit), mouse wheel (blow wind) to interact. (Space key supported)",
        instruction_stage_3: "<b>Controls:</b> Use mouse wheel, right-click, or double-click to control machine sounds. Keyboard inputs (A~Z) are also supported.",
        instruction_stage_4: "<b>Controls:</b> Scroll wheel (create currents), double-click (large bubbles), right-click to control deep sea sounds. (Q, W, E keys supported)",
        instruction_stage_5: "<b>Controls:</b> Right-click, double-click, scroll wheel, and arrow keys (Up, Down, Left, Right) to produce antique sounds.",
        instruction_default: "Feel free to try clicking, right-clicking, double-clicking, scrolling, or dragging."
    },
    ja: {
        start_button: "スタジオに入る",
        tutorial_button: "遊び方",
        rooms_title: "ASMRコーナー (録音室)",
        tab_manage: "経営",
        tab_upgrade: "強化",
        tab_stream: "配信",
        tab_settings: "設定",
        visitor_title: "待機中の疲れた精霊たち",
        visitor_desc: "精霊を直接癒やして莫大な報酬を獲得しましょう。",
        shop_title: "ソウルショップ (バフ＆自動化)",
        stream_title: "エーテリアチューブ (YouTubeチャンネル)",
        stream_desc: "動画をアップロードして、継続的な再生回数(XP)とスパチャ(エッセンス)を獲得しましょう！",
        upload_slots: "アップロード枠:",
        slots_info: "(レベルごとに1つ)",
        select_topic: "ASMRテーマ選択:",
        upload_button: "新しい動画をアップロード 🎥",
        uploaded_videos: "アップロード済みの動画リスト",
        settings_title: "環境設定",
        setting_volume: "🔊 マスター音量",
        setting_bgm_volume: "🎵 BGM音量",
        setting_sfx_volume: "🔊 効果音 (SE) 音量",
        setting_autosave: "💾 自動保存機能",
        setting_graphics: "✨ グラフィック (画質)",
        setting_language: "🌐 언어 / Language",
        graphics_high: "高 (すべてのエフェクトを有効)",
        graphics_low: "低 (バッテリー節約/低スペック用)",
        save_button: "現在の状態を手動保存",
        back_to_studio: "スタジオに戻る",
        stability_index: "安定指数",
        healing_instruction: "ASMRツールとインタラクションして癒やしを完了させましょう！",
        growth_gauge: "成長ゲージ",
        notif_center_title: "通知センター",
        clear_notifs_button: "通知をすべて消去",
        upgrade_max: "一括強化 ⚡",
        auto_heal_button: "自動治療開始 ⚡",
        auto_heal_active: "自動治療中... ⏸️",

        store_branch: "エーテリアスタジオ",
        store_branch_1: "月光の魔法工房 🔮",
        store_branch_2: "囁きの秘密の森 🍃",
        store_branch_3: "深海遺跡アクア 🌊",
        store_branch_4: "ネオンサイバー研究所 ⚡",
        store_branch_5: "エーテリア魔法王城 🏰",
        store_branch_6: "永遠の星光天界聖所 🌌",
        store_selector_locked: "🔒 {stage}号店 (拡張が必要)",
        rank_tag: "スタジオマネージャー",

        prestige_title: "✨ {stage}号店の新規オープン！ ✨",
        prestige_desc1: "すべてのコーナーを解禁しました！拡張することで、より豪華なスタジオや新しいASMRコーナー、そして<b>すべての報酬が永久に5倍</b>になる特典が得られます。",
        prestige_desc2: "⚠️ 注意: エッセンス、レベル、経験値、解放された部屋はすべて初期化されます (バフは維持されます)。",
        prestige_req: "要求: エッセンス {costE} / 経験値 {costX}",
        prestige_button: "🚀 {stage}号店に拡張する",

        video_default_title: "[ASMR] 快適な {room} 1時間",
        views_text: "再生回数: <span class=\"video-stat-val\">{views}</span> (XP)",
        earnings_text: "収益: <span class=\"video-stat-val\">✨{earnings}</span>",
        no_videos_msg: "アップロードされた動画がありません。<br>動画を投稿してパッシブ報酬を獲得しましょう！",
        slots_exceeded: "アップロード上限を超えました。レベルを上げてスロットを増やしましょう！(現在最大: {slots}個)",
        upload_complete: "🎥 動画「{title}」の投稿が完了しました！",
        superchat_alert: "🎉 「{title}」動画でスパチャ発生！ ✨{donation}",

        game_saved_manual: "ゲームの進行状況が手動で保存されました。",
        save_load_prestige: "おめでとうございます！エーテリア {stage}号店に拡張されました！🎉 これから報酬が大幅に増加します！",
        insufficient_resources: "エッセンスまたは経験値が不足しています。",
        upgrade_complete_alert: "アップグレード完了！",
        insufficient_essence: "エッセンスが不足しています。",
        healing_complete_alert: "🎉 癒やし完了！ ✨{essence} / 🌟{xp} 獲得",
        visitor_waiting_alert: "通知: [{difficulty}] {name}が治療を待っています。 {avatar}",
        session_interrupted: "治療セッションが中断されました。",
        level_up_alert: "LV.{level} 達成！より上位の精霊が訪問するようになります。",
        no_unread_notifs: "新しい通知はありません。",
        unlocked_alert: "{room} 解禁完了！",
        healing_focus_title: "{name} 集中治療中...",
        branch_travel_alert: "✨ エーテリア {stage}号店に移動しました。現在のリソースとバフが初期化されました。",
        reward_base_text: "基本報酬: x{reward}",
        cost_req_essence: "✨ {cost}",
        cost_req_xp: "🌟 {cost} XP",
        unlock_button: "解禁する",
        level_required: "レベル不足",
        treat_button: "直接治療",

        upgrade_wind_name: "自動治療精霊",
        upgrade_wind_desc: "1秒ごとにエッセンスを自動獲得",
        upgrade_incense_name: "平穏のお香",
        upgrade_incense_desc: "治療進行速度 +20%",
        upgrade_mic_name: "黄金マイク",
        upgrade_mic_desc: "エッセンス獲得量 +50%",
        upgrade_book_name: "知恵の書",
        upgrade_book_desc: "経験値獲得量 +50%",

        diff_easy: "簡単",
        diff_medium: "普通",
        diff_hard: "難しい",

        visitor_fairy: "疲れた小さな妖精",
        visitor_squirrel: "眠れないリス",
        visitor_bear: "ストレスのたまったクマちゃん",
        visitor_leaf_fairy: "敏感な木の葉の妖精",
        visitor_ghost: "不眠症のゴースト",
        visitor_forest_spirit: "道に迷った森の精霊",
        visitor_android: "オーバーロードされたアンドロイド",
        visitor_bug_ai: "バグだらけのAI",
        visitor_hologram: "ハッキングされたホログラム",
        visitor_mermaid: "深海の人魚",
        visitor_kraken: "傷ついた海王類",
        visitor_submarine_spirit: "沈没した潜水艦の精霊",
        visitor_knight: "没落した王国の騎士",
        visitor_queen: "退屈そうな女王",
        visitor_dragon: "星の光を失った宇宙ドラゴン",

        room_crystal_name: "水晶タッピング室",
        room_potion_name: "ポーション調合室",
        room_waterbowl_name: "水中花びらミキシング",
        room_sand_name: "キ네틱サンド",
        room_chimes_name: "宇宙のウィンドチャイム",
        room_musicbox_name: "ぜんまいオルゴール",
        room_rainwindow_name: "雨の窓辺",
        room_woodblock_name: "ウッドブロックタッピング",
        room_leaves_name: "枯れ葉のカサカサ音",
        room_campfire_name: "たき火のパチパチ音",
        room_singingbowl_name: "シンギングボウル",
        room_birdsong_name: "鳥의さえずり",
        room_stream_name: "渓流のせせらぎ",
        room_crickets_name: "秋の虫の声",
        room_keyboard_name: "メカニカルキーボード",
        room_glitch_name: "ホログラムグリッチ",
        room_spaceship_name: "宇宙船エンジンルーム",
        room_serverfan_name: "サーバー室冷却ファン",
        room_servomotor_name: "サーボモーター作動音",
        room_datatransfer_name: "データ転送音",
        room_zerogpod_name: "無重力カプセル",
        room_bubbles_name: "深海の水泡",
        room_submarine_name: "潜水艦の振動",
        room_whale_name: "クジラの歌声",
        room_waterflow_name: "深海潮流",
        room_coral_name: "珊瑚礁の摩擦音",
        room_oxygentank_name: "ダイバーの酸素ボンベ",
        room_caveecho_name: "海底洞窟の響き",
        room_quill_name: "羽ペンのサラサラ音",
        room_parchment_name: "魔法書のページめくり",
        room_teacup_name: "午後のティーカップ",
        room_royalchimes_name: "黄金のシャンデリア",
        room_velvet_name: "ベルベットのカーテン",
        room_chess_name: "チェス駒のぶつかり音",
        room_royalfire_name: "王室の暖炉",

        instruction_stage_1: "<b>操作方法:</b> クリック(叩く)、右クリック(弾く)、ドラッグ(擦る)、マウスホイール(転がす)で演奏してみてください。数字キー(1, 2, 3)も使用できます。",
        instruction_stage_2: "<b>操作方法:</b> クリック(トントン)、ダブルクリック(強く叩く)、マウスホイール(風を吹く)など、様々にインタラクションしてみてください。(Spaceキーも使用可能)",
        instruction_stage_3: "<b>操作方法:</b> マウスホイールを回す、右クリック、ダブルクリックで機械音を制御してください。キーボード(A~Z)入力も対応しています。",
        instruction_stage_4: "<b>操作方法:</b> ホイールスクロール(潮流を起こす)、ダブルクリック(大きな水泡)、右クリックなどで深海の音を制御してください。(Q, W, Eキーに対応)",
        instruction_stage_5: "<b>操作方法:</b> マウスの右クリック、ダブルクリック、ホイールスクロール、矢印キー(上下左右)で優雅な音を奏でてみてください。",
        instruction_default: "クリック、右クリック、ダブルクリック、マウスホイール、ドラッグなど、自由に試してみてください。"
    },
    zh: {
        start_button: "进入工作室",
        tutorial_button: "怎么玩",
        rooms_title: "ASMR区域 (录音室)",
        tab_manage: "经营",
        tab_upgrade: "强化",
        tab_stream: "直播",
        tab_settings: "设置",
        visitor_title: "等待中的疲惫灵体",
        visitor_desc: "直接治愈灵体以获得丰厚奖励。",
        shop_title: "灵魂商店 (增益 & 自动化)",
        stream_title: "Etheria Tube (YouTube频道)",
        stream_desc: "上传视频以获得持续的播放量(经验)和赞助(精华)！",
        upload_slots: "上传插槽:",
        slots_info: "(每级1个)",
        select_topic: "选择ASMR主题:",
        upload_button: "上传新视频 🎥",
        uploaded_videos: "已上传视频列表",
        settings_title: "环境设置",
        setting_volume: "🔊 主音量",
        setting_bgm_volume: "🎵 背景音乐音量",
        setting_sfx_volume: "🔊 音效音量",
        setting_autosave: "💾 自动保存功能",
        setting_graphics: "✨ 画面质量",
        setting_language: "🌐 语言 / Language",
        graphics_high: "高 (开启所有特效)",
        graphics_low: "低 (省电/低配用)",
        save_button: "手动保存当前进度",
        back_to_studio: "返回工作室",
        stability_index: "安定指数",
        healing_instruction: "与ASMR工具互动以完成治愈！",
        growth_gauge: "成长量条",
        notif_center_title: "通知中心",
        clear_notifs_button: "清除所有通知",
        upgrade_max: "一键强化 ⚡",
        auto_heal_button: "开始自动治愈 ⚡",
        auto_heal_active: "自动治愈中... ⏸️",

        store_branch: "埃泰里亚工作室",
        store_branch_1: "月光魔法工坊 🔮",
        store_branch_2: "低语秘密森林 🍃",
        store_branch_3: "深海遗迹水族馆 🌊",
        store_branch_4: "霓虹赛博实验室 ⚡",
        store_branch_5: "埃泰里亚魔法王城 🏰",
        store_branch_6: "永恒星光天界圣所 🌌",
        store_selector_locked: "🔒 {stage}号店 (需要扩张)",
        rank_tag: "工作室经理",

        prestige_title: "✨ {stage}号店扩张开业！ ✨",
        prestige_desc1: "所有区域已解锁！通过扩张获得更豪华的工作室、全新的ASMR区域，以及**所有收益永久5倍**的加成。",
        prestige_desc2: "⚠️ 注意：精华、等级、经验值和已解锁的房间都将重置。(增益会保留)",
        prestige_req: "要求：精华 {costE} / 经验 {costX}",
        prestige_button: "🚀 扩张至{stage}号店",

        video_default_title: "[ASMR] 舒适的 {room} 1小时",
        views_text: "播放量: <span class=\"video-stat-val\">{views}</span> (XP)",
        earnings_text: "收益: <span class=\"video-stat-val\">✨{earnings}</span>",
        no_videos_msg: "尚未上传任何视频。<br>上传视频以开始赚取被动收益！",
        slots_exceeded: "已超过上传上限。提升等级以增加插槽！(当前最大：{slots}个)",
        upload_complete: "🎥 视频 '{title}' 上传完成！",
        superchat_alert: "🎉 视频 [{title}] 触发了超级留言！ ✨{donation}",

        game_saved_manual: "游戏进度已手动保存。",
        save_load_prestige: "恭喜！已扩张至 Etheria {stage}号店！🎉 收益将大幅提升！",
        insufficient_resources: "精华或经验值不足。",
        upgrade_complete_alert: "升级完成！",
        insufficient_essence: "精华不足。",
        healing_complete_alert: "🎉 治愈完成！获得 ✨{essence} / 🌟{xp}",
        visitor_waiting_alert: "通知：[{difficulty}] {name} 正在等待治愈。{avatar}",
        session_interrupted: "治愈已被中断。",
        level_up_alert: "达到 LV.{level}！更高级的灵体现在会来拜访。",
        no_unread_notifs: "暂无新通知。",
        unlocked_alert: "{room} 解锁完成！",
        healing_focus_title: "正在集中治愈 {name}...",
        branch_travel_alert: "✨ 已前往 Etheria {stage}号店。当前资源与增益已重置。",
        reward_base_text: "基础收益: x{reward}",
        cost_req_essence: "✨ {cost}",
        cost_req_xp: "🌟 {cost} XP",
        unlock_button: "解锁",
        level_required: "等级不足",
        treat_button: "直接治愈",

        upgrade_wind_name: "自动治愈精灵",
        upgrade_wind_desc: "每秒自动获得精华",
        upgrade_incense_name: "宁静香薰",
        upgrade_incense_desc: "治愈进行速度 +20%",
        upgrade_mic_name: "黄金麦克风",
        upgrade_mic_desc: "精华收益 +50%",
        upgrade_book_name: "智慧之书",
        upgrade_book_desc: "经验获得量 +50%",

        diff_easy: "简单",
        diff_medium: "普通",
        diff_hard: "困难",

        visitor_fairy: "疲惫的小妖精",
        visitor_squirrel: "失眠的小松鼠",
        visitor_bear: "压力巨大的泰迪熊",
        visitor_leaf_fairy: "敏感的树叶妖精",
        visitor_ghost: "失眠的小幽灵",
        visitor_forest_spirit: "迷失的森林精灵",
        visitor_android: "过载的安卓机器人",
        visitor_bug_ai: "发生故障的AI",
        visitor_hologram: "被黑客入侵的全息投影",
        visitor_mermaid: "深海美人鱼",
        visitor_kraken: "受伤的深海巨兽",
        visitor_submarine_spirit: "沉没潜艇的灵魂",
        visitor_knight: "陨落王国的骑士",
        visitor_queen: "百无聊赖的女王",
        visitor_dragon: "失去星光的太空巨龙",

        room_crystal_name: "水晶敲击室",
        room_potion_name: "药水调制室",
        room_waterbowl_name: "水中花瓣混合",
        room_sand_name: "动力沙切割",
        room_chimes_name: "宇宙风铃",
        room_musicbox_name: "发条八音盒",
        room_rainwindow_name: "雨打窗台",
        room_woodblock_name: "木块敲击",
        room_leaves_name: "枯叶沙沙声",
        room_campfire_name: "营火噼啪声",
        room_singingbowl_name: "颂钵",
        room_birdsong_name: "林间鸟鸣",
        room_stream_name: "溪流潺潺",
        room_crickets_name: "草丛虫鸣",
        room_keyboard_name: "机械键盘",
        room_glitch_name: "全息投影故障",
        room_spaceship_name: "飞船引擎室",
        room_serverfan_name: "服务器散热风扇",
        room_servomotor_name: "伺服电机转动声",
        room_datatransfer_name: "数据传输声",
        room_zerogpod_name: "无重力舱",
        room_bubbles_name: "深海气泡",
        room_submarine_name: "潜艇震动",
        room_whale_name: "深海鲸歌",
        room_waterflow_name: "深海暖流",
        room_coral_name: "珊瑚摩擦声",
        room_oxygentank_name: "潜水员氧气罐",
        room_caveecho_name: "海底洞穴回声",
        room_quill_name: "羽毛笔沙沙声",
        room_parchment_name: "翻阅魔法书",
        room_teacup_name: "午后茶杯",
        room_royalchimes_name: "黄金吊灯",
        room_velvet_name: "丝绒窗帘",
        room_chess_name: "落子弹指声",
        room_royalfire_name: "皇家壁暖",

        instruction_stage_1: "<b>操作方法：</b> 点击（敲击）、右击（弹指）、拖拽（摩擦）、滚轮（滚动）来弹奏。也支持数字键（1, 2, 3）。",
        instruction_stage_2: "<b>操作方法：</b> 点击（轻敲）、双击（重击）、滚轮（吹风）以进行各种互动。（支持空格键）",
        instruction_stage_3: "<b>操作方法：</b> 滚动滚轮、右击、双击以控制机械音。也支持键盘（A~Z）输入。",
        instruction_stage_4: "<b>操作方法：</b> 滚动滚轮（创建暖流）、双击（大气泡）、右击以控制深海之声。（支持 Q, W, E 键）",
        instruction_stage_5: "<b>操作方法：</b> 右击、双击、滚动滚轮，以及方向键（上下左右）来弹奏古雅之音。",
        instruction_default: "自由尝试点击、右击、双击、滚动或拖拽。"
    },
    fr: {
        start_button: "Entrer dans le Studio",
        tutorial_button: "Comment Jouer",
        rooms_title: "Coins ASMR (Cabines d'enregistrement)",
        tab_manage: "Gérer",
        tab_upgrade: "Améliorer",
        tab_stream: "Diffuser",
        tab_settings: "Paramètres",
        visitor_title: "Esprits fatigués en attente",
        visitor_desc: "Guérissez les esprits directement pour obtenir d'immenses récompenses.",
        shop_title: "Boutique d'âmes (Améliorations & Automatisation)",
        stream_title: "Etheria Tube (Chaîne YouTube)",
        stream_desc: "Téléversez des vidéos pour obtenir des vues passives (XP) et des dons (Essence) !",
        upload_slots: "Slots de téléversement :",
        slots_info: "(1 par niveau)",
        select_topic: "Choisir le sujet ASMR :",
        upload_button: "Téléverser une vidéo 🎥",
        uploaded_videos: "Vidéos téléversées",
        settings_title: "Paramètres",
        setting_volume: "🔊 Volume principal",
        setting_bgm_volume: "🎵 Volume de la musique",
        setting_sfx_volume: "🔊 Volume des effets sonores",
        setting_autosave: "💾 Sauvegarde automatique",
        setting_graphics: "✨ Qualité graphique",
        setting_language: "🌐 Langue / Language",
        graphics_high: "Élevée (Tous les effets)",
        graphics_low: "Faible (Économie de batterie)",
        save_button: "Sauvegarde manuelle",
        back_to_studio: "Retour au Studio",
        stability_index: "Indice de stabilité",
        healing_instruction: "Interagissez avec les outils ASMR pour terminer la guérison !",
        growth_gauge: "Jauge de croissance",
        notif_center_title: "Centre de notifications",
        clear_notifs_button: "Effacer toutes les notifications",
        upgrade_max: "Améliorer Max ⚡",
        auto_heal_button: "Auto-Guérison ⚡",
        auto_heal_active: "Guérison Auto... ⏸️",

        store_branch: "Studio Etheria",
        store_branch_1: "Atelier de Magie de Luna 🔮",
        store_branch_2: "Forêt Secrète Chuchotante 🍃",
        store_branch_3: "Ruines de l'Océan Profond 🌊",
        store_branch_4: "Laboratoire Néon Cyber ⚡",
        store_branch_5: "Château Magique d'Etheria 🏰",
        store_branch_6: "Sanctuaire Céleste Étoilé 🌌",
        store_selector_locked: "🔒 Succursale {stage} (Expansion requise)",
        rank_tag: "Gérant du Studio",

        prestige_title: "✨ Ouverture de la succursale {stage} ! ✨",
        prestige_desc1: "Tous les coins ont été déverrouillés ! Développez votre empire pour profiter d'un studio plus luxueux, de nouveaux coins ASMR et d'un **multiplicateur permanent de récompenses x5**.",
        prestige_desc2: "⚠️ Attention : L'essence, le niveau, l'XP et les cabines déverrouillées seront réinitialisés. (Les bonus persisteront)",
        prestige_req: "Requis : Essence {costE} / XP {costX}",
        prestige_button: "🚀 Développer la succursale {stage}",

        video_default_title: "[ASMR] 1 heure de détente - {room}",
        views_text: "Vues : <span class=\"video-stat-val\">{views}</span> (XP)",
        earnings_text: "Gains : <span class=\"video-stat-val\">✨{earnings}</span>",
        no_videos_msg: "Aucune vidéo téléversées.<br>Téléversez des vidéos pour générer des gains passifs !",
        slots_exceeded: "Limite de téléversement dépassée. Montez de niveau pour débloquer plus de slots ! (Max actuel : {slots})",
        upload_complete: "🎥 Téléversement de la vidéo '{title}' terminé !",
        superchat_alert: "🎉 Super Chat reçu sur la vidéo [{title}] ! ✨{donation}",

        game_saved_manual: "La progression de la partie a été sauvegardée manuellement.",
        save_load_prestige: "Félicitations ! Vous avez développé la succursale Etheria {stage} ! 🎉 Les récompenses augmentent considérablement !",
        insufficient_resources: "Essence ou XP insuffisant.",
        upgrade_complete_alert: "Amélioration terminée !",
        insufficient_essence: "Essence insuffisante.",
        healing_complete_alert: "🎉 Guérison terminée ! ✨{essence} / 🌟{xp} obtenus",
        visitor_waiting_alert: "Alerte : [{difficulty}] {name} attend de se faire soigner. {avatar}",
        session_interrupted: "Session de guérison interrompue.",
        level_up_alert: "Niveau LV.{level} atteint ! Des esprits de plus haut rang peuvent vous rendre visite.",
        no_unread_notifs: "Aucune nouvelle notification.",
        unlocked_alert: "{room} déverrouillé !",
        healing_focus_title: "Guérison ciblée sur {name}...",
        branch_travel_alert: "✨ Voyage vers la succursale Etheria {stage}. Les ressources actuelles et les bonus ont été réinitialisés.",
        reward_base_text: "Récompense de base : x{reward}",
        cost_req_essence: "✨ {cost}",
        cost_req_xp: "🌟 {cost} XP",
        unlock_button: "Déverrouiller",
        level_required: "Niveau requis",
        treat_button: "Soigner directement",

        upgrade_wind_name: "Esprit de soin automatique",
        upgrade_wind_desc: "Génère automatiquement de l'essence chaque seconde",
        upgrade_incense_name: "Encens de tranquillité",
        upgrade_incense_desc: "Vitesse de guérison +20%",
        upgrade_mic_name: "Microphone doré",
        upgrade_mic_desc: "Gains d'essence +50%",
        upgrade_book_name: "Livre de Sagesse",
        upgrade_book_desc: "Gains d'XP +50%",

        diff_easy: "Facile",
        diff_medium: "Moyen",
        diff_hard: "Difficile",

        visitor_fairy: "Petite fée épuisée",
        visitor_squirrel: "Écureuil insomniaque",
        visitor_bear: "Ours en peluche stressé",
        visitor_leaf_fairy: "Fée des feuilles sensible",
        visitor_ghost: "Fantôme insomniaque",
        visitor_forest_spirit: "Esprit de la forêt égaré",
        visitor_android: "Androïde surchargé",
        visitor_bug_ai: "IA bugguée",
        visitor_hologram: "Hologramme piraté",
        visitor_mermaid: "Sirène des abysses",
        visitor_kraken: "Monstre marin blessé",
        visitor_submarine_spirit: "Esprit du sous-marin naufragé",
        visitor_knight: "Chevalier du royaume déchu",
        visitor_queen: "Reine lasse",
        visitor_dragon: "Dragon spatial ayant perdu son éclat",

        room_crystal_name: "Cabine des tapotements de cristal",
        room_potion_name: "Cabine des potions et fioles",
        room_waterbowl_name: "Fleurs et eau clapotante",
        room_sand_name: "Sable cinétique",
        room_chimes_name: "Carillons cosmiques",
        room_musicbox_name: "Boîte à musique mécanique",
        room_rainwindow_name: "Fenêtre pluvieuse",
        room_woodblock_name: "Tapotements sur blocs de bois",
        room_leaves_name: "Froissement de feuilles mortes",
        room_campfire_name: "Feu de camp crépitant",
        room_singingbowl_name: "Bol chantant",
        room_birdsong_name: "Chants d'oiseaux de la forêt",
        room_stream_name: "Murmure du ruisseau",
        room_crickets_name: "Chants des grillons",
        room_keyboard_name: "Clavier mécanique",
        room_glitch_name: "Glitch holographique",
        room_spaceship_name: "Moteur du vaisseau",
        room_serverfan_name: "Ventilateur de serveur",
        room_servomotor_name: "Servomoteur",
        room_datatransfer_name: "Bruit de transfert de données",
        room_zerogpod_name: "Capsule sans gravité",
        room_bubbles_name: "Bulles abyssales",
        room_submarine_name: "Vibration de sous-marin",
        room_whale_name: "Échos de baleine",
        room_waterflow_name: "Courants marins profonds",
        room_coral_name: "Froissement de corail",
        room_oxygentank_name: "Bouteille d'oxygène",
        room_caveecho_name: "Écho de grotte sous-marine",
        room_quill_name: "Plume d'écriture",
        room_parchment_name: "Pages de grimoire",
        room_teacup_name: "Tasse de thé de l'après-midi",
        room_royalchimes_name: "Lustre doré",
        room_velvet_name: "Rideau de velours",
        room_chess_name: "Claquement de pièces d'échecs",
        room_royalfire_name: "Cheminée royale",

        instruction_stage_1: "<b>Commandes :</b> Clic (tapotement), clic droit (pichenette), glisser (frotter), molette (roulement). Les touches (1, 2, 3) sont aussi supportées.",
        instruction_stage_2: "<b>Commandes :</b> Clic (tapotements légers), double-clic (coup fort), molette (souffle de vent) pour interagir. (Touche Espace supportée)",
        instruction_stage_3: "<b>Commandes :</b> Utilisez la molette, le clic droit ou le double-clic pour contrôler les sons mécaniques. Les touches (A~Z) sont aussi supportées.",
        instruction_stage_4: "<b>Commandes :</b> Molette (générer des courants), double-clic (grosses bulles), clic droit pour contrôler les sons abyssaux. (Touches Q, W, E supportées)",
        instruction_stage_5: "<b>Commandes :</b> Clic droit, double-clic, molette et touches directionnelles (Haut, Bas, Gauche, Droite) pour produire des sons anciens.",
        instruction_default: "N'hésitez pas à essayer les clics, clics droits, double-clics, roulements ou glissements."
    }
};

function t(key, params = {}) {
    const lang = state.settings.language || 'ko';
    if (key === 'store_branch' && params && params.stage) {
        const branchKey = `store_branch_${params.stage}`;
        if (TRANSLATIONS[lang]?.[branchKey]) return TRANSLATIONS[lang][branchKey];
        if (TRANSLATIONS['ko']?.[branchKey]) return TRANSLATIONS['ko'][branchKey];
    }
    let text = TRANSLATIONS[lang]?.[key] || TRANSLATIONS['ko']?.[key] || key;
    for (const [k, v] of Object.entries(params)) {
        text = text.replace(new RegExp(`{${k}}`, 'g'), v);
    }
    return text;
}

function applyLanguage() {
    document.documentElement.lang = state.settings.language;

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.innerHTML = t(key);
    });

    updateStoreSelector();
    applyStageVisuals();

    const openPanel = document.querySelector('.panel-container.open');
    if (openPanel) {
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) {
            const tid = activeTab.dataset.tab;
            if (tid === 'manage') renderVisitors();
            if (tid === 'upgrade') renderUpgrades();
            if (tid === 'stream') renderStreamPanel();
        }
    }

    if (state.currentTool) {
        const instructionEl = document.getElementById('tool-instruction');
        if (instructionEl) instructionEl.innerHTML = getToolInstruction(state.currentTool);
        const roomNameEl = document.getElementById('recording-room-name');
        if (roomNameEl) {
            const room = ROOMS.find(r => r.id === state.currentTool);
            roomNameEl.textContent = t(`room_${room.id}_name`);
        }
    }

    updateUI();
}

function getVisitorName(v) {
    if (v.nameKey) return t(v.nameKey);
    const key = Object.keys(TRANSLATIONS['ko']).find(k => TRANSLATIONS['ko'][k] === v.name);
    return key ? t(key) : (v.name || '');
}

function getVisitorDifficulty(v) {
    if (v.difficultyKey) return t(v.difficultyKey);
    const key = Object.keys(TRANSLATIONS['ko']).find(k => TRANSLATIONS['ko'][k] === v.difficulty);
    return key ? t(key) : (v.difficulty || '');
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const masterGain = audioCtx.createGain();
masterGain.connect(audioCtx.destination);
masterGain.gain.value = 0.5; // 기본 볼륨

// 리리아 3 (리버브 3초) - ASMR 사운드를 편안하게 만들어주는 잔향 효과
function createReverbBuffer(ctx, duration) {
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const impulse = ctx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);
    for (let i = 0; i < length; i++) {
        // 부드럽게 감쇠하는 지수 함수 적용 (3초간)
        const decay = Math.exp(-i / (sampleRate * (duration / 3)));
        left[i] = (Math.random() * 2 - 1) * decay;
        right[i] = (Math.random() * 2 - 1) * decay;
    }
    return impulse;
}

const reverbNode = audioCtx.createConvolver();
reverbNode.buffer = createReverbBuffer(audioCtx, 1.0); // 1초 리버브

const dryGain = audioCtx.createGain();
const wetGain = audioCtx.createGain();
dryGain.gain.value = 0.5;  // 원본 소리 50%
wetGain.gain.value = 0.5;  // 잔향 소리 50% (편안하고 몽환적인 느낌)

dryGain.connect(masterGain);
reverbNode.connect(wetGain);
wetGain.connect(masterGain);

const soundInput = audioCtx.createGain();
soundInput.gain.value = 4.0; // 효과음 음량 증가
soundInput.connect(dryGain);
soundInput.connect(reverbNode);

let crystalAudioBuffer = null;
fetch(CRYSTAL_MP3_B64)
    .then(res => res.arrayBuffer())
    .then(buf => audioCtx.decodeAudioData(buf))
    .then(data => crystalAudioBuffer = data)
    .catch(e => console.warn('Could not load crystal mp3:', e));

let flaskAudioBuffer = null;
let flaskSourceNode = null;
fetch(FLASK_MP3_B64)
    .then(res => res.arrayBuffer())
    .then(buf => audioCtx.decodeAudioData(buf))
    .then(data => flaskAudioBuffer = data)
    .catch(e => console.warn('Could not load flask mp3:', e));

let woodsoupAudioBuffer = null;
let woodsoupSourceNode = null;
fetch(FLOWER_WATER_MP3_B64)
    .then(res => res.arrayBuffer())
    .then(buf => audioCtx.decodeAudioData(buf))
    .then(data => woodsoupAudioBuffer = data)
    .catch(e => console.warn('Could not load flower water mp3:', e));

let chimeAudioBuffer = null;
fetch(CHIME_MP3_B64)
    .then(res => res.arrayBuffer())
    .then(buf => audioCtx.decodeAudioData(buf))
    .then(data => chimeAudioBuffer = data)
    .catch(e => console.warn('Could not load chime mp3:', e));

let sandAudioBuffer = null;
fetch(KINETIC_SAND_MP3_B64)
    .then(res => res.arrayBuffer())
    .then(buf => audioCtx.decodeAudioData(buf))
    .then(data => sandAudioBuffer = data)
    .catch(e => console.warn('Could not load sand mp3:', e));

let musicboxAudioBuffer = null;
fetch(MUSICBOX_MP3_B64)
    .then(res => res.arrayBuffer())
    .then(buf => audioCtx.decodeAudioData(buf))
    .then(data => musicboxAudioBuffer = data)
    .catch(e => console.warn('Could not load musicbox mp3:', e));

let rainWindowLoopAudioBuffer = null;
fetch(RAIN_WINDOW_LOOP_MP3_B64)
    .then(res => res.arrayBuffer())
    .then(buf => audioCtx.decodeAudioData(buf))
    .then(data => rainWindowLoopAudioBuffer = data)
    .catch(e => console.warn('Could not load rain window loop mp3:', e));

let rainWindowSingleAudioBuffer = null;
fetch(RAIN_WINDOW_SINGLE_MP3_B64)
    .then(res => res.arrayBuffer())
    .then(buf => audioCtx.decodeAudioData(buf))
    .then(data => rainWindowSingleAudioBuffer = data)
    .catch(e => console.warn('Could not load rain window single mp3:', e));

let woodenBlockAudioBuffer = null;
const woodenBlockSrc = typeof woodenBlockBase64 !== 'undefined' ? woodenBlockBase64 : 'game_sound/효과음/wooden_block.mp3';
fetch(woodenBlockSrc)
    .then(res => res.arrayBuffer())
    .then(buf => audioCtx.decodeAudioData(buf))
    .then(data => woodenBlockAudioBuffer = data)
    .catch(e => console.warn('Could not load wooden block mp3:', e));

let dryLeavesAudioBuffer = null;
fetch('game_sound/효과음/dry_leaves.mp3')
    .then(res => res.arrayBuffer())
    .then(buf => audioCtx.decodeAudioData(buf))
    .then(data => dryLeavesAudioBuffer = data)
    .catch(e => console.warn('Could not load dry leaves mp3:', e));

let campfireAudioBuffer = null;
fetch('game_sound/효과음/firewood_burning.mp3')
    .then(res => res.arrayBuffer())
    .then(buf => audioCtx.decodeAudioData(buf))
    .then(data => campfireAudioBuffer = data)
    .catch(e => console.warn('Could not load firewood burning mp3:', e));

let singingBowlAudioBuffer = null;
fetch('game_sound/효과음/singing_bowl.mp3')
    .then(res => res.arrayBuffer())
    .then(buf => audioCtx.decodeAudioData(buf))
    .then(data => singingBowlAudioBuffer = data)
    .catch(e => console.warn('Could not load singing bowl mp3:', e));

let birdChirpAudioBuffer = null;
fetch('game_sound/효과음/bird_chirp.mp3')
    .then(res => res.arrayBuffer())
    .then(buf => audioCtx.decodeAudioData(buf))
    .then(data => birdChirpAudioBuffer = data)
    .catch(e => console.warn('Could not load bird chirp mp3:', e));

let riverFlowAudioBuffer = null;
fetch('game_sound/효과음/river_flow.mp3')
    .then(res => res.arrayBuffer())
    .then(buf => audioCtx.decodeAudioData(buf))
    .then(data => riverFlowAudioBuffer = data)
    .catch(e => console.warn('Could not load river flow mp3:', e));

function startWoodsoupLoop() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (woodsoupSourceNode) return;
    if (woodsoupAudioBuffer) {
        woodsoupSourceNode = audioCtx.createBufferSource();
        woodsoupSourceNode.buffer = woodsoupAudioBuffer;
        woodsoupSourceNode.loop = true;

        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 8.0; // Volume adjusted
        woodsoupSourceNode.connect(gainNode);
        gainNode.connect(soundInput);

        woodsoupSourceNode.start();
    }
}
function stopWoodsoupLoop() {
    if (woodsoupSourceNode) {
        woodsoupSourceNode.stop();
        woodsoupSourceNode.disconnect();
        woodsoupSourceNode = null;
    }
}

let sandSourceNode = null;
function startSandLoop() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (sandSourceNode) return;
    if (sandAudioBuffer) {
        sandSourceNode = audioCtx.createBufferSource();
        sandSourceNode.buffer = sandAudioBuffer;
        sandSourceNode.loop = true;
        sandSourceNode.playbackRate.value = 0.95;
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 5.5;
        sandSourceNode.connect(gainNode);
        gainNode.connect(soundInput);
        sandSourceNode.start();
    }
}
function stopSandLoop() {
    if (sandSourceNode) {
        sandSourceNode.stop();
        sandSourceNode.disconnect();
        sandSourceNode = null;
    }
}

let rainWindowSourceNode = null;
function startRainWindowLoop() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (rainWindowSourceNode) return;
    if (rainWindowLoopAudioBuffer) {
        rainWindowSourceNode = audioCtx.createBufferSource();
        rainWindowSourceNode.buffer = rainWindowLoopAudioBuffer;
        rainWindowSourceNode.loop = true;
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 1.0;
        rainWindowSourceNode.connect(gainNode);
        gainNode.connect(soundInput);
        rainWindowSourceNode.start();
    }
}
function stopRainWindowLoop() {
    if (rainWindowSourceNode) {
        rainWindowSourceNode.stop();
        rainWindowSourceNode.disconnect();
        rainWindowSourceNode = null;
    }
}
// --- Active Long Sound Registry (Voice Stealing / Monophonic Enforcement) ---
const activeLongSounds = {};

function stopLongSound(name, fadeDuration = 0.04) {
    if (!activeLongSounds[name]) return;
    const entry = activeLongSounds[name];
    delete activeLongSounds[name];

    try {
        if (entry.gainNode && audioCtx.state !== 'closed') {
            const now = audioCtx.currentTime;
            entry.gainNode.gain.cancelScheduledValues(now);
            entry.gainNode.gain.setValueAtTime(entry.gainNode.gain.value, now);
            entry.gainNode.gain.linearRampToValueAtTime(0.0001, now + fadeDuration);
        }
        setTimeout(() => {
            if (entry.sources) {
                entry.sources.forEach(s => {
                    try { s.stop(); s.disconnect(); } catch (e) {}
                });
            } else if (entry.source) {
                try { entry.source.stop(); entry.source.disconnect(); } catch (e) {}
            }
        }, (fadeDuration + 0.02) * 1000);
    } catch (e) {}
}

function registerLongSound(name, sourceOrSources, gainNode) {
    stopLongSound(name, 0.04);
    activeLongSounds[name] = {
        source: Array.isArray(sourceOrSources) ? null : sourceOrSources,
        sources: Array.isArray(sourceOrSources) ? sourceOrSources : null,
        gainNode: gainNode
    };
}

function stopAllLongSounds() {
    Object.keys(activeLongSounds).forEach(name => stopLongSound(name, 0.05));
    stopMusicboxContinuous(0.1);
}

function playRainWindowSingle() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (rainWindowSingleAudioBuffer) {
        const source = audioCtx.createBufferSource();
        source.buffer = rainWindowSingleAudioBuffer;
        source.playbackRate.value = 1.0;
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 1.2;
        source.connect(gainNode);
        gainNode.connect(soundInput);
        registerLongSound('rainwindow', source, gainNode);
        source.start();
    } else {
        playRaindrop();
    }
}

// --- Music Box Continuous Stream (Original Pitch & Single Voice Flow) ---
let musicboxStreamSource = null;
let musicboxStreamGain = null;
let musicboxFadeTimeout = null;
let lastMusicboxWindupTime = 0;

function ensureMusicboxStream() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (!musicboxAudioBuffer) return null;

    if (!musicboxStreamSource) {
        musicboxStreamSource = audioCtx.createBufferSource();
        musicboxStreamSource.buffer = musicboxAudioBuffer;
        musicboxStreamSource.loop = true;
        musicboxStreamSource.playbackRate.value = 1.0; // 원본 음정(original pitch) 엄격 준수

        musicboxStreamGain = audioCtx.createGain();
        musicboxStreamGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);

        musicboxStreamSource.connect(musicboxStreamGain);
        musicboxStreamGain.connect(soundInput);

        musicboxStreamSource.start();
        musicboxStreamSource.onended = () => {
            musicboxStreamSource = null;
            musicboxStreamGain = null;
        };
    }
    return { source: musicboxStreamSource, gain: musicboxStreamGain };
}

function playMusicbox(type = 'click') {
    if (audioCtx.state === 'suspended') audioCtx.resume();

    // 기계식 태엽 소리 (과도한 중복 방지: 최소 120ms 간격)
    const now = Date.now();
    if (now - lastMusicboxWindupTime > 120) {
        lastMusicboxWindupTime = now;
        playWindup();
    }

    const stream = ensureMusicboxStream();
    if (!stream) {
        playGlassTingle(1200);
        return;
    }

    if (musicboxFadeTimeout) {
        clearTimeout(musicboxFadeTimeout);
        musicboxFadeTimeout = null;
    }

    const currTime = audioCtx.currentTime;
    stream.gain.gain.cancelScheduledValues(currTime);

    if (type === 'drag') {
        // 드래그 중: 원래 음정으로 끊김 없이 계속 음악이 흐름 (볼륨 1.2 유지)
        stream.gain.gain.setValueAtTime(stream.gain.gain.value, currTime);
        stream.gain.gain.linearRampToValueAtTime(1.2, currTime + 0.05);

        // 드래그를 멈추거나 마우스 이동이 정지되면 1.2초 후 서서히 페이드아웃 (태엽 감김이 풀리듯 자연스럽게 멈춤)
        musicboxFadeTimeout = setTimeout(() => {
            stopMusicboxContinuous(1.0);
        }, 1200);
    } else {
        // 단일 클릭: 2.2초 동안 원래 음정으로 연주 후 부드럽게 감속 정지
        stream.gain.gain.setValueAtTime(stream.gain.gain.value, currTime);
        stream.gain.gain.linearRampToValueAtTime(1.2, currTime + 0.08);
        musicboxFadeTimeout = setTimeout(() => {
            stopMusicboxContinuous(1.0);
        }, 2200);
    }
}

function stopMusicboxContinuous(fadeDuration = 0.8) {
    if (musicboxFadeTimeout) {
        clearTimeout(musicboxFadeTimeout);
        musicboxFadeTimeout = null;
    }
    if (!musicboxStreamGain || !musicboxStreamSource) return;

    try {
        const currTime = audioCtx.currentTime;
        musicboxStreamGain.gain.cancelScheduledValues(currTime);
        musicboxStreamGain.gain.setValueAtTime(musicboxStreamGain.gain.value, currTime);
        musicboxStreamGain.gain.linearRampToValueAtTime(0.0001, currTime + fadeDuration);

        const srcToStop = musicboxStreamSource;
        const gainToClean = musicboxStreamGain;
        musicboxFadeTimeout = setTimeout(() => {
            if (musicboxStreamSource === srcToStop) {
                try {
                    srcToStop.stop();
                    srcToStop.disconnect();
                    gainToClean.disconnect();
                } catch (e) {}
                musicboxStreamSource = null;
                musicboxStreamGain = null;
            }
        }, (fadeDuration + 0.05) * 1000);
    } catch (e) {
        musicboxStreamSource = null;
        musicboxStreamGain = null;
    }
}

function startMusicboxLoop() {
    playMusicbox('drag');
}

function stopMusicboxLoop() {
    stopMusicboxContinuous(0.8);
}

function startFlaskShakingLoop() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (flaskSourceNode) return;
    if (flaskAudioBuffer) {
        flaskSourceNode = audioCtx.createBufferSource();
        flaskSourceNode.buffer = flaskAudioBuffer;
        flaskSourceNode.loop = true;
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 1.2;
        flaskSourceNode.connect(gainNode);
        gainNode.connect(soundInput);
        flaskSourceNode.start();
    }
}
function stopFlaskShakingLoop() {
    if (flaskSourceNode) {
        flaskSourceNode.stop();
        flaskSourceNode.disconnect();
        flaskSourceNode = null;
    }
}
function playFlaskShaking() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (flaskAudioBuffer) {
        const src = audioCtx.createBufferSource();
        src.buffer = flaskAudioBuffer;
        src.playbackRate.value = 0.95 + Math.random() * 0.15;
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 1.5;
        src.connect(gainNode);
        gainNode.connect(soundInput);
        const offset = Math.random() * Math.max(0, flaskAudioBuffer.duration - 0.5);
        src.start(0, offset, 0.5);
    } else {
        playLiquidSlosh();
    }
}

function playSandCut() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (sandAudioBuffer) {
        const src = audioCtx.createBufferSource();
        src.buffer = sandAudioBuffer;
        src.playbackRate.value = 0.9 + Math.random() * 0.25;
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 2.5;
        src.connect(gainNode);
        gainNode.connect(soundInput);
        const offset = Math.random() * Math.max(0, sandAudioBuffer.duration - 0.35);
        src.start(0, offset, 0.35);
    } else {
        const bufferSize = audioCtx.sampleRate * 0.12;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const src = audioCtx.createBufferSource();
        const filter = audioCtx.createBiquadFilter();
        const gain = audioCtx.createGain();
        filter.type = 'bandpass'; filter.frequency.value = 2200; filter.Q.value = 1.0;
        src.buffer = buffer;
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);
        src.connect(filter); filter.connect(gain); gain.connect(soundInput);
        src.start();
    }
}

function playWaterbowlTap() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    playWaterDrop();
    if (woodsoupAudioBuffer) {
        const src = audioCtx.createBufferSource();
        src.buffer = woodsoupAudioBuffer;
        src.playbackRate.value = 0.9 + Math.random() * 0.2;
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 2.0;
        src.connect(gainNode);
        gainNode.connect(soundInput);
        const offset = Math.random() * Math.max(0, woodsoupAudioBuffer.duration - 0.4);
        src.start(0, offset, 0.4);
    } else {
        playLiquidSlosh();
    }
}

// --- Sound Functions ---
function playCrystalTap(freq) {
    if (audioCtx.state === 'suspended') audioCtx.resume();

    if (crystalAudioBuffer) {
        const src = audioCtx.createBufferSource();
        src.buffer = crystalAudioBuffer;
        src.playbackRate.value = (freq / 880) * 0.825;

        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 1.0;

        src.connect(gainNode);
        gainNode.connect(soundInput);
        src.start();
    } else {
        const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
        osc.type = 'sine'; osc.frequency.setValueAtTime(freq * 0.8, audioCtx.currentTime);
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.03, audioCtx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.0);
        osc.connect(gain); gain.connect(soundInput); osc.start(); osc.stop(audioCtx.currentTime + 1.0);
    }
}
function playGlassTingle(freq) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc1 = audioCtx.createOscillator(); const osc2 = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc1.type = 'sine'; osc1.frequency.value = freq; osc2.type = 'sine'; osc2.frequency.value = freq * 1.2;
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.02, audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.5);
    osc1.connect(gain); osc2.connect(gain); gain.connect(soundInput); osc1.start(); osc2.start(); osc1.stop(audioCtx.currentTime + 1.5); osc2.stop(audioCtx.currentTime + 1.5);
}
function playLiquidSlosh() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(); const filter = audioCtx.createBiquadFilter(); const gain = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(150, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1); osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
    filter.type = 'lowpass'; filter.frequency.value = 800;
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime); gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
    osc.connect(filter); filter.connect(gain); gain.connect(soundInput); osc.start(); osc.stop(audioCtx.currentTime + 0.3);
}
function playWaterDrop() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'sine'; const startFreq = 400 + Math.random() * 400; osc.frequency.setValueAtTime(startFreq, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(startFreq + 300, audioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
    osc.connect(gain); gain.connect(soundInput); osc.start(); osc.stop(audioCtx.currentTime + 0.1);
}
function playChime(freq) {
    if (audioCtx.state === 'suspended') audioCtx.resume();

    if (chimeAudioBuffer) {
        const src = audioCtx.createBufferSource();
        src.buffer = chimeAudioBuffer;
        src.playbackRate.value = freq / 440;
        const gain = audioCtx.createGain();
        gain.gain.value = 1.2;
        src.connect(gain);
        gain.connect(soundInput);
        registerLongSound('chime', src, gain);
        src.start();
    } else {
        const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
        osc.type = 'sine'; osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3.0);
        osc.connect(gain); gain.connect(soundInput);
        registerLongSound('chime', osc, gain);
        osc.start(); osc.stop(audioCtx.currentTime + 3.0);
    }
}
let campfireSourceNode = null;
let lastCampfireTime = 0;
function playCampfire() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const volumeMultiplier = 0.5 + ((state.fireLevel - 1) * 0.2);
    const now = Date.now();
    if (now - lastCampfireTime < 120) return;
    lastCampfireTime = now;

    if (campfireAudioBuffer) {
        const source = audioCtx.createBufferSource();
        source.buffer = campfireAudioBuffer;
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.7 * volumeMultiplier;
        source.connect(gainNode);
        gainNode.connect(soundInput);
        registerLongSound('campfire', source, gainNode);
        const startOffset = Math.random() * Math.max(0, campfireAudioBuffer.duration - 0.5);
        source.start(0, startOffset, 0.5);
        return;
    }

    const osc = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const gainNode = audioCtx.createGain();

    osc.type = 'brownnoise';
    if (!audioCtx.createOscillator().type) { osc.type = 'sine'; }
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100 + Math.random() * 200, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0.3 * volumeMultiplier, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(soundInput);

    registerLongSound('campfire', osc, gainNode);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
}
function playWindup() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(); const filter = audioCtx.createBiquadFilter(); const gain = audioCtx.createGain();
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.1);
    filter.type = 'lowpass'; filter.frequency.value = 800;
    gain.gain.setValueAtTime(0.02, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
    osc.connect(filter); filter.connect(gain); gain.connect(soundInput); osc.start(); osc.stop(audioCtx.currentTime + 0.1);
}
function playRaindrop() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const bufferSize = audioCtx.sampleRate * 0.1; const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate); const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = audioCtx.createBufferSource(); const filter = audioCtx.createBiquadFilter(); const gain = audioCtx.createGain();
    filter.type = 'lowpass'; filter.frequency.value = 400; // 더 먹먹하고 포근한 빗소리
    src.buffer = buffer; gain.gain.setValueAtTime(0.015, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
    src.connect(filter); filter.connect(gain); gain.connect(soundInput); src.start();
}

// Stage 2 Sounds
let lastWoodTapTime = 0;
function playWoodTap() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = Date.now();
    if (now - lastWoodTapTime < 80) return;
    lastWoodTapTime = now;
    if (woodenBlockAudioBuffer) {
        const source = audioCtx.createBufferSource();
        source.buffer = woodenBlockAudioBuffer;
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 1.0;
        source.connect(gainNode);
        gainNode.connect(soundInput);
        source.start(); 
    } else {
        const osc = audioCtx.createOscillator();
        const filter = audioCtx.createBiquadFilter();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320 + Math.random() * 60, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.05);
        filter.type = 'lowpass'; filter.frequency.value = 1200;
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);
        osc.connect(filter); filter.connect(gain); gain.connect(soundInput);
        osc.start(); osc.stop(audioCtx.currentTime + 0.08);
    }
}

let activeSingingBowlOsc = null;
let activeSingingBowlGain = null;
let lastSingingBowlTime = 0;
function playSingingBowl(isDrag) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = Date.now();

    if (singingBowlAudioBuffer) {
        if (isDrag) {
            if (now - lastSingingBowlTime < 200) return;
            lastSingingBowlTime = now;
            const source = audioCtx.createBufferSource();
            source.buffer = singingBowlAudioBuffer;
            const gainNode = audioCtx.createGain();
            gainNode.gain.value = 0.7;
            source.connect(gainNode);
            gainNode.connect(soundInput);
            registerLongSound('singingbowl', source, gainNode);
            const startOffset = Math.random() * Math.max(0, singingBowlAudioBuffer.duration - 0.8);
            source.start(0, startOffset, 0.8);
            return;
        } else {
            if (now - lastSingingBowlTime < 300) return;
            lastSingingBowlTime = now;
            const source = audioCtx.createBufferSource();
            source.buffer = singingBowlAudioBuffer;
            const gainNode = audioCtx.createGain();
            gainNode.gain.value = 1.0;
            source.connect(gainNode);
            gainNode.connect(soundInput);
            registerLongSound('singingbowl', source, gainNode);
            source.start();
            return;
        }
    }

    if (isDrag) {
        // Continuous rubbing sound - single active voice
        if (activeLongSounds['singingbowl']) return;

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 432; // Healing frequency

        gainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.3);

        osc.connect(gainNode);
        gainNode.connect(soundInput);

        registerLongSound('singingbowl', osc, gainNode);
        osc.start();

        setTimeout(() => {
            stopLongSound('singingbowl', 0.8);
        }, 500);
    } else {
        // Strike sound (single instance replaces any previous resonance)
        const baseFreq = 432;
        const osc1 = audioCtx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.value = baseFreq;

        const osc2 = audioCtx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = baseFreq / 2;

        const osc3 = audioCtx.createOscillator();
        osc3.type = 'triangle';
        osc3.frequency.value = baseFreq * 2.5;

        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.7, audioCtx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 6.0);

        const highGain = audioCtx.createGain();
        highGain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        highGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.8);
        osc3.connect(highGain);
        highGain.connect(gainNode);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(soundInput);

        registerLongSound('singingbowl', [osc1, osc2, osc3], gainNode);

        osc1.start();
        osc2.start();
        osc3.start();

        osc1.stop(audioCtx.currentTime + 6.2);
        osc2.stop(audioCtx.currentTime + 6.2);
        osc3.stop(audioCtx.currentTime + 2.0);
    }
}

let lastLeavesRustleTime = 0;
function playLeavesRustle() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = Date.now();
    if (now - lastLeavesRustleTime < 100) return;
    lastLeavesRustleTime = now;
    if (dryLeavesAudioBuffer) {
        const source = audioCtx.createBufferSource();
        source.buffer = dryLeavesAudioBuffer;
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 1.0;
        source.connect(gainNode);
        gainNode.connect(soundInput);
        registerLongSound('leaves', source, gainNode);
        const startOffset = Math.random() * Math.max(0, dryLeavesAudioBuffer.duration - 0.4);
        source.start(0, startOffset, 0.4);
    } else {
        const bufferSize = audioCtx.sampleRate * 0.15;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const src = audioCtx.createBufferSource();
        const filter = audioCtx.createBiquadFilter();
        const gain = audioCtx.createGain();
        filter.type = 'bandpass'; filter.frequency.value = 1800 + Math.random() * 400; filter.Q.value = 0.8;
        src.buffer = buffer;
        gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
        src.connect(filter); filter.connect(gain); gain.connect(soundInput);
        registerLongSound('leaves', src, gain);
        src.start();
    }
}

// Stage 3 Sounds
function playKeyboard() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(); const filter = audioCtx.createBiquadFilter(); const gain = audioCtx.createGain();
    osc.type = 'triangle'; osc.frequency.setValueAtTime(150, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.03);
    filter.type = 'lowpass'; filter.frequency.value = 600; // 쫀득한 도각도각 소리 (Thock)
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime); gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.05);
    osc.connect(filter); filter.connect(gain); gain.connect(soundInput); osc.start(); osc.stop(audioCtx.currentTime + 0.05);
}
function playGlitch() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(); const filter = audioCtx.createBiquadFilter(); const gain = audioCtx.createGain();
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(300 + Math.random() * 200, audioCtx.currentTime);
    filter.type = 'lowpass'; filter.frequency.value = 1500; // 덜 자극적인 부드러운 글리치
    gain.gain.setValueAtTime(0.015, audioCtx.currentTime); gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.05);
    osc.connect(gain); gain.connect(filter); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 0.05);
}
function playSpaceshipDrone() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(50, audioCtx.currentTime); // 매우 낮고 묵직한 우주선 웅웅거림
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime); gain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
    osc.connect(gain); gain.connect(soundInput);
    registerLongSound('spaceship', osc, gain);
    osc.start(); osc.stop(audioCtx.currentTime + 0.5);
}

// Stage 4 Sounds
function playBubbles() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(); const filter = audioCtx.createBiquadFilter(); const gain = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(400, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
    filter.type = 'bandpass'; filter.frequency.value = 600;
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
    osc.connect(filter); filter.connect(gain); gain.connect(soundInput); osc.start(); osc.stop(audioCtx.currentTime + 0.15);
}
function playSubmarine() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(45, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime); gain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 1.0); gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.5);
    osc.connect(gain); gain.connect(soundInput);
    registerLongSound('submarine', osc, gain);
    osc.start(); osc.stop(audioCtx.currentTime + 1.5);
}
function playWhaleSong() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(300, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 2.0);
    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime); gain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.4); gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.8);
    osc.connect(gain); gain.connect(soundInput);
    registerLongSound('whale', osc, gain);
    osc.start(); osc.stop(audioCtx.currentTime + 2.8);
}
function playDeepWaterFlow() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const bufferSize = audioCtx.sampleRate * 0.5; const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate); const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = audioCtx.createBufferSource(); const filter = audioCtx.createBiquadFilter(); const gain = audioCtx.createGain();
    filter.type = 'lowpass'; filter.frequency.value = 150;
    src.buffer = buffer; gain.gain.setValueAtTime(0.02, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
    src.connect(filter); filter.connect(gain); gain.connect(soundInput);
    registerLongSound('waterflow', src, gain);
    src.start();
}

// Stage 5 Sounds
function playQuillPen() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const bufferSize = audioCtx.sampleRate * 0.1; const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate); const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = audioCtx.createBufferSource(); const filter = audioCtx.createBiquadFilter(); const gain = audioCtx.createGain();
    filter.type = 'highpass'; filter.frequency.value = 2500;
    src.buffer = buffer; gain.gain.setValueAtTime(0.015, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
    src.connect(filter); filter.connect(gain); gain.connect(soundInput); src.start();
}
function playParchment() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const bufferSize = audioCtx.sampleRate * 0.15; const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate); const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1);
    const src = audioCtx.createBufferSource(); const filter = audioCtx.createBiquadFilter(); const gain = audioCtx.createGain();
    filter.type = 'bandpass'; filter.frequency.value = 1200; filter.Q.value = 0.5;
    src.buffer = buffer; gain.gain.setValueAtTime(0.03, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
    src.connect(filter); filter.connect(gain); gain.connect(soundInput); src.start();
}
function playTeacup() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(3500 + Math.random() * 500, audioCtx.currentTime);
    gain.gain.setValueAtTime(0, audioCtx.currentTime); gain.gain.linearRampToValueAtTime(0.02, audioCtx.currentTime + 0.02); gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
    osc.connect(gain); gain.connect(soundInput); osc.start(); osc.stop(audioCtx.currentTime + 0.3);
}
function playRoyalChimes() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const oscs = [];
    const masterGainNode = audioCtx.createGain();
    masterGainNode.gain.setValueAtTime(1.0, audioCtx.currentTime);
    masterGainNode.connect(soundInput);

    [880, 1108, 1318, 1760].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
        osc.type = 'sine'; osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.02, audioCtx.currentTime + 0.08 + (idx * 0.04));
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.5 + (idx * 0.4));
        osc.connect(gain); gain.connect(masterGainNode);
        osc.start(); osc.stop(audioCtx.currentTime + 3.0);
        oscs.push(osc);
    });
    registerLongSound('royalchimes', oscs, masterGainNode);
}

// --- NEW STAGE 2 SOUNDS ---
let lastBirdsongTime = 0;
function playBirdsong() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = Date.now();
    if (now - lastBirdsongTime < 150) return;
    lastBirdsongTime = now;
    if (birdChirpAudioBuffer) {
        const source = audioCtx.createBufferSource();
        source.buffer = birdChirpAudioBuffer;
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.9;
        source.connect(gainNode);
        gainNode.connect(soundInput);
        registerLongSound('birdsong', source, gainNode);
        source.start();
        return;
    }

    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(3000 + Math.random() * 1000, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(4000 + Math.random() * 1000, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0, audioCtx.currentTime); gain.gain.linearRampToValueAtTime(0.015, audioCtx.currentTime + 0.05); gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
    osc.connect(gain); gain.connect(soundInput);
    registerLongSound('birdsong', osc, gain);
    osc.start(); osc.stop(audioCtx.currentTime + 0.2);
}

let lastStreamTime = 0;
function playStream() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = Date.now();
    if (now - lastStreamTime < 180) return;
    lastStreamTime = now;

    if (riverFlowAudioBuffer) {
        const source = audioCtx.createBufferSource();
        source.buffer = riverFlowAudioBuffer;
        const gainNode = audioCtx.createGain();
        // 계곡 물소리 볼륨을 더욱 풍부하고 시원하게 상향 (기존 0.5 -> 1.5)
        gainNode.gain.setValueAtTime(1.5, audioCtx.currentTime);
        const playDuration = 1.3;
        gainNode.gain.setValueAtTime(1.5, audioCtx.currentTime + playDuration - 0.25);
        gainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + playDuration);
        source.connect(gainNode);
        gainNode.connect(soundInput);
        registerLongSound('stream', source, gainNode);
        const startOffset = Math.random() * Math.max(0, riverFlowAudioBuffer.duration - playDuration);
        source.start(0, startOffset, playDuration);
        return;
    }

    const bufferSize = Math.floor(audioCtx.sampleRate * 0.35); 
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate); 
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = audioCtx.createBufferSource(); 
    const filter = audioCtx.createBiquadFilter(); 
    const gain = audioCtx.createGain();
    filter.type = 'bandpass'; 
    filter.frequency.value = 1100 + Math.random() * 400; 
    filter.Q.value = 0.6;
    src.buffer = buffer; 
    gain.gain.setValueAtTime(0.09, audioCtx.currentTime); 
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);
    src.connect(filter); 
    filter.connect(gain); 
    gain.connect(soundInput);
    registerLongSound('stream', src, gain);
    src.start();
}
function playCrickets() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(4500, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.01, audioCtx.currentTime); gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.05);
    osc.connect(gain); gain.connect(soundInput); osc.start(); osc.stop(audioCtx.currentTime + 0.05);
}

// --- NEW STAGE 3 SOUNDS ---
function playServerFan() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const bufferSize = audioCtx.sampleRate * 0.5; const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate); const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = audioCtx.createBufferSource(); const filter = audioCtx.createBiquadFilter(); const gain = audioCtx.createGain();
    filter.type = 'lowpass'; filter.frequency.value = 400;
    src.buffer = buffer; gain.gain.setValueAtTime(0.02, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
    src.connect(filter); filter.connect(gain); gain.connect(soundInput);
    registerLongSound('serverfan', src, gain);
    src.start();
}
function playServoMotor() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(100, audioCtx.currentTime); osc.frequency.linearRampToValueAtTime(300, audioCtx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime); gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
    osc.connect(gain); gain.connect(soundInput); osc.start(); osc.stop(audioCtx.currentTime + 0.2);
}
function playDataTransfer() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'square'; osc.frequency.setValueAtTime(1200 + Math.random() * 800, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.015, audioCtx.currentTime); gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.05);
    osc.connect(gain); gain.connect(soundInput); osc.start(); osc.stop(audioCtx.currentTime + 0.05);
}
function playZeroGPod() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(150, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 2.0);
    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime); gain.gain.linearRampToValueAtTime(0.03, audioCtx.currentTime + 0.3); gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.2);
    osc.connect(gain); gain.connect(soundInput);
    registerLongSound('zerogpod', osc, gain);
    osc.start(); osc.stop(audioCtx.currentTime + 2.2);
}

// --- NEW STAGE 4 SOUNDS ---
function playCoral() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const bufferSize = audioCtx.sampleRate * 0.1; const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate); const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = audioCtx.createBufferSource(); const filter = audioCtx.createBiquadFilter(); const gain = audioCtx.createGain();
    filter.type = 'highpass'; filter.frequency.value = 3000;
    src.buffer = buffer; gain.gain.setValueAtTime(0.015, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
    src.connect(filter); filter.connect(gain); gain.connect(soundInput); src.start();
}
function playOxygenTank() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const bufferSize = audioCtx.sampleRate * 0.8; const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate); const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = audioCtx.createBufferSource(); const filter = audioCtx.createBiquadFilter(); const gain = audioCtx.createGain();
    filter.type = 'bandpass'; filter.frequency.value = 800; filter.Q.value = 0.5;
    src.buffer = buffer; gain.gain.setValueAtTime(0.0001, audioCtx.currentTime); gain.gain.linearRampToValueAtTime(0.02, audioCtx.currentTime + 0.3); gain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
    src.connect(filter); filter.connect(gain); gain.connect(soundInput);
    registerLongSound('oxygentank', src, gain);
    src.start();
}
function playCaveEcho() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(200, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 1.5);
    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime); gain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.2); gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.8);
    osc.connect(gain); gain.connect(soundInput);
    registerLongSound('caveecho', osc, gain);
    osc.start(); osc.stop(audioCtx.currentTime + 1.8);
}

// --- NEW STAGE 5 SOUNDS ---
function playVelvet() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const bufferSize = audioCtx.sampleRate * 0.3; const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate); const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = audioCtx.createBufferSource(); const filter = audioCtx.createBiquadFilter(); const gain = audioCtx.createGain();
    filter.type = 'lowpass'; filter.frequency.value = 300;
    src.buffer = buffer; gain.gain.setValueAtTime(0.02, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
    src.connect(filter); filter.connect(gain); gain.connect(soundInput);
    registerLongSound('velvet', src, gain);
    src.start();
}
function playChess() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(); const filter = audioCtx.createBiquadFilter(); const gain = audioCtx.createGain();
    osc.type = 'square'; osc.frequency.setValueAtTime(600, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
    filter.type = 'lowpass'; filter.frequency.value = 1000;
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);
    osc.connect(filter); filter.connect(gain); gain.connect(soundInput); osc.start(); osc.stop(audioCtx.currentTime + 0.05);
}
function playRoyalFireplace() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const bufferSize = audioCtx.sampleRate * 0.2; const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate); const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = audioCtx.createBufferSource(); const filter = audioCtx.createBiquadFilter(); const gain = audioCtx.createGain();
    filter.type = 'lowpass'; filter.frequency.value = 250 + Math.random() * 200;
    src.buffer = buffer; gain.gain.setValueAtTime(0.02, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
    src.connect(filter); filter.connect(gain); gain.connect(soundInput);
    registerLongSound('royalfire', src, gain);
    src.start();
}

// --- DOM Elements ---
const el = {
    screens: document.querySelectorAll('.screen'),
    essence: document.querySelector('#stat-essence .value'),
    shopEssence: document.getElementById('shop-essence'),
    level: document.querySelector('#stat-level .value'),
    xpNumeric: document.querySelector('.xp-numeric'),
    roomList: document.getElementById('room-list'),
    guardianName: document.getElementById('guardian-name'),

    stabilityMeter: document.querySelector('.meter-fill'),
    stabilityText: document.querySelector('#stability-index .value'),
    dbText: document.querySelector('.db-text'),
    dbNeedle: document.querySelector('.db-needle'),
    sanctuary: document.getElementById('interaction-sanctuary'),
    toolInstruction: document.getElementById('tool-instruction'),
    toolLayer: document.getElementById('active-tool-layer'),
    roomName: document.getElementById('recording-room-name'),
    xpBar: document.querySelector('.xp-bar-fill'),

    visitorList: document.getElementById('visitor-list'),
    tabs: document.querySelectorAll('.tab-btn'),
    panels: document.querySelectorAll('.panel'),
    panelContainer: document.querySelector('.panel-container'),

    healingOverlay: document.getElementById('active-healing-overlay'),
    healingAvatar: document.getElementById('healing-avatar'),
    healingName: document.getElementById('healing-name'),
    healingProgressFill: document.getElementById('healing-progress-fill'),
    healingPercent: document.getElementById('healing-percent'),

    // 방송 탭 요소
    streamTopicSelect: document.getElementById('stream-topic'),
    videoList: document.getElementById('video-list'),
    videoCount: document.getElementById('video-count'),
    videoMax: document.getElementById('video-max'),

    // 알림 센터 요소
    notifPanel: document.getElementById('notification-center'),
    notifList: document.getElementById('notif-list'),
    notifBadge: document.getElementById('notif-badge'),

    // 가상 시계 요소
    clockIcon: document.getElementById('clock-icon'),
    clockTime: document.getElementById('clock-time'),
    clockTag: document.getElementById('clock-tag'),
    clockBadge: document.getElementById('game-clock-badge'),
    recordingClockIcon: document.getElementById('recording-clock-icon'),
    recordingClockTime: document.getElementById('recording-clock-time'),
    recordingClockTag: document.getElementById('recording-clock-tag'),
    recordingClockBadge: document.getElementById('recording-game-clock-badge')
};

function init() {
    loadGame();
    setupEventListeners();
    applySettingsToDOM();
    applyLanguage();
    applyStageVisuals();
    checkSecretShopRotation();
    updateGameClockDisplay();
    setInterval(gameLoop, 1000);
    updateUI();
    updateReviewBadge();
}

function switchScreen(screenId) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (screenId !== 'recording') {
        stopAllLongSounds();
    }
    el.screens.forEach(s => s.classList.remove('active'));
    document.getElementById(`screen-${screenId}`).classList.add('active');

    const globalTopBar = document.getElementById('global-top-bar');
    const globalBuffs = document.getElementById('active-buffs-container');
    if (globalTopBar) {
        if (screenId === 'start' || screenId === 'recording') {
            globalTopBar.classList.add('hidden');
        } else {
            globalTopBar.classList.remove('hidden');
        }
    }
    if (globalBuffs) {
        if (screenId === 'recording') {
            globalBuffs.style.display = 'none';
        } else {
            globalBuffs.style.display = '';
        }
    }

    if (screenId === 'studio') { renderRoomList(); updateUI(); }

    updateBgmVolume(screenId);
}
function startGame() {
    playGlassTingle(880);
    if (audioCtx.state === 'suspended') audioCtx.resume();
    playStageBgm(state.stage);
    switchScreen('studio');
}

// --- Unlock System ---
function unlockRoom(roomId, e) {
    if (e) e.stopPropagation();
    const room = ROOMS.find(r => r.id === roomId);
    if (state.level < room.minLevel) return;
    if (state.essence >= room.costEssence) {
        state.essence -= room.costEssence;
        state.unlockedRooms.push(roomId);
        addNotification(t('unlocked_alert', { room: t('room_' + room.id + '_name') }), 'system'); playChime(1000);
        renderRoomList(); renderVisitors();
        if (el.panelContainer.classList.contains('open') && document.getElementById('stream-panel').classList.contains('active')) {
            renderStreamPanel(); // 방송 탭 갱신
        }
        updateUI(); saveGame();
    } else addNotification(t('insufficient_resources'), 'system');
}

function enterRecordingRoom(roomId) {
    if (!state.unlockedRooms.includes(roomId)) return;
    stopAllLongSounds();
    const room = ROOMS.find(r => r.id === roomId);
    state.currentTool = roomId;
    el.roomName.textContent = t('room_' + room.id + '_name');
    if (el.toolInstruction) el.toolInstruction.innerHTML = getToolInstruction(roomId);
    renderSanctuary();
    closePanel();
    updateRecordingUI();
    switchScreen('recording');
    handleInteractionModeChange();
}

function getToolInstruction(roomId) {
    const room = ROOMS.find(r => r.id === roomId);
    if (roomId === 'potion' || roomId === 'waterbowl') return t('instruction_mixing');
    if (room.stage === 1) return t('instruction_stage_1');
    if (room.stage === 2) return t('instruction_stage_2');
    if (room.stage === 3) return t('instruction_stage_4'); // Swapped Deep Sea
    if (room.stage === 4) return t('instruction_stage_3'); // Swapped Machine
    if (room.stage === 5) return t('instruction_stage_5');
    return t('instruction_default');
}

function stopRecording() {
    stopAllLongSounds();
    state.currentTool = null;
    handleInteractionModeChange();
    saveGame();
    stopAutoHeal();
    if (state.activeHealingTarget) {
        addNotification(t('session_interrupted'), 'system');
        state.activeHealingTarget = null;
        el.healingOverlay.classList.add('hidden');
        renderVisitors();
    }
    switchScreen('studio');
}

// --- Interaction (Click vs Drag) ---
let isInteracting = false;
let isDragging = false;
let lastInteractionTime = 0;
let lastAutoRaindropTime = 0;
let autoHealInterval = null;

function setupEventListeners() {
    // 웹 브라우저 오디오 자동 재생 차단 방지 (모든 사용자 동작 시 즉시 엔진 해제)
    const unlockAudioEngine = () => {
        if (typeof audioCtx !== 'undefined' && audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume().catch(e => {});
        }
        const bgmAudio = document.getElementById('bgm');
        if (bgmAudio && bgmAudio.paused) {
            if (typeof playStageBgm === 'function') {
                playStageBgm(state.stage || 1);
            }
        }
    };
    window.addEventListener('click', unlockAudioEngine);
    window.addEventListener('pointerdown', unlockAudioEngine);
    window.addEventListener('keydown', unlockAudioEngine);

    el.sanctuary.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // 좌클릭만 허용
        unlockAudioEngine();
        isInteracting = true;
        if (state.currentTool === 'potion') startFlaskShakingLoop();
        if (state.currentTool === 'waterbowl') {
            startWoodsoupLoop();
            const water = document.querySelector('.wood-water');
            if (water) water.classList.add('active-slosh');
        }
        if (state.currentTool === 'sand') startSandLoop();
        if (state.currentTool === 'rainwindow') startRainWindowLoop();
        handleInteraction(e, 'click');
    });
    el.sanctuary.addEventListener('mousemove', (e) => {
        if (isInteracting) { handleInteraction(e, 'drag'); }
    });
    window.addEventListener('mouseup', () => {
        isInteracting = false;
        stopFlaskShakingLoop();
        stopWoodsoupLoop();
        stopSandLoop();
        if (state.currentTool === 'musicbox') stopMusicboxContinuous(0.8);
        stopRainWindowLoop();
        const water = document.querySelector('.wood-water');
        if (water) water.classList.remove('active-slosh');
    });
    el.tabs.forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));

    const ls = document.getElementById('language-select');
    if (ls) {
        ls.addEventListener('change', () => {
            applySettings();
            applyLanguage();
        });
    }

    window.addEventListener('beforeunload', () => {
        saveGame(true);
    });
}

function gainResource(essence, xp) {
    if (essence <= 0 && xp <= 0) return;
    const eMulti = (state.buffs?.essenceMultiplier || 1);
    const xMulti = (state.buffs?.xpMultiplier || 1);

    // Scale resources by fire level if campfire
    let fireMulti = 1.0;
    if (state.currentTool === 'campfire') {
        fireMulti = 1.0 + ((state.fireLevel - 1) * 0.2); // Up to 2x at level 6
    }

    const realEssence = Math.floor(essence * eMulti * fireMulti);
    const realXp = Math.floor(xp * xMulti * fireMulti);

    state.essence += realEssence;
    gainXp(realXp);
    saveGame();
    updateUI();
}

// Global function to change fire level
window.changeFireLevel = function (delta) {
    state.fireLevel += delta;
    if (state.fireLevel < 1) state.fireLevel = 1;
    if (state.fireLevel > 6) state.fireLevel = 6;

    const display = document.getElementById('fire-level-display');
    if (display) display.textContent = state.fireLevel;

    const flameContainer = document.querySelector('.flame-container');
    if (flameContainer) {
        const scale = 0.5 + (state.fireLevel * 0.15);
        flameContainer.style.transform = `scale(${scale})`;
    }
    saveGame();
};

function handleInteraction(e, type, key = null) {
    if ((type !== 'click' && type !== 'drag' && type !== 'auto') || !state.currentTool) return;

    if (state.settings.interactionMode === 'auto' && type !== 'auto') return;

    const now = Date.now();
    let delay = 150;
    if (type === 'drag') delay = 150;

    if (now - lastInteractionTime < delay && type !== 'auto') return;
    if (type !== 'auto') lastInteractionTime = now;

    let px = 0, py = 0, rx = 0, ry = 0;
    const rect = el.sanctuary.getBoundingClientRect();
    if (e && e.clientX) {
        px = e.clientX; py = e.clientY;
        rx = px - rect.left; ry = py - rect.top;
    } else {
        px = rect.left + rect.width / 2 + (Math.random() - 0.5) * 50;
        py = rect.top + rect.height / 2 + (Math.random() - 0.5) * 50;
        rx = px - rect.left; ry = py - rect.top;
    }

    const tool = ROOMS.find(r => r.id === state.currentTool);
    if (!tool) {
        state.currentTool = 'woodblock';
        return;
    }

    let essenceGain = 0;
    let xpGain = 0;
    if (type !== 'auto') {
        state.currentDb = 30 + Math.random() * 15;
        state.stability = Math.min(100, state.stability + 1.5);
        essenceGain = tool.rewardBase;
        xpGain = tool.rewardBase;
    } else {
        // Auto mode scaling (reduced efficiency for idling)
        essenceGain = tool.rewardBase * 0.5;
        xpGain = tool.rewardBase * 0.5;
    }

    switch (state.currentTool) {
        // Stage 1
        case 'crystal':
            if (type === 'click' || type === 'auto') { playCrystalTap(880); gainResource(essenceGain, xpGain); createParticle(px, py, "💎"); triggerToolAnimation('anim-pulse'); }
            else if (type === 'drag' && Math.random() > 0.4) { playCrystalTap(660 + Math.random() * 440); gainResource(essenceGain, xpGain); createParticle(px, py, "✨"); }
            break;
        case 'potion':
            playFlaskShaking();
            if (type === 'click') playGlassTingle(900 + Math.random() * 300);
            gainResource(essenceGain, xpGain);
            createParticle(px, py, "🧪");
            triggerToolAnimation('anim-bounce');
            break;
        case 'waterbowl':
            playWaterbowlTap();
            movePetals(rx, ry);
            gainResource(essenceGain, xpGain);
            createParticle(px, py, "🌸");
            break;
        case 'sand':
            playSandCut();
            createSandCut(px, py);
            gainResource(essenceGain, xpGain);
            createParticle(px, py, "🏜️");
            break;
        case 'chimes':
            if (type === 'drag' && Math.random() > 0.5) { playChime(400 + Math.random() * 800); gainResource(essenceGain, xpGain); createParticle(px, py, "🎐"); }
            else if (type === 'click' || type === 'auto') { playChime(500 + Math.random() * 400); gainResource(essenceGain, xpGain); createParticle(px, py, "✨"); triggerToolAnimation('anim-pulse'); }
            break;
        case 'musicbox':
            playMusicbox(type);
            rotateCrank();
            gainResource(type === 'click' ? essenceGain * 1.5 : essenceGain, type === 'click' ? xpGain * 1.5 : xpGain);
            createParticle(px, py, "🎶");
            triggerToolAnimation('anim-bounce');
            break;
        case 'rainwindow':
            if (type === 'drag' || type === 'auto') {
                playRaindrop();
                createWipe(px, py);
                gainResource(essenceGain, xpGain);
            } else if (type === 'click') {
                playRainWindowSingle();
                createRaindrop(px, py);
                gainResource(essenceGain * 1.5, xpGain * 1.5);
            }

            if (now - lastAutoRaindropTime > 800) {
                lastAutoRaindropTime = now;
                const w = document.querySelector('.rain-window');
                if (w) {
                    const rect = w.getBoundingClientRect();
                    const rx = rect.left + Math.random() * rect.width;
                    const ry = rect.top + Math.random() * (rect.height * 0.5);
                    createRaindrop(rx, ry);
                }
            }
            break;

        // Stage 2
        case 'woodblock':
            if (type === 'drag' || type === 'click' || type === 'auto') { playWoodTap(); gainResource(essenceGain, xpGain); if (Math.random() > 0.5) createParticle(px, py, "🪵"); }
            break;
        case 'leaves':
            if (type === 'drag' || type === 'click' || type === 'auto') {
                playLeavesRustle(); gainResource(essenceGain, xpGain);
                // Scatter leaves physics
                const leaves = document.querySelectorAll('.magic-leaf');
                leaves.forEach(leaf => {
                    const rect = leaf.getBoundingClientRect();
                    const leafX = rect.left + rect.width / 2;
                    const leafY = rect.top + rect.height / 2;

                    const dx = leafX - px;
                    const dy = leafY - py;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) { // Reduced interaction radius
                        const force = (120 - dist) / 120;
                        const pushX = (dx / (dist || 1)) * force * 50 + (Math.random() - 0.5) * 40;
                        const pushY = (dy / (dist || 1)) * force * 50 + (Math.random() - 0.5) * 40;
                        const rot = Math.random() * 360;

                        // Accumulate transforms via data attributes
                        let curX = parseFloat(leaf.dataset.x || 0);
                        let curY = parseFloat(leaf.dataset.y || 0);
                        curX += pushX;
                        curY += pushY;

                        // Keep within bounds roughly, reduced bounds to prevent them flying off screen
                        curX = Math.max(-100, Math.min(100, curX));
                        curY = Math.max(-100, Math.min(100, curY));

                        leaf.dataset.x = curX;
                        leaf.dataset.y = curY;
                        leaf.style.transform = `translate(${curX}px, ${curY}px) rotate(${rot}deg)`;
                    }
                });
            }
            break;
        case 'campfire':
            if (type === 'drag' || type === 'click' || type === 'auto') { playCampfire(); gainResource(essenceGain, xpGain); createParticle(px, py, "✨"); }
            break;
        case 'singingbowl':
            if (type === 'click' || type === 'auto') {
                playSingingBowl(false); gainResource(essenceGain, xpGain);
                createParticle(px, py, "〰️");
                const bowl = document.querySelector('.singingbowl-visual');
                if (bowl) {
                    bowl.classList.remove('vibrate');
                    void bowl.offsetWidth;
                    bowl.classList.add('vibrate');
                    const wave = document.createElement('div');
                    wave.className = 'sound-wave';
                    bowl.appendChild(wave);
                    setTimeout(() => wave.remove(), 2000);
                }
            } else if (type === 'drag') {
                playSingingBowl(true); gainResource(essenceGain, xpGain);
            }
            break;
        case 'birdsong':
            if (type === 'drag' || type === 'click' || type === 'auto') { playBirdsong(); gainResource(essenceGain, xpGain); createParticle(px, py, "🎵"); triggerToolAnimation('anim-bounce'); }
            break;
        case 'stream':
            if (type === 'drag' || type === 'click' || type === 'auto') { playStream(); gainResource(essenceGain, xpGain); createParticle(px, py, "💧"); triggerToolAnimation('anim-wobble'); }
            break;
        case 'crickets':
            if ((type === 'drag' && Math.random() > 0.5) || type === 'click' || type === 'auto') { playCrickets(); gainResource(essenceGain, xpGain); createParticle(px, py, "🦗"); triggerToolAnimation('anim-shake'); }
            break;

        // Stage 3
        case 'keyboard':
            if (type === 'click' || type === 'auto' || (type === 'drag' && Math.random() > 0.7)) { playKeyboard(); gainResource(essenceGain, xpGain); triggerToolAnimation('anim-shake'); }
            break;
        case 'glitch':
            if (type === 'drag' || type === 'click' || type === 'auto') { playGlitch(); gainResource(essenceGain, xpGain); triggerToolAnimation('anim-wobble'); }
            break;
        case 'spaceship':
            if (type === 'drag' || type === 'click' || type === 'auto') { playSpaceshipDrone(); gainResource(essenceGain, xpGain); triggerToolAnimation('anim-pulse'); }
            break;
        case 'serverfan':
            if (type === 'drag' || type === 'click' || type === 'auto') { playServerFan(); gainResource(essenceGain, xpGain); spinServerFan(); }
            break;
        case 'servomotor':
            if (type === 'click' || type === 'auto' || (type === 'drag' && Math.random() > 0.8)) { playServoMotor(); gainResource(essenceGain, xpGain); createParticle(px, py, "🦾"); triggerToolAnimation('anim-bounce'); }
            break;
        case 'datatransfer':
            if (type === 'click' || type === 'auto' || (type === 'drag' && Math.random() > 0.8)) { playDataTransfer(); gainResource(essenceGain, xpGain); createParticle(px, py, "💽"); triggerToolAnimation('anim-pulse'); }
            break;
        case 'zerogpod':
            if (type === 'click' || type === 'auto' || (type === 'drag' && Math.random() > 0.9)) { playZeroGPod(); gainResource(essenceGain, xpGain); createParticle(px, py, "🌌"); triggerToolAnimation('anim-wobble'); }
            break;

        // Stage 4
        case 'bubbles':
            if (type === 'click' || type === 'auto' || (type === 'drag' && Math.random() > 0.6)) { playBubbles(); gainResource(essenceGain, xpGain); createParticle(px, py, "🫧"); triggerToolAnimation('anim-pulse'); }
            break;
        case 'submarine':
            if (type === 'drag' || type === 'click' || type === 'auto') { playSubmarine(); gainResource(essenceGain, xpGain); if (Math.random() > 0.8) createSonarWave(); }
            break;
        case 'whale':
            if (type === 'click' || type === 'auto' || (type === 'drag' && Math.random() > 0.9)) { playWhaleSong(); gainResource(essenceGain, xpGain); createParticle(px, py, "🐋"); triggerToolAnimation('anim-bounce'); }
            break;
        case 'waterflow':
            if (type === 'drag' || type === 'click' || type === 'auto') { playDeepWaterFlow(); gainResource(essenceGain, xpGain); createParticle(px, py, "🌊"); triggerToolAnimation('anim-wobble'); }
            break;
        case 'coral':
            if (type === 'drag' || type === 'click' || type === 'auto') { playCoral(); gainResource(essenceGain, xpGain); createParticle(px, py, "🪸"); triggerToolAnimation('anim-shake'); }
            break;
        case 'oxygentank':
            if (type === 'click' || type === 'auto' || (type === 'drag' && Math.random() > 0.8)) { playOxygenTank(); gainResource(essenceGain, xpGain); createParticle(px, py, "🤿"); triggerToolAnimation('anim-pulse'); }
            break;
        case 'caveecho':
            if (type === 'click' || type === 'auto' || (type === 'drag' && Math.random() > 0.85)) { playCaveEcho(); gainResource(essenceGain, xpGain); createParticle(px, py, "🕳️"); triggerToolAnimation('anim-wobble'); }
            break;

        // Stage 5
        case 'quill':
            if (type === 'drag' || type === 'click' || type === 'auto') { playQuillPen(); gainResource(essenceGain, xpGain); drawInk(px, py); }
            break;
        case 'parchment':
            if (type === 'click' || type === 'auto' || (type === 'drag' && Math.random() > 0.5)) { playParchment(); gainResource(essenceGain, xpGain); createParticle(px, py, "📜"); triggerToolAnimation('anim-shake'); }
            break;
        case 'teacup':
            if (type === 'click' || type === 'drag' || type === 'auto') { playTeacup(); gainResource(essenceGain, xpGain); createParticle(px, py, "☕"); triggerToolAnimation('anim-bounce'); }
            break;
        case 'royalchimes':
            if (type === 'click' || type === 'auto' || (type === 'drag' && Math.random() > 0.95)) { playRoyalChimes(); gainResource(essenceGain, xpGain); createParticle(px, py, "✨"); triggerToolAnimation('anim-pulse'); }
            break;
        case 'velvet':
            if (type === 'drag' || type === 'click' || type === 'auto') { playVelvet(); gainResource(essenceGain, xpGain); createParticle(px, py, "🧣"); triggerToolAnimation('anim-wobble'); }
            break;
        case 'chess':
            if (type === 'click' || type === 'drag' || type === 'auto') { playChess(); gainResource(essenceGain, xpGain); createParticle(px, py, "♟️"); triggerToolAnimation('anim-shake'); }
            break;
        case 'royalfire':
            if (type === 'drag' || type === 'click' || type === 'auto') { playRoyalFireplace(); gainResource(essenceGain, xpGain); createParticle(px, py, "🏰"); triggerToolAnimation('anim-pulse'); }
            break;

        // Stage 6
        case 'harp':
            if (type === 'click' || type === 'drag' || type === 'auto') { if (typeof playCrystalTap === 'function') playCrystalTap(600 + Math.random() * 400); gainResource(essenceGain, xpGain); createParticle(px, py, "🪕"); triggerToolAnimation('anim-bounce'); }
            break;
        case 'clouds':
            if (type === 'click' || type === 'drag' || type === 'auto') { if (typeof playChime === 'function') playChime(400); gainResource(essenceGain, xpGain); createParticle(px, py, "☁️"); triggerToolAnimation('anim-wobble'); }
            break;
        case 'halo':
            if (type === 'click' || type === 'drag' || type === 'auto') { if (typeof playChime === 'function') playChime(800); gainResource(essenceGain, xpGain); createParticle(px, py, "😇"); triggerToolAnimation('anim-pulse'); }
            break;
        case 'gate':
            if (type === 'click' || type === 'drag' || type === 'auto') { if (typeof playWoodTap === 'function') playWoodTap(); gainResource(essenceGain, xpGain); createParticle(px, py, "🏛️"); triggerToolAnimation('anim-shake'); }
            break;
        case 'choir':
            if (type === 'click' || type === 'drag' || type === 'auto') { if (typeof playChime === 'function') playChime(600); gainResource(essenceGain, xpGain); createParticle(px, py, "👼"); triggerToolAnimation('anim-wobble'); }
            break;
        case 'starlight':
            if (type === 'click' || type === 'drag' || type === 'auto') { if (typeof playCrystalTap === 'function') playCrystalTap(1200); gainResource(essenceGain, xpGain); createParticle(px, py, "✨"); triggerToolAnimation('anim-pulse'); }
            break;
        case 'sanctuary':
            if (type === 'click' || type === 'drag' || type === 'auto') { if (typeof playChime === 'function') playChime(500); gainResource(essenceGain, xpGain); createParticle(px, py, "💒"); triggerToolAnimation('anim-bounce'); }
            break;
    }


    if (state.activeHealingTarget) {
        const healAmount = (tool.rewardBase * 2) * state.buffs.healSpeedMultiplier;
        processHealing(healAmount);
    }
    updateRecordingUI();
}

function processHealing(amount) {
    if (!state.activeHealingTarget) return;
    const target = state.activeHealingTarget;
    const speedMod = target.stressEffect ? target.stressEffect.speedMod : 1.0;
    const rxSpeedMultiplier = target.isOptimalRx ? 1.5 : 1.0;

    // 안정지수에 비례하여 치유량이 증폭됨 (0~100 안정지수 -> 1.0x ~ 2.0x 치유량)
    const stabilityMultiplier = 1.0 + (state.stability / 100);
    const rawHeal = amount * speedMod * stabilityMultiplier * rxSpeedMultiplier;

    // 플레이어가 너무 강력해져서 한 번 클릭에 손님이 바로 치유되는 것을 방지.
    // 아무리 치유량이 높아도 1회 상호작용당 최대 스트레스의 15%까지만 깎이도록 제한 (최소 7번의 상호작용 필요)
    const maxHealLimit = target.maxStress * 0.15;
    const actualHeal = Math.min(rawHeal, maxHealLimit);

    target.currentStress -= actualHeal;
    const max = target.maxStress;
    const cur = target.currentStress;
    const pct = Math.min(100, Math.max(0, 100 - (cur / max) * 100));

    el.healingProgressFill.style.width = `${pct}%`;
    el.healingPercent.textContent = `${Math.floor(pct)}%`;

    if (cur <= 0) {
        const target = state.activeHealingTarget;
        const isOptimal = target.isOptimalRx;
        state.activeHealingTarget = null;
        el.healingOverlay.classList.add('hidden');
        stopAutoHeal();
        state.visitors = state.visitors.filter(v => v.id !== target.id);
        if (state.visitors.length === 0) {
            state.lastVisitorSpawnTime = Date.now();
        }

        const rushMultiplier = state.isEveningRush ? 1.2 : 1.0;
        const rxMultiplier = isOptimal ? 1.3 : 1.0; // 맞춤 처방 성공 시 에센스 및 경험치 +30% 추가 보너스
        const totalEssence = target.rewardEssence * state.buffs.essenceMultiplier * rushMultiplier * rxMultiplier;
        const totalXp = target.rewardXp * state.buffs.xpMultiplier * rushMultiplier * rxMultiplier;

        gainEssence(totalEssence); gainXp(totalXp);
        if (state.isEveningRush) {
            showToast('🔥 [저녁 러시 보너스] 에센스 & XP +20% 추가 획득!');
        }
        if (isOptimal) {
            showToast(`💖 [맞춤 처방 완치!] ${getVisitorName(target)}의 증상이 완전히 호전되어 추가 보답(+30%)을 받았습니다!`);
        }

        // SNS Review Collection Logic
        if (state.currentTool && !state.collectedReviews.includes(state.currentTool)) {
            state.collectedReviews.push(state.currentTool);
            state.unreadReviews++;
            updateReviewBadge();
            addNotification(t('reviews_title') + " - " + t(`room_${state.currentTool}_name`) + " 후기를 수집했습니다! 📱", 'system');

            // Re-render if reviews panel is open
            if (document.getElementById('reviews-panel').classList.contains('active')) {
                renderReviewsPanel();
            }
        }

        if (target.stressEffect && target.stressEffect.id !== 'none') {
            let roll = Math.random();
            if (isOptimal) {
                // 맞춤 처방 성공 시 고급 아이템 드롭 기회 15% 상승
                roll = Math.min(0.99, roll + 0.15);
            }
            let itemId = null;
            if (roll < 0.30) itemId = 'coin_small';            // 30% (흔함 - 작은 동전)
            else if (roll < 0.55) itemId = 'potion_small';     // 25% (보통 - 작은 물약)
            else if (roll < 0.70) itemId = 'silver_pouch';     // 15% (희귀 - 은화 주머니)
            else if (roll < 0.80) itemId = 'potion_medium';    // 10% (희귀 - 중간 물약)
            else if (roll < 0.87) itemId = 'money_bag';        // 7%  (매우 희귀 - 돈주머니)
            else if (roll < 0.93) itemId = 'potion_large';     // 6%  (매우 희귀 - 큰 물약)
            else if (roll < 0.97) itemId = 'flower_perfume';   // 4%  (에픽 - 꽃향수)
            else if (roll < 0.99) itemId = 'promo_bell';       // 2%  (에픽 - 홍보용 종)
            else itemId = 'potion_special';                    // 1%  (전설 - 특수 물약)

            if (itemId) {
                if (!state.inventory[itemId]) state.inventory[itemId] = 0;
                state.inventory[itemId]++;
                const itemName = t(INVENTORY_ITEMS[itemId].nameKey);
                addNotification(`🎁 [${itemName}] 획득!`, 'system');
            }
        }

        playChime(880);
        addNotification(t('healing_complete_alert', { essence: Math.floor(totalEssence).toLocaleString(), xp: Math.floor(totalXp).toLocaleString() }), 'system');
    }
}

function renderSanctuary() {
    el.toolLayer.innerHTML = '';
    const tool = ROOMS.find(r => r.id === state.currentTool);
    const essenceGain = tool.rewardBase * state.buffs.essenceMultiplier;
    const xpGain = tool.rewardBase * state.buffs.xpMultiplier;

    if (state.currentTool === 'crystal') {
        const c = document.createElement('div'); c.className = 'crystal-container';
        c.innerHTML = '<img src="image/crystal_bg.png" class="crystal-image" alt="Crystal">';
        el.toolLayer.appendChild(c);
    }
    else if (state.currentTool === 'potion') {
        const c = document.createElement('div'); c.className = 'potion-container';
        c.innerHTML = '<img src="image/potion_bg.png" class="potion-image" alt="Potion">';
        el.toolLayer.appendChild(c);
    }
    else if (state.currentTool === 'waterbowl') {
        const bowl = document.createElement('div'); bowl.className = 'wood-bowl ornate-bowl';
        bowl.innerHTML = '<div class="wood-water"></div>';
        for (let i = 0; i < 8; i++) {
            const p = document.createElement('div'); p.className = 'flower-pink';
            p.style.left = `${Math.random() * 240 + 10}px`; p.style.top = `${Math.random() * 240 + 10}px`; bowl.appendChild(p);
        }
        for (let i = 0; i < 6; i++) {
            const p = document.createElement('div'); p.className = 'flower-purple';
            p.style.left = `${Math.random() * 240 + 10}px`; p.style.top = `${Math.random() * 240 + 10}px`; bowl.appendChild(p);
        }
        for (let i = 0; i < 5; i++) {
            const p = document.createElement('div'); p.className = 'flower-daisy';
            p.style.left = `${Math.random() * 240 + 10}px`; p.style.top = `${Math.random() * 240 + 10}px`; bowl.appendChild(p);
        }
        for (let i = 0; i < 15; i++) {
            const b = document.createElement('div'); b.className = 'berry-blue';
            b.style.left = `${Math.random() * 220 + 15}px`; b.style.top = `${Math.random() * 220 + 15}px`; bowl.appendChild(b);
        }
        for (let i = 0; i < 20; i++) {
            const b = document.createElement('div'); b.className = 'berry-red';
            b.style.left = `${Math.random() * 230 + 10}px`; b.style.top = `${Math.random() * 230 + 10}px`; bowl.appendChild(b);
        }
        for (let i = 0; i < 12; i++) {
            const l = document.createElement('div'); l.className = 'tiny-leaf';
            l.style.left = `${Math.random() * 230 + 10}px`; l.style.top = `${Math.random() * 230 + 10}px`; bowl.appendChild(l);
        }
        el.toolLayer.appendChild(bowl);
    }
    else if (state.currentTool === 'sand') {
        const s = document.createElement('div'); s.className = 'kinetic-sand';
        el.toolLayer.appendChild(s);
    }
    else if (state.currentTool === 'chimes') {
        const c = document.createElement('div'); c.className = 'cosmic-chime-container';
        const bell = document.createElement('div'); bell.className = 'cosmic-bell-body';
        const rodsContainer = document.createElement('div'); rodsContainer.className = 'cosmic-crystal-rods';
        const freqs = [440, 493, 554, 659, 739];
        freqs.forEach((freq, idx) => {
            const bar = document.createElement('div');
            bar.className = 'cosmic-crystal';
            bar.style.backgroundImage = `url('image/crystal_${idx}.png')`;
            bar.style.height = `${120 + (1000 / freq) * 20}px`;
            bar.onmousedown = (e) => {
                e.stopPropagation();
                playChime(freq);
                bar.style.transform = `rotate(${(Math.random() > 0.5 ? 1 : -1) * 15}deg)`;
                setTimeout(() => bar.style.transform = 'rotate(0deg)', 300);
                gainResource(essenceGain * 1.5, xpGain * 1.5);
                if (state.activeHealingTarget) processHealing((tool.rewardBase * 3) * state.buffs.healSpeedMultiplier);
                updateRecordingUI();
            }
            rodsContainer.appendChild(bar);
        });
        c.appendChild(bell);
        c.appendChild(rodsContainer);
        el.toolLayer.appendChild(c);
    }
    else if (state.currentTool === 'musicbox') {
        el.toolLayer.innerHTML = '<div class="musicbox-container"><div class="musicbox-crank"></div></div>';
    }
    else if (state.currentTool === 'rainwindow') {
        el.toolLayer.innerHTML = '<div class="rain-window"></div>';
    }
    // Stage 2
    else if (state.currentTool === 'woodblock') {
        el.toolLayer.innerHTML = '<div class="woodblock-visual" id="tool-visual"></div>';
    }
    else if (state.currentTool === 'leaves') {
        let leafHTML = '';
        for (let i = 0; i < 20; i++) {
            const img = Math.random() > 0.5 ? 'image/magic_leaf_1.png' : 'image/magic_leaf_2.png';
            const rot = Math.random() * 360;
            const offsetX = (Math.random() - 0.5) * 60;
            const offsetY = (Math.random() - 0.5) * 60;
            leafHTML += `<div class="magic-leaf" data-x="${offsetX}" data-y="${offsetY}" style="background-image: url('${img}'); transform: translate(${offsetX}px, ${offsetY}px) rotate(${rot}deg);"></div>`;
        }
        el.toolLayer.innerHTML = `<div class="leaves-pile-container" id="tool-visual">${leafHTML}</div>`;
    }
    else if (state.currentTool === 'campfire') {
        const scale = 0.5 + (state.fireLevel * 0.15); // Level 1: 0.65, Level 6: 1.4
        el.toolLayer.innerHTML = `
            <div class="campfire-visual" id="tool-visual">
                <div class="campfire-base"></div>
                <div class="flame-container" style="transform: scale(${scale});">
                    <div class="magic-flame"></div>
                </div>
                <div class="fire-controls">
                    <button onclick="changeFireLevel(-1)">-</button>
                    <span>LV <span id="fire-level-display">${state.fireLevel}</span></span>
                    <button onclick="changeFireLevel(1)">+</button>
                </div>
            </div>`;
    }
    else if (state.currentTool === 'singingbowl') {
        el.toolLayer.innerHTML = '<div class="singingbowl-visual" id="tool-visual"></div>';
    }
    else if (state.currentTool === 'birdsong') {
        el.toolLayer.innerHTML = `
            <div class="bird-container" id="tool-visual">
                <div class="bird-body"></div>
            </div>`;
    }
    else if (state.currentTool === 'stream') {
        el.toolLayer.innerHTML = '<div class="stream-visual" id="tool-visual"></div>';
    }
    else if (state.currentTool === 'crickets') { el.toolLayer.innerHTML = '<div class="crickets-visual" id="tool-visual"></div>'; }
    // Stage 3
    else if (state.currentTool === 'keyboard') {
        el.toolLayer.innerHTML = '<div class="keyboard-visual" id="tool-visual">⌨️</div>';
    }
    else if (state.currentTool === 'glitch') {
        el.toolLayer.innerHTML = '<div class="glitch-visual" id="tool-visual"></div>';
    }
    else if (state.currentTool === 'spaceship') {
        el.toolLayer.innerHTML = '<div class="spaceship-visual" id="tool-visual">🚀</div>';
    }
    else if (state.currentTool === 'serverfan') {
        el.toolLayer.innerHTML = '<div class="server-fan-container" id="tool-visual"><div class="server-fan-blade" id="server-fan"></div><div class="server-fan-center"></div></div>';
    }
    else if (state.currentTool === 'servomotor') { el.toolLayer.innerHTML = '<div id="tool-visual" style="font-size:4rem; text-align:center; padding-top:40px;">🦾</div>'; }
    else if (state.currentTool === 'datatransfer') { el.toolLayer.innerHTML = '<div id="tool-visual" style="font-size:4rem; text-align:center; padding-top:40px;">💽</div>'; }
    else if (state.currentTool === 'zerogpod') { el.toolLayer.innerHTML = '<div id="tool-visual" style="font-size:4rem; text-align:center; padding-top:40px;">🌌</div>'; }
    // Stage 4
    else if (state.currentTool === 'bubbles') {
        el.toolLayer.innerHTML = '<div class="bubbles-visual" id="tool-visual"></div>';
    }
    else if (state.currentTool === 'submarine') {
        el.toolLayer.innerHTML = '<div class="submarine-visual" id="tool-visual"></div>';
    }
    else if (state.currentTool === 'whale') {
        el.toolLayer.innerHTML = '<div class="whale-visual" id="tool-visual"></div>';
    }
    else if (state.currentTool === 'waterflow') {
        el.toolLayer.innerHTML = '<div class="waterflow-visual" id="tool-visual"></div>';
    }
    else if (state.currentTool === 'coral') { 
        el.toolLayer.innerHTML = '<div class="coral-visual" id="tool-visual"></div>'; 
    }
    else if (state.currentTool === 'oxygentank') { el.toolLayer.innerHTML = '<div class="oxygentank-visual" id="tool-visual"></div>'; }
    else if (state.currentTool === 'caveecho') { el.toolLayer.innerHTML = '<div class="caveecho-visual" id="tool-visual"></div>'; }
    // Stage 5
    else if (state.currentTool === 'quill') {
        el.toolLayer.innerHTML = '<div class="parchment-paper" id="parchment-paper"></div>';
    }
    else if (state.currentTool === 'parchment') { el.toolLayer.innerHTML = '<div class="parchment-visual" id="tool-visual" style="font-size:4rem; text-align:center; padding-top:40px;">📜</div>'; }
    else if (state.currentTool === 'teacup') { el.toolLayer.innerHTML = '<div class="teacup-visual" id="tool-visual" style="font-size:4rem; text-align:center; padding-top:40px;">☕</div>'; }
    else if (state.currentTool === 'royalchimes') { el.toolLayer.innerHTML = '<div class="royalchimes-visual" id="tool-visual" style="font-size:4rem; text-align:center; padding-top:40px;">✨</div>'; }
    else if (state.currentTool === 'velvet') { el.toolLayer.innerHTML = '<div id="tool-visual" style="font-size:4rem; text-align:center; padding-top:40px;">🧣</div>'; }
    else if (state.currentTool === 'chess') { el.toolLayer.innerHTML = '<div id="tool-visual" style="font-size:4rem; text-align:center; padding-top:40px;">♟️</div>'; }
    else if (state.currentTool === 'royalfire') { el.toolLayer.innerHTML = '<div id="tool-visual" style="font-size:4rem; text-align:center; padding-top:40px;">🏰</div>'; }
    // Stage 6
    else if (state.currentTool === 'harp') { el.toolLayer.innerHTML = '<div id="tool-visual" style="font-size:4rem; text-align:center; padding-top:40px;">🪕</div>'; }
    else if (state.currentTool === 'clouds') { el.toolLayer.innerHTML = '<div id="tool-visual" style="font-size:4rem; text-align:center; padding-top:40px;">☁️</div>'; }
    else if (state.currentTool === 'halo') { el.toolLayer.innerHTML = '<div id="tool-visual" style="font-size:4rem; text-align:center; padding-top:40px;">😇</div>'; }
    else if (state.currentTool === 'gate') { el.toolLayer.innerHTML = '<div id="tool-visual" style="font-size:4rem; text-align:center; padding-top:40px;">🏛️</div>'; }
    else if (state.currentTool === 'choir') { el.toolLayer.innerHTML = '<div id="tool-visual" style="font-size:4rem; text-align:center; padding-top:40px;">👼</div>'; }
    else if (state.currentTool === 'starlight') { el.toolLayer.innerHTML = '<div id="tool-visual" style="font-size:4rem; text-align:center; padding-top:40px;">✨</div>'; }
    else if (state.currentTool === 'sanctuary') { el.toolLayer.innerHTML = '<div id="tool-visual" style="font-size:4rem; text-align:center; padding-top:40px;">💒</div>'; }
}

function movePetals(cx, cy) { document.querySelectorAll('.flower-pink, .flower-purple, .flower-daisy, .berry-blue, .berry-red, .tiny-leaf').forEach(el => { el.style.transform = `translate(${(Math.random() - 0.5) * 60}px, ${(Math.random() - 0.5) * 60}px) rotate(${Math.random() * 360}deg)`; }); }
function createSandCut(px, py) {
    const sand = document.querySelector('.kinetic-sand');
    if (!sand) return;
    const rect = sand.getBoundingClientRect();
    const lx = px - rect.left;
    const ly = py - rect.top;
    const cut = document.createElement('div'); cut.className = 'sand-cut';
    cut.style.left = `${lx - 7}px`; cut.style.top = `${ly - 7}px`;
    sand.appendChild(cut);
    setTimeout(() => { if (cut.parentNode) { cut.style.opacity = '0'; setTimeout(() => cut.remove(), 2000); } }, 500);
}
let crankAngle = 0;
function rotateCrank() { const crank = document.querySelector('.musicbox-crank'); if (crank) { crankAngle += 45; crank.style.transform = `rotateX(${crankAngle}deg)`; } }
function createRaindrop(px, py) {
    const w = document.querySelector('.rain-window'); if (!w) return;
    const rect = w.getBoundingClientRect();
    const lx = px - rect.left; const ly = py - rect.top;
    const d = document.createElement('div'); d.className = 'rain-drop'; d.style.left = `${lx - 15}px`; d.style.top = `${ly - 10}px`; w.appendChild(d); setTimeout(() => d.remove(), 2500);
}
function createWipe(px, py) {
    const w = document.querySelector('.rain-window'); if (!w) return;
    const rect = w.getBoundingClientRect();
    const lx = px - rect.left; const ly = py - rect.top;
    const d = document.createElement('div'); d.className = 'window-wipe'; d.style.left = `${lx - 30}px`; d.style.top = `${ly - 30}px`; w.appendChild(d); setTimeout(() => { d.style.opacity = '0'; setTimeout(() => d.remove(), 500); }, 1500);
}

// 신규 도구 헬퍼 함수
let fanSpeed = 0; let fanAngle = 0;
function spinServerFan() {
    fanSpeed = Math.min(fanSpeed + 10, 50);
    const fan = document.getElementById('server-fan');
    if (fan) { fanAngle += fanSpeed; fan.style.transform = `rotate(${fanAngle}deg)`; }
}
setInterval(() => { if (fanSpeed > 0) fanSpeed -= 2; }, 100);

function createSonarWave() {
    const radar = document.querySelector('.sonar-radar');
    if (!radar) return;
    const wave = document.createElement('div'); wave.className = 'sonar-wave';
    radar.appendChild(wave); setTimeout(() => wave.remove(), 1000);
}

function drawInk(x, y) {
    const paper = document.getElementById('parchment-paper');
    if (!paper) return;
    const ink = document.createElement('div'); ink.className = 'ink-trail';
    const rect = paper.getBoundingClientRect();
    ink.style.left = `${x - rect.left}px`; ink.style.top = `${y - rect.top}px`;
    paper.appendChild(ink); setTimeout(() => ink.remove(), 3000);
}

function triggerToolAnimation(animClass) {
    const el = document.getElementById('tool-visual');
    if (!el) return;
    el.classList.remove('anim-bounce', 'anim-shake', 'anim-pulse', 'anim-wobble');
    // 리플로우 강제 트리거로 애니메이션 재시작 허용
    void el.offsetWidth;
    el.classList.add(animClass);
}

// --- UI Management ---
function renderRoomList() {
    const currentStageRooms = getRoomsForCurrentStage();
    el.roomList.innerHTML = currentStageRooms.map(r => {
        const isUnlocked = state.unlockedRooms.includes(r.id);
        const canUnlockLevel = state.level >= r.minLevel;
        const nameLocalized = t('room_' + r.id + '_name');
        if (isUnlocked) {
            return `<div class="room-card" onclick="enterRecordingRoom('${r.id}')"><div class="room-icon">${r.icon}</div><div class="room-name">${nameLocalized}</div><div class="room-desc">${t('reward_base_text', { reward: r.rewardBase })}</div></div>`;
        }
        else {
            return `
                <div class="room-card locked">
                    <div class="room-icon">🔒</div><div class="room-name">${nameLocalized} (LV.${r.minLevel})</div>
                    <div class="unlock-info">
                        <div class="cost-req ${state.essence < r.costEssence ? 'red' : ''}"><span>${t('cost_req_essence', { cost: Math.floor(r.costEssence).toLocaleString() })}</span></div>
                        <button class="unlock-btn" ${!canUnlockLevel ? 'disabled' : ''} onclick="unlockRoom('${r.id}', event)">${canUnlockLevel ? t('unlock_button') : t('level_required')}</button>
                    </div>
                </div>`;
        }
    }).join('');
}

// --- Game Loop & Auto Interaction ---
let selectedItemId = null;
let autoInteractionInterval = null;
let isAutoPlaying = false;

function handleInteractionModeChange() {
    if (autoInteractionInterval) {
        clearInterval(autoInteractionInterval);
        autoInteractionInterval = null;
    }
    isAutoPlaying = false;

    const autoPlayBtn = document.getElementById('auto-play-toggle');
    if (autoPlayBtn) {
        if (state.currentTool && state.settings.interactionMode === 'auto') {
            autoPlayBtn.style.display = 'block';
            autoPlayBtn.classList.remove('hidden');
            autoPlayBtn.innerHTML = '🔊 소리 켜기';
        } else {
            autoPlayBtn.style.display = 'none';
        }
    }
}

function toggleAutoPlay() {
    const autoPlayBtn = document.getElementById('auto-play-toggle');
    if (isAutoPlaying) {
        // Stop
        if (autoInteractionInterval) {
            clearInterval(autoInteractionInterval);
            autoInteractionInterval = null;
        }
        isAutoPlaying = false;
        if (autoPlayBtn) autoPlayBtn.innerHTML = '🔊 소리 켜기';
    } else {
        // Start
        if (state.currentTool && state.settings.interactionMode === 'auto') {
            let intervalTime = 2000;
            if (state.currentTool === 'crickets') intervalTime = 1200;
            else if (state.currentTool === 'stream') intervalTime = 800;
            else if (state.currentTool === 'birdsong') intervalTime = 1500;
            else if (state.currentTool === 'rainwindow') intervalTime = 500;
            else if (state.currentTool === 'campfire') intervalTime = 1000;

            autoInteractionInterval = setInterval(() => {
                handleInteraction(null, 'auto');
            }, intervalTime);

            isAutoPlaying = true;
            if (autoPlayBtn) autoPlayBtn.innerHTML = '⏸️ 소리 끄기';
        }
    }
}

function renderInventory() {
    const list = document.getElementById('inventory-list');
    if (!list) return;
    if (!state.inventory || Object.keys(state.inventory).length === 0) {
        list.innerHTML = `<p style="text-align:center; color:#888; grid-column: 1 / -1; margin-top:20px;">${t('inventory_empty')}</p>`;
        return;
    }

    let html = '';
    for (const [id, count] of Object.entries(state.inventory)) {
        if (count > 0) {
            const item = INVENTORY_ITEMS[id];
            html += `
                <div class="inventory-item" onclick="openItemModal('${id}')">
                    <div class="item-icon">${item.icon}</div>
                    <div class="item-count">x${count}</div>
                    <div class="item-name">${t(item.nameKey)}</div>
                </div>
            `;
        }
    }

    if (html === '') {
        list.innerHTML = `<p style="text-align:center; color:#888; grid-column: 1 / -1; margin-top:20px;">${t('inventory_empty')}</p>`;
    } else {
        list.innerHTML = html;
    }
}

function openItemModal(itemId) {
    selectedItemId = itemId;
    const item = INVENTORY_ITEMS[itemId];
    const info = document.getElementById('modal-item-info');
    info.innerHTML = `
        <div style="font-size:3rem; margin-bottom:10px;">${item.icon}</div>
        <h4 style="color:var(--accent-gold); margin-bottom:10px;">${t(item.nameKey)}</h4>
        <p style="font-size:0.9rem; color:#ccc;">${t(item.descKey)}</p>
        <p style="margin-top:10px; font-size:0.8rem; color:#aaa;">보유량: ${state.inventory[itemId]}개</p>
    `;
    const quantityInput = document.getElementById('item-quantity');
    if (quantityInput) {
        quantityInput.value = 1;
        quantityInput.max = state.inventory[itemId];
    }
    document.getElementById('item-modal').classList.remove('hidden');
}

function closeItemModal() {
    document.getElementById('item-modal').classList.add('hidden');
    selectedItemId = null;
}

document.addEventListener('DOMContentLoaded', () => {
    const useBtn = document.getElementById('btn-use-item');
    if (useBtn) useBtn.addEventListener('click', useItem);
});

function useItem() {
    if (!selectedItemId || !state.inventory[selectedItemId] || state.inventory[selectedItemId] <= 0) return;

    const quantityInput = document.getElementById('item-quantity');
    const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;

    if (quantity < 1 || quantity > state.inventory[selectedItemId]) return;

    state.inventory[selectedItemId] -= quantity;
    const item = INVENTORY_ITEMS[selectedItemId];

    const now = Date.now();
    for (let i = 0; i < quantity; i++) {
        state.activeTemporaryBuffs.push({
            id: item.id,
            buffMulti: item.buffMulti,
            type: item.type,
            endTime: now + (item.buffDuration * 1000)
        });
    }

    recalculateAllBuffs();
    closeItemModal();
    renderInventory();

    addNotification(t('buff_applied', { itemName: t(item.nameKey) }) + (quantity > 1 ? ` x${quantity}` : ''), 'system');
}

function recalculateAllBuffs() {
    state.buffs.healSpeedMultiplier = 1.0 + ((state.upgradesOwned.incense || 0) * 0.20);
    state.buffs.essenceMultiplier = 1.0 + ((state.upgradesOwned.mic || 0) * 0.50);
    state.buffs.xpMultiplier = 1.0 + ((state.upgradesOwned.book || 0) * 0.50);

    const now = Date.now();
    if (state.activeTemporaryBuffs) {
        state.activeTemporaryBuffs = state.activeTemporaryBuffs.filter(b => b.endTime > now);
        state.activeTemporaryBuffs.forEach(b => {
            if (b.type === 'all') {
                state.buffs.essenceMultiplier *= b.buffMulti;
                state.buffs.xpMultiplier *= b.buffMulti;
                state.buffs.healSpeedMultiplier *= b.buffMulti;
            } else if (b.type === 'essence') {
                state.buffs.essenceMultiplier *= b.buffMulti;
            } else if (b.type === 'heal') {
                state.buffs.healSpeedMultiplier *= b.buffMulti;
            }
        });
    }
}

function renderActiveBuffs() {
    const containers = [
        document.getElementById('active-buffs-container'),
        document.getElementById('recording-active-buffs')
    ];
    let html = '';
    const now = Date.now();

    if (state.activeTemporaryBuffs && state.activeTemporaryBuffs.length > 0) {
        // Group buffs by ID to show only one icon per item
        const grouped = {};
        state.activeTemporaryBuffs.forEach(b => {
            if (!grouped[b.id]) grouped[b.id] = { count: 0, maxEndTime: 0 };
            grouped[b.id].count++;
            grouped[b.id].maxEndTime = Math.max(grouped[b.id].maxEndTime, b.endTime);
        });

        const entries = Object.entries(grouped);
        if (entries.length > 0) {
            const [id, data] = entries[entries.length - 1]; // 화면에 가장 최근 아이템 1개만 표시
            const item = INVENTORY_ITEMS[id];
            const remainingSec = Math.max(0, Math.ceil((data.maxEndTime - now) / 1000));
            const countText = data.count > 1 ? `<span style="font-size: 0.7em; margin-left: 2px;">x${data.count}</span>` : '';
            html += `<div class="buff-icon" title="${t(item.nameKey)}">${item.icon}${countText}<div class="buff-timer">${remainingSec}s</div></div>`;
        }
    }
    containers.forEach(c => {
        if (c) c.innerHTML = html;
    });
}

function processTemporaryBuffs() {
    if (!state.activeTemporaryBuffs) return;
    const now = Date.now();
    let expired = false;
    for (let i = 0; i < state.activeTemporaryBuffs.length; i++) {
        if (now >= state.activeTemporaryBuffs[i].endTime) {
            expired = true;
            break;
        }
    }
    if (expired) {
        recalculateAllBuffs();
        updateUI();
    }
    renderActiveBuffs();
}

function updateGameClockDisplay() {
    const totalMins = Math.floor(state.gameTimeMinutes) % 1440;
    const hours = Math.floor(totalMins / 60);
    const mins = Math.floor(totalMins % 60);
    const timeStr = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;

    // 시간대별 아이콘:
    // 00:00 ~ 05:59: 🌙 심야
    // 06:00 ~ 11:59: ☀️ 아침
    // 12:00 ~ 17:59: ⛅ 낮
    // 18:00 ~ 20:59: 🌅 저녁 (18:00 ~ 18:15는 피크 러시)
    // 21:00 ~ 23:59: 🌌 밤
    let icon = '☀️';
    if (hours < 6) icon = '🌙';
    else if (hours < 12) icon = '☀️';
    else if (hours < 18) icon = '⛅';
    else if (hours < 21) icon = '🌅';
    else icon = '🌌';

    if (el.clockTime) el.clockTime.textContent = timeStr;
    if (el.clockIcon) el.clockIcon.textContent = icon;
    if (el.recordingClockTime) el.recordingClockTime.textContent = timeStr;
    if (el.recordingClockIcon) el.recordingClockIcon.textContent = icon;

    if (state.isEveningRush) {
        if (el.clockTag) el.clockTag.classList.remove('hidden');
        if (el.clockBadge) el.clockBadge.classList.add('rush-active');
        if (el.recordingClockTag) el.recordingClockTag.classList.remove('hidden');
        if (el.recordingClockBadge) el.recordingClockBadge.classList.add('rush-active');
    } else {
        if (el.clockTag) el.clockTag.classList.add('hidden');
        if (el.clockBadge) el.clockBadge.classList.remove('rush-active');
        if (el.recordingClockTag) el.recordingClockTag.classList.add('hidden');
        if (el.recordingClockBadge) el.recordingClockBadge.classList.remove('rush-active');
    }
}

function advanceGameClock() {
    if (state.isEveningRush) {
        // [옵션 A] 저녁 러시 중 (18:00 ~ 18:15):
        // 15분의 러시가 현실 90초 동안 진행되도록 1초당 1/6분(10초)씩 경과
        state.gameTimeMinutes += (1 / 6);
        if (state.gameTimeMinutes >= 1095) {
            state.gameTimeMinutes = 1095;
            endEveningRush();
        }
    } else {
        // 일반 시간: 현실 1초 = 가상 1분 경과 (하루 24시간 = 현실 24분)
        const nextTime = state.gameTimeMinutes + 1;
        // 저녁 6시 (18:00 = 1080분) 정각 도달 체크
        if (state.gameTimeMinutes < 1080 && nextTime >= 1080) {
            state.gameTimeMinutes = 1080;
            startEveningRush();
        } else {
            state.gameTimeMinutes = nextTime >= 1440 ? (nextTime % 1440) : nextTime;
        }
    }
    updateGameClockDisplay();
}

function startEveningRush() {
    if (state.isEveningRush) return;
    state.isEveningRush = true;

    try {
        playChime(660);
        setTimeout(() => playChime(880), 180);
        setTimeout(() => playChime(1100), 360);
    } catch (e) {
        console.warn(e);
    }

    showToast('🌅 [저녁 러시 시작!] 저녁 6시, 정령 손님들이 한꺼번에 찾아옵니다! (15분간 진행 / 치유 보너스 +20%)');
    addNotification('🌅 [저녁 러시] 저녁 6시 정각 피크타임 시작! 대기열이 6명으로 확장되고 치유 보너스(+20%)가 적용됩니다.', 'event');

    // 18:00 정각 즉시 손님 1명 대기열 추가 (치유 압박 완화)
    if (state.visitors.length < 6) {
        spawnVisitor();
    }
    updateGameClockDisplay();
}

function endEveningRush() {
    if (!state.isEveningRush) return;
    state.isEveningRush = false;

    try {
        playChime(520);
    } catch (e) {
        console.warn(e);
    }

    showToast('🌙 [저녁 러시 종료] 오늘의 피크타임이 무사히 마무리되었습니다.');
    addNotification('🌙 [저녁 러시 종료] 저녁 6시 15분, 오늘의 피크타임이 종료되었습니다. 수고하셨습니다!', 'event');

    updateGameClockDisplay();
}

function getVisitorSpawnInterval() {
    // 대기열이 완전히 비었을 때 플레이어가 마음 놓고 여유를 즐길 수 있도록 18~25초 여유 제공
    if (state.visitors.length === 0) {
        return 18000 + Math.random() * 7000;
    }
    if (state.isEveningRush) {
        // 러시 시간 (18:00~18:15): 기존 4~7초 -> 12~18초로 여유 있게 완화
        return 12000 + Math.random() * 6000;
    }

    const hour = Math.floor(state.gameTimeMinutes / 60) % 24;
    // 아침 (06:00 ~ 11:59): 상쾌하고 여유로운 시작 (50~70초)
    if (hour >= 6 && hour < 12) {
        return 50000 + Math.random() * 20000;
    }
    // 낮 (12:00 ~ 17:59): 온화하고 평화로운 방문 (40~60초)
    else if (hour >= 12 && hour < 18) {
        return 40000 + Math.random() * 20000;
    }
    // 저녁 (18:16 ~ 21:59): 차분하고 고요한 저녁 손님 (50~75초)
    else if (hour >= 18 && hour < 22) {
        return 50000 + Math.random() * 25000;
    }
    // 심야 (22:00 ~ 05:59): 드문 손님이지만 깊은 고민 (70~100초)
    else {
        return 70000 + Math.random() * 30000;
    }
}

// 편의 및 테스트용 시각 설정 함수 (브라우저 콘솔 / 테스트용)
window.setGameTime = function(hours, mins = 0) {
    state.gameTimeMinutes = (hours * 60 + mins) % 1440;
    if (state.gameTimeMinutes >= 1080 && state.gameTimeMinutes < 1095) {
        if (!state.isEveningRush) startEveningRush();
    } else {
        if (state.isEveningRush) endEveningRush();
    }
    updateGameClockDisplay();
};

function gameLoop() {
    processTemporaryBuffs();
    checkSecretShopRotation();
    advanceGameClock();

    const currentToolObj = ROOMS.find(r => r.id === state.currentTool);
    const roomReward = currentToolObj ? currentToolObj.rewardBase : (getRoomsForCurrentStage()[0] ? getRoomsForCurrentStage()[0].rewardBase : 2);
    let auto = (state.spirits.wind || 0) * Math.max(1, Math.floor(roomReward * 0.25)) * state.buffs.essenceMultiplier;
    if (auto > 0) gainEssence(auto);

    const now = Date.now();
    const maxCapacity = state.isEveningRush ? 6 : 3;
    const spawnInterval = getVisitorSpawnInterval();
    if (state.visitors.length < maxCapacity && (now - state.lastVisitorSpawnTime) > spawnInterval) {
        spawnVisitor();
        state.lastVisitorSpawnTime = now;
    }

    // 방송(유튜브) 패시브 수익 계산
    processStreamingRewards();

    if (state.currentTool) {
        state.currentDb = Math.max(30, state.currentDb - 2);
        // 시간이 지남에 따라 안정지수가 서서히 감소 (상호작용 유도)
        state.stability = Math.max(0, state.stability - 1.0);
        updateRecordingUI();
    }
    updateUI();
}

function getVideoTitle(v) {
    if (v.roomId) {
        return t('video_default_title', { room: t(`room_${v.roomId}_name`) });
    }
    return v.title || '';
}

function processStreamingRewards() {
    // 방송(유튜브) 시스템 임시 비활성화 (게임 난이도 조절)
    return;
    // if (!state.videos || state.videos.length === 0) return;

    const stageMultiplier = Math.pow(5, state.stage - 1);
    let totalViewsGained = 0;

    state.videos.forEach(v => {
        const room = ROOMS.find(r => r.id === v.roomId);
        if (!room) return;

        // 방의 등급(rewardBase)과 스테이지에 비례하여 초당 조회수(XP) 증가
        const viewGain = Math.ceil(room.rewardBase * 0.1 * stageMultiplier * state.buffs.xpMultiplier);
        v.views += viewGain;
        totalViewsGained += viewGain;

        // 슈퍼챗(기부금) 확률: 1초마다 영상당 5% 확률
        if (Math.random() < 0.05) {
            const donation = Math.ceil(room.rewardBase * 5 * stageMultiplier * state.buffs.essenceMultiplier);
            v.earnings += donation;
            gainEssence(donation);
            addNotification(t('superchat_alert', { title: getVideoTitle(v), donation: donation.toLocaleString() }), 'superchat');
        }
    });

    if (totalViewsGained > 0) {
        gainXp(totalViewsGained);
    }

    // 방송 탭이 열려있다면 목록 실시간 갱신
    if (document.getElementById('stream-panel').classList.contains('active')) {
        renderVideoList();
    }
}

// --- Streaming (YouTube) UI Logic ---
function renderStreamPanel() {
    if (!el.streamTopicSelect) return;
    el.streamTopicSelect.innerHTML = state.unlockedRooms.map(roomId => {
        const room = ROOMS.find(r => r.id === roomId);
        return `<option value="${roomId}">${room.icon} ${t('room_' + room.id + '_name')}</option>`;
    }).join('');

    if (el.videoCount) el.videoCount.textContent = state.videos.length;
    if (el.videoMax) el.videoMax.textContent = state.level;

    renderVideoList();
}

function uploadVideo() {
    if (!el.streamTopicSelect) return;

    if (state.videos.length >= state.level) {
        addNotification(t('slots_exceeded', { slots: state.level }), 'system');
        return;
    }

    const roomId = el.streamTopicSelect.value;
    const room = ROOMS.find(r => r.id === roomId);
    if (!room) return;

    const video = {
        id: Date.now(),
        roomId: room.id,
        title: `[ASMR] 편안한 ${room.name} 1시간`,
        icon: room.icon,
        views: 0,
        earnings: 0
    };

    if (!state.videos) state.videos = [];
    state.videos.push(video);

    addNotification(t('upload_complete', { title: getVideoTitle(video) }), 'system');
    playChime(1000);

    if (el.videoCount) el.videoCount.textContent = state.videos.length;

    renderVideoList();
    saveGame();
}

function renderVideoList() {
    if (!el.videoList) return;
    if (!state.videos || state.videos.length === 0) {
        el.videoList.innerHTML = `<p style="text-align:center; color:#888;">${t('no_videos_msg')}</p>`;
        return;
    }

    el.videoList.innerHTML = [...state.videos].reverse().map(v => `
        <div class="video-card">
            <div class="video-icon">${v.icon}</div>
            <div class="video-info">
                <div class="video-title">${getVideoTitle(v)}</div>
                <div class="video-stats">
                    <span>${t('views_text', { views: v.views.toLocaleString() })}</span>
                    <span>${t('earnings_text', { earnings: v.earnings.toLocaleString() })}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// --- SNS Review (도감) UI Logic ---
function renderReviewsPanel() {
    const container = document.getElementById('reviews-container');
    if (!container) return;

    let html = '';
    // Iterate through unlocked stages or up to the highest stage achieved
    for (let s = 1; s <= state.highestStage; s++) {
        const stageRooms = ROOMS.filter(r => r.stage === s);
        if (stageRooms.length === 0) continue;

        const isClaimed = state.claimedReviewRewards.includes(s);
        const collectedRooms = stageRooms.filter(r => state.collectedReviews.includes(r.id));
        const isComplete = collectedRooms.length === stageRooms.length;

        html += `
            <div class="review-stage-section">
                <div class="review-stage-title">
                    <span>${s}호점 컬렉션</span>
                    <span style="font-size: 0.9rem;">${collectedRooms.length} / ${stageRooms.length}</span>
                </div>
                <div class="review-grid">
        `;

        stageRooms.forEach(room => {
            const collected = state.collectedReviews.includes(room.id);
            if (collected) {
                html += `
                    <div class="review-card">
                        <div class="review-avatar">👤</div>
                        <div class="review-content">
                            <div class="review-author">익명의 방문객</div>
                            <div class="review-text">"${t('review_' + room.id)}"</div>
                        </div>
                        <div class="review-room-icon">${room.icon}</div>
                    </div>
                `;
            } else {
                html += `
                    <div class="review-card locked">
                        <div class="review-content" style="width: 100%;">
                            <div class="review-text">${t('reviews_unknown')}</div>
                        </div>
                        <div class="review-room-icon">${room.icon}</div>
                    </div>
                `;
            }
        });

        html += `</div>`; // end review-grid

        if (isComplete) {
            if (isClaimed) {
                html += `<div class="reward-claimed-text">${t('reward_claimed')}</div>`;
            } else {
                html += `
                    <div class="claim-reward-container">
                        <button class="reward-btn" onclick="claimReviewReward(${s})">
                            🎁 ${t('claim_reward')} (Stage ${s})
                        </button>
                    </div>
                `;
            }
        }

        html += `</div>`; // end review-stage-section
    }

    container.innerHTML = html;
}

function claimReviewReward(stage) {
    if (state.claimedReviewRewards.includes(stage)) return;

    // Reward calculation based on stage
    const baseEssence = 5000000;
    const essenceReward = baseEssence * Math.pow(5, stage - 1);

    // Give potion_special (or more for higher stages)
    const potionCount = Math.ceil(stage / 2);

    if (!state.inventory['potion_special']) state.inventory['potion_special'] = 0;
    state.inventory['potion_special'] += potionCount;

    gainEssence(essenceReward);
    state.claimedReviewRewards.push(stage);

    addNotification(`도감 완성 보상 획득! 에센스 +${essenceReward.toLocaleString()} / 특수 물약 +${potionCount}`, 'system');
    playChime(880);
    setTimeout(() => playChime(1100), 200);

    renderReviewsPanel();
    saveGame();

    // 화면에 도감 보상 획득 연출 팝업 표시
    showReviewRewardCelebration(stage, essenceReward, potionCount);
}

let rewardModalTimer = null;
function showReviewRewardCelebration(stage, essence, potions) {
    const modal = document.getElementById('reward-celebration-modal');
    const title = document.getElementById('reward-modal-title');
    const subtitle = document.getElementById('reward-modal-subtitle');
    const itemsContainer = document.getElementById('reward-modal-items');

    if (title) title.textContent = `🎉 ${stage}호점 도감 컬렉션 달성!`;
    if (subtitle) subtitle.textContent = `${t('store_branch', { stage })}의 모든 소리 후기를 성공적으로 수집했습니다.`;
    if (itemsContainer) {
        itemsContainer.innerHTML = `
            <div class="reward-item-pill">
                <span class="pill-icon">✨</span>
                <div class="pill-details">
                    <span class="pill-title">정수 (에센스)</span>
                    <span class="pill-amount">+${Math.floor(essence).toLocaleString()}</span>
                </div>
            </div>
            <div class="reward-item-pill">
                <span class="pill-icon">🧪</span>
                <div class="pill-details">
                    <span class="pill-title">기적의 에센스 (특수 물약)</span>
                    <span class="pill-amount">+${potions}개</span>
                </div>
            </div>
        `;
    }

    if (modal) modal.classList.remove('hidden');

    showToast(`🎁 [${stage}호점 도감 보상] 에센스 +${Math.floor(essence).toLocaleString()} & 특수 물약 +${potions}개 획득!`);

    if (rewardModalTimer) clearTimeout(rewardModalTimer);
    rewardModalTimer = setTimeout(() => {
        closeRewardCelebrationModal();
    }, 4500);
}

function closeRewardCelebrationModal() {
    const modal = document.getElementById('reward-celebration-modal');
    if (modal) modal.classList.add('hidden');
    if (rewardModalTimer) clearTimeout(rewardModalTimer);
}


function spawnVisitor() {
    const types = [];
    switch (state.stage) {
        case 1:
            types.push({ nameKey: "visitor_fairy", avatar: "🧚", difficultyKey: "diff_easy", maxStress: 60, rewardEssence: 60, rewardXp: 35 });
            types.push({ nameKey: "visitor_squirrel", avatar: "🐿️", difficultyKey: "diff_medium", maxStress: 400, rewardEssence: 500, rewardXp: 280 });
            types.push({ nameKey: "visitor_bear", avatar: "🧸", difficultyKey: "diff_hard", maxStress: 3000, rewardEssence: 4500, rewardXp: 2500 });
            break;
        case 2:
            types.push({ nameKey: "visitor_leaf_fairy", avatar: "🌿", difficultyKey: "diff_easy", maxStress: 900, rewardEssence: 1000, rewardXp: 600 });
            types.push({ nameKey: "visitor_ghost", avatar: "👻", difficultyKey: "diff_medium", maxStress: 6000, rewardEssence: 8000, rewardXp: 4500 });
            types.push({ nameKey: "visitor_forest_spirit", avatar: "🦌", difficultyKey: "diff_hard", maxStress: 45000, rewardEssence: 70000, rewardXp: 38000 });
            break;
        case 3:
            types.push({ nameKey: "visitor_mermaid", avatar: "🧜‍♀️", difficultyKey: "diff_easy", maxStress: 15000, rewardEssence: 16000, rewardXp: 9500 });
            types.push({ nameKey: "visitor_kraken", avatar: "🦑", difficultyKey: "diff_medium", maxStress: 100000, rewardEssence: 130000, rewardXp: 70000 });
            types.push({ nameKey: "visitor_submarine_spirit", avatar: "⚓", difficultyKey: "diff_hard", maxStress: 750000, rewardEssence: 1100000, rewardXp: 600000 });
            break;
        case 4:
            types.push({ nameKey: "visitor_android", avatar: "🤖", difficultyKey: "diff_easy", maxStress: 250000, rewardEssence: 280000, rewardXp: 160000 });
            types.push({ nameKey: "visitor_bug_ai", avatar: "👾", difficultyKey: "diff_medium", maxStress: 1800000, rewardEssence: 2200000, rewardXp: 1200000 });
            types.push({ nameKey: "visitor_hologram", avatar: "💫", difficultyKey: "diff_hard", maxStress: 14000000, rewardEssence: 20000000, rewardXp: 10000000 });
            break;
        case 5:
            types.push({ nameKey: "visitor_knight", avatar: "🛡️", difficultyKey: "diff_easy", maxStress: 4500000, rewardEssence: 5000000, rewardXp: 3000000 });
            types.push({ nameKey: "visitor_queen", avatar: "👑", difficultyKey: "diff_medium", maxStress: 32000000, rewardEssence: 40000000, rewardXp: 22000000 });
            types.push({ nameKey: "visitor_dragon", avatar: "🐉", difficultyKey: "diff_hard", maxStress: 250000000, rewardEssence: 350000000, rewardXp: 180000000 });
            break;
        case 6:
        default:
            types.push({ nameKey: "visitor_angel", avatar: "👼", difficultyKey: "diff_easy", maxStress: 90000000, rewardEssence: 100000000, rewardXp: 60000000 });
            types.push({ nameKey: "visitor_pegasus", avatar: "🦄", difficultyKey: "diff_medium", maxStress: 650000000, rewardEssence: 800000000, rewardXp: 450000000 });
            types.push({ nameKey: "visitor_god", avatar: "👁️", difficultyKey: "diff_hard", maxStress: 5000000000, rewardEssence: 7000000000, rewardXp: 3800000000 });
            break;
    }

    const currentStageRooms = getRoomsForCurrentStage();
    const unlockedInStageCount = currentStageRooms.filter(r => state.unlockedRooms.includes(r.id)).length;
    const totalInStage = currentStageRooms.length;

    let maxDifficultyIndex = 0; // 0: Easy, 1: Medium, 2: Hard
    if (totalInStage > 0) {
        const progress = unlockedInStageCount / totalInStage;
        if (progress >= 0.3) maxDifficultyIndex = 1;
        if (progress >= 0.7) maxDifficultyIndex = 2;
    }

    // Each types array has 3 elements: [Easy, Medium, Hard]
    const availableTypes = types.slice(0, maxDifficultyIndex + 1);
    const vTemplate = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    const v = { ...vTemplate, id: Date.now(), currentStress: vTemplate.maxStress };

    let severeChanceBoost = 0;
    if (state.activeTemporaryBuffs) {
        state.activeTemporaryBuffs.forEach(b => {
            if (b.type === 'severe_chance') severeChanceBoost += 0.30;
        });
    }
    const currentHour = Math.floor(state.gameTimeMinutes / 60) % 24;
    if (currentHour >= 22 || currentHour < 6) {
        // 심야(22:00 ~ 05:59): 깊은 고민을 안고 찾아오는 정령들 (중증 증상 확률 +25%)
        severeChanceBoost += 0.25;
    }

    const rand = Math.random();
    let cumulative = 0;
    for (const effect of STRESS_EFFECTS) {
        let prob = effect.probability;
        if (severeChanceBoost > 0) {
            if (effect.id === 'severe_dep' || effect.id === 'ptsd') {
                prob += severeChanceBoost / 2;
            } else if (effect.id === 'normal' || effect.id === 'none') {
                prob -= severeChanceBoost / 2;
            }
        }
        prob = Math.max(0, prob);
        cumulative += prob;
        if (rand < cumulative) {
            v.stressEffect = effect;
            break;
        }
    }
    if (!v.stressEffect) v.stressEffect = STRESS_EFFECTS[0];

    state.visitors.push(v);
    addNotification(t('visitor_waiting_alert', { difficulty: getVisitorDifficulty(v), name: getVisitorName(v), avatar: v.avatar }), 'visitor');
    renderVisitors();
}

function renderVisitors() {
    if (!el.visitorList) return;
    let html = state.visitors.map(v => `
        <div class="visitor-card">
            <div class="visitor-avatar">${v.avatar}</div>
            <div class="visitor-info">
                <strong>${getVisitorName(v)} <span class="difficulty-text">(${getVisitorDifficulty(v)})</span></strong>
                ${v.stressEffect && v.stressEffect.id !== 'none' ? `<span class="stress-tag stress-${v.stressEffect.id}">${t(v.stressEffect.nameKey)}</span>` : ''}
                <div class="stress-bar"><div class="stress-fill" style="width: ${(v.currentStress / v.maxStress) * 100}%"></div></div>
            </div>
            <button class="primary-btn treat-btn" onclick="startDirectHealing(${v.id})">${t('treat_button')}</button>
        </div>
    `).join('');

    const currentStageRooms = getRoomsForCurrentStage();
    // 해금 여부를 정확히 판별하기 위해 every 메서드 사용 (모든 현재 스테이지 방이 unlockedRooms에 포함되어 있는지)
    const hasUnlockedAllInStage = currentStageRooms.length > 0 && currentStageRooms.every(r => state.unlockedRooms.includes(r.id));

function getPrestigeRequirements(stage) {
    const costs = {
        1: { essence: 1200000, xp: 350000 },
        2: { essence: 22000000, xp: 6000000 },
        3: { essence: 450000000, xp: 120000000 },
        4: { essence: 8000000000, xp: 2200000000 },
        5: { essence: 160000000000, xp: 45000000000 }
    };
    return costs[stage] || { essence: 1000000000000, xp: 300000000000 };
}

    if (hasUnlockedAllInStage && state.stage < 6) {
        const req = getPrestigeRequirements(state.stage);
        const prestigeCost = req.essence;
        const prestigeXp = req.xp;

        html += `
        <div id="prestige-container">
            <h3>${t('prestige_title', { stage: state.stage + 1 })}</h3>
            <p>${t('prestige_desc1')}</p>
            <p style="color:#ff5555; font-size:0.75rem; margin-bottom:5px;">${t('prestige_desc2')}</p>
            <p style="color:var(--accent-purple);">${t('prestige_req', { costE: prestigeCost.toLocaleString(), costX: prestigeXp.toLocaleString() })}</p>
            <button class="prestige-btn" onclick="doPrestige(${prestigeCost}, ${prestigeXp})">${t('prestige_button', { stage: state.stage + 1 })}</button>
        </div>
        `;
    }

    el.visitorList.innerHTML = html;
}

function startDirectHealing(id) {
    const v = state.visitors.find(vis => vis.id === id);
    if (!v) return;

    if (state.unlockedRooms.length === 0) {
        addNotification(t('insufficient_resources'), 'system');
        return;
    }

    const effectId = (v.stressEffect && v.stressEffect.id) || 'none';
    const rx = PRESCRIPTION_GUIDE[effectId] || PRESCRIPTION_GUIDE['none'];

    const modal = document.getElementById('room-select-modal');
    const header = document.getElementById('room-select-modal-header');
    const list = document.getElementById('modal-room-list');

    if (header) {
        header.innerHTML = `
            <div class="patient-card glass">
                <div class="patient-avatar">${v.avatar}</div>
                <div class="patient-details">
                    <h3>${getVisitorName(v)} <span class="difficulty-text">(${getVisitorDifficulty(v)})</span></h3>
                    <div class="diagnosis-badge">🩺 진단 증상: <strong>${rx.name}</strong></div>
                    <p class="diagnosis-desc">${rx.symptomDesc}</p>
                    <div class="prescription-hint">💡 <strong>맞춤 처방 권장</strong>: ${rx.rxSoundDesc}</div>
                </div>
            </div>
            <div class="room-select-instruction">
                <span>치유를 진행할 ASMR 코너를 선택해 주세요.</span>
                <span class="rx-bonus-tag">✨ 맞춤 처방 코너 선택 시 치유 속도 1.5배 & 완치 보너스!</span>
            </div>
        `;
    }

    let html = '';
    const sortedRooms = [...state.unlockedRooms].sort((a, b) => {
        const indexA = ROOMS.findIndex(r => r.id === a);
        const indexB = ROOMS.findIndex(r => r.id === b);
        return indexA - indexB;
    });

    sortedRooms.forEach(roomId => {
        const room = ROOMS.find(r => r.id === roomId);
        if (room) {
            const isRxMatch = rx.recommendedRooms.includes(room.id);
            html += `
                <button class="upgrade-card ${isRxMatch ? 'rx-recommended' : ''}" style="cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:15px; border:none;" onclick="selectRoomForHealing('${id}', '${room.id}')">
                    ${isRxMatch ? `<span class="rx-match-badge">✨ 맞춤 처방</span>` : ''}
                    <span style="font-size:2rem; margin-bottom:5px;">${room.icon}</span>
                    <span style="font-weight:bold; font-size:0.9rem;">${t('room_' + room.id + '_name')}</span>
                    <span style="font-size:0.7rem; color:${isRxMatch ? '#34d399' : '#888'}; margin-top:3px;">${isRxMatch ? '치유 가속 1.5배' : '일반 치유'}</span>
                </button>
            `;
        }
    });

    list.innerHTML = html;
    modal.classList.remove('hidden');
}

function closeRoomSelectModal() {
    document.getElementById('room-select-modal').classList.add('hidden');
}

window.selectRoomForHealing = function (visitorId, roomId) {
    closeRoomSelectModal();
    const v = state.visitors.find(vis => String(vis.id) === String(visitorId));
    if (!v) return;

    const effectId = (v.stressEffect && v.stressEffect.id) || 'none';
    const rx = PRESCRIPTION_GUIDE[effectId] || PRESCRIPTION_GUIDE['none'];
    const isOptimalRx = rx.recommendedRooms.includes(roomId);

    v.isOptimalRx = isOptimalRx;
    state.activeHealingTarget = v;

    el.healingOverlay.classList.remove('hidden');
    el.healingAvatar.textContent = v.avatar;
    el.healingName.textContent = t('healing_focus_title', { name: getVisitorName(v) });

    const rxBadge = document.getElementById('healing-prescription-badge');
    if (rxBadge) {
        if (isOptimalRx) {
            rxBadge.textContent = '✨ 맞춤 처방 적용 중 (가속 1.5배)';
            rxBadge.className = 'prescription-pill optimal';
            showToast(`✨ [맞춤 처방] ${getVisitorName(v)}의 증상에 딱 맞는 코너입니다! (치유 속도 +50%)`);
        } else {
            rxBadge.textContent = '일반 처방 진행 중';
            rxBadge.className = 'prescription-pill standard';
        }
    }

    const pct = Math.max(0, 100 - (v.currentStress / v.maxStress) * 100);
    el.healingProgressFill.style.width = `${pct}%`;
    el.healingPercent.textContent = `${Math.floor(pct)}%`;

    enterRecordingRoom(roomId);
};

function doPrestige(costE, costX) {
    if (state.essence >= costE && state.xp >= costX) {
        state.highestStage = Math.max(state.highestStage, state.stage + 1);

        // 현재 지점 상태 저장
        if (!state.storeSaves) state.storeSaves = {};
        state.storeSaves[state.stage] = {
            essence: state.essence - costE,
            xp: state.xp - costX,
            level: state.level,
            nextLevelXp: state.nextLevelXp,
            inventory: { ...state.inventory },
            videos: [...state.videos],
            visitors: [...state.visitors],
            activeTemporaryBuffs: [...state.activeTemporaryBuffs],
            upgradesOwned: { ...state.upgradesOwned },
            spirits: { ...state.spirits },
            fireLevel: state.fireLevel
        };

        state.stage++;

        // 프레스티지 시 자원 강제 리셋 로직 (또는 기존 저장된 값 불러오기)
        if (state.storeSaves[state.stage]) {
            const saved = state.storeSaves[state.stage];
            state.essence = saved.essence;
            state.level = saved.level;
            state.xp = saved.xp;
            const expectedXp = calculateNextLevelXp(state.stage, saved.level || 1);
            state.nextLevelXp = (saved.nextLevelXp && saved.nextLevelXp >= expectedXp * 0.5) ? saved.nextLevelXp : expectedXp;
            state.inventory = { ...saved.inventory };
            state.videos = [...saved.videos];
            state.visitors = [...saved.visitors];
            state.activeTemporaryBuffs = [...saved.activeTemporaryBuffs];
            state.upgradesOwned = { incense: 0, mic: 0, book: 0, ...saved.upgradesOwned };
            state.spirits = { wind: 0, water: 0, ...saved.spirits };
            state.fireLevel = saved.fireLevel || 1;
        } else {
            state.essence = 0;
            state.level = 1;
            state.xp = 0;
            state.nextLevelXp = calculateNextLevelXp(state.stage, 1);
            state.inventory = {};
            state.activeTemporaryBuffs = [];
            state.visitors = [];
            state.videos = [];
            state.upgradesOwned = { incense: 0, mic: 0, book: 0 };
            state.spirits = { wind: 0, water: 0 };
            state.fireLevel = 1;
        }

        // 이전 지점들의 방들은 유지하고 새로운 방 1개 추가
        const nextStageRooms = getRoomsForCurrentStage();
        if (nextStageRooms.length > 0 && !state.unlockedRooms.includes(nextStageRooms[0].id)) {
            state.unlockedRooms.push(nextStageRooms[0].id);
        }

        state.activeHealingTarget = null;

        recalculateAllBuffs();
        renderActiveBuffs();

        if (nextStageRooms.length > 0) {
            state.currentTool = nextStageRooms[0].id;
        } else {
            state.currentTool = null;
        }

        if (state.visitors.length === 0) spawnVisitor();

        addNotification(t('save_load_prestige', { stage: state.stage }), 'system');
        playChime(1300);
        updateStoreSelector();
        applyStageVisuals();
        renderRoomList();
        renderVisitors();

        if (document.getElementById('stream-panel').classList.contains('active')) {
            renderStreamPanel();
        }

        updateUI();
        updateGameClockDisplay();
        saveGame();
    } else {
        addNotification(t('insufficient_resources'), "system");
    }
}

// --- Store Navigation ---
function updateStoreSelector() {
    const sel = document.getElementById('store-selector');
    if (!sel) return;
    let html = '';
    const maxStages = 6;
    for (let i = 1; i <= maxStages; i++) {
        if (i <= state.highestStage) {
            html += `<option value="${i}" ${i === state.stage ? 'selected' : ''}>${t('store_branch', { stage: i })}</option>`;
        } else {
            html += `<option value="${i}" disabled>${t('store_selector_locked', { stage: i })}</option>`;
        }
    }
    sel.innerHTML = html;
}

function changeStage(newStage) {
    newStage = parseInt(newStage);
    if (newStage > state.highestStage || newStage < 1 || newStage === state.stage) return;

    // 현재 지점 상태 저장
    if (!state.storeSaves) state.storeSaves = {};
    state.storeSaves[state.stage] = {
        essence: state.essence,
        xp: state.xp,
        level: state.level,
        nextLevelXp: state.nextLevelXp,
        inventory: { ...state.inventory },
        videos: [...state.videos],
        visitors: [...state.visitors],
        activeTemporaryBuffs: [...(state.activeTemporaryBuffs || [])],
        upgradesOwned: { ...state.upgradesOwned },
        spirits: { ...state.spirits },
        fireLevel: state.fireLevel
    };

    state.stage = newStage;
    state.activeHealingTarget = null;

    // 가게 이동 시 초기화 (이전 저장된 값 불러오기)
    if (state.storeSaves[state.stage]) {
        const saved = state.storeSaves[state.stage];
        state.essence = saved.essence;
        state.level = saved.level;
        state.xp = saved.xp;
        const expectedXp = calculateNextLevelXp(state.stage, saved.level || 1);
        state.nextLevelXp = (saved.nextLevelXp && saved.nextLevelXp >= expectedXp * 0.5) ? saved.nextLevelXp : expectedXp;
        state.inventory = { ...saved.inventory };
        state.videos = [...saved.videos];
        state.visitors = [...saved.visitors];
        state.activeTemporaryBuffs = [...saved.activeTemporaryBuffs];
        state.upgradesOwned = { incense: 0, mic: 0, book: 0, ...saved.upgradesOwned };
        state.spirits = { wind: 0, water: 0, ...saved.spirits };
        state.fireLevel = saved.fireLevel || 1;
    } else {
        state.essence = 0;
        state.xp = 0;
        state.level = 1;
        state.nextLevelXp = calculateNextLevelXp(state.stage, 1);
        state.videos = [];
        state.visitors = [];
        state.inventory = {};
        state.activeTemporaryBuffs = [];
        state.upgradesOwned = { incense: 0, mic: 0, book: 0 };
        state.spirits = { wind: 0, water: 0 };
        state.fireLevel = 1;
    }

    state.buffs = { essenceMultiplier: 1.0, xpMultiplier: 1.0, healSpeedMultiplier: 1.0 };
    recalculateAllBuffs();

    const currentStageRooms = getRoomsForCurrentStage();
    const firstUnlocked = currentStageRooms.find(r => state.unlockedRooms.includes(r.id));
    if (firstUnlocked) {
        state.currentTool = firstUnlocked.id;
    } else {
        state.currentTool = null;
    }

    if (state.visitors.length === 0) spawnVisitor();

    applyStageVisuals();
    renderRoomList();
    renderVisitors();
    if (document.getElementById('stream-panel').classList.contains('active')) {
        renderStreamPanel();
    }
    updateUI();
    updateGameClockDisplay();
    saveGame(true);
    addNotification(`✨ 에테르노아 ${state.stage}호점으로 이동했습니다. 이전 자원과 버프가 초기화되었습니다.`, 'system');
}

// --- Settings ---
function applySettingsToDOM() {
    const bgmVs = document.getElementById('bgm-volume-slider');
    const sfxVs = document.getElementById('sfx-volume-slider');
    const vs = document.getElementById('volume-slider');
    const ast = document.getElementById('autosave-toggle');
    const gs = document.getElementById('graphics-select');
    const ls = document.getElementById('language-select');
    const im = document.getElementById('interaction-mode');
    const dmt = document.getElementById('devmode-toggle');

    if (bgmVs && state.settings.bgmVolume !== undefined) bgmVs.value = state.settings.bgmVolume;
    else if (bgmVs && state.settings.volume !== undefined) bgmVs.value = state.settings.volume;

    if (sfxVs && state.settings.sfxVolume !== undefined) sfxVs.value = state.settings.sfxVolume;
    else if (sfxVs && state.settings.volume !== undefined) sfxVs.value = state.settings.volume;

    if (vs && state.settings.volume !== undefined) vs.value = state.settings.volume;
    if (ast && state.settings.autoSave !== undefined) ast.checked = state.settings.autoSave;
    if (gs && state.settings.graphics) gs.value = state.settings.graphics;
    if (ls && state.settings.language) ls.value = state.settings.language;
    if (im && state.settings.interactionMode) im.value = state.settings.interactionMode;
    if (dmt) {
        dmt.checked = !!state.settings.devMode;
        const panel = document.getElementById('devmode-panel');
        if (panel) panel.style.display = state.settings.devMode ? 'flex' : 'none';
        if (state.settings.devMode) startDevDiagnosticsLoop();
    }

    applySettings();
}

function applySettings() {
    const bgmVs = document.getElementById('bgm-volume-slider');
    const sfxVs = document.getElementById('sfx-volume-slider');
    const vs = document.getElementById('volume-slider');
    const ast = document.getElementById('autosave-toggle');
    const gs = document.getElementById('graphics-select');
    const ls = document.getElementById('language-select');

    if (bgmVs) {
        state.settings.bgmVolume = parseInt(bgmVs.value);
        const screenId = document.querySelector('.screen.active') ? document.querySelector('.screen.active').id.replace('screen-', '') : '';
        updateBgmVolume(screenId);
    }

    if (sfxVs) {
        state.settings.sfxVolume = parseInt(sfxVs.value);
        masterGain.gain.value = state.settings.sfxVolume / 100;
    }

    if (vs) {
        state.settings.volume = parseInt(vs.value);
        if (!bgmVs) {
            const screenId = document.querySelector('.screen.active') ? document.querySelector('.screen.active').id.replace('screen-', '') : '';
            updateBgmVolume(screenId);
        }
        if (!sfxVs) {
            masterGain.gain.value = state.settings.volume / 100;
        }
    }

    const im = document.getElementById('interaction-mode');
    if (im) {
        const oldMode = state.settings.interactionMode;
        state.settings.interactionMode = im.value;
        if (oldMode !== state.settings.interactionMode) {
            handleInteractionModeChange();
        }
    }

    if (ast) {
        if (state.settings.autoSave !== ast.checked) autoSaveChanged = true;
        state.settings.autoSave = ast.checked;
    }
    if (gs) {
        state.settings.graphics = gs.value;
        if (state.settings.graphics === 'low') {
            document.body.classList.add('low-graphics');
        } else {
            document.body.classList.remove('low-graphics');
        }
    }
    if (ls) {
        state.settings.language = ls.value;
    }

    saveSettingsOnly();

    if (state.settings.autoSave) {
        saveGame(true);
    }
}

function saveSettingsOnly() {
    let savedState = {};
    const s = localStorage.getItem('etheria_tycoon_v12');
    if (s) {
        try {
            savedState = JSON.parse(s);
        } catch (e) {
            savedState = {};
        }
    }
    savedState.settings = state.settings;
    localStorage.setItem('etheria_tycoon_v12', JSON.stringify(savedState));
}

function manualSave() {
    saveGame(true);
    addNotification(t('game_saved_manual'), "system");
}

function applyStageVisuals() {
    el.guardianName.textContent = t('store_branch', { stage: state.stage });
    document.body.dataset.stage = state.stage;
    playStageBgm(state.stage);
}

// --- Shop & Buffs ---
function getMaxUpgradeLevel() {
    // 스테이지별 해금 요소 가격(기하급수적 증가)과 밸런스를 고려한 수학적 상한선
    return Math.floor(20 * Math.pow(3.5, state.stage - 1)); 
}

function getStageBaseScale(stage = state.stage) {
    const scales = { 1: 1, 2: 15, 3: 250, 4: 4000, 5: 75000, 6: 1500000 };
    return scales[stage] || 1;
}

function getUpgradeBaseCost(id, stage = state.stage) {
    const scale = getStageBaseScale(stage);
    if (id === 'wind') return 100 * scale;
    if (id === 'incense') return 250 * scale;
    if (id === 'mic') return 500 * scale;
    if (id === 'book') return 500 * scale;
    return 200 * scale;
}

function renderUpgrades() {
    const items = [
        { id: 'wind', name: t('upgrade_wind_name'), type: 'auto', cost: getUpgradeBaseCost('wind') * (state.spirits.wind + 1), icon: '🍃', desc: t('upgrade_wind_desc') },
        { id: 'incense', name: t('upgrade_incense_name'), type: 'buff', cost: getUpgradeBaseCost('incense') * (state.upgradesOwned.incense + 1), icon: '🕯️', desc: t('upgrade_incense_desc') },
        { id: 'mic', name: t('upgrade_mic_name'), type: 'buff', cost: getUpgradeBaseCost('mic') * (state.upgradesOwned.mic + 1), icon: '🎤', desc: t('upgrade_mic_desc') },
        { id: 'book', name: t('upgrade_book_name'), type: 'buff', cost: getUpgradeBaseCost('book') * (state.upgradesOwned.book + 1), icon: '📖', desc: t('upgrade_book_desc') }
    ];
    document.getElementById('upgrade-items').innerHTML = items.map(i => {
        let currentL = i.type === 'auto' ? state.spirits.wind : state.upgradesOwned[i.id];
        let maxL = getMaxUpgradeLevel();
        let isMax = currentL >= maxL;
        let levelText = isMax ? 'MAX' : `LV.${currentL}`;

        let buy1Btn = isMax 
            ? `<button class="primary-btn" disabled style="font-size: 0.8rem; padding: 6px 12px; background: gray;">MAX</button>` 
            : `<button class="primary-btn" onclick="buyUpgrade('${i.id}', '${i.type}', ${i.cost})" style="font-size: 0.8rem; padding: 6px 12px;">✨ ${i.cost.toLocaleString()}</button>`;
        
        let maxBtn = isMax 
            ? '' 
            : `<button class="primary-btn max-btn" onclick="buyMaxUpgrade('${i.id}', '${i.type}')" style="background: linear-gradient(135deg, var(--accent-emerald), #27ae60); color: #000; font-size: 0.75rem; padding: 4px 10px; font-weight: bold;">${t('upgrade_max')}</button>`;

        return `
        <div class="upgrade-card">
            <div><strong>${i.icon} ${i.name}</strong> <span class="difficulty-text">${levelText}</span><br><div class="upgrade-desc">${i.desc}</div></div>
            <div class="upgrade-actions" style="display: flex; flex-direction: column; gap: 6px; align-items: stretch; min-width: 120px;">
                ${buy1Btn}
                ${maxBtn}
            </div>
        </div>
        `;
    }).join('');
    renderSecretShop();
}

function buyUpgrade(id, type, cost) {
    let currentL = type === 'auto' ? state.spirits.wind : state.upgradesOwned[id];
    if (currentL >= getMaxUpgradeLevel()) {
        addNotification('이미 최대 레벨입니다.', 'system');
        return;
    }

    if (state.essence >= cost) {
        state.essence -= cost;
        if (type === 'auto') state.spirits.wind++;
        else if (type === 'buff') {
            state.upgradesOwned[id]++;
            recalculateAllBuffs();
        }
        addNotification(t('upgrade_complete_alert'), 'system'); renderUpgrades(); updateUI(); saveGame();
    } else addNotification(t('insufficient_essence'), 'system');
}

function buyMaxUpgrade(id, type) {
    let base = getUpgradeBaseCost(id);
    let currentL = type === 'auto' ? state.spirits.wind : (state.upgradesOwned[id] || 0);

    let a = base / 2;
    let b = base * (currentL + 0.5);
    let c = -state.essence;

    let k = Math.floor((-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a));
    if (k <= 0) {
        addNotification(t('insufficient_essence'), 'system');
        return;
    }

    let maxAllowed = getMaxUpgradeLevel() - currentL;
    if (k > maxAllowed) k = maxAllowed;
    if (k <= 0) {
        addNotification('이미 최대 레벨입니다.', 'system');
        return;
    }

    let totalCost = base * (k * currentL + (k * (k + 1)) / 2);
    if (totalCost > state.essence) {
        k--;
        totalCost = base * (k * currentL + (k * (k + 1)) / 2);
    }

    if (k > 0) {
        state.essence -= totalCost;
        if (type === 'auto') {
            state.spirits.wind += k;
        } else if (type === 'buff') {
            state.upgradesOwned[id] += k;
            recalculateAllBuffs();
        }
        addNotification(t('upgrade_complete_alert') + ` (+${k})`, 'system');
        renderUpgrades();
        updateUI();
        saveGame();
    } else {
        addNotification(t('insufficient_essence'), 'system');
    }
}

function resetState() {
    state.essence = 0;
    state.level = 1;
    state.xp = 0;
    state.nextLevelXp = calculateNextLevelXp(1, 1);
    state.stability = 80;
    state.currentDb = 35;
    state.spirits = { wind: 0, water: 0 };
    state.currentTool = null;
    state.visitors = [];
    state.unlockedRooms = ['crystal'];
    state.videos = [];
    state.notifications = [];
    state.unreadNotifs = 0;
    state.highestStage = 1;
    state.buffs = {
        healSpeedMultiplier: 1.0,
        essenceMultiplier: 1.0,
        xpMultiplier: 1.0
    };
    state.upgradesOwned = { incense: 0, mic: 0, book: 0 };
    state.inventory = {};
    state.activeTemporaryBuffs = [];
    state.activeHealingTarget = null;
    state.stage = 1;
    state.lastVisitorSpawnTime = Date.now();

    localStorage.removeItem('etheria_tycoon_v12');
    saveSettingsOnly();
}

function toggleAutoHeal() {
    if (autoHealInterval) {
        stopAutoHeal();
    } else {
        startAutoHeal();
    }
}

function startAutoHeal() {
    if (autoHealInterval) return;
    const btn = document.getElementById('auto-heal-btn');
    if (btn) {
        btn.textContent = t('auto_heal_active');
        btn.classList.add('active');
        btn.style.background = "linear-gradient(135deg, #ff5555, #ff3333)";
    }

    autoHealInterval = setInterval(() => {
        if (!state.activeHealingTarget || !state.currentTool) {
            stopAutoHeal();
            return;
        }

        const originalInteracting = isInteracting;
        const originalLastTime = lastInteractionTime;

        lastInteractionTime = 0;
        isInteracting = true;

        handleInteraction(null, 'click');

        isInteracting = originalInteracting;
    }, 700);
}

function stopAutoHeal() {
    if (autoHealInterval) {
        clearInterval(autoHealInterval);
        autoHealInterval = null;
    }
    const btn = document.getElementById('auto-heal-btn');
    if (btn) {
        btn.textContent = t('auto_heal_button');
        btn.classList.remove('active');
        btn.style.background = "linear-gradient(135deg, var(--accent-gold), #ffaa00)";
    }
}

// --- 패널 ---
function closePanel() { el.panelContainer.classList.remove('open'); el.tabs.forEach(b => b.classList.remove('active')); }
function switchTab(tid) {
    if (document.getElementById(`${tid}-panel`).classList.contains('active') && el.panelContainer.classList.contains('open')) { closePanel(); return; }
    el.tabs.forEach(b => b.classList.toggle('active', b.dataset.tab === tid));
    el.panels.forEach(p => p.classList.toggle('active', p.id === `${tid}-panel`));
    el.panelContainer.classList.add('open');
    if (tid === 'manage') renderVisitors();
    if (tid === 'inventory') renderInventory();
    if (tid === 'upgrade') renderUpgrades();
    if (tid === 'stream') renderStreamPanel();
    if (tid === 'reviews') {
        state.unreadReviews = 0;
        updateReviewBadge();
        renderReviewsPanel();
    }
    if (tid === 'settings') applySettingsToDOM();
}

function updateReviewBadge() {
    const badge = document.getElementById('reviews-badge');
    if (!badge) return;
    if (state.unreadReviews > 0) {
        badge.textContent = state.unreadReviews;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function applyDynamicFontSize(element, text, baseSize, shrinkThreshold, shrinkRate, minSize = 0.5) {
    if (!element) return;
    element.textContent = text;
    const len = text.length;
    let size = baseSize;
    if (len > shrinkThreshold) {
        size = Math.max(minSize, baseSize - (len - shrinkThreshold) * shrinkRate);
    }
    element.style.fontSize = `${size}rem`;
}

function updateUI() {
    if (el.essence) applyDynamicFontSize(el.essence, Math.floor(state.essence).toLocaleString(), 1.0, 8, 0.05, 0.6);
    if (el.shopEssence) applyDynamicFontSize(el.shopEssence, Math.floor(state.essence).toLocaleString(), 1.0, 8, 0.05, 0.6);
    if (el.level) el.level.textContent = `LV.${state.level}`;
    if (el.xpNumeric) applyDynamicFontSize(el.xpNumeric, `${Math.floor(state.xp).toLocaleString()} / ${state.nextLevelXp.toLocaleString()} XP`, 0.9, 15, 0.03, 0.5);
    if (!state.currentTool) renderRoomList();
}

function updateRecordingUI() {
    if (el.stabilityMeter) el.stabilityMeter.style.width = `${state.stability}%`;
    if (el.dbText) el.dbText.textContent = `${Math.floor(state.currentDb)} dB`;
    if (el.dbNeedle) el.dbNeedle.style.transform = `rotate(${(state.currentDb - 30) * 5}deg)`;
    if (el.xpBar) el.xpBar.style.width = `${(state.xp / state.nextLevelXp) * 100}%`;

    const recordingLevelText = document.getElementById('recording-level-text');
    if (recordingLevelText) recordingLevelText.textContent = `LV.${state.level}`;
}

function gainEssence(a) { state.essence += a; updateUI(); }
function gainXp(a) {
    state.xp += a;
    if (state.xp >= state.nextLevelXp) levelUp();
    if (state.currentTool) updateRecordingUI();
    updateUI();
}
let levelUpTimeout = null;

function levelUp() {
    state.level++;
    state.xp = Math.max(0, state.xp - state.nextLevelXp);
    state.nextLevelXp = calculateNextLevelXp(state.stage || 1, state.level);
    playChime(880);
    addNotification(t('level_up_alert', { level: state.level }), 'system');

    const anim = document.getElementById('levelup-overlay');
    const levelText = document.getElementById('levelup-level');
    if (anim && levelText) {
        levelText.textContent = `LV.${state.level}`;
        anim.classList.remove('hidden');
        if (levelUpTimeout) clearTimeout(levelUpTimeout);
        levelUpTimeout = setTimeout(() => anim.classList.add('hidden'), 2000);
    }

    renderRoomList();
    saveGame();
}

function createParticle(x, y, t) { const p = document.createElement('div'); p.className = 'particle-text'; p.textContent = t; p.style.left = `${x}px`; p.style.top = `${y}px`; document.body.appendChild(p); setTimeout(() => p.remove(), 1000); }

// --- Notification Center ---
function addNotification(msg, type = 'system') {
    const timeStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    state.notifications.unshift({ id: Date.now(), text: msg, type: type, time: timeStr });
    if (state.notifications.length > 50) state.notifications.pop(); // 50개 유지

    if (!el.notifPanel.classList.contains('open')) {
        state.unreadNotifs++;
        updateNotifBadge();
    }
    renderNotifications();

    if (type === 'visitor') showToast(msg);
}

// 화면 팝업 알림 (손님용)
function showToast(m) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = m;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add('fade-out'); setTimeout(() => toast.remove(), 500); }, 3000);
}

function toggleNotifications() {
    el.notifPanel.classList.toggle('open');
    if (el.notifPanel.classList.contains('open')) {
        state.unreadNotifs = 0;
        updateNotifBadge();
    }
}

function clearNotifications() {
    state.notifications = [];
    renderNotifications();
}

function updateNotifBadge() {
    if (state.unreadNotifs > 0) {
        el.notifBadge.textContent = state.unreadNotifs;
        el.notifBadge.classList.remove('hidden');
    } else {
        el.notifBadge.classList.add('hidden');
    }
}

function renderNotifications() {
    if (!el.notifList) return;
    if (state.notifications.length === 0) {
        el.notifList.innerHTML = `<p style="text-align:center; color:#888; font-size:0.8rem;">${t('no_unread_notifs')}</p>`;
        return;
    }
    el.notifList.innerHTML = state.notifications.map(n => `
        <div class="notif-card type-${n.type}">
            ${n.text}
            <span class="notif-time">${n.time}</span>
        </div>
    `).join('');
}

function saveGame(force = false) {
    if (!state.settings.autoSave && !force) return;
    localStorage.setItem('etheria_tycoon_v12', JSON.stringify(state));
}
function loadGame() {
    const s = localStorage.getItem('etheria_tycoon_v12');
    if (s) {
        try {
            const parsed = JSON.parse(s);
            Object.assign(state, parsed);
            if (parsed.settings) {
                state.settings = { ...state.settings, ...parsed.settings };
            }
            if (state.currentTool === 'bamboo') state.currentTool = 'singingbowl';
            if (state.unlockedTools) state.unlockedTools = state.unlockedTools.map(t => t === 'bamboo' ? 'singingbowl' : t);
            if (state.unlockedRooms) state.unlockedRooms = state.unlockedRooms.map(t => t === 'bamboo' ? 'singingbowl' : t);
            if (state.videos) {
                state.videos.forEach(v => {
                    if (v.roomId === 'bamboo') v.roomId = 'singingbowl';
                });
            }
        } catch (e) {
            console.error("Failed to parse save game:", e);
        }
    }

    if (!state.stage) state.stage = 1;
    if (!state.highestStage) state.highestStage = state.stage || 1;
    if (!state.videos) state.videos = [];
    if (!state.notifications) state.notifications = [];
    if (!state.inventory) state.inventory = {};
    if (!state.collectedReviews) state.collectedReviews = [];
    if (!state.claimedReviewRewards) state.claimedReviewRewards = [];
    if (state.unreadReviews === undefined) state.unreadReviews = 0;
    if (!state.activeTemporaryBuffs) state.activeTemporaryBuffs = [];
    recalculateAllBuffs();
    if (!state.settings) state.settings = { bgmVolume: 50, sfxVolume: 50, volume: 50, autoSave: false, graphics: 'high', language: 'ko' };
    if (state.settings.bgmVolume === undefined) state.settings.bgmVolume = state.settings.volume !== undefined ? state.settings.volume : 50;
    if (state.settings.sfxVolume === undefined) state.settings.sfxVolume = state.settings.volume !== undefined ? state.settings.volume : 50;
    const expectedXp = calculateNextLevelXp(state.stage || 1, state.level || 1);
    if (!state.nextLevelXp || state.nextLevelXp < expectedXp * 0.5) {
        state.nextLevelXp = expectedXp;
    }
    if (state.storeSaves) {
        Object.keys(state.storeSaves).forEach(stg => {
            const sSave = state.storeSaves[stg];
            const sExp = calculateNextLevelXp(parseInt(stg), sSave.level || 1);
            if (!sSave.nextLevelXp || sSave.nextLevelXp < sExp * 0.5) {
                sSave.nextLevelXp = sExp;
            }
        });
    }
    if (!state.visitors || state.visitors.length === 0) {
        state.visitors = [];
        spawnVisitor();
    }
    if (state.gameTimeMinutes === undefined || isNaN(state.gameTimeMinutes)) {
        state.gameTimeMinutes = 480; // 기본 08:00 (오전 8시)
    }
    state.isEveningRush = false;
    masterGain.gain.value = state.settings.sfxVolume / 100;
    state.unreadNotifs = 0;
    updateNotifBadge();
    renderNotifications();
}

let currentTutorialSlide = 1;
const totalTutorialSlides = 3;

function showTutorial(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    if (typeof audioCtx !== 'undefined' && audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(err => {});
    }
    currentTutorialSlide = 1;
    updateTutorialView();
    const modal = document.getElementById('tutorial-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }
}

function hideTutorial(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    const modal = document.getElementById('tutorial-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
}

function startFromTutorial(e) {
    hideTutorial(e);
    startGame();
}

function changeTutorialSlide(dir) {
    currentTutorialSlide += dir;
    if (currentTutorialSlide < 1) currentTutorialSlide = 1;
    if (currentTutorialSlide > totalTutorialSlides) currentTutorialSlide = totalTutorialSlides;
    updateTutorialView();
}

function updateTutorialView() {
    for (let i = 1; i <= totalTutorialSlides; i++) {
        const slide = document.getElementById(`tutorial-slide-${i}`);
        if (slide) {
            if (i === currentTutorialSlide) slide.classList.remove('hidden');
            else slide.classList.add('hidden');
        }
    }

    const prevBtn = document.getElementById('tutorial-prev');
    const nextBtn = document.getElementById('tutorial-next');

    if (prevBtn) prevBtn.style.visibility = (currentTutorialSlide === 1) ? 'hidden' : 'visible';
    if (nextBtn) nextBtn.style.visibility = (currentTutorialSlide === totalTutorialSlides) ? 'hidden' : 'visible';

    const dots = document.querySelectorAll('#tutorial-dots .dot');
    dots.forEach((dot, index) => {
        if (index + 1 === currentTutorialSlide) {
            dot.style.backgroundColor = 'var(--accent-gold)';
        } else {
            dot.style.backgroundColor = 'rgba(255,255,255,0.3)';
        }
    });
}

// --- Developer Mode Toolkit ---
let devDiagInterval = null;

function toggleDevMode(forcedState) {
    const checkbox = document.getElementById('devmode-toggle');
    const panel = document.getElementById('devmode-panel');
    
    let targetState = forcedState !== undefined ? forcedState : (checkbox ? checkbox.checked : false);
    
    // 개발자 모드를 켤 때: 만약 기존 백업이 없으면 현재의 순수 게임 데이터를 백업
    if (targetState && !localStorage.getItem('etheria_dev_backup')) {
        const cleanCopy = { ...state };
        delete cleanCopy.settings;
        localStorage.setItem('etheria_dev_backup', JSON.stringify(cleanCopy));
    }
    
    state.settings.devMode = targetState;
    if (checkbox) checkbox.checked = !!targetState;
    if (panel) panel.style.display = targetState ? 'flex' : 'none';
    
    if (targetState) {
        startDevDiagnosticsLoop();
        addNotification("🛠️ 개발자 모드가 활성화되었습니다. (원본 세이브가 백업됨)", "system");
    } else {
        if (devDiagInterval) {
            clearInterval(devDiagInterval);
            devDiagInterval = null;
        }
        devResetAllData();
    }
}

function devResetAllData() {
    const backup = localStorage.getItem('etheria_dev_backup');
    if (backup) {
        try {
            const restoredState = JSON.parse(backup);
            const savedSettings = { ...state.settings, devMode: false };
            Object.assign(state, restoredState);
            state.settings = savedSettings;
            localStorage.removeItem('etheria_dev_backup');
            saveGame(true);
            
            applySettingsToDOM();
            applyLanguage();
            applyStageVisuals();
            updateStoreSelector();
            renderRoomList();
            renderUpgrades();
            updateUI();
            addNotification("🧹 개발자 모드가 꺼지면서 테스트 이전의 원본 게임 데이터로 복원되었습니다!", "system");
            return;
        } catch (e) {
            console.error("Backup restoration failed:", e);
        }
    }
    
    // 백업이 없을 경우 안전하게 상태 초기화
    resetState();
    state.settings.devMode = false;
    saveGame(true);
    applySettingsToDOM();
    applyLanguage();
    applyStageVisuals();
    updateStoreSelector();
    renderRoomList();
    renderUpgrades();
    updateUI();
    addNotification("🧹 누적된 개발자 테스트 데이터가 초기화되었습니다!", "system");
}

function startDevDiagnosticsLoop() {
    if (devDiagInterval) clearInterval(devDiagInterval);
    updateDevDiagnostics();
    devDiagInterval = setInterval(updateDevDiagnostics, 1000);
}

function updateDevDiagnostics() {
    const diagEl = document.getElementById('dev-diag-info');
    if (!diagEl) return;
    
    const bgmAudio = document.getElementById('bgm');
    const activeScreen = document.querySelector('.screen.active') ? document.querySelector('.screen.active').id : 'unknown';
    
    let audioState = 'N/A';
    let sampleRate = 'N/A';
    if (typeof audioCtx !== 'undefined' && audioCtx) {
        audioState = audioCtx.state;
        sampleRate = audioCtx.sampleRate + ' Hz';
    }
    
    let bgmInfo = 'Playing';
    if (bgmAudio) {
        bgmInfo = `${bgmAudio.paused ? 'Paused' : 'Playing'} (Vol: ${Math.round(bgmAudio.volume * 100)}%)`;
    }
    
    const unlockedCount = state.unlockedRooms ? state.unlockedRooms.length : 0;
    const currentToolName = state.currentTool || 'None';
    
    diagEl.innerHTML = `
        <div>[Audio Engine] Status: <b>${audioState}</b> | Rate: <b>${sampleRate}</b></div>
        <div>[BGM State] Status: <b>${bgmInfo}</b> | Stage BGM Vol: <b>${state.settings.bgmVolume ?? 50}%</b></div>
        <div>[SFX Master] Gain: <b>${state.settings.sfxVolume ?? 50}%</b> | Master Gain Node: <b>${(masterGain.gain.value * 100).toFixed(0)}%</b></div>
        <div>[Game State] Stage: <b>${state.stage}호점 (${t('store_branch', {stage: state.stage})})</b> | Level: <b>${state.level}</b></div>
        <div>[Active Workspace] Tool: <b>${currentToolName}</b> | Active Screen: <b>${activeScreen}</b></div>
        <div>[Unlocks & Visitors] Unlocked Corners: <b>${unlockedCount}/${ROOMS.length}</b> | Visitors: <b>${state.visitors ? state.visitors.length : 0}</b></div>
    `;
}

function devAddResources() {
    state.essence = (state.essence || 0) + 10000000000;
    state.xp = (state.xp || 0) + 100000000;
    updateUI();
    saveGame(true);
    addNotification("💰 [개발자 모드] +100억 에센스 & +1억 XP가 지급되었습니다!", "system");
}

function devUnlockAllStages() {
    state.unlockedRooms = ROOMS.map(r => r.id);
    state.highestStage = 6;
    updateStoreSelector();
    renderRoomList();
    applyStageVisuals();
    updateUI();
    saveGame(true);
    addNotification("🔓 [개발자 모드] 1~6호점 모든 코너와 지점이 즉시 해금되었습니다!", "system");
}

function devMaxAllRooms() {
    const maxLvl = getMaxUpgradeLevel();
    ROOMS.filter(r => r.stage === state.stage).forEach(r => {
        state.roomLevels[r.id] = maxLvl;
    });
    renderRoomList();
    updateUI();
    saveGame(true);
    addNotification(`⚡ [개발자 모드] ${state.stage}호점 모든 코너가 최고 레벨(${maxLvl})로 강화되었습니다!`, "system");
}

function devSpawnVisitor() {
    if (typeof spawnVisitor === 'function') {
        spawnVisitor();
        renderVisitors();
        addNotification("🧑‍🤝‍🧑 [개발자 모드] 새로운 치유 손님이 즉시 소환되었습니다!", "system");
    }
}

function devResetBgm() {
    if (typeof audioCtx !== 'undefined' && audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    if (typeof playStageBgm === 'function') {
        playStageBgm(state.stage);
    }
    const screenId = document.querySelector('.screen.active') ? document.querySelector('.screen.active').id.replace('screen-', '') : '';
    if (typeof updateBgmVolume === 'function') {
        updateBgmVolume(screenId);
    }
    addNotification("🎵 [개발자 모드] BGM 엔진 및 오디오 세션이 재초기화 되었습니다.", "system");
}

// --- 1시간 주기 비밀 보물상점 ---
function checkSecretShopRotation() {
    const now = Date.now();
    
    if (!state.secretShopResetTime || now >= state.secretShopResetTime || !state.secretShopStock || state.secretShopStock.length === 0) {
        state.secretShopResetTime = now + (3600 * 1000); // 1시간 (3600초) 후 교체
        
        // 셔플하여 3개 선택
        const shuffled = [...SECRET_SHOP_ITEMS_POOL].sort(() => Math.random() - 0.5);
        const stageMultiplier = Math.pow(3.5, (state.stage || 1) - 1);
        
        state.secretShopStock = shuffled.slice(0, 3).map(item => ({
            ...item,
            purchased: false,
            cost: Math.floor(item.baseCost * stageMultiplier)
        }));
        saveGame();
    }
    
    // 타이머 갱신
    const timerEl = document.getElementById('secret-shop-timer');
    if (timerEl) {
        const remMs = Math.max(0, state.secretShopResetTime - now);
        const mins = Math.floor(remMs / 60000);
        const secs = Math.floor((remMs % 60000) / 1000);
        timerEl.textContent = `⏱️ 재고 교체까지: ${mins}분 ${secs < 10 ? '0' : ''}${secs}초`;
    }
}

function renderSecretShop() {
    const container = document.getElementById('secret-shop-items');
    if (!container) return;
    
    checkSecretShopRotation();
    
    if (!state.secretShopStock || state.secretShopStock.length === 0) {
        container.innerHTML = '<div style="color:#aaa; font-size:0.85rem;">재고를 불러오는 중입니다...</div>';
        return;
    }
    
    container.innerHTML = state.secretShopStock.map((item, idx) => {
        const isEssence = item.costType === 'essence';
        const costSymbol = isEssence ? '✨' : '⭐';
        const currencyText = isEssence ? '에센스' : 'XP';
        
        let buyBtn = item.purchased
            ? `<button class="primary-btn" disabled style="font-size: 0.8rem; padding: 6px 12px; background: gray;">품절 (COMPLETED)</button>`
            : `<button class="primary-btn" onclick="buySecretShopItem(${idx})" style="font-size: 0.8rem; padding: 6px 12px; background: linear-gradient(135deg, #00ffcc, #00b894); color:#000; font-weight:bold;">${costSymbol} ${item.cost.toLocaleString()} ${currencyText}</button>`;
            
        return `
        <div class="upgrade-card" style="border: 1px solid rgba(0,255,204,0.3); background: rgba(0, 255, 204, 0.03);">
            <div><strong>${item.icon} ${item.name}</strong> <span class="difficulty-text" style="color:#00ffcc;">[한정 특가]</span><br><div class="upgrade-desc">${item.desc}</div></div>
            <div class="upgrade-actions" style="display: flex; flex-direction: column; gap: 6px; align-items: stretch; min-width: 130px;">
                ${buyBtn}
            </div>
        </div>
        `;
    }).join('');
}

function buySecretShopItem(index) {
    if (!state.secretShopStock || !state.secretShopStock[index]) return;
    const item = state.secretShopStock[index];
    if (item.purchased) {
        addNotification('이미 구매를 완료한 상품입니다.', 'system');
        return;
    }
    
    const isEssence = item.costType === 'essence';
    const currentBalance = isEssence ? state.essence : state.xp;
    
    if (currentBalance >= item.cost) {
        if (isEssence) state.essence -= item.cost;
        else state.xp -= item.cost;
        
        item.purchased = true;
        
        // 효과 적용
        if (item.duration > 0) {
            state.activeTemporaryBuffs.push({
                type: item.effect.type,
                multiplier: item.effect.val,
                endTime: Date.now() + (item.duration * 1000)
            });
            recalculateAllBuffs();
            addNotification(`✨ [비밀상점] ${item.name} 효과가 활성화되었습니다! (${item.duration / 60}분간 유지)`, 'system');
        } else if (item.effect.type === 'sootheVisitors') {
            if (state.visitors) {
                state.visitors.forEach(v => {
                    v.currentStress = Math.max(0, v.currentStress - item.effect.val);
                });
            }
            renderVisitors();
            addNotification(`🍵 [비밀상점] ${item.name}의 효과로 모든 손님의 스트레스가 -50 감소했습니다!`, 'system');
        } else if (item.effect.type === 'instantEssence') {
            const gainAmount = item.effect.val * Math.pow(4, (state.stage || 1) - 1);
            state.essence += gainAmount;
            addNotification(`💎 [비밀상점] ${item.name}의 효과로 ✨ ${gainAmount.toLocaleString()} 에센스를 즉시 획득했습니다!`, 'system');
        }
        
        renderSecretShop();
        updateUI();
        saveGame();
    } else {
        addNotification(isEssence ? t('insufficient_essence') : '경험치(XP)가 부족합니다.', 'system');
    }
}

// 게임 초기화 실행
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
