document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  const modalClose = document.getElementById('modalClose');
  const modalOverlay = document.getElementById('modalOverlay');
  const openButtons = document.querySelectorAll('.js-modal-open');

  // モーダルを開く関数
  const openModal = (src, caption) => {
    modalImg.src = src;
    modalCaption.textContent = caption || '';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // 背景スクロール固定
  };

  // モーダルを閉じる関数
  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // スクロール解除
    // アニメーション完了後に画像ソースを空にする
    setTimeout(() => {
      modalImg.src = '';
    }, 500);
  };

  // 各写真をクリックしたときのイベント
  openButtons.forEach(button => {
    button.addEventListener('click', () => {
      const fullSrc = button.getAttribute('data-full');
      const caption = button.getAttribute('data-caption');
      if (fullSrc) {
        openModal(fullSrc, caption);
      }
    });
  });

  // 閉じるボタン・背景クリック・Escキーで閉じる
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
});