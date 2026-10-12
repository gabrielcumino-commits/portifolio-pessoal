const SUPPORTED = ["pt", "en"];
const STORAGE_KEY = "lang";

function detectLang() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (SUPPORTED.includes(saved)) return saved;
  return navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en";
}

async function loadDict(lang) {
  const res = await fetch(`data/${lang}.json`);
  if (!res.ok) throw new Error(`Não consegui carregar data/${lang}.json`);
  return res.json();
}

// "nav.about" -> dict.nav.about
function get(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export async function setLang(lang) {
  const dict = await loadDict(lang);

  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  document.title = dict.meta.title;
  document.querySelector('meta[name="description"]').content = dict.meta.description;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const value = get(dict, el.dataset.i18n);
    if (value) el.textContent = value;
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const value = get(dict, el.dataset.i18nAria);
    if (value) el.setAttribute("aria-label", value);
  });

  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.langBtn === lang));
  });

  localStorage.setItem(STORAGE_KEY, lang);

  // as seções que forem renderizadas por JS escutam este evento
  document.dispatchEvent(new CustomEvent("langchange", { detail: { lang, dict } }));
}

export function initI18n() {
  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.langBtn));
  });
  return setLang(detectLang());
}