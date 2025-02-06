// Fungsi untuk membaca nilai cookie berdasarkan nama
function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

// Fungsi untuk mengambil boardingHouseID dari URL
function getBoardingHouseIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("boarding_house_id");
}
// Fungsi untuk merender detail boarding house
async function renderBoardingHouseDetail(boardingHouse) {
  const container = document.querySelector(".cards-container");
  container.innerHTML = ""; // Kosongkan container sebelum diisi

  if (!boardingHouse) {
    container.innerHTML = `
        <div class="card">
            <p>Data boarding house tidak ditemukan.</p>
        </div>
      `;
    return;
  }

  const { boarding_house_id, images, name, address, description, rules } =
    boardingHouse;

  try {
    // Ambil detail boarding house
    const detailResponse = await fetch(
      `https://kosconnect-server.vercel.app/api/boardingHouses/${boarding_house_id}/detail`
    );
    if (!detailResponse.ok) throw new Error("Gagal mengambil detail kos.");

    const detail = await detailResponse.json();

    // Ambil kategori dan owner
    const categoryName = detail?.category_name || "Kategori Tidak Diketahui";
    const ownerFullname =
      detail?.owner_fullname || "Nama Pemilik Tidak Diketahui";
    const facilityList = detail?.facilities || []; // Ambil fasilitas dari response

    // Buat tampilan semua gambar
    const imageGallery =
      images && images.length > 0
        ? images
            .map(
              (img) => `<img src="${img}" alt="Kos Image" class="card-image">`
            )
            .join("")
        : `<p>Tidak ada gambar tersedia</p>`;

    // Buat tampilan fasilitas umum kos
    const facilityDisplay =
      facilityList.length > 0
        ? facilityList.map((facility) => `<li>${facility}</li>`).join("")
        : `<p>Tidak ada fasilitas tersedia</p>`;

    // Tampilkan data di halaman
    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <h3>${name}</h3>
            <p class="kategori">Kategori: ${categoryName}</p> 
          </div>
          <p class="alamat"><i class="fa-solid fa-location-dot"></i> ${address}</p> 
          <p class="owner"><i class="fa-solid fa-user"></i> Pemilik: ${ownerFullname}</p> 
        </div>

        <div class="card-content">
          <div class="left">
            <p><strong>Aturan:</strong></p>
            <p>${rules}</p>
          </div>
          <div class="center">
            <p><strong>Deskripsi:</strong></p>
            <p>${description}</p>
          </div>
          <div class="right">
            <p><strong>Fasilitas Umum Kos:</strong></p>
            <div class="facility-list">
              <ul>${facilityDisplay}</ul>
            </div>
          </div>
        </div>

        <div class="card-gallery">
          <p><strong>Gambar Kos:</strong></p>
          ${imageGallery}
        </div>
      </div>
    `;
  } catch (error) {
    console.error(`Gagal mengambil detail untuk Kos ${name}:`, error);
  }
}

// Fungsi untuk memuat data boarding house berdasarkan ID
async function loadBoardingHouseDetail() {
  try {
    const boardingHouseId = getBoardingHouseIdFromURL();
    if (!boardingHouseId)
      throw new Error("ID boarding house tidak ditemukan di URL.");

    const authToken = getCookie("authToken");
    const response = await fetch(
      `https://kosconnect-server.vercel.app/api/boardingHouses/${boardingHouseId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    if (!response.ok) throw new Error("Gagal mengambil data boarding house");

    const boardingHouse = await response.json();
    await renderBoardingHouseDetail(boardingHouse);
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    document.querySelector(".cards-container").innerHTML =
      "<p>Gagal memuat data kos.</p>";
  }
}

// Ambil data saat halaman dimuat
window.onload = loadBoardingHouseDetail;