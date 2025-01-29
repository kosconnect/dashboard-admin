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

   // Ambil detail untuk setiap boarding house
   for (let boardingHouse of boardingHouses) {
    const { boarding_house_id, images, name, address, description, rules } = boardingHouse;

    // Ambil detail (full_name dan category_name) untuk setiap boarding house
    const detailResponse = await fetch(`https://kosconnect-server.vercel.app/api/boardingHouses/${boarding_house_id}/detail`);
    const detail = await detailResponse.json();
    
    // Ambil data full_name (owner) dan category_name dari detail
    const ownerName = detail[0]?.full_name || "Owner Tidak Diketahui"; // Menggunakan full_name
    const categoryName = detail[0]?.category_name || "Kategori Tidak Diketahui";

    // Membuat card untuk setiap boarding house
    container.innerHTML += `
        <div class="card">
            <img src="${images[0]}" alt="Kos Image" class="card-image">
            <div class="card-content">
                <h3>${name}</h3>
                <p>Alamat: ${address}</p>
                <p>Owner: ${ownerName}</p>
                <p>Kategori: ${categoryName}</p>
                <p>${description}</p>
                <p>Aturan: ${rules}</p>
            <h3>Aksi</h3>
            <button class="btn btn-primary" onclick="editBoardingHouse('${boardingHouseId}')">Edit</button>
            <button class="btn btn-primary" onclick="deleteBoardingHouse('${boardingHouseId}')">Hapus</button>
            </div>
        </div>
    `;
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
// async function fetchBoardingHouseDetail(boardingHouseId) {
//     try {
//         const response = await fetch(`https://kosconnect-server.vercel.app/api/boardingHouses/${boardingHouseId}/detail`);
//         if (!response.ok) {
//             throw new Error("Gagal mengambil detail boarding house");
//         }
//         const detail = await response.json();
//         renderBoardingHouseDetail(detail, boardingHouseId);
//     } catch (error) {
//         console.error("Gagal mengambil data detail:", error);
//     }
// }

// Fungsi untuk merender detail boarding house
// function renderBoardingHouseDetail(detail, boardingHouseId) {
//     const card = document.querySelector(".card");
//     card.innerHTML = `
//         <div class="header">
//             <h2>${detail.name || "Nama Kos Tidak Tersedia"}</h2>
//         </div>
//         <div class="card-content">
//             <h3>Owner</h3>
//             <p>Owner: ${detail.owner_name || "Tidak Diketahui"}</p>
//             <h3>Kategori</h3>
//             <p>Nama Kategori: ${detail.category_name || "Tidak Diketahui"}</p>
//             <h3>Detail</h3>
//             <p>Alamat: ${detail.address || "Alamat Tidak Tersedia"}</p>
//             <p>Latitude & Longitude: ${detail.latitude || "N/A"}, ${detail.longitude  || "N/A"}</p>
//             <p>Deskripsi: ${detail.description || "Deskripsi Tidak Tersedia"}</p>
//             <p>Aturan: ${detail.rules || "Tidak Ada Aturan"}</p>
//             <h3>Foto</h3>
//             <div class="images">
//                 ${detail.images && detail.images.length > 0 ? detail.images.map(img => `<img src="${img}" alt="Foto Kos">`).join('') : 'Tidak Ada Foto'}
//             </div>
//             <h3>Aksi</h3>
//             <button class="btn btn-primary" onclick="editBoardingHouse('${boardingHouseId}')">Edit</button>
//             <button class="btn btn-primary" onclick="deleteBoardingHouse('${boardingHouseId}')">Hapus</button>
//         </div>
//     `;
// }