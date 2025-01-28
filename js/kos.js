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

// Fungsi untuk mendapatkan parameter ID dari URL
function getIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id"); // Mengambil nilai dari parameter "id"
}

// Fungsi untuk merender detail boarding house
async function renderBoardingHouseDetails() {
  const id = getIdFromURL(); // Ambil ID dari URL
  if (!id) {
    alert("ID kos tidak ditemukan di URL.");
    return;
  }

  const cardsContainer = document.querySelector(".cards-container");

  try {
    // Ambil token autentikasi dari cookie
    const authToken = getCookie("authToken");

    // Fetch detail boarding house dari API
    const response = await fetch(
      `https://kosconnect-server.vercel.app/api/boardingHouses/${id}/detail`,
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

    // Hapus isi kontainer sebelum menampilkan data baru
    cardsContainer.innerHTML = "";

    // Render detail boarding house
    const card = document.createElement("div");
    card.classList.add("card-item");

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
          ${
            detail.images && detail.images.length > 0
              ? detail.images
                  .map((img) => `<img src="${img}" alt="Foto Kos" class="kos-image">`)
                  .join("")
              : "Tidak Ada Foto"
          }
        </div>
        <h3>Aksi</h3>
        <button class="btn btn-primary" onclick="editBoardingHouse('${id}')">Edit</button>
        <button class="btn btn-primary" onclick="deleteBoardingHouse('${id}')">Hapus</button>
      </div>
    `;

    // Tambahkan card ke dalam container
    cardsContainer.appendChild(card);
  } catch (error) {
    console.error("Error:", error);
    cardsContainer.innerHTML = `<p>Terjadi kesalahan saat mengambil detail boarding house.</p>`;
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
    // Tambahkan implementasi delete di sini
  }
}

// Render detail boarding house saat halaman dimuat
window.onload = () => {
  renderBoardingHouseDetails();
};
