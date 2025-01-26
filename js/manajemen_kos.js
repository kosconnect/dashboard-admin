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
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

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

            // Loop untuk setiap boarding house
            boardingHouses.forEach((boardingHouse) => {
                // Ambil nama kategori dan owner
                fetchCategory(boardingHouse.category_id)
                    .then(categoryName => {
                        return fetchOwner(boardingHouse.owner_id)
                            .then(ownerName => {
                                // Membuat card setelah mendapatkan nama kategori dan owner
                                const card = document.createElement("div");
                                card.className = "card";

                                card.innerHTML = `
                                    <div class="header">
                                        <h2>${boardingHouse.name || 'Nama Kos Tidak Tersedia'}</h2>
                                    </div>
                                    <div class="card-content">
                                        <h3>Owner</h3>
                                        <p>Nama Owner: ${ownerName || 'Tidak Diketahui'}</p>
                                        <h3>Detail</h3>
                                        <p>Nama Kategori: ${categoryName || 'Tidak Diketahui'}</p>
                                        <p>Alamat: ${boardingHouse.address || 'Alamat Tidak Tersedia'}</p>
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
                        console.error("Error mendapatkan kategori atau owner:", error);
                    });
            });
        })
        .catch(error => {
            console.error("Gagal mengambil data boarding houses:", error);
        });
}

// Fungsi untuk mendapatkan kategori berdasarkan category_id
function fetchCategory(categoryId) {
    return fetch(`https://kosconnect-server.vercel.app/api/categories/${categoryId}`)
        .then(response => response.json())
        .then(data => data.name)
        .catch(error => {
            console.error("Gagal mendapatkan kategori:", error);
            return null;
        });
}

// Fungsi untuk mendapatkan owner berdasarkan owner_id
function fetchOwner(ownerId) {
    return fetch(`https://kosconnect-server.vercel.app/api/owners/${ownerId}`)
        .then(response => response.json())
        .then(data => data.name)
        .catch(error => {
            console.error("Gagal mendapatkan owner:", error);
            return null;
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
