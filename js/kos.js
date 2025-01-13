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
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <div class="header">
            <h2>Manajemen Kos</h2>
          </div>
          <div class="card-content">
            <h3>Owner</h3>
            <p>Email: ${house.owner_email}</p> <!-- Gantikan dengan field email -->
            <p>Nama Kos: ${house.name}</p>

            <h3>Detail</h3>
            <p>Fasilitas: ${house.facilities.join(', ')}</p>
            <p>Alamat: ${house.address}</p>
            <p>Latitude & Longitude: ${house.latitude}, ${house.longitude}</p>

            <h3>Foto</h3>
            ${house.images.map(img => `<img src="${img}" alt="${house.name}" width="100">`).join('')}

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
