/**
 * PT. SBS — Skrip penerima data formulir website
 * ------------------------------------------------
 * Skrip ini menerima kiriman dari formulir "Hubungi Kami" di website
 * dan menyimpannya sebagai baris baru di Google Sheet ini.
 *
 * CARA PASANG:
 * 1. Buka Google Sheet baru (sheets.new).
 * 2. Menu Extensions > Apps Script.
 * 3. Hapus semua kode default, lalu tempel (paste) seluruh isi file ini.
 * 4. Klik ikon simpan (💾), beri nama project misalnya "SBS Form Handler".
 * 5. Klik Deploy > New deployment.
 *    - Klik ikon gerigi di samping "Select type" > pilih "Web app".
 *    - Description: bebas, misal "SBS Website Form".
 *    - Execute as: Me.
 *    - Who has access: Anyone.
 *    - Klik Deploy.
 * 6. Google akan minta izin akses (Authorize access) — pilih akun Google
 *    Anda, lalu klik "Advanced" > "Go to (nama project) (unsafe)" > Allow.
 *    (Ini normal untuk skrip buatan sendiri, bukan tanda bahaya.)
 * 7. Setelah deploy selesai, copy "Web app URL" yang muncul.
 * 8. Buka file pt-sbs-website.html, cari baris:
 *      const SHEET_ENDPOINT_URL = "PASTE_URL_WEB_APP_ANDA_DI_SINI";
 *    Ganti isinya dengan URL yang baru Anda copy, lalu simpan file.
 * 9. Selesai — setiap formulir yang dikirim dari website akan otomatis
 *    masuk sebagai baris baru di sheet ini.
 *
 * CATATAN:
 * - Kalau nanti Anda mengubah kode ini, ulangi dari langkah 5 tapi pilih
 *   "Manage deployments" > ikon pensil > "New version" > Deploy, supaya
 *   URL Web App tidak berubah.
 * - Sheet pertama pada spreadsheet ini akan otomatis diisi header di
 *   baris pertama saat data pertama masuk.
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Form Masuk')
      || createSheetWithHeader_();

    const params = e.parameter;

    sheet.appendRow([
      new Date(),                 // waktu server menerima data
      params.timestamp  || '',    // waktu di browser customer
      params.name       || '',
      params.phone      || '',
      params.service    || '',
      params.message    || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function createSheetWithHeader_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.insertSheet('Form Masuk');
  sheet.appendRow([
    'Waktu Diterima (Server)',
    'Waktu Dikirim (Browser)',
    'Nama',
    'No. WhatsApp',
    'Layanan Diminati',
    'Pesan'
  ]);
  sheet.setFrozenRows(1);
  return sheet;
} 