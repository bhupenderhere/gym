const siteHeader = document.getElementById("site-header");
const siteFooter = document.getElementById("site-footer");
const trialTicketStorageKey = "aquilaStrengthTrialTicket";
let activeTrialTicket = null;

const siteConfig = {
  brandName: "Aquila Strength Gym",
  logoSrc: "/images/aquila-logo.jpg",
  logoAlt: "Aquila Strength Gym logo",
  phoneHref: "tel:+15550123456",
  phoneLabel: "+1 (555) 012-3456",
  facebookHref: "https://www.facebook.com/",
  instagramHref: "https://www.instagram.com/aquilastrength/",
  whatsappHref: "https://wa.me/15550123456",
  emailHref: "mailto:hello@aquilastrengthgym.com",
  emailLabel: "hello@aquilastrengthgym.com",
  address: "Vasishat Niwas, Sanjauli Cemetery Rd, Cemetery, Sanjauli, Shimla, Himachal Pradesh 171006",
  footerTagline: "Premium coaching, focused training, and a community built around results.",
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Programs", href: "/pages/programs.html" },
    { label: "Pricing", href: "/pages/pricing.html" },
    { label: "Trainers", href: "/pages/trainers.html" },
    { label: "Contact", href: "/pages/contact.html" },
  ],
  socialLinks: [],
};

siteConfig.socialLinks = [
  { label: "Facebook", href: siteConfig.facebookHref, icon: "facebook" },
  { label: "Instagram", href: siteConfig.instagramHref, icon: "instagram" },
  { label: "WhatsApp", href: siteConfig.whatsappHref, icon: "whatsapp" },
  { label: "Email", href: siteConfig.emailHref, icon: "email" },
];

const instagramPreviewPosts = [
  {
    title: "Strength Floor Sessions",
    tag: "Gym Floor",
    imageSrc: "/images/gym-floor.jpg",
    imageAlt: "Main gym floor at Aquila Strength Gym",
    caption: "Heavy compounds, focused coaching, and peak training-hour energy.",
    href: siteConfig.instagramHref,
  },
  {
    title: "Free Weights In Action",
    tag: "Lifting",
    imageSrc: "/images/free-weights.jpg",
    imageAlt: "Free weights area at Aquila Strength Gym",
    caption: "Built for serious strength work, progressive overload, and consistent sessions.",
    href: siteConfig.instagramHref,
  },
  {
    title: "Small Group Energy",
    tag: "Community",
    imageSrc: "/images/group-workout.jpg",
    imageAlt: "Group training session at Aquila Strength Gym",
    caption: "High-accountability training blocks for members who push harder together.",
    href: siteConfig.instagramHref,
  },
  {
    title: "Coach-Led Training",
    tag: "Coaching",
    imageSrc: "/images/personal-training.jpg",
    imageAlt: "Personal training session at Aquila Strength Gym",
    caption: "Technique work, structure, and guided sessions for faster progress.",
    href: siteConfig.instagramHref,
  },
];

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const escapeAttribute = (value) => escapeHtml(value);

const formatDisplayDate = (value) => {
  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const escapePdfText = (value) =>
  String(value)
    .replace(/[^\x20-\x7e]/g, "?")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");

const encodeFormBody = (formData) =>
  new URLSearchParams([...formData.entries()].map(([key, value]) => [key, String(value)])).toString();

const buildTicketCode = () => {
  if (window.crypto && typeof window.crypto.getRandomValues === "function") {
    const values = new Uint32Array(2);
    window.crypto.getRandomValues(values);
    return `AQ-${values[0].toString(36).slice(-4).toUpperCase()}${values[1]
      .toString(36)
      .slice(-4)
      .toUpperCase()}`;
  }

  return `AQ-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
};

const getCurrentPath = () => window.location.pathname || "/";

const isCurrentPath = (href) => {
  const currentPath = getCurrentPath();

  if (href === "/") {
    return currentPath === "/" || currentPath.endsWith("/index.html");
  }

  return currentPath === href || currentPath.endsWith(href);
};

const socialIcons = {
  facebook: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.7-1.6H16.8V4.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.2V11H7.8v3h2.6v8h3.1Z"></path>
    </svg>
  `,
  instagram: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7 2h10c2.8 0 5 2.2 5 5v10c0 2.8-2.2 5-5 5H7c-2.8 0-5-2.2-5-5V7c0-2.8 2.2-5 5-5Zm0 2C5.3 4 4 5.3 4 7v10c0 1.7 1.3 3 3 3h10c1.7 0 3-1.3 3-3V7c0-1.7-1.3-3-3-3H7Zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5Zm5.2-3.4a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1Z"></path>
    </svg>
  `,
  whatsapp: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 3.5a8.5 8.5 0 0 0-7.24 12.95L3.9 20.5l4.18-.82A8.5 8.5 0 1 0 12 3.5Z"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M9.3 8.7c-.3 0-.6.14-.8.42-.3.42-.7 1.03-.7 1.83 0 .93.56 1.85.65 1.98.1.14 1.28 2.02 3.16 2.8 1.55.63 1.9.5 2.24.48.34-.02 1.06-.43 1.2-.84.14-.4.14-.75.1-.82-.05-.08-.18-.13-.39-.23-.2-.1-1.18-.58-1.37-.64-.18-.06-.32-.09-.44.1-.13.2-.52.63-.64.76-.12.14-.23.16-.43.06-.2-.1-.84-.32-1.58-.97-.59-.53-.98-1.18-1.1-1.38-.12-.2-.03-.31.08-.42.1-.1.2-.23.3-.35.1-.12.14-.2.2-.34.07-.13.04-.25-.01-.35l-.6-1.45c-.1-.22-.26-.34-.47-.34H9.3Z"
      ></path>
    </svg>
  `,
  email: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v.2l9 5.8 9-5.8V7H3Zm18 10V9.6l-8.5 5.5a1 1 0 0 1-1 0L3 9.6V17h18Z"></path>
    </svg>
  `,
};

const buildHeaderMarkup = () => {
  const navLinksMarkup = siteConfig.navLinks
    .map((link) => {
      const isActive = isCurrentPath(link.href);
      return `<a href="${escapeAttribute(link.href)}"${isActive ? ' aria-current="page"' : ""}>${escapeHtml(
        link.label
      )}</a>`;
    })
    .join("");

  return `
    <nav class="navbar container">
      <a class="logo" href="/" aria-label="${escapeAttribute(siteConfig.brandName)} home">
        <img
          class="logo-mark"
          src="${escapeAttribute(siteConfig.logoSrc)}"
          alt="${escapeAttribute(siteConfig.logoAlt)}"
          width="52"
          height="52"
        />
        <span class="logo-text">${escapeHtml(siteConfig.brandName)}</span>
      </a>
      <button
        class="nav-toggle"
        type="button"
        aria-expanded="false"
        aria-controls="nav-menu"
        aria-label="Open navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div class="nav-menu" id="nav-menu">
        ${navLinksMarkup}
        <a class="nav-cta" href="/pages/contact.html#contact-form">Free Trial</a>
      </div>
    </nav>
  `;
};

const buildFooterMarkup = () => {
  const currentYear = new Date().getFullYear();
  const footerLinksMarkup = siteConfig.navLinks
    .map((link) => {
      const isActive = isCurrentPath(link.href);
      return `<a href="${escapeAttribute(link.href)}"${isActive ? ' aria-current="page"' : ""}>${escapeHtml(
        link.label
      )}</a>`;
    })
    .join("");

  const socialLinksMarkup = siteConfig.socialLinks
    .map((link) => {
      const isExternal = /^https?:\/\//.test(link.href);
      return `
        <a
          class="footer-social-link"
          href="${escapeAttribute(link.href)}"
          aria-label="${escapeAttribute(link.label)}"
          title="${escapeAttribute(link.label)}"
          ${isExternal ? 'target="_blank" rel="noreferrer"' : ""}
        >
          ${socialIcons[link.icon] || ""}
          <span class="sr-only">${escapeHtml(link.label)}</span>
        </a>
      `;
    })
    .join("");

  return `
    <div class="container footer-grid">
      <div class="footer-brand">
        <a class="logo footer-logo" href="/" aria-label="${escapeAttribute(siteConfig.brandName)} home">
          <img
            class="logo-mark"
            src="${escapeAttribute(siteConfig.logoSrc)}"
            alt="${escapeAttribute(siteConfig.logoAlt)}"
            width="52"
            height="52"
          />
          <span class="logo-text">${escapeHtml(siteConfig.brandName)}</span>
        </a>
        <p>${escapeHtml(siteConfig.footerTagline)}</p>
        <div class="footer-contact-list">
          <a href="${escapeAttribute(siteConfig.phoneHref)}">${escapeHtml(siteConfig.phoneLabel)}</a>
          <a href="${escapeAttribute(siteConfig.emailHref)}">${escapeHtml(siteConfig.emailLabel)}</a>
          <p>${escapeHtml(siteConfig.address)}</p>
        </div>
      </div>
      <div class="footer-column">
        <p class="footer-title">Quick Links</p>
        <div class="footer-links">
          ${footerLinksMarkup}
        </div>
      </div>
      <div class="footer-column">
        <p class="footer-title">Follow &amp; Contact</p>
        <div class="footer-socials">
          ${socialLinksMarkup}
        </div>
        <a class="btn btn-primary footer-cta" href="/pages/contact.html#contact-form">Get Free Trial</a>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <p>&copy; ${currentYear} ${escapeHtml(siteConfig.brandName)}. All rights reserved.</p>
        <p>Built to drive free trials, calls, and walk-ins.</p>
      </div>
    </div>
  `;
};

if (siteHeader) {
  siteHeader.innerHTML = buildHeaderMarkup();
}

if (siteFooter) {
  siteFooter.innerHTML = buildFooterMarkup();
}

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.getElementById("contact-form");
const feedback = document.getElementById("form-feedback");
const instagramPostGrid = document.getElementById("instagram-post-grid");
const trialDateInput = document.getElementById("trial-date");
const trialDateTrigger = document.querySelector('[data-date-trigger="trial-date"]');
const trialTicketPanel = document.getElementById("trial-ticket-panel");
const downloadTicketButton = document.getElementById("download-ticket");
const ticketCodeInput = document.getElementById("ticket-code-input");
const ticketIssuedInput = document.getElementById("ticket-issued-input");
const ticketStatusInput = document.getElementById("ticket-status-input");
const ticketSubjectInput = document.getElementById("ticket-subject-input");
const ticketCodeElement = document.getElementById("ticket-code");
const ticketNameElement = document.getElementById("ticket-name");
const ticketPhoneElement = document.getElementById("ticket-phone");
const ticketDateElement = document.getElementById("ticket-date");
const ticketIssuedElement = document.getElementById("ticket-issued");
const ticketNoteElement = document.getElementById("ticket-note");

const getHashTarget = () => {
  if (!window.location.hash) {
    return null;
  }

  try {
    const target = document.querySelector(window.location.hash);
    return target instanceof HTMLElement ? target : null;
  } catch (error) {
    return null;
  }
};

const getStickyHeaderOffset = () => {
  const headerHeight = siteHeader instanceof HTMLElement ? siteHeader.offsetHeight : 0;
  return headerHeight + 24;
};

const renderInstagramWidget = () => {
  if (!instagramPostGrid) {
    return;
  }

  instagramPostGrid.innerHTML = instagramPreviewPosts
    .map(
      (post) => `
        <a
          class="instagram-post-card"
          href="${escapeAttribute(post.href)}"
          target="_blank"
          rel="noreferrer"
          aria-label="${escapeAttribute(`${post.title} on Instagram profile @aquilastrength`)}"
        >
          <div class="instagram-post-media">
            <img
              src="${escapeAttribute(post.imageSrc)}"
              alt="${escapeAttribute(post.imageAlt)}"
              loading="lazy"
            />
          </div>
          <div class="instagram-post-body">
            <span class="instagram-post-tag">${escapeHtml(post.tag)}</span>
            <strong>${escapeHtml(post.title)}</strong>
            <p>${escapeHtml(post.caption)}</p>
            <span class="instagram-post-link">View Profile</span>
          </div>
        </a>
      `
    )
    .join("");
};

const scrollToHashTarget = (behavior = "smooth") => {
  const target = getHashTarget();

  if (!target) {
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - getStickyHeaderOffset();
  window.scrollTo({
    top: Math.max(top, 0),
    behavior,
  });
};

const syncHashScroll = (behavior = "smooth") => {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      scrollToHashTarget(behavior);
    });
  });
};

const renderTrialTicket = (ticket) => {
  if (
    !trialTicketPanel ||
    !ticketCodeElement ||
    !ticketNameElement ||
    !ticketPhoneElement ||
    !ticketDateElement ||
    !ticketIssuedElement ||
    !ticketNoteElement
  ) {
    return;
  }

  ticketCodeElement.textContent = ticket.code;
  ticketNameElement.textContent = ticket.name;
  ticketPhoneElement.textContent = ticket.phone;
  ticketDateElement.textContent = formatDisplayDate(ticket.trialDate);
  ticketIssuedElement.textContent = formatDisplayDate(ticket.issuedAt);
  ticketNoteElement.textContent = `Present this pass with your phone number at the front desk on ${formatDisplayDate(
    ticket.trialDate
  )}.`;
  activeTrialTicket = ticket;
  trialTicketPanel.hidden = false;
};

const wrapPdfText = (value, maxLength = 62) => {
  const words = escapePdfText(value).split(/\s+/).filter(Boolean);
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (nextLine.length <= maxLength) {
      currentLine = nextLine;
      return;
    }

    if (currentLine) {
      lines.push(currentLine);
    }
    currentLine = word;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length ? lines : [""];
};

const createPdfBlob = (ticket) => {
  const encoder = new TextEncoder();
  const contentLines = [
    "0.89 0.11 0.14 RG",
    "2 w",
    "36 60 523 730 re S",
    "0.89 0.11 0.14 rg",
    "36 720 523 70 re f",
    "1 1 1 rg",
    "BT",
    "/F1 26 Tf",
    "50 760 Td",
    "(Aquila Strength Gym) Tj",
    "ET",
    "BT",
    "/F1 12 Tf",
    "50 738 Td",
    "(Free Trial Check-In Pass) Tj",
    "ET",
    "0 0 0 rg",
    "BT",
    "/F1 12 Tf",
    "50 684 Td",
    `(Ticket ID: ${escapePdfText(ticket.code)}) Tj`,
    "0 -28 Td",
    `(Guest: ${escapePdfText(ticket.name)}) Tj`,
    "0 -28 Td",
    `(Phone: ${escapePdfText(ticket.phone)}) Tj`,
    "0 -28 Td",
    `(Trial Date: ${escapePdfText(formatDisplayDate(ticket.trialDate))}) Tj`,
    "0 -28 Td",
    `(Issued: ${escapePdfText(formatDisplayDate(ticket.issuedAt))}) Tj`,
    "ET",
    "0.89 0.11 0.14 rg",
    "50 500 495 1 re f",
    "0 0 0 rg",
    "BT",
    "/F1 12 Tf",
    "50 476 Td",
    "(Goal / Notes:) Tj",
    "ET",
  ];

  wrapPdfText(ticket.message, 68).forEach((line, index) => {
    contentLines.push("BT");
    contentLines.push("/F1 11 Tf");
    contentLines.push(`50 ${452 - index * 18} Td`);
    contentLines.push(`(${line}) Tj`);
    contentLines.push("ET");
  });

  const noteStartY = 388 - Math.max(wrapPdfText(ticket.message, 68).length - 1, 0) * 18;
  contentLines.push("0.89 0.11 0.14 rg");
  contentLines.push(`50 ${noteStartY} 495 1 re f`);
  contentLines.push("0 0 0 rg");
  contentLines.push("BT");
  contentLines.push("/F1 12 Tf");
  contentLines.push(`50 ${noteStartY - 24} Td`);
  contentLines.push("(Show this pass at the front desk before starting your free trial.) Tj");
  contentLines.push("ET");

  const stream = `${contentLines.join("\n")}\n`;
  const streamBytes = encoder.encode(stream);

  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Count 1 /Kids [3 0 R] >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    `5 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n${stream}endstream\nendobj\n`,
  ];

  const chunks = [encoder.encode("%PDF-1.4\n")];
  const offsets = [0];
  let currentOffset = chunks[0].length;

  objects.forEach((object) => {
    offsets.push(currentOffset);
    const encodedObject = encoder.encode(object);
    chunks.push(encodedObject);
    currentOffset += encodedObject.length;
  });

  const xrefOffset = currentOffset;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;

  offsets.slice(1).forEach((offset) => {
    xref += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });

  xref += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  chunks.push(encoder.encode(xref));

  return new Blob(chunks, { type: "application/pdf" });
};

const downloadTrialTicket = (ticket) => {
  const blob = createPdfBlob(ticket);
  const link = document.createElement("a");
  const objectUrl = URL.createObjectURL(blob);
  link.href = objectUrl;
  link.download = `${ticket.code.toLowerCase()}-trial-ticket.pdf`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
};

const loadStoredTrialTicket = () => {
  try {
    const rawValue = window.localStorage.getItem(trialTicketStorageKey);
    if (!rawValue) {
      return null;
    }

    const parsedTicket = JSON.parse(rawValue);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(parsedTicket.trialDate) < today) {
      window.localStorage.removeItem(trialTicketStorageKey);
      return null;
    }

    return parsedTicket;
  } catch (error) {
    return null;
  }
};

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.classList.toggle("active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (
      target instanceof HTMLElement &&
      !navMenu.contains(target) &&
      !navToggle.contains(target)
    ) {
      navMenu.classList.remove("open");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      navMenu.classList.remove("open");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

renderInstagramWidget();

if (window.location.hash) {
  syncHashScroll("auto");
  window.addEventListener("load", () => syncHashScroll("auto"), { once: true });
}

window.addEventListener("hashchange", () => {
  syncHashScroll("smooth");
});

if (trialDateInput) {
  trialDateInput.min = new Date().toISOString().split("T")[0];
}

if (trialDateInput && trialDateTrigger instanceof HTMLButtonElement) {
  trialDateTrigger.addEventListener("click", () => {
    trialDateInput.focus();

    if (typeof trialDateInput.showPicker === "function") {
      trialDateInput.showPicker();
      return;
    }

    trialDateInput.click();
  });
}

const storedTrialTicket = loadStoredTrialTicket();
if (storedTrialTicket) {
  activeTrialTicket = storedTrialTicket;
  renderTrialTicket(storedTrialTicket);
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

if (contactForm && feedback) {
  const requiredFields = [...contactForm.querySelectorAll("[required]")];

  const validateField = (field) => {
    const value = field.value.trim();
    let isValid = value.length > 1;

    if (field.name === "phone") {
      const digits = value.replace(/\D/g, "");
      isValid = digits.length >= 10;
    }

    if (field.name === "trialDate") {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      isValid = value.length > 0 && selectedDate >= today;
    }

    field.classList.toggle("field-error", !isValid);
    return isValid;
  };

  requiredFields.forEach((field) => {
    field.addEventListener("input", () => {
      validateField(field);
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const isFormValid = requiredFields.every((field) => validateField(field));

    if (!isFormValid) {
      feedback.textContent = "Please fill all fields correctly before submitting.";
      feedback.classList.remove("success");
      return;
    }

    const nameField = contactForm.elements.namedItem("name");
    const phoneField = contactForm.elements.namedItem("phone");
    const trialDateField = contactForm.elements.namedItem("trialDate");
    const messageField = contactForm.elements.namedItem("message");

    if (
      !(nameField instanceof HTMLInputElement) ||
      !(phoneField instanceof HTMLInputElement) ||
      !(trialDateField instanceof HTMLInputElement) ||
      !(messageField instanceof HTMLTextAreaElement)
    ) {
      feedback.textContent = "The booking form is misconfigured. Please refresh and try again.";
      feedback.classList.remove("success");
      return;
    }

    const ticket = {
      code: buildTicketCode(),
      name: nameField.value.trim(),
      phone: phoneField.value.trim(),
      trialDate: trialDateField.value.trim(),
      message: messageField.value.trim(),
      issuedAt: new Date().toISOString(),
    };
    const submitButton = contactForm.querySelector('button[type="submit"]');

    if (ticketCodeInput) {
      ticketCodeInput.value = ticket.code;
    }

    if (ticketIssuedInput) {
      ticketIssuedInput.value = ticket.issuedAt;
    }

    if (ticketStatusInput) {
      ticketStatusInput.value = "Booked";
    }

    if (ticketSubjectInput) {
      ticketSubjectInput.value = `New free trial booking - ${ticket.code}`;
    }

    const formData = new FormData(contactForm);

    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
      submitButton.textContent = "Booking...";
    }

    feedback.textContent = "Submitting your booking...";
    feedback.classList.remove("success");

    fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: encodeFormBody(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Submission failed.");
        }

        try {
          window.localStorage.setItem(trialTicketStorageKey, JSON.stringify(ticket));
        } catch (error) {
          // Ignore storage failures and still render the ticket for the current session.
        }

        renderTrialTicket(ticket);
        feedback.textContent =
          "Free trial booked. The booking was submitted and your ticket is ready below.";
        feedback.classList.add("success");
      })
      .catch(() => {
        feedback.textContent =
          "Your ticket could not be submitted right now. Please try again after the site is deployed on Netlify.";
        feedback.classList.remove("success");
      })
      .finally(() => {
        if (submitButton instanceof HTMLButtonElement) {
          submitButton.disabled = false;
          submitButton.textContent = "Book Free Trial";
        }
      });
  });
}

if (downloadTicketButton) {
  downloadTicketButton.addEventListener("click", () => {
    const ticket = activeTrialTicket || loadStoredTrialTicket();
    if (ticket) {
      downloadTrialTicket(ticket);
    }
  });
}
