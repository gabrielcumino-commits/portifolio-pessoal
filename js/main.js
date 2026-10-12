import { initI18n } from "./i18n.js";

initI18n();

// menu mobile
const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");

menuBtn.addEventListener("click", () => {
  const open = menu.classList.toggle("hidden") === false;
  menuBtn.setAttribute("aria-expanded", String(open));
});

// fecha o menu ao clicar em um link
menu.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    menu.classList.add("hidden");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

document.getElementById("year").textContent = new Date().getFullYear();