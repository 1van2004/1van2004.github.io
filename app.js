// app.js
(() => {
  const root = document.documentElement;

  // Año
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Tema (persistente)
  const THEME_KEY = "portfolio-theme";
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light") root.setAttribute("data-theme", "light");

  const toggleTheme = () => {
    const isLight = root.getAttribute("data-theme") === "light";
    if (isLight) {
      root.removeAttribute("data-theme");
      localStorage.setItem(THEME_KEY, "dark");
    } else {
      root.setAttribute("data-theme", "light");
      localStorage.setItem(THEME_KEY, "light");
    }
  };

  document.getElementById("themeBtn")?.addEventListener("click", toggleTheme);
  document.getElementById("themeBtn2")?.addEventListener("click", toggleTheme);

  // Menú móvil
  const burger = document.getElementById("burger");
  const mobileNav = document.getElementById("mobileNav");

  const closeMobile = () => {
    burger?.classList.remove("is-open");
    mobileNav?.classList.remove("is-open");
    mobileNav?.setAttribute("aria-hidden", "true");
    burger?.setAttribute("aria-label", "Abrir menú");
  };

  const openMobile = () => {
    burger?.classList.add("is-open");
    mobileNav?.classList.add("is-open");
    mobileNav?.setAttribute("aria-hidden", "false");
    burger?.setAttribute("aria-label", "Cerrar menú");
  };

  burger?.addEventListener("click", () => {
    const isOpen = burger.classList.contains("is-open");
    isOpen ? closeMobile() : openMobile();
  });

  mobileNav?.addEventListener("click", (e) => {
    if (e.target === mobileNav) closeMobile();
  });

  mobileNav?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => closeMobile());
  });

  // Scroll suave
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Cursor glow
  const glow = document.querySelector(".cursor-glow");
  let gx = -9999, gy = -9999;
  let tx = -9999, ty = -9999;

  window.addEventListener("mousemove", (e) => {
    tx = e.clientX - 210;
    ty = e.clientY - 210;
    if (glow) glow.style.opacity = "0.85";
  }, { passive: true });

  window.addEventListener("mouseleave", () => {
    if (glow) glow.style.opacity = "0";
  });

  const tickGlow = () => {
    gx += (tx - gx) * 0.12;
    gy += (ty - gy) * 0.12;
    if (glow) {
      glow.style.left = gx + "px";
      glow.style.top = gy + "px";
    }
    requestAnimationFrame(tickGlow);
  };
  tickGlow();

  // Reveal on scroll
  const reveals = [...document.querySelectorAll(".reveal")];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((ent) => {
      if (ent.isIntersecting) {
        ent.target.classList.add("is-in");
        io.unobserve(ent.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach((el) => io.observe(el));

  // Count-up stats
  const countEls = [...document.querySelectorAll("[data-count]")];
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((ent) => {
      if (!ent.isIntersecting) return;
      const el = ent.target;
      const end = Number(el.getAttribute("data-count") || "0");
      const dur = 900;
      const t0 = performance.now();

      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(end * eased));
        if (p < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
      countIO.unobserve(el);
    });
  }, { threshold: 0.35 });
  countEls.forEach((el) => countIO.observe(el));

  // Tilt cards (hover effect)
  const tilts = [...document.querySelectorAll("[data-tilt]")];
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  tilts.forEach((card) => {
    let rect = null;
    let raf = 0;

    const onEnter = () => {
      rect = card.getBoundingClientRect();
      card.style.transition = "transform 120ms ease";
      setTimeout(() => (card.style.transition = ""), 140);
    };

    const onMove = (e) => {
      if (!rect) rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      const rx = clamp((py - 0.5) * 14, -10, 10);
      const ry = clamp((px - 0.5) * -18, -12, 12);

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
      });
    };

    const onLeave = () => {
      rect = null;
      card.style.transition = "transform 180ms ease";
      card.style.transform = "none";
      setTimeout(() => (card.style.transition = ""), 200);
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
  });

  // Modal "Más detalles"
  const modal = document.getElementById("detailsModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const modalClose = document.getElementById("modalClose");
  const modalOk = document.getElementById("modalOk");

  const openModal = (title, body) => {
    if (!modal) return;
    if (modalTitle) modalTitle.textContent = title || "Detalles";
    if (modalBody) modalBody.textContent = body || "";
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  };

  document.querySelectorAll(".js-details").forEach((btn) => {
    btn.addEventListener("click", () => {
      const title = btn.getAttribute("data-title") || "Detalles";
      const body = btn.getAttribute("data-body") || "";
      openModal(title, body);
    });
  });

  modalClose?.addEventListener("click", closeModal);
  modalOk?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Formulario con validación (interacción obligatoria)
  const form = document.getElementById("contactForm");
  const hint = document.getElementById("formHint");

  const setError = (name, msg) => {
    const el = document.querySelector(`[data-error-for="${name}"]`);
    if (el) el.textContent = msg || "";
  };

  const validate = (data) => {
    let ok = true;

    // nombre
    const name = (data.get("name") || "").toString().trim();
    if (name.length < 3) { setError("name", "Escribí un nombre válido (mín. 3 caracteres)."); ok = false; }
    else setError("name", "");

    // email
    const email = (data.get("email") || "").toString().trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
    if (!emailOk) { setError("email", "Email inválido (ej: correo@ejemplo.com)."); ok = false; }
    else setError("email", "");

    // mensaje
    const msg = (data.get("message") || "").toString().trim();
    if (msg.length < 10) { setError("message", "El mensaje debe tener al menos 10 caracteres."); ok = false; }
    else setError("message", "");

    return ok;
  };

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const ok = validate(fd);

    if (!ok) {
      if (hint) hint.textContent = "Revisá los campos marcados y volvé a intentar.";
      return;
    }

    // Demo: simulación
    if (hint) hint.textContent = "Mensaje validado. En un deploy real se conecta a un backend/email.";
    form.reset();
  });
})();