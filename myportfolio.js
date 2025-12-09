/* myportfolio.js — interactivity: slider, popup, theme, animations */

// ---------- PREFILLED DETAILS (edit here) ----------
const DETAILS = {
  name: "Seth Wambua",
  bio: "I combine hand-drawn techniques with digital tools to craft intimate visual narratives. My practice emphasizes negative space, subtle color accents, and composition drawn from Japanese aesthetics.",
  email: "sethmusyoka2021@gmail.com",
  phone: "+254759646009",
  instagram: "https://www.instagram.com/sir_seth_draws",
  resume: "/Seth_Wambua_Resume.pdf"
};

// apply details where relevant
document.addEventListener("DOMContentLoaded", () => {
  // title & meta
  document.title = `${DETAILS.name} — Visual Artist`;
  const bioEl = document.getElementById("bioText");
  if(bioEl) bioEl.textContent = DETAILS.bio;
  const resumeLink = document.getElementById("resumeLink");
  if(resumeLink && DETAILS.resume) resumeLink.href = DETAILS.resume;

  // year in footer
  document.getElementById("year").textContent = new Date().getFullYear();

  // contact form mailto fallback default
  setupForm();
  setupTheme();
  setupSlider();
  setupPopup();
  setupScrollReveal();
  spawnPetals();
});

// ---------- CONTACT FORM ----------
function setupForm(){
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("cfName").value;
    const email = document.getElementById("cfEmail").value;
    const message = document.getElementById("cfMessage").value;
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\nContact: ${email}`);
    window.location.href = `mailto:${DETAILS.email}?subject=${subject}&body=${body}`;
  });
  document.getElementById("resetBtn").addEventListener("click", () => {
    document.getElementById("cfName").value = "";
    document.getElementById("cfEmail").value = "";
    document.getElementById("cfMessage").value = "";
  });
}

// ---------- THEME TOGGLE ----------
function setupTheme(){
  const root = document.documentElement;
  const btn = document.getElementById("themeToggle");
  const saved = localStorage.getItem("siteTheme");
  if(saved === "light") root.classList.add("light");

  btn.addEventListener("click", () => {
    root.classList.toggle("light");
    const active = root.classList.contains("light") ? "light" : "dark";
    localStorage.setItem("siteTheme", active);
    btn.textContent = root.classList.contains("light") ? "🌙" : "🌞";
  });
}

// ---------- SLIDER (simple, accessible) ----------
function setupSlider(){
  const slidesWrap = document.getElementById("slides");
  const slides = Array.from(slidesWrap.querySelectorAll(".slide"));
  const prev = document.getElementById("prevBtn");
  const next = document.getElementById("nextBtn");
  const dotsWrap = document.getElementById("dots");

  // create dots
  slides.forEach((s, i) => {
    const b = document.createElement("button");
    b.addEventListener("click", () => goTo(i));
    if(i===0) b.classList.add("active");
    dotsWrap.appendChild(b);
  });

  let idx = 0;
  function update(){
    const target = slides[idx];
    if(!target) return;
    const left = target.offsetLeft - (window.innerWidth < 980 ? 24 : (window.innerWidth - target.offsetWidth)/2 - 30);
    slidesWrap.scrollTo({left,behavior:"smooth"});
    Array.from(dotsWrap.children).forEach((d,i)=> d.classList.toggle("active", i===idx));
  }
  function goTo(i){ idx = (i+slides.length)%slides.length; update(); }
  prev.addEventListener("click", ()=> goTo(idx-1));
  next.addEventListener("click", ()=> goTo(idx+1));

  // swipe support
  let x0 = null;
  slidesWrap.addEventListener("touchstart", e => x0 = e.touches[0].clientX);
  slidesWrap.addEventListener("touchend", e => {
    if(!x0) return;
    let dx = x0 - e.changedTouches[0].clientX;
    if(Math.abs(dx) > 40) dx > 0 ? goTo(idx+1) : goTo(idx-1);
    x0 = null;
  });

  // auto center on load
  setTimeout(update, 400);
}

// ---------- POPUP IMAGE ----------
function setupPopup(){
  const popup = document.getElementById("imgPopup");
  const popupImg = document.getElementById("popupImg");
  const popupBg = document.getElementById("popupBg");
  const closeBtn = document.getElementById("closePopup");

  document.querySelectorAll(".slide img").forEach(img => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      popupImg.src = img.src;
      popup.classList.add("show");
      popup.setAttribute("aria-hidden","false");
    });
  });

  [popupBg, closeBtn].forEach(el => el.addEventListener("click", () => {
    popup.classList.remove("show");
    popup.setAttribute("aria-hidden","true");
    popupImg.src = "";
  }));
}

// ---------- SCROLL REVEAL ----------
function setupScrollReveal(){
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting) e.target.classList.add("show");
    });
  }, {threshold:0.12});
  document.querySelectorAll(".card, .slide, .hero-inner, .section-head").forEach(el => {
    el.classList.add("fade-up");
    observer.observe(el);
  });
}

// ---------- SAKURA PETALS + PARALLAX ----------
function spawnPetals(){
  const holder = document.querySelector(".petals-holder");
  if(!holder) return;
  // create a few SVG petals with randomized animation
  for(let i=0;i<7;i++){
    const img = document.createElement("img");
    img.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'><path d='M14 1.5c3 0 5 2.3 5 5 0 3.2-5 8.8-5 8.8s-5-5.6-5-8.8c0-2.7 2-5 5-5z' fill='%23ff7eb6' opacity='0.95'/></svg>`;
    img.className = "petal";
    img.style.position = "absolute";
    img.style.left = Math.floor(Math.random()*80) + "%";
    img.style.top  = Math.floor(Math.random()*30) + "%";
    img.style.width = (14 + Math.random()*18) + "px";
    img.style.opacity = 0.9 - Math.random()*0.5;
    img.style.transform = `rotate(${Math.random()*40 - 20}deg)`;
    img.style.transition = `transform ${8 + Math.random()*8}s linear, top ${8 + Math.random()*8}s linear`;
    holder.appendChild(img);

    // drift animation
    (function(p){
      setTimeout(()=> {
        p.style.top = (50 + Math.random()*40) + "%";
        p.style.left = (parseFloat(p.style.left) + (Math.random()*20-10)) + "%";
      }, 100 + Math.random()*800);
      // loop drift
      setInterval(()=> {
        p.style.top = (40 + Math.random()*60) + "%";
        p.style.left = (parseFloat(p.style.left) + (Math.random()*30-15)) + "%";
      }, 6000 + Math.random()*4000);
    })(img);
  }

  // subtle parallax on mousemove
  document.addEventListener("mousemove", (e) => {
    const xp = (e.clientX / window.innerWidth - 0.5) * 20;
    const yp = (e.clientY / window.innerHeight - 0.5) * 20;
    document.querySelectorAll(".decor-bg").forEach(d => {
      d.style.transform = `translate3d(${xp}px, ${yp}px, 0)`;
    });
  });
}
