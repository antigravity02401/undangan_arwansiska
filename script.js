/**
 * UNDANGAN DIGITAL - ANWAR & SISKA
 * script.js — Interactive Logic + Supabase Integration
 */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ============================================================
// SUPABASE CLIENT
// ============================================================
const _SB = createClient(
  'https://xabmzlvehwmpsqmejvhv.supabase.co',
  'sb_publishable_MvSXWigH_3AN5ZWrelnFag_ohImhKqs'
);

// ============================================================
// CONFIG
// ============================================================
const CONFIG = {
  weddingDate: new Date('2027-01-01T08:00:00+07:00'),
  audioSrc: 'https://web.galeriundanganofficial.com/wp-content/uploads/2025/11/Senario-Zapin-Usik-Mengusik-Lirik.mp3',
  mapsAkad: 'https://maps.google.com/?q=Kampung+Mengkapan+JL+SMP+Gg+Cik+Nor+Siak+Riau',
  mapsResepsi: 'https://maps.google.com/?q=Kampung+Mengkapan+JL+SMP+Gg+Cik+Nor+Siak+Riau',
};

// ============================================================
// GALLERY IMAGES
// ============================================================
const GALLERY_IMAGES = [
  'assets/01.jpg', 'assets/02.jpg', 'assets/03.jpg', 'assets/04.jpg',
  'assets/05.jpg', 'assets/06.jpg', 'assets/07.jpg', 'assets/08.jpg',
  'assets/09.jpg', 'assets/10.jpg', 'assets/11.jpg', 'assets/12.jpg',
  'assets/13.jpg', 'assets/14.jpg', 'assets/15.jpg', 'assets/16.jpg',
  'assets/17.jpg', 'assets/18.jpg', 'assets/19.jpg', 'assets/20.jpg',
  'assets/21.jpg', 'assets/22.jpg', 'assets/23.jpg', 'assets/24.jpg',
  'assets/25.jpg', 'assets/26.jpg', 'assets/27.jpg', 'assets/28.jpg',
  'assets/29.jpg', 'assets/30.jpg', 'assets/31.jpg', 'assets/32.jpg',
  'assets/33.jpg', 'assets/34.jpg',
];

const GALLERY_GRID_COUNT = 12;

// ============================================================
// STATE
// ============================================================
let rsvpData = [];
let wishesData = [];

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
    audio.play().then(() => {
      isPlaying = true;
      document.getElementById('music-player').classList.add('playing');
      document.getElementById('music-player').querySelector('.music-icon').textContent = '🎶';
    }).catch(() => {});
    startHeroReveal();
  }, 400);
}

// ============================================================
// HERO TEXT REVEAL
// ============================================================
function startHeroReveal() {
  const video = document.querySelector('#hero-video');
  if (!video) return;

  video.addEventListener('ended', () => {
    video.currentTime = video.duration - 0.001;
    video.pause();
  }, { once: true });

  const heroElements = [
    { selector: '.hero-top-ornament', delay: 0 },
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
      setTimeout(() => el.classList.add('hero-revealed'), delay);
    });
    video.removeEventListener('timeupdate', onTimeUpdate);
  }

  function onTimeUpdate() {
    if (video.currentTime >= 14) revealAll();
  }

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
    document.getElementById('cd-days').textContent  = '00';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-mins').textContent  = '00';
    document.getElementById('cd-secs').textContent  = '00';
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

  rsvpData.push({ id: Date.now(), name, attendance: selectedAttendance, total: total || 1, date: new Date().toISOString() });
  localStorage.setItem('rsvpData', JSON.stringify(rsvpData));
  updateRSVPStats();
  showToast('✓ Konfirmasi kehadiran terkirim!');

  document.getElementById('rsvp-name').value  = '';
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
async function submitWish(e) {
  e.preventDefault();
  const name    = document.getElementById('wish-name').value.trim();
  const message = document.getElementById('wish-message').value.trim();
  if (!name || !message) { showToast('Mohon isi nama dan ucapan'); return; }

  const btn = document.getElementById('btn-wish-submit');
  if (btn) { btn.disabled = true; btn.textContent = 'Mengirim...'; }

  try {
    const { error } = await _SB.from('guestbook').insert({ nama: name, pesan: message });
    if (error) throw error;
    showToast('✓ Ucapan & doa terkirim!');
    document.getElementById('wish-name').value    = '';
    document.getElementById('wish-message').value = '';
    await loadAndRenderWishes();
  } catch (err) {
    console.error('Guestbook error:', err);
    showToast('Gagal mengirim ucapan. Coba lagi.');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '💌 Kirim Ucapan'; }
  }
}

async function loadAndRenderWishes() {
  const list = document.getElementById('wishes-list');
  if (!list) return;
  list.innerHTML = '<p style="color:var(--text-light);font-style:italic;font-size:0.85rem;text-align:center;padding:20px 0;">Memuat ucapan... ⏳</p>';
  try {
    const { data, error } = await _SB
      .from('guestbook')
      .select('id, nama, pesan, created_at')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(30);
    if (error) throw error;
    wishesData = data || [];
    renderWishes();
  } catch (err) {
    console.error('Load guestbook error:', err);
    list.innerHTML = '<p style="color:var(--text-light);font-style:italic;font-size:0.85rem;text-align:center;padding:20px 0;">Gagal memuat ucapan.</p>';
  }
}

function renderWishes() {
  const list = document.getElementById('wishes-list');
  if (!list) return;
  if (!wishesData || wishesData.length === 0) {
    list.innerHTML = '<p style="color:var(--text-light);font-style:italic;font-size:0.85rem;text-align:center;padding:20px 0;">Jadilah yang pertama mengirimkan ucapan 💌</p>';
    return;
  }
  list.innerHTML = wishesData.map(w => `
    <div class="wish-item">
      <div class="wish-item-header">
        <div class="wish-avatar">${escapeHTML(w.nama).charAt(0).toUpperCase()}</div>
        <div>
          <div class="wish-name">${escapeHTML(w.nama)}</div>
          <div style="font-size:0.65rem;color:var(--text-light);font-family:var(--font-ui);margin-top:2px;">${formatDate(w.created_at)}</div>
        </div>
      </div>
      <div class="wish-message">"${escapeHTML(w.pesan)}"</div>
    </div>
  `).join('');
}

// ============================================================
// SAVE THE DATE (Google Calendar)
// ============================================================
function saveToCalendar() {
  const start    = '20251115T060000Z';
  const end      = '20251115T090000Z';
  const text     = encodeURIComponent('Pernikahan Zaki & Anti');
  const details  = encodeURIComponent('Akad Nikah M. Zaki Saputra & Nor Afrianti');
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
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
}

// ============================================================
// GALLERY BUILDER
// ============================================================
function buildGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  grid.innerHTML = GALLERY_IMAGES.slice(0, GALLERY_GRID_COUNT).map((src, i) => `
    <div class="gallery-item" onclick="openLightbox(${i})">
      <img src="${src}" alt="Foto ${i + 1}" loading="lazy">
      <div class="gallery-item-overlay"><span class="zoom-icon">🔍</span></div>
    </div>
  `).join('');

  const sliderImgs = GALLERY_IMAGES.slice(GALLERY_GRID_COUNT);
  const strip = document.getElementById('gallery-strip');
  if (!strip || sliderImgs.length === 0) return;

  const track = strip.querySelector('.gallery-strip-track');
  const allSlider = [...sliderImgs, ...sliderImgs];
  track.innerHTML = allSlider.map((src, i) => {
    const realIdx = GALLERY_GRID_COUNT + (i % sliderImgs.length);
    return `
      <div class="gallery-strip-item" onclick="openLightbox(${realIdx})">
        <img src="${src}" alt="Foto ${realIdx + 1}" loading="lazy">
        <div class="gallery-item-overlay"><span class="zoom-icon">🔍</span></div>
      </div>
    `;
  }).join('');
}

// ============================================================
// HELPERS
// ============================================================
function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ============================================================
// PREVENT COPY / RIGHT CLICK
// ============================================================
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (e.ctrlKey && ['s', 'u', 'c', 'a', 'x', 'p'].includes(e.key.toLowerCase())) {
    e.preventDefault();
    showToast('Konten dilindungi hak cipta');
  }
});

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const guestEl = document.getElementById('cover-guest-name');
  if (guestEl) guestEl.textContent = getGuestName();

  buildGallery();
  loadAndRenderWishes();
  updateRSVPStats();
  updateCountdown();
  setInterval(updateCountdown, 1000);
  initScrollReveal();

  document.getElementById('music-player').addEventListener('click', toggleAudio);
  document.getElementById('btn-open').addEventListener('click', openInvitation);

  document.getElementById('lightbox').addEventListener('click', function(e) {
    if (e.target === this) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (document.getElementById('lightbox').classList.contains('active')) {
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  prevLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
    }
  });

  const rsvpForm = document.getElementById('rsvp-form');
  if (rsvpForm) rsvpForm.addEventListener('submit', submitRSVP);

  const wishForm = document.getElementById('wishes-form');
  if (wishForm) wishForm.addEventListener('submit', submitWish);

  const btnAkad    = document.getElementById('btn-maps-akad');
  const btnResepsi = document.getElementById('btn-maps-resepsi');
  if (btnAkad)    btnAkad.addEventListener('click', () => window.open(CONFIG.mapsAkad, '_blank'));
  if (btnResepsi) btnResepsi.addEventListener('click', () => window.open(CONFIG.mapsResepsi, '_blank'));

  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => copyText(btn.dataset.copy, btn));
  });

  const btnSave = document.getElementById('btn-save-date');
  if (btnSave) btnSave.addEventListener('click', saveToCalendar);

  // Section 2 — Gambar 4.jpg (position:fixed img): tampil hanya saat section di viewport
  const qvSection = document.getElementById('quran-verse');
  if (qvSection) {
    new IntersectionObserver(
      ([entry]) => qvSection.classList.toggle('qv-in-view', entry.isIntersecting),
      { threshold: 0 }
    ).observe(qvSection);
  }
});

// ============================================================
// GIFT CONFIRM — Simpan ke Supabase
// ============================================================
async function submitGiftConfirm() {
  const nama    = (document.getElementById('gc-nama')?.value    || '').trim();
  const bank    = (document.getElementById('gc-bank')?.value    || '').trim();
  const nominal = (document.getElementById('gc-nominal')?.value || '').trim();
  const ucapan  = (document.getElementById('gc-ucapan')?.value  || '').trim();
  const buktiEl   = document.getElementById('gc-bukti');
  const buktiFile = buktiEl?.files?.[0] || null;

  if (!nama || !bank || !nominal) { showToast('Mohon isi Nama, Nama Bank, dan Nominal.'); return; }

  const btn = document.getElementById('btn-gift-confirm');
  if (btn) { btn.disabled = true; btn.textContent = 'Mengirim...'; }

  try {
    let buktiUrl = null;
    if (buktiFile) {
      const ext      = buktiFile.name.split('.').pop();
      const fileName = `bukti_${Date.now()}.${ext}`;
      const { error: upErr } = await _SB.storage.from('gift-bukti').upload(fileName, buktiFile, { cacheControl: '3600', upsert: false });
      if (!upErr) {
        const { data: urlData } = _SB.storage.from('gift-bukti').getPublicUrl(fileName);
        buktiUrl = urlData?.publicUrl || null;
      }
    }

    const { error } = await _SB.from('gift_confirm').insert({ nama, nama_bank: bank, nominal, ucapan: ucapan || null, bukti_url: buktiUrl });
    if (error) throw error;

    showToast('✓ Konfirmasi gift berhasil dikirim!');
    ['gc-nama', 'gc-bank', 'gc-nominal', 'gc-ucapan'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    if (buktiEl) buktiEl.value = '';

  } catch (err) {
    console.error('Gift confirm error:', err);
    showToast('Gagal mengirim konfirmasi. Coba lagi.');
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg> Kirim'; }
  }
}

// ============================================================
// RSVP — Simpan ke Supabase
// ============================================================
async function submitRsvpWa() {
  const nama      = (document.getElementById('rsvp-name')?.value     || '').trim();
  const kehadiran = document.getElementById('rsvp-kehadiran')?.value || 'hadir';
  const jumlah    = parseInt(document.getElementById('rsvp-jumlah')?.value || '1');
  const namaTamu  = getGuestName();

  if (!nama) { showToast('Mohon isi Nama terlebih dahulu.'); return; }

  const btn = document.getElementById('btn-rsvp-submit');
  if (btn) { btn.disabled = true; btn.textContent = 'Mengirim...'; }

  try {
    const { error } = await _SB.from('rsvp').insert({ nama, kehadiran, jumlah, nama_tamu: namaTamu !== 'Tamu Undangan' ? namaTamu : null });
    if (error) throw error;
    const label = kehadiran === 'hadir' ? '✅ Hadir' : '❌ Tidak Hadir';
    showToast(`✓ Konfirmasi ${label} berhasil dikirim!`);
    const nameEl = document.getElementById('rsvp-name');
    if (nameEl) nameEl.value = '';
  } catch (err) {
    console.error('RSVP error:', err);
    showToast('Gagal mengirim konfirmasi. Coba lagi.');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Kirim'; }
  }
}
