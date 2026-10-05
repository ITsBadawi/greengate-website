/**
 * GREEN GATE - $10,000 LUXURY INTERACTION & MOTION ENGINE
 * Powered by GSAP 3.12, ScrollTrigger, Lenis Smooth Scroll
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons immediately
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 1. Language State Management
  let currentLang = localStorage.getItem("greengate_lang") || "ar"; // Default to Arabic for Iraqi corporate identity
  
  const setLanguage = (lang, animate = true) => {
    currentLang = lang;
    localStorage.setItem("greengate_lang", lang);
    const html = document.documentElement;
    
    // Set direction and lang attribute
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";
    
    // Update switch buttons
    document.querySelectorAll(".lang-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    const dict = translations[lang];
    if (!dict) return;

    if (animate && typeof gsap !== "undefined") {
      gsap.to("[data-i18n], [data-i18n-ph]", {
        opacity: 0,
        duration: 0.15,
        ease: "power2.out",
        onComplete: () => {
          applyTranslations(dict);
          gsap.to("[data-i18n], [data-i18n-ph]", {
            opacity: 1,
            duration: 0.25,
            ease: "power2.out"
          });
        }
      });
    } else {
      applyTranslations(dict);
    }
  };

  const applyTranslations = (dict) => {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    document.querySelectorAll("[data-i18n-ph]").forEach(el => {
      const key = el.dataset.i18nPh;
      if (dict[key]) {
        el.placeholder = dict[key];
      }
    });
  };

  // Wire language switcher buttons
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const selected = btn.dataset.lang;
      if (selected !== currentLang) {
        setLanguage(selected, true);
      }
    });
  });

  // Apply initial language
  setLanguage(currentLang, false);

  // 2. Lenis Smooth Momentum Scroll & GSAP Sync
  let lenis;
  if (typeof Lenis !== "undefined") {
    lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2
    });

    if (typeof ScrollTrigger !== "undefined") {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    // Anchor links smooth jump via Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function(e) {
        const targetId = this.getAttribute("href");
        if (targetId.length > 1) {
          e.preventDefault();
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            lenis.scrollTo(targetEl, { offset: -80, duration: 1.2 });
            // Close mobile menu if open
            closeMobileMenu();
          }
        }
      });
    });
  }

  // 3. Custom Physics Cursor
  const cursorDot = document.querySelector(".custom-cursor");
  const cursorFollower = document.querySelector(".custom-cursor-follower");

  if (cursorDot && cursorFollower && window.matchMedia("(pointer: fine)").matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    const renderCursor = () => {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    // Hover effect on interactives
    const interactiveElements = document.querySelectorAll("a, button, input, textarea, select, .glass-card, .facility-tab-btn, .hub-node, .gallery-thumb");
    interactiveElements.forEach(el => {
      el.addEventListener("mouseenter", () => document.body.classList.add("hovering"));
      el.addEventListener("mouseleave", () => document.body.classList.remove("hovering"));
    });
  }

  // 4. GSAP Motion Orchestration
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // Sticky Navbar Glass Effect
    const navbar = document.querySelector(".header-nav");
    if (navbar) {
      ScrollTrigger.create({
        start: "top -50",
        onUpdate: (self) => {
          if (self.progress > 0) {
            navbar.classList.add("scrolled");
          } else {
            navbar.classList.remove("scrolled");
          }
        }
      });
    }

    // Hero Entrance Timeline
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    heroTl.fromTo(".header-nav", 
      { y: -80, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, clearProps: "transform,opacity" }
    )
    .fromTo(".hero-badge-wrap", 
      { scale: 0.85, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.8, clearProps: "transform,opacity" }, 
      "-=0.6"
    )
    .fromTo(".hero-title", 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.1, clearProps: "transform,opacity" }, 
      "-=0.6"
    )
    .fromTo(".hero-subtitle", 
      { y: 35, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.9, clearProps: "transform,opacity" }, 
      "-=0.8"
    )
    .fromTo(".hero-cta-group a", 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, clearProps: "transform,opacity" }, 
      "-=0.7"
    )
    .fromTo(".stat-box", 
      { y: 35, opacity: 0 }, 
      { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, clearProps: "transform,opacity" }, 
      "-=0.6"
    )
    .fromTo(".hero-visual-card", 
      { scale: 0.94, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 1.2, ease: "expo.out", clearProps: "transform,opacity" }, 
      "-=1.1"
    )
    .fromTo(".floating-glass-card", 
      { scale: 0.8, opacity: 0 }, 
      { scale: 1, opacity: 1, stagger: 0.2, duration: 0.9, clearProps: "opacity" }, 
      "-=0.8"
    );

    // Parallax on Hero Visual
    gsap.to(".hero-visual-card img", {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Staggered reveals on section headers
    gsap.utils.toArray(".section-header-reveal").forEach(header => {
      gsap.from(header.children, {
        scrollTrigger: {
          trigger: header,
          start: "top 88%",
          once: true
        },
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out",
        clearProps: "all"
      });
    });

    // Staggered cards reveal
    const animateGridItems = (selector) => {
      const items = gsap.utils.toArray(selector);
      if (items.length > 0) {
        gsap.from(items, {
          scrollTrigger: {
            trigger: items[0].parentElement,
            start: "top 85%",
            once: true
          },
          y: 45,
          opacity: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: "power2.out",
          clearProps: "all"
        });
      }
    };

    animateGridItems(".team-card");
    animateGridItems(".activity-card");
    animateGridItems(".hub-badge-item");

    // Animated Count-Up Numbers
    gsap.utils.toArray(".stat-number").forEach(stat => {
      const textVal = stat.innerText;
      const numMatch = textVal.match(/\d+/);
      if (numMatch) {
        const targetNum = parseInt(numMatch[0], 10);
        const suffix = textVal.replace(/\d+/, "");
        
        ScrollTrigger.create({
          trigger: stat,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.fromTo(stat, 
              { innerText: 0 },
              {
                innerText: targetNum,
                duration: 2.2,
                ease: "power2.out",
                snap: { innerText: 1 },
                onUpdate: function() {
                  stat.innerText = Math.round(stat.innerText) + suffix;
                }
              }
            );
          }
        });
      }
    });
  }

  // 5. Interactive Facilities Tabs & Gallery Switcher
  const facilityData = {
    egypt: {
      titleKey: "facilityEgyptTitle",
      descKey: "facilityEgyptDesc",
      mainImg: "https://www.greengate.icu/images/e1.jpg",
      thumbs: [
        "https://www.greengate.icu/images/e1.jpg",
        "https://www.greengate.icu/images/e2.jpg",
        "https://www.greengate.icu/images/e3.jpg"
      ],
      specs: [
        { title: "specLocTitle", val: "Cairo Industrial Zone, Egypt" },
        { title: "specCapTitle", val: "specCapVal" },
        { title: "specSecurityTitle", val: "specSecurityVal" },
        { title: "specStatusTitle", val: "specStatusVal" }
      ]
    },
    jamia: {
      titleKey: "facilityJamiaTitle",
      descKey: "facilityJamiaDesc",
      mainImg: "https://www.greengate.icu/images/j1.jpg",
      thumbs: [
        "https://www.greengate.icu/images/j1.jpg",
        "https://www.greengate.icu/images/j2.jpg",
        "https://www.greengate.icu/images/j3.jpg"
      ],
      specs: [
        { title: "specLocTitle", val: "Al-Jamia District, Baghdad, Iraq" },
        { title: "specCapTitle", val: "specCapVal" },
        { title: "specSecurityTitle", val: "specSecurityVal" },
        { title: "specStatusTitle", val: "specStatusVal" }
      ]
    },
    shurja1: {
      titleKey: "facilityShurja1Title",
      descKey: "facilityShurja1Desc",
      mainImg: "https://www.greengate.icu/images/s1.jpg",
      thumbs: [
        "https://www.greengate.icu/images/s1.jpg",
        "https://www.greengate.icu/images/s2.jpg",
        "https://www.greengate.icu/images/s3.jpg"
      ],
      specs: [
        { title: "specLocTitle", val: "Al-Shurja Commercial Center (Site 1), Baghdad" },
        { title: "specCapTitle", val: "specCapVal" },
        { title: "specSecurityTitle", val: "specSecurityVal" },
        { title: "specStatusTitle", val: "specStatusVal" }
      ]
    },
    shurja2: {
      titleKey: "facilityShurja2Title",
      descKey: "facilityShurja2Desc",
      mainImg: "https://www.greengate.icu/images/sh1.jpg",
      thumbs: [
        "https://www.greengate.icu/images/sh1.jpg",
        "https://www.greengate.icu/images/sh2.jpg",
        "https://www.greengate.icu/images/sh3.jpg"
      ],
      specs: [
        { title: "specLocTitle", val: "Al-Shurja Commercial Center (Site 2), Baghdad" },
        { title: "specCapTitle", val: "specCapVal" },
        { title: "specSecurityTitle", val: "specSecurityVal" },
        { title: "specStatusTitle", val: "specStatusVal" }
      ]
    }
  };

  const tabButtons = document.querySelectorAll(".facility-tab-btn");
  const facilityPanel = document.querySelector(".facility-showcase-panel");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetKey = btn.dataset.facility;
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderFacility(targetKey);
    });
  });

  const renderFacility = (key) => {
    const data = facilityData[key];
    if (!data || !facilityPanel) return;

    const dict = translations[currentLang];
    
    // Smooth transition
    gsap.to(facilityPanel, {
      opacity: 0,
      y: 10,
      duration: 0.2,
      onComplete: () => {
        // Update texts
        const titleEl = facilityPanel.querySelector(".facility-display-title");
        const descEl = facilityPanel.querySelector(".facility-display-desc");
        const mainImgEl = facilityPanel.querySelector(".gallery-main-view img");
        const thumbsWrap = facilityPanel.querySelector(".gallery-thumbs-row");

        if (titleEl) titleEl.innerText = dict[data.titleKey] || data.titleKey;
        if (descEl) descEl.innerText = dict[data.descKey] || data.descKey;
        if (mainImgEl) mainImgEl.src = data.mainImg;

        // Render thumbs
        if (thumbsWrap) {
          thumbsWrap.innerHTML = data.thumbs.map((thumbSrc, idx) => `
            <div class="gallery-thumb ${idx === 0 ? 'active' : ''}" data-src="${thumbSrc}">
              <img src="${thumbSrc}" alt="Thumbnail ${idx + 1}" loading="lazy">
            </div>
          `).join("");

          // Re-attach thumb click events
          thumbsWrap.querySelectorAll(".gallery-thumb").forEach(thumb => {
            thumb.addEventListener("click", () => {
              thumbsWrap.querySelectorAll(".gallery-thumb").forEach(t => t.classList.remove("active"));
              thumb.classList.add("active");
              mainImgEl.src = thumb.dataset.src;
            });
          });
        }

        gsap.to(facilityPanel, {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: "power2.out"
        });
      }
    });
  };

  // 6. Lightbox Modal Viewer
  const lightboxModal = document.querySelector(".lightbox-modal");
  const lightboxImg = document.querySelector(".lightbox-img");
  const lightboxClose = document.querySelector(".lightbox-close");

  const openLightbox = (src) => {
    if (lightboxModal && lightboxImg) {
      lightboxImg.src = src;
      lightboxModal.classList.add("active");
      document.body.style.overflow = "hidden";
      if (lenis) lenis.stop();
    }
  };

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.remove("active");
      document.body.style.overflow = "";
      if (lenis) lenis.start();
    }
  };

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener("click", (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Clickable images to trigger lightbox
  document.addEventListener("click", (e) => {
    if (e.target.matches(".gallery-main-view img, .activity-media-wrap img, .zoomable-img")) {
      openLightbox(e.target.src);
    }
  });

  // 7. Video Player Controls (Nelly Exhibition Video)
  const videoElem = document.querySelector(".nelly-video-player");
  const playBtn = document.querySelector(".play-btn-pulse");

  if (videoElem && playBtn) {
    playBtn.addEventListener("click", () => {
      if (videoElem.paused) {
        videoElem.play();
        playBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
      } else {
        videoElem.pause();
        playBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
      }
    });
  }

  // 8. Mobile Navigation Drawer
  const mobileToggle = document.querySelector(".mobile-toggle");
  const mobileDrawer = document.querySelector(".mobile-menu-drawer");
  const mobileBackdrop = document.querySelector(".mobile-drawer-backdrop");
  const mobileClose = document.querySelector(".mobile-drawer-close");

  const openMobileMenu = () => {
    if (mobileDrawer) mobileDrawer.classList.add("open");
    if (mobileBackdrop) mobileBackdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeMobileMenu = () => {
    if (mobileDrawer) mobileDrawer.classList.remove("open");
    if (mobileBackdrop) mobileBackdrop.classList.remove("active");
    document.body.style.overflow = "";
  };

  if (mobileToggle) mobileToggle.addEventListener("click", openMobileMenu);
  if (mobileClose) mobileClose.addEventListener("click", closeMobileMenu);
  if (mobileBackdrop) mobileBackdrop.addEventListener("click", closeMobileMenu);

  // 9. Working Contact Form with EmailJS & WhatsApp Launch
  const contactForm = document.getElementById("quoteContactForm");
  const formStatus = document.getElementById("formStatusMessage");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const origBtnText = submitBtn.innerHTML;
      const dict = translations[currentLang];

      const firstName = contactForm.querySelector("#formFirstName").value.trim();
      const lastName = contactForm.querySelector("#formLastName").value.trim();
      const email = contactForm.querySelector("#formEmail").value.trim();
      const subject = contactForm.querySelector("#formSubject").value;
      const message = contactForm.querySelector("#formMessage").value.trim();

      if (!firstName || !email || !message) {
        alert(currentLang === "ar" ? "يرجى تعبئة الحقول المطلوبة الإلزامية (*)" : "Please fill in all required fields (*)");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>${dict.formSending || "Transmitting..."}</span>`;

      try {
        // Try EmailJS if library available, or mock success
        if (typeof emailjs !== "undefined") {
          await emailjs.send(
            "service_g5h9o2e",
            "template_xirq8zc",
            {
              from_name: `${firstName} ${lastName}`,
              from_email: email,
              subject: subject,
              message: message
            },
            "EhJ0gDI2OImhDqsmD"
          );
        }

        formStatus.innerHTML = `
          <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid var(--primary-emerald); color: var(--primary-emerald-light); padding: 16px; border-radius: 12px; margin-top: 16px;">
            ${dict.formSuccess}
          </div>
        `;
        contactForm.reset();

        // Optional Confetti blast
        if (typeof confetti !== "undefined") {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.85 } });
        }
      } catch (err) {
        console.error("EmailJS Error:", err);
        formStatus.innerHTML = `
          <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #fca5a5; padding: 16px; border-radius: 12px; margin-top: 16px;">
            ${dict.formError}
          </div>
        `;
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnText;
      }
    });
  }

  // 10. WhatsApp Direct Inquiries with Pre-filled Context
  const setupWhatsAppButtons = () => {
    document.querySelectorAll(".trigger-whatsapp-inquiry").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const inquiryType = btn.dataset.inquiry || "General";
        let text = "";
        if (currentLang === "ar") {
          text = `مرحباً شركة البوابة الخضراء، أود الاستفسار عن خدمات التوريد والتجارة بخصوص: ${inquiryType}`;
        } else {
          text = `Hello Green Gate Company, I would like to inquire about your trading and supply services regarding: ${inquiryType}`;
        }
        const waUrl = `https://wa.me/9647858802023?text=${encodeURIComponent(text)}`;
        window.open(waUrl, "_blank");
      });
    });
  };
  setupWhatsAppButtons();
});
