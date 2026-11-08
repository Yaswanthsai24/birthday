document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Soft falling hearts, shared by all pages.
  const particleContainer = document.getElementById("particles");
  if (particleContainer && !reduceMotion) {
    const createHeart = () => {
      if (particleContainer.childElementCount >= 28) return;
      const heart = document.createElement("span");
      heart.className = "particle";
      heart.textContent = Math.random() > 0.5 ? "♥" : "♡";
      heart.style.left = `${Math.random() * 100}vw`;
      heart.style.fontSize = `${Math.random() * 9 + 8}px`;
      heart.style.animationDuration = `${Math.random() * 7 + 10}s`;
      heart.style.animationDelay = `${Math.random() * 1.5}s`;
      particleContainer.appendChild(heart);
      heart.addEventListener("animationend", () => heart.remove(), { once: true });
    };
    for (let i = 0; i < 12; i++) createHeart();
    window.setInterval(() => {
      if (document.visibilityState === "visible") createHeart();
    }, 850);
  }

  // Reveal cards and sections as they enter the viewport.
  const revealItems = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(item => item.classList.add("visible"));
  } else {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -25px 0px" });
    revealItems.forEach(item => observer.observe(item));
  }

  // Memory photos are bundled static files in images/; no browser upload is needed.

  // Interactive letter envelope.
  const envelopeButton = document.getElementById("envelopeButton");
  const letterPaper = document.getElementById("letterPaper");
  const letterInstruction = document.getElementById("letterInstruction");
  if (envelopeButton && letterPaper) {
    envelopeButton.addEventListener("click", () => {
      const isOpen = envelopeButton.classList.toggle("opened");
      envelopeButton.setAttribute("aria-expanded", String(isOpen));
      letterPaper.classList.toggle("letter-open", isOpen);
      letterPaper.setAttribute("aria-hidden", String(!isOpen));
      if (letterInstruction) {
        letterInstruction.textContent = isOpen
          ? "A little message, written with affection. ♥"
          : "There's a little message waiting inside. Open the envelope.";
      }
    });
  }

  // Lightweight canvas confetti for the final birthday page.
  const celebrateButton = document.getElementById("celebrateButton");
  const canvas = document.getElementById("celebrationCanvas");
  if (celebrateButton && canvas) {
    const context = canvas.getContext("2d");
    let pieces = [];
    let animationFrame = null;

    const resizeCanvas = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const draw = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      pieces = pieces.filter(piece => piece.y < window.innerHeight + 30 && piece.life > 0);
      pieces.forEach(piece => {
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.vy += 0.035;
        piece.rotation += piece.spin;
        piece.life -= 1;
        context.save();
        context.translate(piece.x, piece.y);
        context.rotate(piece.rotation);
        context.globalAlpha = Math.min(1, piece.life / 35);
        context.fillStyle = piece.color;
        context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.65);
        context.restore();
      });
      if (pieces.length) animationFrame = window.requestAnimationFrame(draw);
      else {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        animationFrame = null;
      }
    };

    celebrateButton.addEventListener("click", () => {
      if (reduceMotion) {
        celebrateButton.textContent = "Happy Birthday! ♥";
        return;
      }
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      pieces = [];
      const colors = ["#d97899", "#e7b8c7", "#f3d9a5", "#ffffff", "#a94f70"];
      for (let i = 0; i < 150; i++) {
        pieces.push({
          x: window.innerWidth * (0.2 + Math.random() * 0.6),
          y: window.innerHeight * 0.35,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 1.1) * 8,
          size: Math.random() * 7 + 3,
          rotation: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.18,
          life: Math.random() * 90 + 65,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      draw();
      celebrateButton.textContent = "Make another wish ✨";
    });
  }
});
