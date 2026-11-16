const lightbox = document.querySelector(".lightbox");
const lightboxMedia = lightbox.querySelector("[data-lightbox-media]");
const lightboxCaption = lightbox.querySelector(".lightbox__caption");
const imageButtons = [...document.querySelectorAll("[data-lightbox]")];
const mobileMenu = document.querySelector(".site-header__mobile-menu");
let activeImageIndex = 0;

mobileMenu.querySelectorAll(".site-header__mobile-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.removeAttribute("open");
  });
});

function showImage(index) {
  activeImageIndex = (index + imageButtons.length) % imageButtons.length;
  const activeButton = imageButtons[activeImageIndex];
  const sourceFrame = activeButton.querySelector(".media-frame");

  lightboxMedia.replaceChildren(...sourceFrame.cloneNode(true).childNodes);
  lightboxCaption.textContent = activeButton.dataset.label;
}

imageButtons.forEach((button, index) => {
  button.setAttribute("aria-label", `${button.dataset.label}の画像を拡大`);
  button.addEventListener("click", () => {
    showImage(index);
    lightbox.showModal();
  });
});

lightbox.querySelector("[data-lightbox-close]").addEventListener("click", () => {
  lightbox.close();
});

lightbox.querySelector("[data-lightbox-previous]").addEventListener("click", () => {
  showImage(activeImageIndex - 1);
});

lightbox.querySelector("[data-lightbox-next]").addEventListener("click", () => {
  showImage(activeImageIndex + 1);
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    showImage(activeImageIndex - 1);
  }

  if (event.key === "ArrowRight") {
    showImage(activeImageIndex + 1);
  }

  if (event.key === "Escape") {
    lightbox.close();
  }
});