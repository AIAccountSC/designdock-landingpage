/* DesignDock — creative graphics layer (three.js hero object + reactive dot-grid) */
(function () {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pointer = { x: 0.5, y: 0.5 };
  addEventListener('pointermove', (e) => { pointer.x = e.clientX / innerWidth; pointer.y = e.clientY / innerHeight; }, { passive: true });

  /* ============================================================
     1) HERO — rotating abstract 3D object (three.js, graceful)
     ============================================================ */
  function heroThree() {
    const canvas = document.getElementById('hero3d');
    if (!canvas || typeof THREE === 'undefined') return;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (e) { return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 9;

    const group = new THREE.Group();
    scene.add(group);

    const LIME = 0xc6f24e;
    // solid dark core so the wireframe reads against the page
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.0, 1),
      new THREE.MeshBasicMaterial({ color: 0x11160f })
    );
    group.add(core);
    // glowing wireframe shell
    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.35, 1),
      new THREE.MeshBasicMaterial({ color: LIME, wireframe: true, transparent: true, opacity: 0.42 })
    );
    group.add(shell);
    // faint outer cage
    const cage = new THREE.Mesh(
      new THREE.IcosahedronGeometry(3.0, 0),
      new THREE.MeshBasicMaterial({ color: 0x7fd0c4, wireframe: true, transparent: true, opacity: 0.12 })
    );
    group.add(cage);
    // vertex dots
    const dotGeo = new THREE.IcosahedronGeometry(2.35, 1);
    const dots = new THREE.Points(dotGeo, new THREE.PointsMaterial({ color: LIME, size: 0.08, transparent: true, opacity: 0.85 }));
    group.add(dots);

    // sit the object to the right, behind the board
    group.position.x = 2.2;
    group.position.y = 0.2;

    function resize() {
      const host = canvas.parentElement;
      const w = host.clientWidth, h = host.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // push object further right on wide screens, center on narrow
      group.position.x = w > 900 ? 2.4 : 0;
      group.position.y = w > 900 ? 0.2 : -0.4;
      camera.updateProjectionMatrix();
    }
    resize();
    addEventListener('resize', resize);

    let raf, t = 0;
    function frame() {
      t += 0.01;
      const sc = scrollY * 0.0012;
      group.rotation.y += reduce ? 0 : 0.0035;
      group.rotation.x = (reduce ? 0 : Math.sin(t * 0.6) * 0.12) + (pointer.y - 0.5) * 0.5 + sc;
      group.rotation.z = sc * 0.4;
      camera.position.x = (pointer.x - 0.5) * 1.2;
      camera.lookAt(group.position.x * 0.5, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }
    frame();

    // pause when hero off-screen
    const hero = document.querySelector('.hero');
    if (hero && 'IntersectionObserver' in window) {
      new IntersectionObserver((ents) => {
        ents.forEach((en) => {
          if (en.isIntersecting) { if (!raf) frame(); }
          else { cancelAnimationFrame(raf); raf = 0; }
        });
      }, { threshold: 0 }).observe(hero);
    }
  }

  /* ============================================================
     2) Generative dot-grid that reacts to cursor + scroll
     ============================================================ */
  function dotGrid() {
    const canvas = document.querySelector('.dotgrid');
    if (!canvas) return;
    const host = canvas.closest('.dotgrid-host') || canvas.parentElement;
    const ctx = canvas.getContext('2d');
    let dpr = Math.min(devicePixelRatio || 1, 2);
    let W = 0, H = 0, gap = 38, cols = 0, rows = 0;
    const mouse = { x: -9999, y: -9999, on: false };

    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = host.clientWidth; H = host.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(W / gap) + 1;
      rows = Math.ceil(H / gap) + 1;
    }
    resize();
    addEventListener('resize', resize);

    host.addEventListener('pointermove', (e) => { const r = host.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.on = true; }, { passive: true });
    host.addEventListener('pointerleave', () => { mouse.on = false; mouse.x = mouse.y = -9999; });

    let raf = 0, t = 0, running = false;
    function renderFrame() {
      ctx.clearRect(0, 0, W, H);
      const sOff = (scrollY * 0.05) % gap;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gap;
          const y = j * gap - sOff;
          const wave = reduce ? 0 : Math.sin((i * 0.4) + (j * 0.4) + t) * 0.6;
          let r = 1.1 + wave * 0.5;
          let a = 0.16 + wave * 0.06;
          if (mouse.on) {
            const dx = x - mouse.x, dy = y - mouse.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            const infl = Math.max(0, 1 - d / 150);
            r += infl * 3.2;
            a += infl * 0.8;
          }
          ctx.beginPath();
          ctx.arc(x, y, Math.max(0.4, r), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(198,242,78,${Math.min(a, 1)})`;
          ctx.fill();
        }
      }
    }
    function draw() {
      t += 0.02;
      renderFrame();
      raf = requestAnimationFrame(draw);
    }
    renderFrame(); // static baseline so the grid is always visible
    function start() { if (!running && !reduce) { running = true; draw(); } }
    function stop() { running = false; cancelAnimationFrame(raf); }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((ents) => ents.forEach((en) => en.isIntersecting ? start() : stop()), { threshold: 0 }).observe(host);
    } else { start(); }
  }

  function init() { heroThree(); dotGrid(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
