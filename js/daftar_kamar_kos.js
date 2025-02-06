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

// Fungsi utama yang dijalankan ketika halaman dimuat
window.onload = function () {
  const authToken = getCookie("authToken");
  if (!authToken) {
    console.error("Token otentikasi tidak ditemukan! Pastikan sudah login.");
    return;
  }

  loadKamarKos(authToken); // Panggil fungsi untuk mengambil dan menampilkan data kamar kos
};

// Fungsi untuk mengambil daftar kamar kos dan render ke tabel
async function loadKamarKos(authToken) {
  try {
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

    if (!data || !Array.isArray(data.data)) {
      throw new Error("Format data tidak sesuai. Tidak ada array data.");
    }

    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ""; // Kosongkan tabel sebelum memasukkan data

    let nomor = 1;
    for (const room of data.data) {
      const { room_id, room_type, size, number_available } = room;
      // Ambil detail kos berdasarkan room_id
      await fetchRoomDetail(
        room_id,
        authToken,
        nomor++,
        tableBody,
        room_type,
        size,
        number_available,
      );
    }
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML =
      "<tr><td colspan='7'>Gagal memuat data kamar.</td></tr>";
  }
}

// Fungsi untuk mengambil detail kamar berdasarkan room_id
async function fetchRoomDetail(
  roomId,
  authToken,
  nomor,
  tableBody,
  room_type,
  size,
  numberAvailable
) {
  try {
    const detailResponse = await fetch(
      `https://kosconnect-server.vercel.app/api/rooms/${roomId}/detail`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    if (!detailResponse.ok) {
      console.warn(
        `Gagal mengambil detail kamar ${roomId}. Status: ${detailResponse.status}`
      );
      return;
    }

    const detail = await detailResponse.json();

    // Pastikan detail berupa array dan ada elemen pertama
    const boardingHouseName = detail.length > 0 ? detail[0]?.boarding_house_name || "Tidak Diketahui" : "Tidak Diketahui";
    const ownerName = detail.length > 0 ? detail[0]?.owner_name || "Tidak Diketahui" : "Tidak Diketahui";

    // Tambahkan data ke tabel
    const row = `
      <tr>
        <td>${nomor}</td>
        <td>${boardingHouseName}</td>
        <td>${room_type}</td>
        <td>${size}</td>
        <td>${numberAvailable}</td>
        <td>${ownerName}</td>
        <td>
          <button class="btn btn-primary" onclick="lihatDetailKamar('${roomId}')">Detail</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  } catch (error) {
    console.error(`Error saat mengambil detail kamar ${roomId}:`, error);
  }
}

// Fungsi untuk melihat detail kamar
function lihatDetailKamar(roomId) {
  window.location.href = `detail_kamar.html?room_id=${roomId}`;
}