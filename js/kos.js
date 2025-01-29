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

// Variabel global untuk menyimpan semua data boarding houses
let allBoardingHouseData = [];

// Fungsi untuk merender tabel boarding house
async function renderBoardingHouseTable(boardingHouses) {
    const tbody = document.querySelector("cards-container");
    tbody.innerHTML = "";

    if (boardingHouses.length === 0) {
        tbody.innerHTML = `
        <tr>
          <td colspan="6">Tidak ada boarding house yang ditemukan.</td>
        </tr>
      `;
        return;
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

        allBoardingHouseData = await response.json();
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
}
