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
    const response = await fetch(
      "https://kosconnect-server.vercel.app/api/rooms/",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    if (!response.ok) throw new Error("Gagal mengambil data kos");

    const data = await response.json();
    if (!data || !data.data) throw new Error("Data tidak ditemukan");

    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ""; // Kosongkan tabel sebelum memasukkan data

    let nomor = 1;
    for (let room of data.data) {
      const { room_id, type, size, number_available } = room;

      // Ambil detail kos berdasarkan room_id
      const detailResponse = await fetch(
        `https://kosconnect-server.vercel.app/api/rooms/${room_id}/detail`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (!detailResponse.ok)
        throw new Error(`Gagal mengambil detail kamar ${room_id}`);

      const detail = await detailResponse.json();

      // Ambil informasi tambahan dari detail
      const boardingHouseName = detail.boarding_house_name || "Tidak Diketahui";
      const ownerName = detail.owner_name || "Tidak Diketahui";

      // Tambahkan data ke tabel
      const row = `
        <tr>
            <td>${nomor++}</td>
            <td>${boardingHouseName}</td>
            <td>${type}</td>
            <td>${size}</td>
            <td>${number_available}</td>
            <td>${ownerName}</td>
            <td>
                <button class="btn btn-detail" onclick="lihatDetailKamar('${room_id}')">Detail</button>
            </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    }
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML =
      "<tr><td colspan='7'>Gagal memuat data kamar.</td></tr>";
  }
}

// Fungsi untuk redirect ke halaman tambah kamar
function redirectToTambahKamar() {
  window.location.href = "tambah_kamar_kos.html";
}

// Fungsi untuk melihat detail kamar
function lihatDetailKamar(roomId) {
  window.location.href = `detail_kamar.html?room_id=${roomId}`;
}

// Ambil data saat halaman dimuat
window.onload = loadKamarKos;
