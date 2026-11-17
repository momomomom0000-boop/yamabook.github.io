(() => {
  const slides = [...document.querySelectorAll(".hero-slide")];
  const dots = [...document.querySelectorAll(".slide-dot")];
  const currentCount = document.querySelector("#slide-current");
  let activeSlide = 0;
  let slideshowTimer;

  function showSlide(index) {
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === activeSlide));
    dots.forEach((dot, i) => {
      const isActive = i === activeSlide;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-pressed", String(isActive));
    });
    if (currentCount) currentCount.textContent = String(activeSlide + 1).padStart(2, "0");
  }

  function restartSlideshow() {
    window.clearInterval(slideshowTimer);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      slideshowTimer = window.setInterval(() => showSlide(activeSlide + 1), 6000);
    }
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      restartSlideshow();
    });
  });
  if (slides.length > 1) restartSlideshow();

  const menu = document.querySelector("#site-menu");
  const menuToggle = document.querySelector(".menu-toggle");
  const menuClose = document.querySelector(".menu-close");
  const menuScrim = document.querySelector(".menu-scrim");

  if (menu && menuToggle && menuClose && menuScrim) {
    function setMenuOpen(isOpen) {
      menu.hidden = !isOpen;
      menuScrim.hidden = !isOpen;
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
      document.body.classList.toggle("no-scroll", isOpen);
      if (isOpen) menuClose.focus();
      else menuToggle.focus();
    }

    menuToggle.addEventListener("click", () => setMenuOpen(menu.hidden));
    menuClose.addEventListener("click", () => setMenuOpen(false));
    menuScrim.addEventListener("click", () => setMenuOpen(false));
    menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenuOpen(false)));
    document.addEventListener("keydown", event => {
      if (menu.hidden) return;
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...menu.querySelectorAll("a[href], button:not([disabled])")];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  const tabs = [...document.querySelectorAll(".clothes-tab")];
  const panels = [...document.querySelectorAll(".clothes-panel")];

  function activateTab(tab, moveFocus = false) {
    const targetPanelId = tab.getAttribute("aria-controls");
    tabs.forEach(item => {
      const selected = item === tab;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(panel => {
      const selected = panel.id === targetPanelId;
      panel.classList.toggle("is-active", selected);
    });
    if (moveFocus) tab.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      activateTab(tabs[nextIndex], true);
    });
  });

  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = document.querySelector(".lightbox-image");
  const lightboxCaption = document.querySelector(".lightbox-caption");
  const lightboxItems = [...document.querySelectorAll("[data-lightbox]")];
  let lightboxIndex = 0;
  let lastLightboxTrigger = null;

  if (
    lightbox &&
    lightboxImage &&
    lightboxCaption &&
    lightboxItems.length &&
    document.querySelector(".lightbox-prev") &&
    document.querySelector(".lightbox-next") &&
    document.querySelector(".lightbox-close")
  ) {
    function showLightboxImage(index) {
      lightboxIndex = (index + lightboxItems.length) % lightboxItems.length;
      const item = lightboxItems[lightboxIndex];
      lightboxImage.src = item.dataset.src;
      lightboxImage.alt = item.dataset.alt || "";
      const photographerText = item.dataset.photographer ? ` ／ ${item.dataset.photographer}` : "";
      lightboxCaption.textContent = `${lightboxIndex + 1} / ${lightboxItems.length} — ${item.dataset.alt || ""}${photographerText}`;
    }

    lightboxItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        lastLightboxTrigger = item;
        showLightboxImage(index);
        lightbox.showModal();
      });
    });
    document.querySelector(".lightbox-prev").addEventListener("click", () => showLightboxImage(lightboxIndex - 1));
    document.querySelector(".lightbox-next").addEventListener("click", () => showLightboxImage(lightboxIndex + 1));
    document.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
    lightbox.addEventListener("click", event => {
      if (event.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener("close", () => {
      if (lastLightboxTrigger) lastLightboxTrigger.focus();
    });
    lightbox.addEventListener("keydown", event => {
      if (event.key === "Escape") lightbox.close();
      if (event.key === "ArrowLeft") showLightboxImage(lightboxIndex - 1);
      if (event.key === "ArrowRight") showLightboxImage(lightboxIndex + 1);
    });
  }

  const floatingCta = document.querySelector(".floating-cta");
  const floatingClose = document.querySelector(".floating-close");
  let ctaDismissed = false;

  if (floatingCta && floatingClose) {
    function updateFloatingCta() {
      if (!ctaDismissed) {
        floatingCta.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.7);
      }
    }

    window.addEventListener("scroll", updateFloatingCta, { passive: true });
    updateFloatingCta();
    floatingClose.addEventListener("click", () => {
      ctaDismissed = true;
      floatingCta.classList.remove("is-visible");
      floatingCta.classList.add("is-dismissed");
    });
  }

  const reservationForm = document.querySelector("#reservation-form");
  const reservationStatus = document.querySelector("#reservation-form-status");
  const inquiryType = document.querySelector("#inquiry-type");
  if (inquiryType) {
    const requestedType = new URLSearchParams(window.location.search).get("type");
    if ([...inquiryType.options].some(option => option.value === requestedType)) {
      inquiryType.value = requestedType;
    }
  }
  if (reservationForm && reservationStatus) {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const minDate = today.toISOString().slice(0, 10);
    reservationForm.querySelectorAll('input[type="date"]').forEach(input => {
      input.min = minDate;
    });
    reservationForm.addEventListener("submit", event => {
      event.preventDefault();
      reservationStatus.textContent = "現在、予約フォームは送信システムに接続されていません。送信先が設定されるまで予約を受け付けられません。";
    });
  }

  const year = document.querySelector("#copyright-year");
  if (year) year.textContent = String(new Date().getFullYear());

  // カメラマンセクションのアコーディオン開閉
  const photoToggle = document.querySelector(".photographer-toggle");
  const photoMore = document.querySelector("#photographer-more");

  if (photoToggle && photoMore) {
    photoToggle.addEventListener("click", () => {
      const isOpen = photoToggle.classList.contains("is-open");
      
      if (isOpen) {
        photoMore.classList.remove("is-expanded");
        photoToggle.classList.remove("is-open");
        photoToggle.setAttribute("aria-expanded", "false");
        photoToggle.querySelector(".toggle-text").textContent = "MORE CREATORS";
      } else {
        photoMore.classList.add("is-expanded");
        photoToggle.classList.add("is-open");
        photoToggle.setAttribute("aria-expanded", "true");
        photoToggle.querySelector(".toggle-text").textContent = "CLOSE CREATORS";
      }
    });
  }

  // ギャラリーのカテゴリーフィルター機能
  const filterTabs = document.querySelectorAll(".gallery-filter-tab");
  const galleryItems = document.querySelectorAll(".gallery-item");

  if (filterTabs.length > 0 && galleryItems.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const category = tab.dataset.filter;

        filterTabs.forEach(t => {
          const selected = t === tab;
          t.classList.toggle("is-active", selected);
          t.setAttribute("aria-pressed", String(selected));
        });

        galleryItems.forEach(item => {
          const itemCategory = item.dataset.category;
          if (category === "all" || itemCategory === category) {
            item.classList.remove("is-hidden");
          } else {
            item.classList.add("is-hidden");
          }
        });
      });
    });
  }
})();