/**
 * UNDANGAN DIGITAL - ZAKI & ANTI
 * script.js — Interactive Logic
 */

// ============================================================
// CONFIG
// ============================================================
const CONFIG = {
  weddingDate: new Date('2025-11-15T13:00:00+07:00'),
  audioSrc: 'https://web.galeriundanganofficial.com/wp-content/uploads/2025/11/Senario-Zapin-Usik-Mengusik-Lirik.mp3',
  mapsAkad: 'https://maps.google.com/?q=Jalan+Binaharapan+Gg+Pustu+Sungai+Apit+Siak+Riau',
  mapsResepsi: 'https://maps.google.com/?q=Jalan+Binaharapan+Gg+Pustu+Sungai+Apit+Siak+Riau',
};

// ============================================================
// GALLERY IMAGES
// ============================================================
const GALLERY_IMAGES = [
  'https://web.galeriundanganofficial.com/wp-content/uploads/2025/11/CVR-Zaki-Anti-14.jpg',
  'https://web.galeriundanganofficial.com/wp-content/uploads/2025/11/CVR-Zaki-Anti-14.jpg',
  'https://web.galeriundanganofficial.com/wp-content/uploads/2025/11/CVR-Zaki-Anti-14.jpg',
  'https://web.galeriundanganofficial.com/wp-content/uploads/2025/11/CVR-Zaki-Anti-14.jpg',
  'https://web.galeriundanganofficial.com/wp-content/uploads/2025/11/CVR-Zaki-Anti-14.jpg',
  'https://web.galeriundanganofficial.com/wp-content/uploads/2025/11/CVR-Zaki-Anti-14.jpg',
];

// ============================================================
// RSVP DATA (in-memory, replace with backend later)
// ============================================================
let rsvpData = JSON.parse(localStorage.getItem('rsvpData') || '[]');
let wishesData = JSON.parse(localStorage.getItem('wishesData') || '[]');

// ============================================================
// AUDIO PLAYER
// ============================================================
const audio = new Audio(CONFIG.audioSrc);
audio.loop = true;
audio.volume = 0.5;
let isPlaying = false;

function toggleAudio() {
  const btn = document.getElementById('music-player');
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    btn.classList.remove('playing');
    btn.querySelector('.music-icon').textContent = '🎵';
  } else {
    audio.play().catch(() => {});
    isPlaying = true;
    btn.classList.add('playing');
    btn.querySelector('.music-icon').textContent = '🎶';
  }
}

// ============================================================
// COVER OVERLAY
// ============================================================
function getGuestName() {
  const params = new URLSearchParams(window.location.search);
  return params.get('to') || 'Tamu Undangan';
}

function openInvitation() {
  const cover = document.getElementById('cover-overlay');
  const main  = document.getElementById('main-invitation');

  cover.classList.add('hidden');
  document.body.classList.remove('no-scroll');

  setTimeout(() => {
    main.classList.add('visible');

    // Autoplay audio
    audio.play().then(() => {
      isPlaying = true;
      document.getElementById('music-player').classList.add('playing');
      document.getElementById('music-player').querySelector('.music-icon').textContent = '🎶';
    }).catch(() => {});

    // Mulai watcher hero reveal
    startHeroReveal();
  }, 400);
}

// ============================================================
// HERO TEXT REVEAL — muncul di detik ke-14 video
// ============================================================
function startHeroReveal() {
  const video = document.querySelector('#hero-video');
  if (!video) return;

  // ---- Freeze di frame terakhir saat video selesai ----
  video.addEventListener('ended', () => {
    // Seek ke 0.001 detik sebelum akhir agar frame terakhir tetap tampil
    video.currentTime = video.duration - 0.001;
    video.pause();
  }, { once: true });

  // Urutan elemen dari atas ke bawah, delay bertahap (ms)
  const heroElements = [
    { selector: '.hero-top-ornament', delay: 0   },
    { selector: '.hero-label',        delay: 200 },
    { selector: '.hero-couple-name',  delay: 450 },
    { selector: '.hero-hashtag',      delay: 700 },
    { selector: '.hero-divider',      delay: 850 },
    { selector: '.hero-date',         delay: 1000 },
    { selector: '.hero-scroll-hint',  delay: 1250 },
  ];

  let revealed = false;

  function revealAll() {
    if (revealed) return;
    revealed = true;

    heroElements.forEach(({ selector, delay }) => {
      const el = document.querySelector(selector);
      if (!el) return;
      setTimeout(() => {
        el.classList.add('hero-revealed');
      }, delay);
    });

    video.removeEventListener('timeupdate', onTimeUpdate);
  }

  function onTimeUpdate() {
    if (video.currentTime >= 14) {
      revealAll();
    }
  }

  // Jika video sudah > 14 detik saat dibuka (edge case)
  if (video.currentTime >= 14) {
    revealAll();
  } else {
    video.addEventListener('timeupdate', onTimeUpdate);
  }
}

// ============================================================
// COUNTDOWN TIMER
// ============================================================
function updateCountdown() {
  const now  = new Date();
  const diff = CONFIG.weddingDate - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent   = '00';
    document.getElementById('cd-hours').textContent  = '00';
    document.getElementById('cd-mins').textContent   = '00';
    document.getElementById('cd-secs').textContent   = '00';
    return;
  }

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs  = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cd-days').textContent  = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent  = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent  = String(secs).padStart(2, '0');
}

// ============================================================
// COPY TO CLIPBOARD
// ============================================================
function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.textContent;
    btn.textContent = '✓ Tersalin!';
    btn.classList.add('copied');
    showToast('Berhasil disalin ke clipboard!');
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    // Fallback
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    btn.textContent = '✓ Tersalin!';
    btn.classList.add('copied');
    showToast('Berhasil disalin!');
    setTimeout(() => {
      btn.textContent = '📋 Salin';
      btn.classList.remove('copied');
    }, 2000);
  });
}

// ============================================================
// TOAST NOTIFICATION
// ============================================================
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ============================================================
// LIGHTBOX GALLERY
// ============================================================
let currentLightboxIndex = 0;

function openLightbox(index) {
  currentLightboxIndex = index;
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = GALLERY_IMAGES[index];
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function prevLightbox() {
  currentLightboxIndex = (currentLightboxIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
  document.getElementById('lightbox-img').src = GALLERY_IMAGES[currentLightboxIndex];
}

function nextLightbox() {
  currentLightboxIndex = (currentLightboxIndex + 1) % GALLERY_IMAGES.length;
  document.getElementById('lightbox-img').src = GALLERY_IMAGES[currentLightboxIndex];
}

// ============================================================
// RSVP FORM
// ============================================================
let selectedAttendance = '';

function selectAttendance(type) {
  selectedAttendance = type;
  document.querySelectorAll('.attendance-btn').forEach(btn => {
    btn.classList.remove('active-hadir', 'active-tidak', 'active-ragu');
  });
  const btn = document.getElementById(`btn-${type}`);
  if (btn) btn.classList.add(`active-${type}`);
}

function submitRSVP(e) {
  e.preventDefault();
  const name  = document.getElementById('rsvp-name').value.trim();
  const total = document.getElementById('rsvp-total').value.trim();

  if (!name) { showToast('Mohon isi nama Anda'); return; }
  if (!selectedAttendance) { showToast('Mohon pilih konfirmasi kehadiran'); return; }

  const entry = {
    id: Date.now(),
    name,
    attendance: selectedAttendance,
    total: total || 1,
    date: new Date().toISOString(),
  };

  rsvpData.push(entry);
  localStorage.setItem('rsvpData', JSON.stringify(rsvpData));
  updateRSVPStats();
  showToast('✓ Konfirmasi kehadiran terkirim!');

  // Reset form
  document.getElementById('rsvp-name').value = '';
  document.getElementById('rsvp-total').value = '';
  selectedAttendance = '';
  document.querySelectorAll('.attendance-btn').forEach(btn => {
    btn.classList.remove('active-hadir', 'active-tidak', 'active-ragu');
  });
}

function updateRSVPStats() {
  const hadir = rsvpData.filter(r => r.attendance === 'hadir').length;
  const tidak = rsvpData.filter(r => r.attendance === 'tidak').length;
  const ragu  = rsvpData.filter(r => r.attendance === 'ragu').length;

  const elH = document.getElementById('stat-hadir');
  const elT = document.getElementById('stat-tidak');
  const elR = document.getElementById('stat-ragu');
  if (elH) elH.textContent = hadir;
  if (elT) elT.textContent = tidak;
  if (elR) elR.textContent = ragu;
}

// ============================================================
// GUESTBOOK / WISHES
// ============================================================
function submitWish(e) {
  e.preventDefault();
  const name    = document.getElementById('wish-name').value.trim();
  const message = document.getElementById('wish-message').value.trim();

  if (!name || !message) { showToast('Mohon isi nama dan ucapan'); return; }

  const entry = { id: Date.now(), name, message, date: new Date().toISOString() };
  wishesData.unshift(entry);
  localStorage.setItem('wishesData', JSON.stringify(wishesData));
  renderWishes();
  showToast('✓ Ucapan & doa terkirim!');

  document.getElementById('wish-name').value    = '';
  document.getElementById('wish-message').value = '';
}

function renderWishes() {
  const list = document.getElementById('wishes-list');
  if (!list) return;

  if (wishesData.length === 0) {
    list.innerHTML = '<p style="color:var(--text-light);font-style:italic;font-size:0.85rem;text-align:center;padding:20px 0;">Jadilah yang pertama mengirimkan ucapan 💌</p>';
    return;
  }

  list.innerHTML = wishesData.slice(0, 20).map(w => `
    <div class="wish-item">
      <div class="wish-item-header">
        <div class="wish-avatar">${w.name.charAt(0).toUpperCase()}</div>
        <div>
          <div class="wish-name">${escapeHTML(w.name)}</div>
          <div style="font-size:0.65rem;color:var(--text-light);font-family:var(--font-ui);margin-top:2px;">${formatDate(w.date)}</div>
        </div>
      </div>
      <div class="wish-message">"${escapeHTML(w.message)}"</div>
    </div>
  `).join('');
}

// ============================================================
// SAVE THE DATE (Google Calendar)
// ============================================================
function saveToCalendar() {
  const start = '20251115T060000Z'; // UTC (13:00 WIB)
  const end   = '20251115T090000Z';
  const text  = encodeURIComponent('Pernikahan Zaki & Anti');
  const details = encodeURIComponent('Akad Nikah M. Zaki Saputra & Nor Afrianti');
  const location = encodeURIComponent('Jln Binaharapan Gg Pustu, Sungai Apit, Siak, Riau');
  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`;
  window.open(url, '_blank');
}

// ============================================================
// SCROLL REVEAL
// ============================================================
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}

// ============================================================
// GALLERY BUILDER
// ============================================================
function buildGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  grid.innerHTML = GALLERY_IMAGES.map((src, i) => `
    <div class="gallery-item" onclick="openLightbox(${i})">
      <img src="${src}" alt="Foto ${i + 1}" loading="lazy">
      <div class="gallery-item-overlay">
        <span class="zoom-icon">🔍</span>
      </div>
    </div>
  `).join('');
}

// ============================================================
// HELPERS
// ============================================================
function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ============================================================
// PREVENT COPY / RIGHT CLICK (matching original site)
// ============================================================
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (e.ctrlKey && ['s','u','c','a','x','p'].includes(e.key.toLowerCase())) {
    e.preventDefault();
    showToast('Konten dilindungi hak cipta');
  }
});

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Set guest name on cover — tampilkan nama lengkap dari URL ?to=
  const guestName = getGuestName();
  const guestEl   = document.getElementById('cover-guest-name');
  if (guestEl) {
    guestEl.textContent = guestName;
  }

  // Build gallery
  buildGallery();

  // Render wishes
  renderWishes();

  // RSVP stats
  updateRSVPStats();

  // Countdown
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Scroll reveal
  initScrollReveal();

  // Music player toggle
  document.getElementById('music-player').addEventListener('click', toggleAudio);

  // Open invitation button
  document.getElementById('btn-open').addEventListener('click', openInvitation);

  // Lightbox close on backdrop click
  document.getElementById('lightbox').addEventListener('click', function(e) {
    if (e.target === this) closeLightbox();
  });

  // Keyboard nav for lightbox
  document.addEventListener('keydown', e => {
    if (document.getElementById('lightbox').classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
    }
  });

  // RSVP form
  const rsvpForm = document.getElementById('rsvp-form');
  if (rsvpForm) rsvpForm.addEventListener('submit', submitRSVP);

  // Wishes form
  const wishForm = document.getElementById('wishes-form');
  if (wishForm) wishForm.addEventListener('submit', submitWish);

  // Maps buttons
  const btnAkad = document.getElementById('btn-maps-akad');
  const btnResepsi = document.getElementById('btn-maps-resepsi');
  if (btnAkad) btnAkad.addEventListener('click', () => window.open(CONFIG.mapsAkad, '_blank'));
  if (btnResepsi) btnResepsi.addEventListener('click', () => window.open(CONFIG.mapsResepsi, '_blank'));

  // Copy buttons
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => copyText(btn.dataset.copy, btn));
  });

  // Save the date
  const btnSave = document.getElementById('btn-save-date');
  if (btnSave) btnSave.addEventListener('click', saveToCalendar);
});

// ============================================================
// GIFT CONFIRM — Submit via WhatsApp
// ============================================================
function submitGiftConfirm() {
  const nama    = (document.getElementById('gc-nama')?.value || '').trim();
  const bank    = (document.getElementById('gc-bank')?.value || '').trim();
  const nominal = (document.getElementById('gc-nominal')?.value || '').trim();
  const ucapan  = (document.getElementById('gc-ucapan')?.value || '').trim();
  const bukti   = document.getElementById('gc-bukti');
  const hasBukti = bukti && bukti.files && bukti.files.length > 0;

  if (!nama || !bank || !nominal) {
    alert('Mohon isi Nama, Nama Bank, dan Nominal terlebih dahulu.');
    return;
  }

  const msg = [
    '🎁 *Konfirmasi Gift — Zaki & Anti*',
    '',
    `👤 Nama       : ${nama}`,
    `🏦 Nama Bank  : ${bank}`,
    `💰 Nominal    : ${nominal}`,
    ucapan ? `💬 Ucapan     : ${ucapan}` : '',
    hasBukti ? `📎 Bukti TF   : (silakan kirim foto bukti transfer)` : '',
    '',
    'Terima kasih atas perhatian dan kasih sayang Bapak/Ibu/Saudara/i 🙏',
  ].filter(Boolean).join('\n');

  // Nomor WhatsApp penerima (ganti dengan nomor asli jika perlu)
  const waNumber = '6281234567890'; // ← ganti nomor WA
  const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// ============================================================
// RSVP — Submit via WhatsApp
// ============================================================
function submitRsvpWa() {
  const nama      = (document.getElementById('rsvp-name')?.value || '').trim();
  const kehadiran = document.getElementById('rsvp-kehadiran')?.value || 'hadir';
  const jumlah    = document.getElementById('rsvp-jumlah')?.value || '1';

  if (!nama) {
    alert('Mohon isi Nama terlebih dahulu.');
    return;
  }

  const kehadiranLabel = kehadiran === 'hadir' ? '✅ Hadir' : '❌ Tidak Hadir';

  const msg = [
    '📩 *Konfirmasi Kehadiran — Zaki & Anti*',
    '',
    `👤 Nama         : ${nama}`,
    `🎉 Kehadiran    : ${kehadiranLabel}`,
    `👥 Jumlah       : ${jumlah} Orang`,
    '',
    'Terima kasih atas konfirmasi kehadirannya 🙏',
  ].join('\n');

  // Nomor WhatsApp penerima (ganti dengan nomor asli)
  const waNumber = '6281234567890'; // ← ganti nomor WA
  const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}
