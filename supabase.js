// ============================================================
// SUPABASE CLIENT — Undangan Digital Anwar & Siska
// ============================================================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL  = 'https://xabmzlvehwmpsqmejvhv.supabase.co';
const SUPABASE_ANON = 'sb_publishable_MvSXWigH_3AN5ZWrelnFag_ohImhKqs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// ============================================================
// RSVP — Submit Konfirmasi Kehadiran
// ============================================================
export async function submitRsvp({ nama, kehadiran, jumlah, namaTamu }) {
  const { error } = await supabase.from('rsvp').insert({
    nama,
    kehadiran,
    jumlah: parseInt(jumlah),
    nama_tamu: namaTamu || null,
  });
  if (error) throw error;
}

// ============================================================
// GIFT CONFIRM — Submit Konfirmasi Transfer
// ============================================================
export async function submitGift({ nama, namaBank, nominal, ucapan, buktiFile }) {
  let buktiUrl = null;

  // Upload foto bukti jika ada
  if (buktiFile) {
    const ext      = buktiFile.name.split('.').pop();
    const fileName = `bukti_${Date.now()}.${ext}`;
    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from('gift-bukti')
      .upload(fileName, buktiFile, { cacheControl: '3600', upsert: false });
    if (uploadErr) throw uploadErr;
    const { data: urlData } = supabase.storage.from('gift-bukti').getPublicUrl(fileName);
    buktiUrl = urlData.publicUrl;
  }

  const { error } = await supabase.from('gift_confirm').insert({
    nama,
    nama_bank:  namaBank,
    nominal,
    ucapan:     ucapan || null,
    bukti_url:  buktiUrl,
  });
  if (error) throw error;
}

// ============================================================
// GUESTBOOK — Submit Ucapan & Doa
// ============================================================
export async function submitGuestbook({ nama, pesan }) {
  const { error } = await supabase.from('guestbook').insert({ nama, pesan });
  if (error) throw error;
}

// ============================================================
// GUESTBOOK — Load Ucapan (approved saja)
// ============================================================
export async function loadGuestbook(limit = 20) {
  const { data, error } = await supabase
    .from('guestbook')
    .select('id, nama, pesan, created_at')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}
