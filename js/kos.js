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
      const response = await fetch("https://kosconnect-server.vercel.app/api/boardingHouses/");
      const result = await response.json();
      console.log(result); // Log seluruh respons untuk memeriksa struktur data

      // Akses array dari properti `data` dalam respons
      const boardingHouses = result.data;
  
      // Cek apakah `data` adalah array
      if (Array.isArray(boardingHouses)) {
        // Mendapatkan container untuk menampilkan card
        const cardsContainer = document.querySelector(".cards-container");
  
        // Pastikan container kosong sebelum menambahkan card baru
        cardsContainer.innerHTML = "";
  
        // Iterasi melalui data dan tampilkan setiap boardingHouse dalam bentuk card
        boardingHouses.forEach((boardingHouse) => {
          const card = document.createElement("div");
          card.classList.add("card-item");
              
              // Isi konten card sesuai template
              card.innerHTML = `
                  <div class="header">
                      <h2>${boardingHouse.name || 'Nama Kos Tidak Tersedia'}</h2>
                  </div>
                  <div class="card-content">
                      <h3>Owner</h3>
                      <p>Owner: ${boardingHouse.owner_name || 'Tidak Diketahui'}</p>
                      <h3>Kategori</h3>
                      <p>Nama Kategori: ${boardingHouse.category_name || 'Tidak Diketahui'}</p>
                      <h3>Detail</h3>
                      <p>Alamat: ${boardingHouse.address || 'Alamat Tidak Tersedia'}</p>
                      <p>Latitude & Longitude: ${boardingHouse.latitude || 'N/A'}, ${boardingHouse.longitude || 'N/A'}</p>
                      <p>Deskripsi: ${boardingHouse.description || 'Deskripsi Tidak Tersedia'}</p>
                      <p>Aturan: ${boardingHouse.rules || 'Tidak Ada Aturan'}</p>
                      <h3>Foto</h3>
                      <div class="images">
                          ${boardingHouse.images && boardingHouse.images.length > 0 ? boardingHouse.images.map(img => `<img src="${img}" alt="Foto Kos">`).join('') : 'Tidak Ada Foto'}
                      </div>
                      <h3>Aksi</h3>
                      <button class="btn btn-primary" onclick="editBoardingHouse('${boardingHouse.boarding_house_id}')">Edit</button>
                      <button class="btn btn-primary" onclick="deleteBoardingHouse('${boardingHouse.boarding_house_id}')">Hapus</button>
                  </div>
              `;
              
              // Tambahkan card ke dalam container
              cardsContainer.appendChild(card);
          });
      } else {
          console.error("Data tidak berbentuk array");
      }
  } catch (error) {
      console.error('Gagal mengambil data kos:', error);
  }
}

// Panggil fungsi renderBoardingHouses saat halaman dimuat
window.onload = () => {
  renderBoardingHouses();
};
