/* ================================================================
   Bhavesh AD Agency — site script
   EDIT YOUR DETAILS HERE. Everything on the page updates from this.
   ================================================================ */
const CONFIG = {
  // WhatsApp number: country code + number, digits only (e.g. 919876543210)
  whatsapp: "919468952121",
  // Phone number shown on the site and used for "Call" buttons
  phoneDisplay: "+91 94689 52121",
  phoneDial: "+919468952121",
  email: "mukeshkhatri1313@gmail.com",
  address: "Kinger Niwas, 3GHA/21, Pawan Puri, Sardar Patel Colony, Bikaner, Rajasthan 334003"
};

(function () {
  const html = document.documentElement;
  const isPlaceholder = (v) => /X{3,}|example\.com/i.test(v);

  /* ---------- Fill contact details ---------- */
  document.querySelectorAll('[data-field="phone"]').forEach(el => el.textContent = CONFIG.phoneDisplay);
  document.querySelectorAll('[data-field="email"]').forEach(el => el.textContent = CONFIG.email);
  document.querySelectorAll('[data-field="address"]').forEach(el => el.textContent = CONFIG.address);
  if (!isPlaceholder(CONFIG.phoneDial)) {
    document.querySelectorAll("[data-tel]").forEach(el => el.href = "tel:" + CONFIG.phoneDial);
  }
  if (!isPlaceholder(CONFIG.email)) {
    document.querySelectorAll("[data-mail]").forEach(el => el.href = "mailto:" + CONFIG.email);
  }

  /* ---------- WhatsApp links ---------- */
  const waMessages = {
    general: {
      en: "Hello Bhavesh AD Agency, I want to book a newspaper ad.",
      hi: "नमस्ते भावेश एड एजेंसी, मुझे अख़बार में विज्ञापन बुक करना है।"
    },
    rate: {
      en: "Hello Bhavesh AD Agency, please share today's ad rates.",
      hi: "नमस्ते भावेश एड एजेंसी, कृपया आज की विज्ञापन दरें बताएँ।"
    }
  };
  const waUrl = (text) => "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(text);

  function updateWaLinks(lang) {
    if (isPlaceholder(CONFIG.whatsapp)) return; // keep "#contact" until a real number is set
    document.querySelectorAll("[data-wa]").forEach(el => {
      const key = el.dataset.waMsg || "general";
      el.href = waUrl(waMessages[key][lang]);
      el.target = "_blank";
      el.rel = "noopener";
    });
  }

  /* ---------- Language switch ---------- */
  const titles = {
    en: "Bhavesh AD Agency | Newspaper Advertising in Bikaner",
    hi: "भावेश एड एजेंसी | बीकानेर में अख़बार विज्ञापन"
  };

  function setLang(lang) {
    html.classList.toggle("lang-hi", lang === "hi");
    html.lang = lang;
    document.title = titles[lang];
    document.querySelectorAll(".lang-switch button").forEach(b =>
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    document.querySelectorAll("[data-ph-en]").forEach(el =>
      el.placeholder = el.dataset["ph" + (lang === "hi" ? "Hi" : "En")]);
    document.querySelectorAll("option[data-en]").forEach(o =>
      o.textContent = o.dataset[lang]);
    updateWaLinks(lang);
    try { localStorage.setItem("lang", lang); } catch (e) {}
  }

  document.querySelectorAll(".lang-switch button").forEach(b =>
    b.addEventListener("click", () => setLang(b.dataset.lang)));

  let initial = "en"; // English is the primary language
  const fromUrl = new URLSearchParams(location.search).get("lang");
  if (fromUrl === "hi" || fromUrl === "en") initial = fromUrl;
  else { try { initial = localStorage.getItem("lang") || "en"; } catch (e) {} }
  setLang(initial);

  /* ---------- Mobile menu ---------- */
  const nav = document.getElementById("nav");
  const toggle = document.querySelector(".menu-toggle");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));

  /* ---------- Quote form → WhatsApp ---------- */
  const form = document.getElementById("quoteForm");
  const errorBox = document.getElementById("formError");
  const dateInput = form.querySelector('input[type="date"]');
  dateInput.min = new Date().toISOString().slice(0, 10);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const lang = html.lang === "hi" ? "hi" : "en";
    const f = form.elements;
    const name = f["name"].value.trim();
    const typeSelect = f["type"];
    const typeOpt = typeSelect.selectedOptions[0];
    const papers = [...form.querySelectorAll('input[name="paper"]:checked')]
      .map(c => lang === "hi" ? c.dataset.hi : c.value);
    const date = f["date"].value;
    const details = f["details"].value.trim();

    if (!name || !typeSelect.value) {
      errorBox.textContent = lang === "hi"
        ? "कृपया अपना नाम और विज्ञापन का प्रकार भरें।"
        : "Please enter your name and choose the type of ad.";
      errorBox.hidden = false;
      return;
    }
    errorBox.hidden = true;

    const L = lang === "hi"
      ? { hello: "नमस्ते भावेश एड एजेंसी,", name: "नाम", type: "विज्ञापन", paper: "अख़बार", date: "तारीख़", details: "विवरण", any: "आप सुझाएँ" }
      : { hello: "Hello Bhavesh AD Agency,", name: "Name", type: "Ad type", paper: "Newspaper", date: "Date", details: "Details", any: "Please suggest" };

    const lines = [
      L.hello,
      `${L.name}: ${name}`,
      `${L.type}: ${typeOpt.dataset[lang]}`,
      `${L.paper}: ${papers.length ? papers.join(", ") : L.any}`
    ];
    if (date) lines.push(`${L.date}: ${date.split("-").reverse().join("-")}`);
    if (details) lines.push(`${L.details}: ${details}`);

    if (isPlaceholder(CONFIG.whatsapp)) {
      errorBox.textContent = "WhatsApp number not set yet. Add it in script.js (CONFIG.whatsapp).";
      errorBox.hidden = false;
      return;
    }
    window.open(waUrl(lines.join("\n")), "_blank", "noopener");
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
