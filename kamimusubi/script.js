/**
 * 居酒屋 神結（かみむすび）Webサイト 制御スクリプト
 * - お品書き写真カルーセルモーダル（単価非掲載・別画像差し替え対応）
 * - 駅からの行き方4ステップ切替
 * - PC(1200px) / SP(375px) プレビューモード切替
 * - BOX・構成ガイド表示切替
 * - 紹介文コピー機能
 */

// お品書きカルーセルデータ（img に別画像パスを入れると自動で画像表示に切り替わります）
const MENU_SLIDES = [
  {
    category: 'dish',
    badge: 'TEIBAN WASHOKU',
    title: '若鶏のからあげ',
    desc: '外はかりっと香ばしく、中はふっくらジューシー。自家製のタルタルやレモンを添えて、最初の一杯にもぴったりの定番人気です。',
    img: ''
  },
  {
    category: 'dish',
    badge: 'SORRISO CREATIVE',
    title: '海鮮の創作一皿（魚介の旨み仕立て）',
    desc: '姉妹店 Sorriso でイタリアンシェフを務めた店長ならではの発想。魚介の出汁とコクを生かした、お酒にもごはんにも合う一皿です。',
    img: ''
  },
  {
    category: 'dish',
    badge: 'SEASONAL SASHIMI',
    title: '旬のお刺身盛り合わせ（5点盛りほか）',
    desc: 'その日の仕入れに合わせて丁寧に引き立てた旬のお造り。華やかな純米吟醸やキレのある辛口日本酒と合わせてどうぞ。',
    img: ''
  },
  {
    category: 'dish',
    badge: 'POPULAR DISH',
    title: '大根のバターステーキ',
    desc: '和のお出汁をじっくり含ませた大根を香ばしく焼き上げ、バターのコクを重ねた和洋折衷の人気メニュー。ほっと心がほどける味わいです。',
    img: ''
  },
  {
    category: 'meal',
    badge: 'WASHOKU × ITALIAN',
    title: '香ばし和風仕立ての特製ピザ ／ ピリ辛ジャージャーpizza',
    desc: '和の素材とチーズがとけ合う神結ならではの特製ピザ。シェアして楽しむお酒のおともにも、しっかり食べたい夜にも好評です。',
    img: ''
  },
  {
    category: 'sake',
    badge: 'SELECTED SAKE',
    title: '鳳凰美田・而今 ほか厳選純米酒',
    desc: '華やかな吟醸香が心地よい「鳳凰美田」や、なかなか出会えない希少な一本まで。その日のラインナップは店内の黒板や店長までお気軽に。',
    img: ''
  },
  {
    category: 'sake',
    badge: 'SPECIAL SAKE',
    title: '獺祭・列 ほか今宵の特別な一杯',
    desc: '日本酒が初めての方にも飲みやすいフルーティーな銘酒から、食中酒として寄り添う一本まで、お好みに合わせてご提案いたします。',
    img: ''
  },
  {
    category: 'sake',
    badge: 'SAKE TASTING',
    title: '澤の花・プレミアム日本酒利き酒セット',
    desc: '「少しずついろいろ試したい」という方に嬉しい飲み比べ。お料理との相性を楽しみながら、お気に入りの一杯を見つけてください。',
    img: ''
  },
  {
    category: 'sake',
    badge: 'SHUKI & IKKON',
    title: '涼やかな酒器で味わう冷酒・熱燗',
    desc: '季節や銘柄に合わせて温度帯も心地よく。仕事帰りの一人飲みでも、ゆっくりと自分のペースでお酒を味わえます。',
    img: ''
  },
  {
    category: 'dish',
    badge: 'WARM ODEN & GRILL',
    title: 'おでん盛り合わせ ／ 白レバー串・焼き鳥各種',
    desc: '出汁のしみた温かいおでんや、香ばしく焼き上げる白レバー串・ねぎま・もも・皮串など、ほっとする居酒屋の定番も充実しています。',
    img: ''
  },
  {
    category: 'meal',
    badge: 'DINNER & RICE',
    title: 'ニキータのチャーハン ／ ガーリックライス',
    desc: 'お酒を飲まない方の夜ごはん利用や、〆の一品としてファンが多い看板ごはん。ごはんセット（もずくたまごスープ・お漬物付き）での定食風も人気です。',
    img: ''
  },
  {
    category: 'meal',
    badge: 'CURRY & UDON',
    title: 'カレー各種（グリーン・レッド・シーフード）／ うどん各種',
    desc: '遅い時間帯のしっかりお食事にも嬉しいカレー3種や、おろし明太うどん・和風冷やしサラダうどんなど、気分に合わせて選べます。',
    img: ''
  }
];

let activeCategory = 'all';
let filteredIndices = MENU_SLIDES.map((_, idx) => idx);
let currentFilteredPos = 0;

/**
 * 差し替えBOX内の <img> に src が設定されているかを判定し、
 * 画像がある場合は枠線・プレースホルダーを自動で切り替える
 */
function syncAssetBoxes() {
  document.querySelectorAll('.asset-box').forEach((box) => {
    const img = box.querySelector('img.asset-img');
    if (!img) return;
    const srcVal = (img.getAttribute('src') || '').trim();
    if (srcVal !== '') {
      box.classList.add('has-image');
    } else {
      box.classList.remove('has-image');
    }
  });
}

function openMenuCarousel(globalIndex = 0) {
  activeCategory = 'all';
  filteredIndices = MENU_SLIDES.map((_, idx) => idx);
  currentFilteredPos = Math.max(0, Math.min(globalIndex, filteredIndices.length - 1));
  updateCategoryTabUI();
  renderCarouselSlide();

  const modal = document.getElementById('menuCarouselModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeMenuCarousel() {
  const modal = document.getElementById('menuCarouselModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
}

function handleModalBackdropClick(e) {
  if (e.target && e.target.id === 'menuCarouselModal') {
    closeMenuCarousel();
  }
}

function filterCarouselCategory(cat) {
  activeCategory = cat;
  if (cat === 'all') {
    filteredIndices = MENU_SLIDES.map((_, idx) => idx);
  } else {
    filteredIndices = MENU_SLIDES
      .map((item, idx) => (item.category === cat ? idx : -1))
      .filter((idx) => idx !== -1);
  }
  currentFilteredPos = 0;
  updateCategoryTabUI();
  renderCarouselSlide();
}

function updateCategoryTabUI() {
  document.querySelectorAll('.cat-tab').forEach((btn) => {
    const isSelected = btn.getAttribute('data-cat') === activeCategory;
    if (isSelected) {
      btn.classList.remove('bg-[#E9DCCB]/70', 'text-[#514039]', 'hover:bg-[#E9DCCB]');
      btn.classList.add('bg-[#514039]', 'text-[#FAF8F3]');
    } else {
      btn.classList.remove('bg-[#514039]', 'text-[#FAF8F3]');
      btn.classList.add('bg-[#E9DCCB]/70', 'text-[#514039]', 'hover:bg-[#E9DCCB]');
    }
  });
}

function stepCarousel(delta) {
  if (!filteredIndices.length) return;
  currentFilteredPos = (currentFilteredPos + delta + filteredIndices.length) % filteredIndices.length;
  renderCarouselSlide();
}

function jumpCarousel(pos) {
  currentFilteredPos = pos;
  renderCarouselSlide();
}

function renderCarouselSlide() {
  const slideIndex = filteredIndices[currentFilteredPos];
  const item = MENU_SLIDES[slideIndex];
  if (!item) return;

  const mainImg = document.getElementById('carouselMainImage');
  const mainBox = mainImg ? mainImg.closest('.asset-box') : null;
  const placeholderEl = document.getElementById('carouselPlaceholderText');

  if (mainImg) {
    mainImg.setAttribute('src', item.img || '');
    mainImg.alt = item.title;
  }
  if (placeholderEl) {
    placeholderEl.innerHTML = `${item.title}<small>MENU_SLIDES[${slideIndex}].img に画像パスを設定</small>`;
  }
  if (mainBox) {
    if ((item.img || '').trim() !== '') {
      mainBox.classList.add('has-image');
    } else {
      mainBox.classList.remove('has-image');
    }
  }

  document.getElementById('carouselBadge').textContent = item.badge;
  document.getElementById('carouselItemTitle').textContent = item.title;
  document.getElementById('carouselItemDesc').textContent = item.desc;

  const curNum = String(currentFilteredPos + 1).padStart(2, '0');
  const totNum = String(filteredIndices.length).padStart(2, '0');
  document.getElementById('carouselCounter').textContent = `${curNum} / ${totNum}`;

  const thumbsWrap = document.getElementById('carouselThumbs');
  if (!thumbsWrap) return;
  thumbsWrap.innerHTML = '';

  filteredIndices.forEach((mIdx, pos) => {
    const mItem = MENU_SLIDES[mIdx];
    const isCurrent = pos === currentFilteredPos;
    const hasImg = (mItem.img || '').trim() !== '';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick = () => jumpCarousel(pos);
    btn.title = mItem.title;
    btn.className = `shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 flex items-center justify-center bg-[#E9DCCB]/60 transition ${
      isCurrent
        ? 'border-[#A65E50] ring-2 ring-[#B99A63]/50 opacity-100 scale-105'
        : 'border-[#B99A63]/45 opacity-70 hover:opacity-100'
    }`;

    if (hasImg) {
      btn.innerHTML = `<img src="${mItem.img}" alt="${mItem.title}" class="w-full h-full object-cover" />`;
    } else {
      btn.innerHTML = `<span class="font-jost text-[10px] font-semibold text-[#514039]">${String(mIdx + 1).padStart(2, '0')}</span>`;
    }
    thumbsWrap.appendChild(btn);
  });
}

// 駅からの行き方4ステップ切替
const WALK_STEPS = [
  {
    step: 'STEP 01 · 鶴間駅を出発',
    title: '小田急江ノ島線「鶴間駅」から徒歩5〜6分',
    desc: '駅周辺の落ち着いた街並みから、気負わずゆっくり歩ける距離です。'
  },
  {
    step: 'STEP 02 · 街並みを進む',
    title: '地元の日常が流れる通りを直進',
    desc: 'お仕事帰りや夜ごはんにも立ち寄りやすい、落ち着いた鶴間エリアの道順です。'
  },
  {
    step: 'STEP 03 · サンライト鶴間1Fへ',
    title: '神奈川県大和市鶴間2-10-13 サンライト鶴間1F',
    desc: '目的の建物に到着します（専用駐車場はありませんので近隣コインパーキングをご利用ください）。'
  },
  {
    step: 'STEP 04 · あたたかい明かりへ',
    title: '「神結」の提灯と暖簾が目印',
    desc: '17:00〜24:30（L.O. 24:00）営業・水曜定休。常連さんも初めての方も気さくな明かりでお待ちしています。'
  }
];

let walkIndex = 0;
function stepWalkGuide(delta) {
  walkIndex = (walkIndex + delta + WALK_STEPS.length) % WALK_STEPS.length;
  const cur = WALK_STEPS[walkIndex];
  document.getElementById('walkGuideCounter').textContent = `${String(walkIndex + 1).padStart(2, '0')} / ${String(WALK_STEPS.length).padStart(2, '0')}`;
  document.getElementById('walkGuideStep').textContent = cur.step;
  document.getElementById('walkGuideTitle').textContent = cur.title;
  document.getElementById('walkGuideDesc').textContent = cur.desc;
}

// キーボード操作（ESCで閉じる・左右矢印でカルーセル送り）
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('menuCarouselModal');
  if (!modal || modal.classList.contains('hidden')) return;
  if (e.key === 'Escape') closeMenuCarousel();
  if (e.key === 'ArrowLeft') stepCarousel(-1);
  if (e.key === 'ArrowRight') stepCarousel(1);
});

// PC(1200px) / SP(375px) プレビューモード切替
function setPreviewMode(mode) {
  const canvas = document.getElementById('previewCanvas');
  const btnPc = document.getElementById('btnModePc');
  const btnSp = document.getElementById('btnModeSp');
  const pcNav = document.getElementById('pcNavLinks');
  const navTelLabel = document.getElementById('navTelLabel');

  if (!canvas) return;

  if (mode === 'sp') {
    canvas.classList.remove('mode-pc');
    canvas.classList.add('mode-sp');

    btnSp.classList.add('bg-[#FAF8F3]', 'text-[#514039]', 'shadow-sm');
    btnSp.classList.remove('text-[#FAF8F3]');
    btnPc.classList.remove('bg-[#FAF8F3]', 'text-[#514039]', 'shadow-sm');
    btnPc.classList.add('text-[#FAF8F3]');

    if (pcNav) pcNav.classList.add('!hidden');
    if (navTelLabel) navTelLabel.textContent = '予約';
  } else {
    canvas.classList.remove('mode-sp');
    canvas.classList.add('mode-pc');

    btnPc.classList.add('bg-[#FAF8F3]', 'text-[#514039]', 'shadow-sm');
    btnPc.classList.remove('text-[#FAF8F3]');
    btnSp.classList.remove('bg-[#FAF8F3]', 'text-[#514039]', 'shadow-sm');
    btnSp.classList.add('text-[#FAF8F3]');

    if (pcNav) pcNav.classList.remove('!hidden');
    if (navTelLabel) navTelLabel.textContent = '080-6843-1212';
  }
}

// BOX・構成ガイド表示切替
function toggleGuides() {
  document.body.classList.toggle('show-guides');
  const dot = document.getElementById('guideDot');
  if (!dot) return;
  if (document.body.classList.contains('show-guides')) {
    dot.classList.remove('bg-[#E9DCCB]/50');
    dot.classList.add('bg-[#B99A63]');
  } else {
    dot.classList.add('bg-[#E9DCCB]/50');
    dot.classList.remove('bg-[#B99A63]');
  }
}

// 紹介文コピー機能
function copyInviteMessage() {
  const text = '神結 〜それでも私は酒を呑む〜｜あれもある、これもある。お酒と料理、夜ごはんまでいろいろ揃う鶴間の「神結」に行こうよ！';
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    const feedback = document.getElementById('copyFeedback');
    if (feedback) {
      feedback.textContent = '誘いやすい紹介メッセージをクリップボードにコピーしました。';
      setTimeout(() => {
        feedback.textContent = '';
      }, 3500);
    }
  } catch (e) {
    // エラー時は静かに処理
  }
  document.body.removeChild(textarea);
}

window.addEventListener('DOMContentLoaded', () => {
  syncAssetBoxes();
  if (window.innerWidth < 768) {
    setPreviewMode('sp');
  } else {
    setPreviewMode('pc');
  }
});