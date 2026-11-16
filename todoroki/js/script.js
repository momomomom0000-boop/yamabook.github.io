"use strict";

const yearElement = document.getElementById("copyright-year");
if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

const today = new Date().getDay();
document.querySelectorAll(`[data-day="${today}"]`).forEach((cell) => {
  cell.classList.add("is-today");
  if (cell.matches("th")) {
    cell.setAttribute("aria-current", "date");
  }
});

document.querySelectorAll("[data-details-toggle]").forEach((button) => {
  const target = document.getElementById(button.dataset.detailsToggle);
  if (!target) {
    return;
  }

  const details = Array.from(target.querySelectorAll("details"));
  const updateButton = () => {
    const allOpen = details.length > 0 && details.every((item) => item.open);
    button.textContent = allOpen ? "説明をすべて閉じる" : "説明をすべて開く";
    button.setAttribute("aria-expanded", String(allOpen));
  };

  button.addEventListener("click", () => {
    const shouldOpen = details.some((item) => !item.open);
    details.forEach((item) => {
      item.open = shouldOpen;
    });
    updateButton();
  });

  details.forEach((item) => {
    item.addEventListener("toggle", updateButton);
  });
  updateButton();
});

const newsFilters = document.querySelectorAll("[data-news-filter]");
const newsCards = document.querySelectorAll("[data-news-category]");

newsFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const selectedCategory = filter.dataset.newsFilter;

    newsFilters.forEach((item) => {
      const isActive = item === filter;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    newsCards.forEach((card) => {
      card.hidden = selectedCategory !== "all" && card.dataset.newsCategory !== selectedCategory;
    });
  });
});
