// Fungsi untuk merender kartu boarding house
async function renderBoardingHouseTable(boardingHouses) {
    const container = document.querySelector(".cards-container");
    container.innerHTML = ""; // Menghapus konten sebelumnya

    if (boardingHouses.length === 0) {
        container.innerHTML = `
        <div class="card">
            <p>Tidak ada boarding house yang ditemukan.</p>
        </div>
      `;
        return;
    }

    for (let boardingHouse of boardingHouses) {
        // Ambil data owner dan kategori berdasarkan ID
        const ownerName = await fetchOwnerName(boardingHouse.owner_id);
        const categoryName = await fetchCategoryName(boardingHouse.category_id);

        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${boardingHouse.images[0]}" alt="Kos Image" class="card-image">
            <div class="card-content">
                <h3>${boardingHouse.name}</h3>
                <p>Alamat: ${boardingHouse.address}</p>
                <p>Owner: ${ownerName || "Owner Tidak Diketahui"}</p>
                <p>Kategori: ${categoryName || "Kategori Tidak Diketahui"}</p>
                <p>${boardingHouse.description}</p>
                <button onclick="fetchBoardingHouseDetail('${boardingHouse.boarding_house_id}')">Lihat Detail</button>
            </div>
        `;
        
        container.appendChild(card);
    }
}

// Fungsi untuk mengambil nama owner berdasarkan ID
async function fetchOwnerName(ownerId) {
    try {
        const response = await fetch(`https://kosconnect-server.vercel.app/api/owners/${ownerId}`);
        if (!response.ok) {
            throw new Error("Gagal mengambil data owner");
        }
        const data = await response.json();
        return data.name || "Nama Owner Tidak Diketahui";
    } catch (error) {
        console.error("Gagal mengambil data owner:", error);
        return "Nama Owner Tidak Diketahui";
    }
}

// Fungsi untuk mengambil nama kategori berdasarkan ID
async function fetchCategoryName(categoryId) {
    try {
        const response = await fetch(`https://kosconnect-server.vercel.app/api/categories/${categoryId}`);
        if (!response.ok) {
            throw new Error("Gagal mengambil data kategori");
        }
        const data = await response.json();
        return data.name || "Kategori Tidak Diketahui";
    } catch (error) {
        console.error("Gagal mengambil data kategori:", error);
        return "Kategori Tidak Diketahui";
    }
}

// Ambil data boarding house saat halaman dimuat
window.onload = async () => {
    try {
        const authToken = getCookie("authToken");
        const response = await fetch(
            "https://kosconnect-server.vercel.app/api/boardingHouses/",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error("Gagal mengambil data boarding house");
        }

        const data = await response.json(); // Dapatkan data dalam bentuk JSON
        allBoardingHouseData = data.data; // Ambil array dari 'data'
        await renderBoardingHouseTable(allBoardingHouseData);
    } catch (error) {
        console.error("Gagal mengambil data:", error);
    }
};

// Fungsi untuk mengambil detail boarding house
async function fetchBoardingHouseDetail(boardingHouseId) {
    try {
        const response = await fetch(`https://kosconnect-server.vercel.app/api/boardingHouses/${boardingHouseId}/detail`);
        if (!response.ok) {
            throw new Error("Gagal mengambil detail boarding house");
        }
        const detail = await response.json();
        renderBoardingHouseDetail(detail, boardingHouseId);
    } catch (error) {
        console.error("Gagal mengambil data detail:", error);
    }
}

// Fungsi untuk merender detail boarding house
function renderBoardingHouseDetail(detail, boardingHouseId) {
    const card = document.querySelector(".card");
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
            <p>Latitude & Longitude: ${detail.latitude || "N/A"}, ${detail.longitude  || "N/A"}</p>
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
}
