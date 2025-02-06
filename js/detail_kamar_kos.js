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

// Fungsi untuk mendapatkan daftar kamar kos dan render ke tabel
async function loadKamarKos() {
    try {
        const authToken = getCookie("authToken");
        const response = await fetch("https://kosconnect-server.vercel.app/api/boardingHouses/", {
            method: "GET",
            headers: { Authorization: `Bearer ${authToken}` }
        });

        if (!response.ok) throw new Error("Gagal mengambil data kos");

        const data = await response.json();
        if (!data || !data.data) throw new Error("Data tidak ditemukan");

        const tableBody = document.getElementById("table-body");
        tableBody.innerHTML = ""; // Kosongkan tabel sebelum memasukkan data

        let nomor = 1;
        for (let boardingHouse of data.data) {
            const { boarding_house_id, name } = boardingHouse;

            // Ambil detail kos
            const detailResponse = await fetch(
                `https://kosconnect-server.vercel.app/api/boardingHouses/${boarding_house_id}/detail`
            );

            if (!detailResponse.ok) throw new Error(`Gagal mengambil detail kos ${name}`);

            const detail = await detailResponse.json();

            // Ambil informasi tambahan
            const ownerFullname = detail.owner_fullname || "Tidak Diketahui";
            const rooms = detail.rooms || [];

            for (let room of rooms) {
                const { type, size, available } = room;

                // Tambahkan data ke tabel
                const row = `
                    <tr>
                        <td>${nomor++}</td>
                        <td>${name}</td>
                        <td>${type}</td>
                        <td>${size}</td>
                        <td>${available}</td>
                        <td>${ownerFullname}</td>
                        <td>
                            <button class="btn btn-detail" onclick="lihatDetailKamar(${boarding_house_id})">Detail</button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            }
        }
    } catch (error) {
        console.error("Gagal mengambil data:", error);
    }
}

// Fungsi untuk redirect ke halaman tambah kamar
function redirectToTambahKamar() {
    window.location.href = "tambah_kamar_kos.html";
}

// Fungsi untuk melihat detail kamar
function lihatDetailKamar(boardingHouseId) {
    window.location.href = `detail_kamar.html?boarding_house_id=${boardingHouseId}`;
}

// Ambil data saat halaman dimuat
window.onload = loadKamarKos;
