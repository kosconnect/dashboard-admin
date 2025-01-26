// Fungsi untuk mendapatkan JWT token
function getJwtToken() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('authToken=')) {
            return cookie.substring('authToken='.length);
        }
    }
    console.error("Token tidak ditemukan.");
    return null;
}

// Tunggu hingga seluruh DOM dimuat
document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".cards-container");
    console.log(container ? "Elemen ditemukan" : "Elemen tidak ditemukan");
    
    if (container) {
      fetchBoardingHouses();
    } else {
      console.error("Elemen .cards-container tidak ditemukan di DOM.");
    }
  });  

// Fungsi untuk mengambil data kos
function fetchBoardingHouses(jwtToken) {
    fetch('https://kosconnect-server.vercel.app/api/boardingHouses/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Data boarding houses:", data);

            const container = document.querySelector('.cards-container');
            if (!container) {
                console.error("Elemen .cards-container tidak ditemukan di DOM.");
                return;
            }

            container.innerHTML = ''; // Kosongkan kontainer

            data.forEach(kos => {
                const card = document.createElement('div');
                card.className = 'card';

                card.innerHTML = `
                    <div class="header">
                        <h2>${kos.name || 'Nama Kos Tidak Tersedia'}</h2>
                    </div>
                    <div class="card-content">
                        <h3>Owner</h3>
                        <p>Owner Id: ${kos.owner_id || 'Tidak Diketahui'}</p>
                        <h3>Detail</h3>
                        <p>Fasilitas: ${kos.facilities ? kos.facilities.length : 0}</p>
                        <p>Alamat: ${kos.address || 'Alamat Tidak Tersedia'}</p>
                        <p>Latitude & Longitude: ${kos.latitude || 'N/A'}, ${kos.longitude || 'N/A'}</p>
                        <h3>Foto</h3>
                        <div class="images">
                            ${kos.images && kos.images.length > 0 ? kos.images.map(img => `<img src="${img}" alt="Foto Kos">`).join('') : 'Tidak Ada Foto'}
                        </div>
                        <h3>Aksi</h3>
                        <button class="btn btn-primary" onclick="editBoardingHouse('${kos.boarding_house_id}')">Edit</button>
                        <button class="btn btn-primary" onclick="deleteBoardingHouse('${kos.boarding_house_id}')">Hapus</button>
                    </div>
                `;

                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Gagal mengambil data boarding houses:", error);
        });
}

// Fungsi Edit (placeholder)
function editBoardingHouse(boardingHouseId) {
    alert(`Edit boarding house: ${boardingHouseId}`);
}

// Fungsi Hapus (placeholder)
function deleteBoardingHouse(boardingHouseId) {
    alert(`Hapus boarding house: ${boardingHouseId}`);
}
