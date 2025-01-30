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

// Variabel global untuk menyimpan semua data kamar kos
let allRoomData = [];

// Fungsi untuk merender tabel kamar kos
async function renderRoomTable(rooms) {
    const container = document.querySelector(".cards-container");
    container.innerHTML = ""; // Menghapus konten sebelumnya

    if (rooms.length === 0) {
        container.innerHTML = `
        <div class="card">
            <p>Tidak ada kamar kos yang ditemukan.</p>
        </div>
      `;
        return;
    }

    // Ambil detail untuk setiap kamar
    for (let room of rooms) {
        const { room_id, images, room_type, size, price, status, number_available } = room;

        try {
            // Ambil detail kamar dari API
            const detailResponse = await fetch(`https://kosconnect-server.vercel.app/api/rooms/${room_id}/detail`);
            if (!detailResponse.ok) throw new Error("Gagal mengambil detail kamar");

            const detail = await detailResponse.json();

            // Ambil boarding house, room facilities, dan custom facilities
            const boardingHouse = detail.boarding_house || "Tidak tersedia";
            const roomFacilities = detail.room_facilities ? detail.room_facilities.join(", ") : "Tidak ada fasilitas";
            const customFacilities = detail.custom_facilities ? detail.custom_facilities.join(", ") : "Tidak ada fasilitas tambahan";

            // Pastikan harga tidak menyebabkan error
            const formattedPrice = price?.quarterly ? price.quarterly.toLocaleString() : "Harga tidak tersedia";
            
            // Membuat card untuk setiap kamar kos
            container.innerHTML += `
            <div class="card">
            <img src="${images[0]}" alt="Room Image" class="card-image">
            <div class="card-content">
                        <h3>${room_type}</h3>
                        <p>Kos: ${boardingHouse}</p>
                        <p>Ukuran: ${size}</p>
                        <p>Harga: Rp ${formattedPrice}</p>
                        <p>Status: ${status}</p>
                        <p>Kamar Tersedia: ${number_available}</p>
                        <p>Fasilitas: ${roomFacilities}</p>
                        <p>Fasilitas Tambahan: ${customFacilities}</p>

                        <h3>Aksi</h3>
                        <button class="btn btn-primary" onclick="editRoom('${room_id}')">Edit</button>
                        <button class="btn btn-primary" onclick="deleteRoom('${room_id}')">Hapus</button>
                </div>
            </div>
            `;
        } catch (error) {
            console.error(`Gagal mengambil detail untuk room_id: ${room_id}`, error);
        }
    }
}

    // Ambil data kamar kos saat halaman dimuat
    window.onload = async () => {
        try {
            const authToken = getCookie("authToken");
            const response = await fetch(
                "https://kosconnect-server.vercel.app/api/rooms/",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Gagal mengambil data kamar kos");
            }

            const data = await response.json(); // Dapatkan data dalam bentuk JSON
            allRoomData = data.data; // Ambil array dari 'data'
            await renderRoomTable(allRoomData);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        }
    };
