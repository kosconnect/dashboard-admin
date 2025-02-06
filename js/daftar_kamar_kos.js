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

  loadKamarKos(authToken);
};

// Fungsi untuk mengambil daftar kamar kos dan render ke tabel
async function loadKamarKos(authToken) {
  try {
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
    tableBody.innerHTML = "";

    let nomor = 1;
    for (const room of data.data) {
      const { room_id, room_type, size, number_available, price } = room;
      await fetchRoomDetail(
        room_id,
        authToken,
        nomor++,
        tableBody,
        room_type,
        size,
        number_available,
        price
      );
    }
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML =
      "<tr><td colspan='8'>Gagal memuat data kamar.</td></tr>";
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
  numberAvailable,
  price
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
    const boardingHouseName =
      detail[0]?.boarding_house_name || "Tidak Diketahui";
    const ownerName = detail[0]?.owner_name || "Tidak Diketahui";
    const roomFacilities = detail[0]?.room_facilities || [];
    const customFacilities = detail[0]?.custom_facility_details || [];

    // Konversi harga berdasarkan jenis sewa
    let priceDisplay = "<ul>";
    if (price && typeof price === "object") {
      const priceTypes = {
        monthly: "bulan",
        quarterly: "3 bulan",
        semi_annual: "6 bulan",
        yearly: "tahun",
      };
      Object.entries(priceTypes).forEach(([key, label]) => {
        if (price[key]) {
          priceDisplay += `<li>Rp ${price[key].toLocaleString(
            "id-ID"
          )} / ${label}</li>`;
        }
      });
    }
    priceDisplay += "</ul>";

    const facilityList =
      roomFacilities.length > 0
        ? roomFacilities.map((facility) => `<li>${facility}</li>`).join("")
        : "Tidak ada fasilitas";

    const customFacilityList =
      customFacilities.length > 0
        ? customFacilities
            .map(
              (facility) =>
                `<li>${facility.name} - Rp ${facility.price.toLocaleString(
                  "id-ID"
                )}</li>`
            )
            .join("")
        : "Tidak ada fasilitas custom";

    // Tambahkan data ke tabel
    const row = `
      <tr>
        <td>${nomor}</td>
        <td>${boardingHouseName}</td>
        <td>${room_type}</td>
        <td>${size}</td>
        <td>${numberAvailable}</td>
        <td>${ownerName}</td>
        <td><ul>${facilityList}</ul></td>
        <td><ul>${customFacilityList}</ul></td>
        <td>${priceDisplay}</td>
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
