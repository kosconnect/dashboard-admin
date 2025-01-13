// Fungsi untuk Mengambil JWT Token dari Cookie
function getJwtToken() {
    const cookieName = 'authToken=';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(cookieName)) {
            return cookie.substring(cookieName.length);  // Ambil token setelah "authToken="
        }
    }
    console.error("Token tidak ditemukan.");
    return null;
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("boardingHousesContainer");
  const token = getJwtToken();

  if (!token) {
    container.innerHTML = '<p>Token tidak ditemukan. Silakan login terlebih dahulu.</p>';
    return;
  }

  fetch('https://kosconnect-server.vercel.app/api/boardingHouses/', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.data && data.data.length > 0) {
        data.data.forEach(house => {
            const facilities = Array.isArray(house.facilities) ? house.facilities.join(', ') : 'Tidak tersedia';
            const images = Array.isArray(house.images) ? house.images.map(img => `<img src="${img}" alt="${house.name}" width="100">`).join('') : 'Tidak ada gambar';
            
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
              <div class="header">
                <h2>Manajemen Kos</h2>
              </div>
              <div class="card-content">
                <h3>Owner</h3>
                <p>Email: ${house.owner_email || 'Tidak tersedia'}</p>
                <p>Nama Kos: ${house.name || 'Tidak tersedia'}</p>
        
                <h3>Detail</h3>
                <p>Fasilitas: ${facilities}</p>
                <p>Alamat: ${house.address || 'Tidak tersedia'}</p>
                <p>Latitude & Longitude: ${house.latitude || 'N/A'}, ${house.longitude || 'N/A'}</p>
        
                <h3>Foto</h3>
                ${images}
        
                <h3>Aksi</h3>
                <button>Edit</button>
                <button>Delete</button>
              </div>
            `;
            container.appendChild(card);
        });
    } else {
      container.innerHTML = '<p>No boarding houses found</p>';
    }
  })
  .catch(error => {
    console.error('Error:', error);
    container.innerHTML = '<p>Gagal mengambil data boarding house.</p>';
  });
});
