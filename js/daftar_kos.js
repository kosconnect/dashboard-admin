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
  loadBoardingHouses(authToken);
};

// Fungsi untuk mengambil daftar kos dan render ke tabel
async function loadBoardingHouses(authToken) {
  try {
    const response = await fetch(
      "https://kosconnect-server.vercel.app/api/boardingHouses/",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    if (!response.ok) {
      throw new Error(`Gagal mengambil data kos. Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.data)) {
      throw new Error("Format data tidak sesuai. Tidak ada array data.");
    }

    const tableBody = document.getElementById("kos-table-body");
    tableBody.innerHTML = "";

    let nomor = 1;
    for (const boardingHouse of data.data) {
      const { boarding_house_id, name, address, rules, description } =
        boardingHouse;
      await fetchBoardingHouseDetail(
        boarding_house_id,
        authToken,
        nomor++,
        tableBody,
        name,
        address,
        rules,
        description
      );
    }
  } catch (error) {
    console.error("Gagal mengambil data kos:", error);
    const tableBody = document.getElementById("kos-table-body");
    tableBody.innerHTML =
      "<tr><td colspan='7'>Gagal memuat data kos.</td></tr>";
  }
}

// Fungsi untuk mengambil detail boarding house berdasarkan boarding_house_id
async function fetchBoardingHouseDetail(
  boardingHouseId,
  authToken,
  nomor,
  tableBody,
  name,
  address,
  rules,
  description
) {
  try {
    const detailResponse = await fetch(
      `https://kosconnect-server.vercel.app/api/boardingHouses/${boardingHouseId}/detail`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    if (!detailResponse.ok) {
      console.warn(
        `Gagal mengambil detail kos ${boardingHouseId}. Status: ${detailResponse.status}`
      );
      return;
    }

    const detail = await detailResponse.json();
    const categoryName = detail?.category_name || "Kategori Tidak Diketahui";
    const ownerFullname = detail?.owner_fullname || "Owner Tidak Diketahui";
    const facilityList = detail?.facilities || [];

    const facilityDisplay =
      facilityList.length > 0
        ? facilityList.map((facility) => `<li>${facility}</li>`).join("")
        : "Tidak ada fasilitas tersedia.";

    // Tambahkan data ke tabel
    const row = `
      <tr>
        <td>${nomor}</td>
        <td>${ownerFullname}</td>
        <td>${categoryName}</td>
        <td>${name}</td>
        <td>${address}</td>
        <td>${rules}</td>
        <td>${description}</td>
        <td><ul>${facilityDisplay}</ul></td>
        <td>
          <button class="btn btn-primary" onclick="lihatDetailKos('${boardingHouseId}')">Detail</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  } catch (error) {
    console.error(`Error saat mengambil detail kos ${boardingHouseId}:`, error);
  }
}

// Fungsi untuk melihat detail kos
function lihatDetailKos(boardingHouseId) {
  window.location.href = `detail_kos.html?boarding_house_id=${boardingHouseId}`;
}