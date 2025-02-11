// Fungsi utama yang dijalankan ketika halaman dimuat
window.onload = function () {
  console.log("Halaman dimuat, mulai fetch data kos...");
  loadBoardingHouses();
};

// Fungsi untuk mengambil daftar kos dan render ke tabel
async function loadBoardingHouses() {
  try {
    console.log("Fetching data dari boardingHouses...");
    const response = await fetch(
      "https://kosconnect-server.vercel.app/api/boardingHouses/"
    );

    if (!response.ok) {
      throw new Error(`Gagal mengambil data kos. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Data berhasil diambil:", data);

    if (!data || !Array.isArray(data.data)) {
      throw new Error("Format data tidak sesuai. Tidak ada array data.");
    }

    const tableBody = document.getElementById("kos-table-body");
    tableBody.innerHTML = ""; // Kosongkan isi tabel sebelum menambahkan data

    let nomor = 1;
    for (const boardingHouse of data.data) {
      const { boarding_house_id, name, address, rules, description } =
        boardingHouse;
      await fetchBoardingHouseDetail(
        boarding_house_id,
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
  nomor,
  tableBody,
  name,
  address,
  rules,
  description
) {
  try {
    console.log(`Fetching detail untuk boardingHouseId: ${boardingHouseId}...`);
    const detailResponse = await fetch(
      `https://kosconnect-server.vercel.app/api/boardingHouses/${boardingHouseId}/detail`
    );

    if (!detailResponse.ok) {
      console.warn(
        `Gagal mengambil detail kos ${boardingHouseId}. Status: ${detailResponse.status}`
      );
      return;
    }

    const detail = await detailResponse.json();
    console.log(`Detail kos ${boardingHouseId} berhasil diambil:`, detail);

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
        <td>${rules || "-"}</td>
        <td>${description || "-"}</td>
        <td><ul>${facilityDisplay}</ul></td>
      </tr>
    `;
    tableBody.insertAdjacentHTML("beforeend", row);
  } catch (error) {
    console.error(`Error saat mengambil detail kos ${boardingHouseId}:`, error);
  }
}