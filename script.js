/* ============================================================
   Santosh Dutta — Portfolio · interactions
   Uses scroll-position checks (robust everywhere) instead of
   IntersectionObserver.
   ============================================================ */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nav = document.querySelector(".nav");

  /* ---- nav: scrolled state ---- */
  function onScroll() {
    if (window.scrollY > 12) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }

  /* ---- mobile menu toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () { nav.classList.toggle("open"); });
    nav.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }

  /* ---- counters ---- */
  function animateCount(el) {
    if (el.__done) return; el.__done = true;
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduce) { el.textContent = target + suffix; return; }
    var dur = 1400, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  var bars = Array.prototype.slice.call(document.querySelectorAll(".lang-bar i"));

  if (reduce) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
    counters.forEach(animateCount);
    bars.forEach(function (el) { el.style.width = el.getAttribute("data-w"); });
  }

  function inView(el, frac) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var trigger = vh * (1 - (frac || 0.12));
    return r.top < trigger && r.bottom > 0;
  }

  function checkAll() {
    if (revealEls.length) {
      revealEls = revealEls.filter(function (el) {
        if (inView(el, 0.10)) { el.classList.add("in"); return false; }
        return true;
      });
    }
    if (counters.length) {
      counters = counters.filter(function (el) {
        if (inView(el, 0.25)) { animateCount(el); return false; }
        return true;
      });
    }
    if (bars.length) {
      bars = bars.filter(function (el) {
        if (inView(el, 0.25)) { el.style.width = el.getAttribute("data-w"); return false; }
        return true;
      });
    }
  }

  /* ---- nav active section tracking ---- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("section[id]"));
  var linkMap = {};
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    linkMap[a.getAttribute("href").replace("#", "")] = a;
  });
  function trackActive() {
    var mid = window.scrollY + window.innerHeight * 0.4;
    var current = null;
    sections.forEach(function (s) {
      if (s.offsetTop <= mid) current = s.id;
    });
    Object.keys(linkMap).forEach(function (k) {
      linkMap[k].classList.toggle("active", k === current);
    });
  }

  var ticking = false;
  function onFrame() {
    onScroll();
    if (!reduce) checkAll();
    trackActive();
    ticking = false;
  }
  function requestTick() {
    if (!ticking) { ticking = true; requestAnimationFrame(onFrame); }
  }

  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick, { passive: true });

  /* initial passes (covers above-the-fold + any late layout) */
  onFrame();
  setTimeout(onFrame, 60);
  setTimeout(onFrame, 250);
  window.addEventListener("load", onFrame);

  /* ---- subtle pointer parallax on hero glow ---- */
  if (!reduce) {
    window.addEventListener("pointermove", function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 14;
      var y = (e.clientY / window.innerHeight - 0.5) * 14;
      document.documentElement.style.setProperty("--px", x.toFixed(1) + "px");
      document.documentElement.style.setProperty("--py", y.toFixed(1) + "px");
    }, { passive: true });
  }

  /* ============================================================
     PROJECT OVERVIEW MODAL
     ============================================================ */
  var PROJECTS = {
    "kozmo-intake": {
      idx: "P/02", role: "Lead Business Analyst",
      title: "Kozmo AI & Intake Agent",
      sub: "Lead Business Analyst · AI Contract Intelligence Platform",
      goal: "Automate contract intake, clause extraction, metadata tagging, and approval workflows using AI to reduce manual effort in contract processing.",
      contributions: [
        "Defined 30+ business rules for contract intake, clause detection, risk tagging, and approval workflows.",
        "Created AI input/output specifications for OpenAI-powered contract extraction.",
        "Established validation criteria for extraction accuracy and exception handling.",
        "Conducted Fit-Gap Analysis and mapped data across three integrated systems.",
        "Designed feedback loops to continuously improve AI model performance."
      ],
      achievements: [
        "Reduced manual intervention by approximately 40%.",
        "Improved extraction quality through structured AI validation and feedback mechanisms.",
        "Successfully stabilized the product and completed operational handover with documentation and runbooks."
      ],
      skills: ["AI Product Analysis", "OpenAI APIs", "Business Rules Definition", "Fit-Gap Analysis", "Data Mapping", "UAT"]
    },
    "econtracts": {
      idx: "P/03", role: "Business Analyst",
      title: "eContracts 2.5",
      sub: "Business Analyst · Enterprise CLM Product Enhancement",
      goal: "Modernize the Contract Lifecycle Management platform by consolidating customer enhancement requests into scalable product capabilities.",
      contributions: [
        "Led end-to-end requirements gathering and analysis across multiple enterprise customers.",
        "Conducted impact analysis for dependencies, risks, and implementation considerations.",
        "Authored BRDs, FRDs, process flows, wireframes, and solution design documents.",
        "Facilitated stakeholder workshops, requirement reviews, and UAT activities.",
        "Partnered with development and QA teams throughout the SDLC."
      ],
      achievements: [
        "Consolidated multiple customer requests into reusable product features.",
        "Reduced redundant customizations across implementations.",
        "Improved product scalability and maintainability.",
        "Successfully delivered enhancements to production."
      ],
      skills: ["Product Enhancement", "Requirement Analysis", "Impact Analysis", "Stakeholder Management", "UAT", "SDLC"]
    },
    "testing-console": {
      idx: "P/01", role: "Business Analyst",
      title: "Kozmo Testing Console",
      sub: "Business Analyst · Enterprise AI Testing & Observability Platform",
      goal: "Build an enterprise AI operational intelligence platform for testing, evaluating, and monitoring AI-driven workflows and agents.",
      contributions: [
        "Designed AI testing and evaluation workflows for enterprise AI applications.",
        "Defined testing strategies covering scenario injection, replay execution, and failure simulation.",
        "Contributed to deterministic AI evaluation and operational reliability frameworks.",
        "Supported observability and execution-tracing requirements for AI workflows."
      ],
      achievements: [
        "Established foundations for enterprise-grade AI testing governance.",
        "Enabled structured AI evaluation and operational monitoring.",
        "Contributed to scalable AI reliability and testing frameworks."
      ],
      skills: ["AI Testing", "AI Observability", "Agentic AI", "Deterministic Evaluation", "Operational Intelligence"]
    },
    "dashboard": {
      idx: "P/04", role: "Business Analyst",
      title: "Kozmo AI Dashboard",
      sub: "Business Analyst · Contract Intelligence Analytics",
      goal: "Provide a 360-degree analytics view of contract portfolio health, renewals, obligations, milestones, and business performance.",
      contributions: [
        "Defined dashboard requirements and KPI framework.",
        "Designed analytics for contract renewals, obligations, milestones, and counterparty performance.",
        "Created business-area specific reporting requirements.",
        "Defined drill-down analytics and dashboard widget specifications.",
        "Collaborated with stakeholders to establish reporting and audit requirements."
      ],
      achievements: [
        "Created a centralized contract intelligence reporting framework.",
        "Improved visibility into contract renewals and obligations.",
        "Enabled business-area level analytics and decision support."
      ],
      skills: ["KPI Design", "Dashboard Requirements", "Business Analysis", "Contract Analytics", "Reporting"]
    },
    "portal": {
      idx: "P/05", role: "Business Analyst",
      title: "Kozmo Portal",
      sub: "Business Analyst · Agentic AI Platform",
      goal: "Support the development of an enterprise agentic AI platform by defining requirements and enabling Agile product delivery.",
      contributions: [
        "Facilitated stakeholder workshops across multiple business units.",
        "Defined epics and created sprint-ready backlog items.",
        "Produced workflow documentation and functional specifications.",
        "Participated in sprint planning and delivery tracking."
      ],
      achievements: [
        "Established structured requirements for Agentic AI workflows.",
        "Improved backlog readiness and sprint planning efficiency.",
        "Supported roadmap-aligned delivery through scope management."
      ],
      skills: ["Requirements Gathering", "Agile Delivery", "Agentic AI", "Workshop Facilitation", "Sprint Planning"]
    }
  };

  var modal = document.getElementById("projModal");
  if (modal) {
    var panel = modal.querySelector(".proj-modal-panel");
    var elIdx = modal.querySelector(".pm-idx");
    var elRole = modal.querySelector(".pm-role");
    var elTitle = modal.querySelector("#pmTitle");
    var elSub = modal.querySelector(".pm-sub");
    var elGoal = modal.querySelector(".pm-goal-text");
    var elContrib = modal.querySelector(".pm-list.contributions");
    var elAchieve = modal.querySelector(".pm-list.achievements");
    var elTags = modal.querySelector(".pm-tags");
    var lastFocus = null;

    function fillList(ul, items) {
      ul.innerHTML = "";
      items.forEach(function (t) {
        var li = document.createElement("li");
        li.textContent = t;
        ul.appendChild(li);
      });
    }

    function openModal(key) {
      var d = PROJECTS[key];
      if (!d) return;
      elIdx.textContent = d.idx;
      elRole.textContent = d.role || "";
      elTitle.textContent = d.title;
      elSub.textContent = d.sub;
      elGoal.textContent = d.goal;
      fillList(elContrib, d.contributions);
      fillList(elAchieve, d.achievements);
      elTags.innerHTML = "";
      d.skills.forEach(function (s) {
        var span = document.createElement("span");
        span.className = "tag";
        span.textContent = s;
        elTags.appendChild(span);
      });
      lastFocus = document.activeElement;
      if (reduce) modal.classList.add("no-anim");
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      panel.scrollTop = 0;
      modal.querySelector(".proj-modal-close").focus();
    }

    function closeModal() {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.querySelectorAll(".proj-card[data-proj]").forEach(function (card) {
      card.addEventListener("click", function () { openModal(card.getAttribute("data-proj")); });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(card.getAttribute("data-proj")); }
      });
    });

    modal.querySelectorAll("[data-close]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });

    /* simple focus trap */
    modal.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || !modal.classList.contains("open")) return;
      var focusable = panel.querySelectorAll("button, [href], [tabindex]:not([tabindex='-1'])");
      if (!focusable.length) return;
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
})();
