// NOIR ÉTOILE — small interactions (tabs, smooth scroll, modal, toast)

const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

/* Tabs */
const tabs = $$(".tab");
const panels = $$(".menu-panel");

tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.tab;

    tabs.forEach(t => {
      t.classList.toggle("is-active", t === btn);
      t.setAttribute("aria-selected", t === btn ? "true" : "false");
    });

    panels.forEach(p => p.classList.toggle("is-active", p.dataset.panel === key));

    // smooth scroll to the menu section area
    btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  });
});

/* Smooth scroll helpers */
$$("[data-scroll]").forEach(el => {
  el.addEventListener("click", () => {
    const target = el.getAttribute("data-scroll");
    const node = $(target);
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

/* Modal */
const modal = $("#modal");
const openReservation = $("#openReservation");
const openPairing = $("#openPairing");

function openModal() {
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

openReservation?.addEventListener("click", openModal);
openPairing?.addEventListener("click", openModal);

modal?.addEventListener("click", (e) => {
  const close = e.target?.getAttribute?.("data-close");
  if (close) closeModal();
});

/* Fake submit toast */
const fakeSubmit = $("#fakeSubmit");

function toast(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.position = "fixed";
  t.style.left = "50%";
  t.style.bottom = "22px";
  t.style.transform = "translateX(-50%)";
  t.style.padding = "12px 14px";
  t.style.borderRadius = "999px";
  t.style.border = "1px solid rgba(201,162,77,.35)";
  t.style.background = "rgba(10,10,10,.78)";
  t.style.backdropFilter = "blur(8px)";
  t.style.color = "rgba(245,243,239,.92)";
  t.style.letterSpacing = ".12em";
  t.style.textTransform = "uppercase";
  t.style.fontSize = "12px";
  t.style.boxShadow = "0 18px 60px rgba(0,0,0,.55)";
  t.style.zIndex = "60";
  document.body.appendChild(t);

  setTimeout(() => {
    t.style.transition = "opacity .25s ease";
    t.style.opacity = "0";
    setTimeout(() => t.remove(), 250);
  }, 1400);
}

fakeSubmit?.addEventListener("click", () => {
  toast("Talep oluşturuldu (demo)");
});

// ======================
// QR MENU (GitHub Pages URL)
// ======================
(function () {
  const qrModal = document.getElementById("qrModal");
  const qrBox = document.getElementById("qrBox");
  const qrLinkText = document.getElementById("qrLinkText");
  const copyBtn = document.getElementById("copyQrLink");
  const openBtn = document.getElementById("openQrLink");

  // Üstteki Rezervasyon butonunun yanına QR butonu ekleyelim (JS ile)
  const topbar = document.querySelector(".topbar");
  const reservationBtn = document.getElementById("openReservation");

  if (topbar && reservationBtn) {
    const qrBtn = document.createElement("button");
    qrBtn.className = "btn btn-outline";
    qrBtn.type = "button";
    qrBtn.id = "openQrMenu";
    qrBtn.textContent = "QR Menü";
    reservationBtn.insertAdjacentElement("afterend", qrBtn);

    qrBtn.addEventListener("click", openQr);
  }

  // QR için link: site canlıysa kendi adresi, değilse github pages yazabilirsin
  // En sağlamı: current URL
  function getMenuUrl() {
    return window.location.href.split("#")[0]; // hash temiz
  }

  let qrInstance = null;

  function openQr() {
    if (!qrModal) return;

    const url = getMenuUrl();
    qrLinkText.textContent = url;

    // QR'ı her açışta temizle
    if (qrBox) qrBox.innerHTML = "";

    // QR oluştur
    qrInstance = new QRCode(qrBox, {
      text: url,
      width: 220,
      height: 220,
      correctLevel: QRCode.CorrectLevel.M
    });

    qrModal.setAttribute("aria-hidden", "false");
    qrModal.classList.add("is-open");
  }

  function closeQr() {
    if (!qrModal) return;
    qrModal.setAttribute("aria-hidden", "true");
    qrModal.classList.remove("is-open");
  }

  // Kapatma alanları
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.matches("[data-qr-close='true']")) closeQr();
  });

  // ESC ile kapat
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeQr();
  });

  // Link kopyala
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        const url = getMenuUrl();
        await navigator.clipboard.writeText(url);
        toast("Link kopyalandı ✅");
      } catch {
        toast("Kopyalama başarısız ❌");
      }
    });
  }

  // Link aç
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      window.open(getMenuUrl(), "_blank");
    });
  }

  // Basit toast (senin tasarıma uygun minimal)
  function toast(msg) {
    let t = document.getElementById("toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      t.style.position = "fixed";
      t.style.bottom = "18px";
      t.style.left = "50%";
      t.style.transform = "translateX(-50%)";
      t.style.padding = "12px 14px";
      t.style.border = "1px solid rgba(255,255,255,.14)";
      t.style.background = "rgba(0,0,0,.6)";
      t.style.backdropFilter = "blur(10px)";
      t.style.borderRadius = "999px";
      t.style.fontSize = "12px";
      t.style.letterSpacing = ".14em";
      t.style.textTransform = "uppercase";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = "1";
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => (t.style.opacity = "0"), 1600);
  }
})();

