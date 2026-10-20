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
  'assets/01.jpg','assets/02.jpg','assets/03.jpg','assets/04.jpg',
  'assets/05.jpg','assets/06.jpg','assets/07.jpg','assets/08.jpg',
  'assets/09.jpg','assets/10.jpg','assets/11.jpg','assets/12.jpg',
  'assets/13.jpg','assets/14.jpg','assets/15.jpg','assets/16.jpg',
  'assets/17.jpg','assets/18.jpg','assets/19.jpg','assets/20.jpg',
  'assets/21.jpg','assets/22.jpg','assets/23.jpg','assets/24.jpg',
  'assets/25.jpg','assets/26.jpg','assets/27.jpg','assets/28.jpg',
  'assets/29.jpg','assets/30.jpg','assets/31.jpg','assets/32.jpg',
  'assets/33.jpg','assets/34.jpg',
];

// Gambar grid utama = 12 pertama; sisanya masuk slider
const GALLERY_GRID_COUNT = 12;

// ============================================================
// STATE
// ============================================================
let rsvpData   = [];   // tidak dipakai untuk submit, hanya stat lokal
let wishesData = [];   // akan diisi dari Supabase

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

  // --- Grid utama: 12 foto pertama dengan layout masonry ---
  const gridImgs = GALLERY_IMAGES.slice(0, GALLERY_GRID_COUNT);
  grid.innerHTML = gridImgs.map((src, i) => `
    <div class="gallery-item" onclick="openLightbox(${i})">
      <img src="${src}" alt="Foto ${i + 1}" loading="lazy">
      <div class="gallery-item-overlay">
        <span class="zoom-icon">🔍</span>
      </div>
    </div>
  `).join('');

  // --- Slider strip: sisa gambar (index 12–33) ---
  const sliderImgs = GALLERY_IMAGES.slice(GALLERY_GRID_COUNT);
  const strip = document.getElementById('gallery-strip');
  if (!strip || sliderImgs.length === 0) return;

  // Duplikasi untuk efek loop tanpa jeda
  const allSlider = [...sliderImgs, ...sliderImgs];
  const track = strip.querySelector('.gallery-strip-track');
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

  // Load & render guestbook dari Supabase
  loadAndRenderWishes();

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
// GIFT CONFIRM — Simpan ke Supabase + kirim WA
// ============================================================
async function submitGiftConfirm() {
  const nama    = (document.getElementById('gc-nama')?.value || '').trim();
  const bank    = (document.getElementById('gc-bank')?.value || '').trim();
  const nominal = (document.getElementById('gc-nominal')?.value || '').trim();
  const ucapan  = (document.getElementById('gc-ucapan')?.value || '').trim();
  const buktiEl = document.getElementById('gc-bukti');
  const buktiFile = buktiEl?.files?.[0] || null;

  if (!nama || !bank || !nominal) {
    showToast('Mohon isi Nama, Nama Bank, dan Nominal.');
    return;
  }

  const btn = document.getElementById('btn-gift-confirm');
  if (btn) { btn.disabled = true; btn.textContent = 'Mengirim...'; }

  try {
    // 1. Upload foto bukti ke Supabase Storage (jika ada)
    let buktiUrl = null;
    if (buktiFile) {
      const ext = buktiFile.name.split('.').pop();
      const fileName = `bukti_${Date.now()}.${ext}`;
      const { error: upErr } = await _SB.storage
        .from('gift-bukti')
        .upload(fileName, buktiFile, { cacheControl: '3600', upsert: false });
      if (!upErr) {
        const { data: urlData } = _SB.storage.from('gift-bukti').getPublicUrl(fileName);
        buktiUrl = urlData?.publicUrl || null;
      }
    }

    // 2. Simpan ke tabel gift_confirm
    const { error } = await _SB.from('gift_confirm').insert({
      nama, nama_bank: bank, nominal,
      ucapan: ucapan || null,
      bukti_url: buktiUrl,
    });
    if (error) throw error;

    showToast('✓ Konfirmasi gift berhasil dikirim!');

    // 3. Reset form
    ['gc-nama','gc-bank','gc-nominal','gc-ucapan'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    if (buktiEl) buktiEl.value = '';

  } catch (err) {
    console.error('Gift confirm error:', err);
    showToast('Gagal mengirim konfirmasi. Coba lagi.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg> Konfirmasi';
    }
  }
}

// ============================================================
// RSVP — Simpan ke Supabase
// ============================================================
async function submitRsvpWa() {
  const nama      = (document.getElementById('rsvp-name')?.value || '').trim();
  const kehadiran = document.getElementById('rsvp-kehadiran')?.value || 'hadir';
  const jumlah    = parseInt(document.getElementById('rsvp-jumlah')?.value || '1');
  const namaTamu  = getGuestName();

  if (!nama) {
    showToast('Mohon isi Nama terlebih dahulu.');
    return;
  }

  const btn = document.getElementById('btn-rsvp-submit');
  if (btn) { btn.disabled = true; btn.textContent = 'Mengirim...'; }

  try {
    const { error } = await _SB.from('rsvp').insert({
      nama, kehadiran, jumlah,
      nama_tamu: namaTamu !== 'Tamu Undangan' ? namaTamu : null,
    });
    if (error) throw error;

    const label = kehadiran === 'hadir' ? '✅ Hadir' : '❌ Tidak Hadir';
    showToast(`✓ Konfirmasi ${label} berhasil dikirim!`);

    // Reset form
    const nameEl = document.getElementById('rsvp-name');
    if (nameEl) nameEl.value = '';

  } catch (err) {
    console.error('RSVP error:', err);
    showToast('Gagal mengirim konfirmasi. Coba lagi.');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Submit'; }
  }
}
