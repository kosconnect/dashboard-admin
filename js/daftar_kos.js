document.addEventListener("DOMContentLoaded", async function () {
  const tableBody = document.getElementById("kos-table-body");

  try {
    // Ambil daftar kos dari API
    const response = await fetch(
      "https://kosconnect-server.vercel.app/api/boardingHouses/"
    );
    if (!response.ok) throw new Error("Gagal mengambil data kos.");

    const responseData = await response.json();
    console.log("responseData:", responseData); // Debugging

    const kosList = Array.isArray(responseData.data) ? responseData.data : [];

    if (kosList.length === 0) {
      console.warn("Data kos tidak ditemukan.");
    }

    let tableContent = "";
    let nomor = 1;

    for (const kos of kosList) {
      const { boarding_house_id, name, address } = kos;

      let category_name = "Kategori Tidak Diketahui";
      let owner_fullname = "Owner Tidak Diketahui";

      try {
        // Fetch detail boarding house
        const detailResponse = await fetch(
          `https://kosconnect-server.vercel.app/api/boardingHouses/${boarding_house_id}/detail`
        );

        if (detailResponse.ok) {
          const detailData = await detailResponse.json();
          category_name = detailData?.category_name ?? category_name;
          owner_fullname = detailData?.owner_fullname ?? owner_fullname;

          console.log(
            `Kos ID: ${boarding_house_id} | Kategori: ${category_name} | Owner: ${owner_fullname}`
          );
        } else {
          console.warn(
            `Gagal mengambil detail untuk Kos ID: ${boarding_house_id}, Status: ${detailResponse.status}`
          );
        }
      } catch (err) {
        console.error(
          `Error saat mengambil detail kos ID ${boarding_house_id}:`,
          err
        );
      }

      // Tambahkan baris ke dalam tabel
      tableContent += `
        <tr>
          <td>${nomor++}</td>
          <td>${name}</td>
          <td>${category_name}</td>
          <td>${address}</td>
          <td>${owner_fullname}</td>
          <td>
            <button class="btn btn-detail" onclick="lihatDetail('${boarding_house_id}')">Detail</button>
          </td>
        </tr>
      `;
    }

    tableBody.innerHTML = tableContent;
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    tableBody.innerHTML =
      "<tr><td colspan='6'>Gagal memuat data kos.</td></tr>";
  }
});

// Fungsi untuk mengarahkan ke halaman detail
function lihatDetail(boardingHouseId) {
  window.location.href = `detail_kos.html?boarding_house_id=${boardingHouseId}`;
}