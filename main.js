// JavaScript Document
document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     01_ハンバーガーメニュー（スマホ表示対応）
     ========================================================================== */
  const toggleBtn = document.querySelector('.header__toggle');
  const nav = document.querySelector('.header__nav');
  const navLinks = document.querySelectorAll('.header__nav-link');

  if (toggleBtn && nav) {
    // メニューボタンクリックで開閉
    toggleBtn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggleBtn.classList.toggle('is-open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // ナビゲーションリンククリックでメニューを閉じる
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggleBtn.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* ==========================================================================
     02_Works カテゴリーフィルター
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.works__filter-btn');
  const workCards = document.querySelectorAll('.works__card');

  if (filterBtns.length > 0 && workCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // アクティブボタンの切り替え
        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        // data-filter 属性（all, web, banner, logo など）を取得
        const filterValue = btn.getAttribute('data-filter') || btn.textContent.trim();

        workCards.forEach(card => {
          // カード側の data-category 属性（例: "web", "web logo" など半角スペース区切りも想定）
          const cardCategory = card.getAttribute('data-category') || '';
          const categories = cardCategory.split(' ');

          // 「all」「すべて」または、card の category に含まれている場合表示
          if (
            filterValue === 'all' || 
            filterValue === 'すべて' || 
            categories.includes(filterValue)
          ) {
            card.style.display = 'block';
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            
            // ふわっと表示させるアニメーション
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ==========================================================================
     03_スクロールアニメーション（Intersection Observer）
     ========================================================================== */
  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // 一度表示されたら監視解除
      }
    });
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  });

  // アニメーション対象要素の監視登録
  const animatedElements = document.querySelectorAll(
    '.news__card, .about__content, .about__character, .works__card, .services__card, .contact__container'
  );

  animatedElements.forEach(el => {
    el.classList.add('fade-in-up');
    fadeObserver.observe(el);
  });


  /* ==========================================================================
     04_Works クイック概要モーダル ＆ 2段階導線制御
     ========================================================================== */
  const modal = document.getElementById('worksModal');
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');
  const prevBtn = document.getElementById('modalPrev');
  const nextBtn = document.getElementById('modalNext');

  const modalImg = document.getElementById('modalImg');
  const modalCounter = document.getElementById('modalCounter');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalSpec = document.getElementById('modalSpec');
  const modalDemoArea = document.getElementById('modalDemoArea');
  const modalAction = document.getElementById('modalAction');

  let currentImages = [];
  let currentIndex = 0;

  const modalTriggers = document.querySelectorAll('.works__modal-trigger');

  if (modal && modalTriggers.length > 0) {
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();

        // 1. 画像データの読み込み
        const imagesAttr = trigger.getAttribute('data-images');
        try {
          currentImages = JSON.parse(imagesAttr || '[]');
        } catch (err) {
          console.error('画像データの読み込みに失敗しました:', err);
          currentImages = [];
        }
        currentIndex = 0;

        // 2. テキスト・概要の読み込み
        if (modalTitle) modalTitle.textContent = trigger.getAttribute('data-title') || '';
        if (modalCategory) modalCategory.textContent = trigger.getAttribute('data-category') || '';
        if (modalDesc) modalDesc.innerHTML = trigger.getAttribute('data-desc') || '';
        if (modalSpec) modalSpec.textContent = trigger.getAttribute('data-spec') || '';

        // 3. 実機デモURLボタンの挿入
        const demoUrl = trigger.getAttribute('data-demo-url');
        if (modalDemoArea) {
          if (demoUrl) {
            modalDemoArea.innerHTML = `
              <a href="${demoUrl}" target="_blank" rel="noopener noreferrer" class="works-modal__btn-secondary">
                成果物Webサイト/実機デモを開く ↗
              </a>`;
          } else {
            modalDemoArea.innerHTML = '';
          }
        }

        // 4. 【2段階導線】個別ケーススタディ詳細ページリンクの制御
        const detailLink = trigger.getAttribute('data-link');
        if (modalAction) {
          if (detailLink) {
            // ケーススタディページへの誘導ボタンを表示
            modalAction.innerHTML = `
              <a href="${detailLink}" class="works-modal__btn-primary">
                📖 制作記録・ケーススタディをじっくり読む ↗
              </a>`;
          } else {
            // モーダル内で完結
            modalAction.innerHTML = '';
          }
        }

        updateSlide();
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // 背景スクロール固定
      });
    });
  }

  // スライド画像の更新関数
  function updateSlide() {
    if (!currentImages || currentImages.length === 0) return;

    if (modalImg) {
      modalImg.src = currentImages[currentIndex];
      modalImg.alt = modalTitle ? modalTitle.textContent : '';
    }

    if (modalCounter) {
      modalCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
    }

    // 画像が1枚以下の場合は前後の矢印ボタンとカウンターを非表示
    if (currentImages.length <= 1) {
      if (prevBtn) prevBtn.classList.add('is-hidden');
      if (nextBtn) nextBtn.classList.add('is-hidden');
      if (modalCounter) modalCounter.style.display = 'none';
    } else {
      if (prevBtn) prevBtn.classList.remove('is-hidden');
      if (nextBtn) nextBtn.classList.remove('is-hidden');
      if (modalCounter) modalCounter.style.display = 'block';
    }
  }

  // 前へボタン
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentImages.length === 0) return;
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      updateSlide();
    });
  }

  // 次へボタン
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentImages.length === 0) return;
      currentIndex = (currentIndex + 1) % currentImages.length;
      updateSlide();
    });
  }

  // モーダルを閉じる関数
  function closeModal() {
    if (modal) {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = ''; // スクロール固定解除
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  // Escキー押下時にモーダルを閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

});

document.addEventListener('DOMContentLoaded', () => {
  const INITIAL_COUNT = 6; // 初期表示枚数
  const workCards = Array.from(document.querySelectorAll('.works__card'));
  const moreBtn = document.getElementById('worksMoreBtn');
  const filterBtns = document.querySelectorAll('.works__filter-btn');

  let isExpanded = false; // 「もっと見る」が開かれているかどうかのフラグ

  /* ==========================================================================
     Works 初期表示制御 ＆ 「もっと見る」機能
     ========================================================================== */
  function updateWorksVisibility() {
    // 現在選択されているカテゴリーを取得
    const activeFilterBtn = document.querySelector('.works__filter-btn.is-active');
    const activeFilter = activeFilterBtn ? (activeFilterBtn.getAttribute('data-filter') || activeFilterBtn.textContent.trim()) : 'all';

    // フィルター条件に合致するカードを抽出
    const matchedCards = workCards.filter(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const categories = cardCategory.split(' ');
      return activeFilter === 'all' || activeFilter === 'すべて' || categories.includes(activeFilter);
    });

    // 表示制御
    let visibleCount = 0;
    matchedCards.forEach((card, index) => {
      if (isExpanded || index < INITIAL_COUNT) {
        card.classList.remove('is-hidden');
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.classList.add('is-hidden');
        card.style.display = 'none';
      }
    });

    // 対象カードが初期表示件数以下の場合は「MORE!」ボタンを非表示
    if (!moreBtn) return;
    if (matchedCards.length <= INITIAL_COUNT || isExpanded) {
      moreBtn.classList.add('is-hidden');
    } else {
      moreBtn.classList.remove('is-hidden');
    }
  }

  // 初期実行
  updateWorksVisibility();

  // 「MORE!」ボタンクリックイベント
  if (moreBtn) {
    moreBtn.addEventListener('click', () => {
      isExpanded = true;
      updateWorksVisibility();

      // 新しく表示されたカードにスムーズ表示アニメーションを適用
      const hiddenCards = workCards.filter(card => !card.classList.contains('is-hidden'));
      hiddenCards.slice(INITIAL_COUNT).forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      });
    });
  }

  // 既存のフィルターボタンクリック時にも制限状態を更新させる処理
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // カテゴリーが変更されたら「もっと見る」の状態をリセット（初期件数表示に戻す）
        isExpanded = false;
        // 少し遅延させてフィルター処理実行後に件数を再計算
        setTimeout(updateWorksVisibility, 0);
      });
    });
  }
});

/* ==========================================================================
   05_News 「もっとみる / 閉じる」ボタン開閉処理
   ========================================================================== */
const newsMoreBtn = document.getElementById('newsMoreBtn');

if (newsMoreBtn) {
  // 開閉状態フラグ
  let isNewsExpanded = false;

  newsMoreBtn.addEventListener('click', () => {
    const hiddenNewsItems = document.querySelectorAll('.news__list .news__item');
    const btnText = newsMoreBtn.querySelector('.news__btn-text');
    const btnArrow = newsMoreBtn.querySelector('.news__arrow');

    if (!isNewsExpanded) {
      // 展開処理（2件目以降を表示）
      hiddenNewsItems.forEach((item, index) => {
        if (index > 0) { // 1件目以外を表示対象に
          item.classList.remove('is-hidden');
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px)';

          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
        }
      });

      // ボタン表示切り替え
      if (btnText) btnText.textContent = '閉じる';
      if (btnArrow) btnArrow.textContent = '↑';
      newsMoreBtn.classList.add('is-expanded');
      isNewsExpanded = true;

    } else {
      // 折りたたみ処理（2件目以降を隠す）
      hiddenNewsItems.forEach((item, index) => {
        if (index > 0) {
          item.classList.add('is-hidden');
        }
      });

      // ボタン表示切り替え
      if (btnText) btnText.textContent = 'もっとみる';
      if (btnArrow) btnArrow.textContent = '→';
      newsMoreBtn.classList.remove('is-expanded');
      isNewsExpanded = false;

      // お知らせセクション上部へスムーズスクロール（アクセシビリティ対応）
      const newsSection = document.getElementById('news');
      if (newsSection) {
        newsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}
/* ==========================================================================
   NEWバッジ自動制御（「すべて」選択時のみ左上1件目に表示）
   ========================================================================== */
function updateNewBadge() {
  const activeBtn = document.querySelector('.works__filter-btn.is-active');
  const activeFilter = activeBtn ? (activeBtn.getAttribute('data-filter') || activeBtn.textContent.trim()) : 'all';

  let isFirstVisibleFound = false;

  workCards.forEach(card => {
    // 全カードから一旦バッジ表示用クラスを外す
    card.classList.remove('has-new-badge');

    // 「すべて (all)」が選択されている場合のみ、表示中の1件目にバッジを付与
    if (activeFilter === 'all' || activeFilter === 'すべて') {
      const isVisible = window.getComputedStyle(card).display !== 'none';
      if (isVisible && !isFirstVisibleFound) {
        card.classList.add('has-new-badge');
        isFirstVisibleFound = true;
      }
    }
  });
}

/* ==========================================================================
     02_Works カテゴリーフィルター ＆ NEWバッジ制御
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.works__filter-btn');
  const workCards = document.querySelectorAll('.works__card');

  // 「すべて」選択時のみ左上カードにNEWバッジを付与する関数
  function updateNewBadge() {
    const activeBtn = document.querySelector('.works__filter-btn.is-active');
    const activeFilter = activeBtn ? (activeBtn.getAttribute('data-filter') || activeBtn.textContent.trim()) : 'all';

    let isFirstVisibleFound = false;

    workCards.forEach(card => {
      card.classList.remove('has-new-badge');

      // 「すべて」の時だけ最初のカードに判定
      if (activeFilter === 'all' || activeFilter === 'すべて') {
        const isVisible = window.getComputedStyle(card).display !== 'none';
        if (isVisible && !isFirstVisibleFound) {
          card.classList.add('has-new-badge');
          isFirstVisibleFound = true;
        }
      }
    });
  }

  if (filterBtns.length > 0 && workCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // アクティブボタンの切り替え
        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        const filterValue = btn.getAttribute('data-filter') || btn.textContent.trim();

        workCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category') || '';
          const categories = cardCategory.split(' ');

          if (filterValue === 'all' || filterValue === 'すべて' || categories.includes(filterValue)) {
            card.style.display = 'block';
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.display = 'none';
          }
        });

        // フィルター切替後にバッジ表示状態を更新
        updateNewBadge();
      });
    });

    // ページ読み込み時の初期実行
    updateNewBadge();
  }
// ==========================================================================
// Figma「自由帳」フロートバナーの表示制御
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const floatBanner = document.getElementById('floatBanner');
  const floatClose = document.getElementById('floatClose');

  if (!floatBanner) return;

  // 300pxスクロールしたら表示
  let hasShown = false;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300 && !hasShown) {
      floatBanner.classList.add('is-show');
      hasShown = true;
    }
  });

  // ×ボタンで非表示
  if (floatClose) {
    floatClose.addEventListener('click', () => {
      floatBanner.classList.remove('is-show');
    });
  }
});