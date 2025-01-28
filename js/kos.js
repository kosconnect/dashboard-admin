
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

// Fungsi untuk merender setiap boarding house ke dalam kartu
async function renderBoardingHouseCard(boardingHouseId) {
  const cardsContainer = document.querySelector(".cards-container");

  try {
      // Ambil token autentikasi dari cookie
      const authToken = getCookie("authToken");

      // Fetch detail boarding house dari API
      const response = await fetch(
          `https://kosconnect-server.vercel.app/api/boardingHouses/${boardingHouseId}/detail`,
          {
              method: "GET",
              headers: {
                  Authorization: `Bearer ${authToken}`,
              },
          }
      );

      if (!response.ok) {
          throw new Error("Gagal mengambil data detail boarding house.");
      }

      const detail = await response.json();

      // Membuat elemen kartu untuk setiap boarding house
      const card = document.createElement("div");
      card.classList.add("card-item");

      // Menambahkan isi detail boarding house
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
              <button class="btn btn-primary" onclick="editBoardingHouse('${boardingHouseId}')">Edit</button>
              <button class="btn btn-primary" onclick="deleteBoardingHouse('${boardingHouseId}')">Hapus</button>
          </div>
      `;

      cardsContainer.appendChild(card);

  } catch (error) {
      console.error("Error:", error);
  }
}

// Fungsi untuk edit boarding house
function editBoardingHouse(boardingHouseId) {
  alert(`Edit boarding house dengan ID: ${boardingHouseId}`);
}

// Fungsi untuk hapus boarding house
function deleteBoardingHouse(boardingHouseId) {
  const confirmDelete = confirm("Apakah Anda yakin ingin menghapus kos ini?");
  if (confirmDelete) {
      alert(`Hapus boarding house dengan ID: ${boardingHouseId}`);
      // Implementasi penghapusan bisa ditambahkan di sini
  }
}

// Fungsi untuk mendapatkan daftar boarding houses
async function fetchBoardingHouses() {
  const cardsContainer = document.querySelector(".cards-container");

  try {
      // Ambil token autentikasi dari cookie
      const authToken = getCookie("authToken");

      // Fetch daftar boarding houses
      const response = await fetch(
          `https://kosconnect-server.vercel.app/api/boardingHouses/`,
          {
              method: "GET",
              headers: {
                  Authorization: `Bearer ${authToken}`,
              },
          }
      );

      if (!response.ok) {
          throw new Error("Gagal mengambil data boarding houses.");
      }

      const boardingHouses = await response.json();

      // Render kartu untuk setiap boarding house
      boardingHouses.data.forEach(boardingHouse => {
          renderBoardingHouseCard(boardingHouse.boarding_house_id);
      });

  } catch (error) {
      console.error("Error:", error);
      cardsContainer.innerHTML = `<p>Terjadi kesalahan saat mengambil data boarding house.</p>`;
  }
}

// Panggil fetchBoardingHouses saat halaman dimuat
window.onload = () => {
  fetchBoardingHouses();
};
