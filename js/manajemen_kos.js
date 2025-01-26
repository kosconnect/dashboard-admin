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

// Fungsi untuk mengambil kategori berdasarkan ID
function fetchCategory(categoryId) {
    return fetch(`https://kosconnect-server.vercel.app/api/categories/${categoryId}`, {
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parsing JSON dari respons
        })
        .then(result => {
            return result.data.name || 'Nama Kategori Tidak Tersedia';
        })
        .catch(error => {
            console.error("Gagal mengambil data kategori:", error);
        });
}

// Fungsi untuk mengambil owner berdasarkan ID
function fetchOwner(ownerId) {
    return fetch(`https://kosconnect-server.vercel.app/api/users/owner/${ownerId}`, {
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parsing JSON dari respons
        })
        .then(result => {
            return result.data.name || 'Nama Owner Tidak Tersedia';
        })
        .catch(error => {
            console.error("Gagal mengambil data owner:", error);
        });
}

// Fungsi untuk mengambil data kos dan menampilkan owner dan kategori
function fetchBoardingHouses(jwtToken) {
    fetch("https://kosconnect-server.vercel.app/api/boardingHouses/", {
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parsing JSON dari respons
        })
        .then((result) => {
            console.log("Data boarding houses:", result);

            const boardingHouses = result.data;
            if (!Array.isArray(boardingHouses)) {
                throw new TypeError("Respons API tidak sesuai, 'data' bukan array.");
            }

            const container = document.querySelector(".cards-container");
            if (!container) {
                console.error("Elemen .cards-container tidak ditemukan di DOM.");
                return;
            }

            container.innerHTML = "";

            boardingHouses.forEach((boardingHouse) => {
                const card = document.createElement("div");
                card.className = "card";

                // Mengambil nama owner dan kategori berdasarkan ID
                Promise.all([
                    fetchOwner(boardingHouse.owner_id), // Mengambil nama owner
                    fetchCategory(boardingHouse.category_id) // Mengambil nama kategori
                ])
                    .then(([ownerName, categoryName]) => {
                        card.innerHTML = `
                            <div class="header">
                                <h2>${boardingHouse.name || 'Nama Kos Tidak Tersedia'}</h2>
                            </div>
                            <div class="card-content">
                                <h3>Owner</h3>
                                <p>Nama Owner: ${ownerName}</p>
                                <h3>Kategori</h3>
                                <p>Nama Kategori: ${categoryName}</p>
                                <h3>Detail</h3>
                                <p>Fasilitas: ${boardingHouse.facilities ? boardingHouse.facilities.length : 0}</p>
                                <p>Alamat: ${boardingHouse.address || 'Alamat Tidak Tersedia'}</p>
                                <p>Latitude & Longitude: ${boardingHouse.latitude || 'N/A'}, ${boardingHouse.longitude || 'N/A'}</p>
                                <h3>Foto</h3>
                                <div class="images">
                                    ${boardingHouse.images && boardingHouse.images.length > 0 ? boardingHouse.images.map(img => `<img src="${img}" alt="Foto Kos">`).join('') : 'Tidak Ada Foto'}
                                </div>
                                <h3>Aksi</h3>
                                <button class="btn btn-primary" onclick="editBoardingHouse('${boardingHouse.boarding_house_id}')">Edit</button>
                                <button class="btn btn-primary" onclick="deleteBoardingHouse('${boardingHouse.boarding_house_id}')">Hapus</button>
                            </div>
                        `;
                        container.appendChild(card);
                    })
                    .catch((error) => {
                        console.error("Gagal mengambil data owner atau kategori:", error);
                    });
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

// Tunggu hingga seluruh DOM dimuat
document.addEventListener("DOMContentLoaded", function () {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    fetchBoardingHouses(jwtToken);
});
