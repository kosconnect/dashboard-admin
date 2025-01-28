// Fungsi untuk membaca nilai cookie berdasarkan nama
function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

// Fungsi untuk merender daftar Kos ke dalam card
async function renderBoardingHouses() {
  try {
    // Fetch daftar ID kos dari endpoint awal
    const response = await fetch("https://kosconnect-server.vercel.app/api/boardingHouses/");
    const result = await response.json();

    // Pastikan format data sesuai
    const boardingHouses = result.data;
    console.log("Data Kos:", boardingHouses);

    // Ambil container card
    const cardsContainer = document.querySelector(".cards-container");
    if (!cardsContainer) {
      console.error("Element .cards-container tidak ditemukan di HTML.");
      return;
    }

    // Hapus konten lama sebelum render
    cardsContainer.innerHTML = "";

    // Periksa apakah data berbentuk array
    if (Array.isArray(boardingHouses)) {
      // Iterasi setiap ID kos untuk mendapatkan detailnya
      for (let boardingHouse of boardingHouses) {
        const detailResponse = await fetch(`https://kosconnect-server.vercel.app/api/boardingHouses/${boardingHouse.boarding_house_id}/detail`);
        const detailResult = await detailResponse.json();
        const detail = detailResult.data;

        // Buat elemen card untuk setiap kos
        const card = document.createElement("div");
        card.classList.add("card-item");

        // Isi konten card sesuai template
        card.innerHTML = `
          <div class="header">
            <h2>${detail.name || "Nama Kos Tidak Tersedia"}</h2>
          </div>
          <div class="card-content">
            <h3>Owner</h3>
            <p>Owner: ${detail.owner_name || "Tidak Diketahui"}</p>
            <h3>Kategori</h3>
            <p>Nama Kategori: ${detail.category_name || "Tidak Diketahui"}</p>
            <h3>Detail</h3>
            <p>Alamat: ${detail.address || "Alamat Tidak Tersedia"}</p>
            <p>Latitude & Longitude: ${detail.latitude || "N/A"}, ${detail.longitude || "N/A"}</p>
            <p>Deskripsi: ${detail.description || "Deskripsi Tidak Tersedia"}</p>
            <p>Aturan: ${detail.rules || "Tidak Ada Aturan"}</p>
            <h3>Foto</h3>
            <div class="images">
                ${detail.images && detail.images.length > 0 ? detail.images.map(img => `<img src="${img}" alt="Foto Kos">`).join('') : 'Tidak Ada Foto'}
            </div>
            <h3>Aksi</h3>
            <button class="btn btn-primary" onclick="editBoardingHouse('${detail.boarding_house_id}')">Edit</button>
            <button class="btn btn-primary" onclick="deleteBoardingHouse('${detail.boarding_house_id}')">Hapus</button>
          </div>
        `;

        // Tambahkan card ke dalam container
        cardsContainer.appendChild(card);
      }
    } else {
      console.error("Data tidak berbentuk array");
    }
  } catch (error) {
    console.error("Gagal mengambil data kos:", error);
  }
}

// Event listener untuk memastikan DOM siap sebelum JavaScript dijalankan
document.addEventListener("DOMContentLoaded", () => {
  renderBoardingHouses();
});

// Dummy fungsi untuk edit dan delete (update sesuai kebutuhan)
function editBoardingHouse(id) {
  alert(`Edit kos dengan ID: ${id}`);
}

function deleteBoardingHouse(id) {
  alert(`Hapus kos dengan ID: ${id}`);
}
