/**
 * GREEN GATE - CORE LOGIC & REAL GEOGRAPHIC MAP ENGINE
 * Leaflet.js Real CartoDB Dark Map + GSAP Micro-Reveals
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 1. Facilities Data & Renderer
  const facilityData = {
    egypt: {
      titleKey: "facEgyptTitle",
      descKey: "facEgyptDesc",
      locAr: "منطقة المصانع، القاهرة، مصر",
      locEn: "Industrial Zone, Cairo, Egypt",
      mainImg: "https://www.greengate.icu/images/e1.jpg",
      thumbs: [
        "https://www.greengate.icu/images/e1.jpg",
        "https://www.greengate.icu/images/e2.jpg",
        "https://www.greengate.icu/images/e3.jpg"
      ]
    },
    jamia: {
      titleKey: "facJamiaTitle",
      descKey: "facJamiaDesc",
      locAr: "حي الجامعة، بغداد، العراق",
      locEn: "Al-Jamia District, Baghdad, Iraq",
      mainImg: "https://www.greengate.icu/images/j1.jpg",
      thumbs: [
        "https://www.greengate.icu/images/j1.jpg",
        "https://www.greengate.icu/images/j2.jpg",
        "https://www.greengate.icu/images/j3.jpg"
      ]
    },
    shurja1: {
      titleKey: "facShurja1Title",
      descKey: "facShurja1Desc",
      locAr: "سوق الشورجة (الموقع 1)، بغداد",
      locEn: "Al-Shurja Commercial Hub (Site 1), Baghdad",
      mainImg: "https://www.greengate.icu/images/s1.jpg",
      thumbs: [
        "https://www.greengate.icu/images/s1.jpg",
        "https://www.greengate.icu/images/s2.jpg",
        "https://www.greengate.icu/images/s3.jpg"
      ]
    },
    shurja2: {
      titleKey: "facShurja2Title",
      descKey: "facShurja2Desc",
      locAr: "سوق الشورجة (الموقع 2)، بغداد",
      locEn: "Al-Shurja Commercial Hub (Site 2), Baghdad",
      mainImg: "https://www.greengate.icu/images/sh1.jpg",
      thumbs: [
        "https://www.greengate.icu/images/sh1.jpg",
        "https://www.greengate.icu/images/sh2.jpg",
        "https://www.greengate.icu/images/sh3.jpg"
      ]
    }
  };

  const renderFacility = (key) => {
    const data = facilityData[key];
    const facSection = document.getElementById("facilities");
    if (!data || !facSection) return;

    const dict = translations[currentLang];
    if (!dict) return;

    const titleEl = facSection.querySelector(".fac-title-target");
    const descEl = facSection.querySelector(".fac-desc-target");
    const locEl = facSection.querySelector(".fac-loc-target");
    const mainImgEl = facSection.querySelector(".fac-main-img img");
    const thumbsContainer = facSection.querySelector(".fac-thumbs");

    if (titleEl) titleEl.innerText = dict[data.titleKey] || "";
    if (descEl) descEl.innerText = dict[data.descKey] || "";
    if (locEl) locEl.innerText = currentLang === "ar" ? data.locAr : data.locEn;
    if (mainImgEl) mainImgEl.src = data.mainImg;

    if (thumbsContainer) {
      thumbsContainer.innerHTML = data.thumbs.map((thumb, idx) => `
        <div class="fac-thumb ${idx === 0 ? 'active' : ''}" data-src="${thumb}">
          <img src="${thumb}" alt="Facility thumb ${idx + 1}" loading="lazy">
        </div>
      `).join("");

      thumbsContainer.querySelectorAll(".fac-thumb").forEach(t => {
        t.addEventListener("click", () => {
          thumbsContainer.querySelectorAll(".fac-thumb").forEach(item => item.classList.remove("active"));
          t.classList.add("active");
          if (mainImgEl) mainImgEl.src = t.dataset.src;
        });
      });
    }
  };

  // 2. Language State Management
  let currentLang = localStorage.getItem("greengate_lang") || "ar";

  const setLanguage = (lang) => {
    currentLang = lang;
    localStorage.setItem("greengate_lang", lang);
    const html = document.documentElement;

    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";

    document.querySelectorAll(".lang-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    const dict = translations[lang];
    if (!dict) return;

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

    // Re-render facility specs text if active
    const activeFacBtn = document.querySelector(".fac-tab-btn.active");
    if (activeFacBtn) {
      renderFacility(activeFacBtn.dataset.facility);
    }

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  };

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const selected = btn.dataset.lang;
      if (selected !== currentLang) {
        setLanguage(selected);
      }
    });
  });

  setLanguage(currentLang);

  // 2. REAL GEOGRAPHIC MAP INITIALIZATION (Leaflet.js + CartoDB Dark)
  let map;
  const initRealWorldMap = () => {
    const mapContainer = document.getElementById("realWorldMap");
    if (!mapContainer || typeof L === "undefined") return;

    // Center map around Middle East / Asia trade corridor
    map = L.map("realWorldMap", {
      center: [28.0, 58.0],
      zoom: 3.5,
      minZoom: 2,
      maxZoom: 9,
      zoomControl: true,
      scrollWheelZoom: false // Prevent page scroll trapping
    });

    // Esri World Dark Gray Canvas (100% real geography, sleek dark luxury, zero watermark, free)
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &copy; OpenStreetMap contributors',
      maxZoom: 16
    }).addTo(map);

    // City Coordinates
    const cities = {
      baghdad: {
        name: "Baghdad (HQ)",
        coords: [33.3152, 44.3661],
        type: "hq",
        infoAr: "المقر الرئيسي وشبكة المستودعات المركزية (حي الجامعة والشورجة)",
        infoEn: "Corporate HQ & Primary Distribution Hub (Al-Jamia & Al-Shurja)"
      },
      guangzhou: {
        name: "Guangzhou (Canton Fair)",
        coords: [23.1291, 113.2644],
        type: "hub",
        infoAr: "مركز التوريد والمنسوجات والمشاركة في معرض كانتون الدولي",
        infoEn: "Major sourcing hub for textiles and official Canton Fair pavilion"
      },
      istanbul: {
        name: "Istanbul",
        coords: [41.0082, 28.9784],
        type: "hub",
        infoAr: "خطوط إمداد متسارعة للمنتجات الأوروبية والتركية الراقية",
        infoEn: "Fast-transit supply corridor for European and Turkish commodities"
      },
      cairo: {
        name: "Cairo (Plant)",
        coords: [30.0444, 31.2357],
        type: "factory",
        infoAr: "مصنع الشركة المتكامل لخطوط الملابس والإنتاج الإقليمي",
        infoEn: "Green Gate regional apparel manufacturing & production plant"
      },
      kualalumpur: {
        name: "Kuala Lumpur & Bangkok",
        coords: [3.1390, 101.6869],
        type: "hub",
        infoAr: "توريد المنتجات الاستهلاكية والتجهيزات المتنوعة من جنوب شرق آسيا",
        infoEn: "Strategic sourcing for consumer commodities across SE Asia"
      },
      europe: {
        name: "Europe (Rotterdam)",
        coords: [51.9244, 4.4777],
        type: "hub",
        infoAr: "شراكات أوروبية لاستيراد المعدات والتجهيزات الصناعية المتطورة",
        infoEn: "European freight corridor for advanced equipment & materials"
      }
    };

    // Helper: Create Custom HTML Marker Pin
    const createCustomIcon = (type) => {
      let pinClass = "pin-hub";
      if (type === "hq") pinClass = "pin-hq";
      if (type === "factory") pinClass = "pin-factory";
      return L.divIcon({
        className: "custom-pin-wrap",
        html: `<div class="custom-pin ${pinClass}"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      });
    };

    // Add Markers & Popups
    const markers = {};
    Object.keys(cities).forEach(key => {
      const city = cities[key];
      const marker = L.marker(city.coords, {
        icon: createCustomIcon(city.type)
      }).addTo(map);

      marker.bindPopup(`
        <div class="popup-inner">
          <h4>${city.name}</h4>
          <p>${currentLang === 'ar' ? city.infoAr : city.infoEn}</p>
        </div>
      `);

      markers[key] = marker;
    });

    // Helper: Generate curved arc points between two coordinates
    const generateArc = (start, end, numPoints = 60, curvature = 0.22) => {
      const pts = [];
      const lat1 = start[0], lng1 = start[1];
      const lat2 = end[0], lng2 = end[1];

      for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const lat = lat1 + (lat2 - lat1) * t;
        const lng = lng1 + (lng2 - lng1) * t;
        // Arc offset perpendicular to the line
        const offset = Math.sin(t * Math.PI) * (curvature * 40);
        pts.push([lat + offset, lng]);
      }
      return pts;
    };

    // Draw Realistic Trade Corridors to Baghdad
    const baghdadCoords = cities.baghdad.coords;
    const routes = [
      { from: cities.guangzhou.coords, color: "#10b981", weight: 2.5, dash: "6, 6" },
      { from: cities.istanbul.coords, color: "#38bdf8", weight: 2.2, dash: "6, 6" },
      { from: cities.kualalumpur.coords, color: "#10b981", weight: 2.2, dash: "6, 6" },
      { from: cities.europe.coords, color: "#38bdf8", weight: 2.2, dash: "6, 6" },
      { from: cities.cairo.coords, color: "#d4af37", weight: 2.5, dash: "6, 6" }
    ];

    routes.forEach(route => {
      const arcPoints = generateArc(route.from, baghdadCoords);
      L.polyline(arcPoints, {
        color: route.color,
        weight: route.weight,
        dashArray: route.dash,
        opacity: 0.85
      }).addTo(map);
    });

    // Wire Quick City Pill Navigation Buttons
    document.querySelectorAll(".city-pill-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetCity = btn.dataset.city;
        if (cities[targetCity]) {
          document.querySelectorAll(".city-pill-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");

          const city = cities[targetCity];
          map.flyTo(city.coords, targetCity === "baghdad" ? 5 : 6, {
            duration: 1.4,
            easeLinearity: 0.25
          });

          if (markers[targetCity]) {
            setTimeout(() => markers[targetCity].openPopup(), 1200);
          }
        }
      });
    });
  };

  // Run Map Init
  initRealWorldMap();

  // 3. Clean GSAP Micro-Animations
  if (typeof gsap !== "undefined") {
    // Subtle Navbar scroll change
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });

    // Hero Entrance
    gsap.from(".hero-content > *", {
      y: 24,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power2.out"
    });

    gsap.from(".hero-image-wrap", {
      scale: 0.96,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      delay: 0.2
    });
  }

  // 4. Facilities Tab Switcher Event Listeners

  document.querySelectorAll(".fac-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".fac-tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderFacility(btn.dataset.facility);
    });
  });

  // 5. Clean Image Lightbox
  const lightbox = document.getElementById("imageLightbox");
  const lightboxImg = lightbox ? lightbox.querySelector(".lightbox-img") : null;
  const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;

  const openLightbox = (src) => {
    if (lightbox && lightboxImg) {
      lightboxImg.src = src;
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  };

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("click", (e) => {
    if (e.target.matches(".fac-main-img img, .event-media img, .zoom-img")) {
      openLightbox(e.target.src);
    }
  });

  // 6. Working Contact Form
  const form = document.getElementById("cleanContactForm");
  const formFeedback = document.getElementById("formFeedback");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const origText = submitBtn.innerHTML;
      const dict = translations[currentLang];

      const name = form.querySelector("#contactName").value.trim();
      const email = form.querySelector("#contactEmailInput").value.trim();
      const type = form.querySelector("#contactType").value;
      const message = form.querySelector("#contactMsg").value.trim();

      if (!name || !email || !message) {
        alert(currentLang === "ar" ? "يرجى تعبئة الحقول المطلوبة (*)" : "Please fill in all required fields (*)");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>...</span>`;

      try {
        if (typeof emailjs !== "undefined") {
          await emailjs.send(
            "service_g5h9o2e",
            "template_xirq8zc",
            {
              from_name: name,
              from_email: email,
              subject: type,
              message: message
            },
            "EhJ0gDI2OImhDqsmD"
          );
        }

        formFeedback.innerHTML = `
          <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid var(--primary); color: var(--primary-light); padding: 12px; border-radius: 8px; margin-top: 14px; font-size: 0.9rem;">
            ${dict.formSuccess}
          </div>
        `;
        form.reset();
      } catch (err) {
        console.error(err);
        formFeedback.innerHTML = `
          <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #fca5a5; padding: 12px; border-radius: 8px; margin-top: 14px; font-size: 0.9rem;">
            ${dict.formError}
          </div>
        `;
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }
    });
  }
});
