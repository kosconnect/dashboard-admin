// Fungsi untuk membaca nilai cookie berdasarkan nama
function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
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

    if (!authToken) {
      throw new Error(
        "Token otentikasi tidak ditemukan! Pastikan sudah login."
      );
    }

    console.log("Menggunakan authToken:", authToken);

    // Fetch daftar kamar
    const response = await fetch(
      "https://kosconnect-server.vercel.app/api/rooms/",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    

    if (!response.ok) {
      throw new Error(`Gagal mengambil data kamar. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Response Data dari /rooms:", data);

    if (!data || !Array.isArray(data.data)) {
      throw new Error("Format data tidak sesuai. Tidak ada array data.");
    }

    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ""; // Kosongkan tabel sebelum memasukkan data

    let nomor = 1;
    for (const room of data.data) {
      const { room_id, type, size, number_available } = room;

      console.log(`Fetching detail kamar untuk room_id: ${room_id}`);

      // Ambil detail kos berdasarkan room_id
      const detailResponse = await fetch(
        `https://kosconnect-server.vercel.app/api/rooms/${room_id}/detail`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (!detailResponse.ok) {
        console.warn(
          `Gagal mengambil detail kamar ${room_id}. Status: ${detailResponse.status}`
        );
        continue; // Skip kamar yang gagal diambil detailnya
      }

      const detail = await detailResponse.json();
      console.log(`Detail kamar ${room_id}:`, detail);

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

// Fungsi untuk melihat detail kamar
function lihatDetailKamar(roomId) {
  window.location.href = `detail_kamar.html?room_id=${roomId}`;
}

// Ambil data saat halaman dimuat
window.onload = loadKamarKos;