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
document.addEventListener("DOMContentLoaded", function () {
    const jwtToken = getJwtToken(); // Dapatkan JWT token
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    // Panggil fungsi untuk mengambil data kos setelah token didapat
    fetchBoardingHouses(jwtToken);
});

// Fungsi untuk mengambil data kos
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

            // Mengakses array 'data' dari respons
            const boardingHouses = result.data;

            // Validasi apakah boardingHouses adalah array
            if (!Array.isArray(boardingHouses)) {
                throw new TypeError("Respons API tidak sesuai, 'data' bukan array.");
            }

            const container = document.querySelector(".cards-container");
            if (!container) {
                console.error("Elemen .cards-container tidak ditemukan di DOM.");
                return;
            }

            // Clear previous cards
            container.innerHTML = "";

            boardingHouses.forEach((boardingHouse) => {
                const card = document.createElement("div");
                card.className = "card";

                // Ambil kategori dan owner menggunakan fetch
                fetchCategory(boardingHouse.category_id, jwtToken)
                    .then(categoryName => {
                        return fetchOwner(boardingHouse.owner_id, jwtToken)
                            .then(ownerName => {
                                card.innerHTML = `
                                    <div class="header">
                                        <h2>${boardingHouse.name || 'Nama Kos Tidak Tersedia'}</h2>
                                    </div>
                                    <div class="card-content">
                                        <h3>Owner</h3>
                                        <p>Owner: ${ownerName || 'Tidak Diketahui'}</p>
                                        <h3>Kategori</h3>
                                        <p>Nama Kategori: ${categoryName || 'Tidak Diketahui'}</p>
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
                                container.appendChild(card);
                            });
                    })
                    .catch(error => {
                        console.error("Error fetching category or owner:", error);
                    });
            });
        })
        .catch(error => {
            console.error("Gagal mengambil data boarding houses:", error);
        });
}

// Fungsi untuk mengambil kategori berdasarkan ID
function fetchCategory(categoryId, jwtToken) {
    return fetch(`https://kosconnect-server.vercel.app/api/categories/${categoryId}`, {
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    })
        .then(response => {
            console.log(`Response kategori (ID: ${categoryId}):`, response); // Log response
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            console.log(`Hasil kategori (ID: ${categoryId}):`, result);
            return result.data.name;
        })
        .catch(error => {
            console.error("Gagal mengambil data kategori:", error);
            return 'Tidak Diketahui';
        });
}

// Fungsi untuk mengambil owner berdasarkan ID
function fetchOwner(ownerId, jwtToken) {
    return fetch(`https://kosconnect-server.vercel.app/api/users/${ownerId}`, {
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    })
        .then(response => {
            console.log(`Response owner (ID: ${ownerId}):`, response); // Log response
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            console.log(`Hasil owner (ID: ${ownerId}):`, result);
            return result.user.name;
        })
        .catch(error => {
            console.error("Gagal mengambil data owner:", error);
            return 'Tidak Diketahui';
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

