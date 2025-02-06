document.addEventListener("DOMContentLoaded", async function () {
  const tableBody = document.getElementById("kos-table-body");

  try {
    // Ambil daftar kos dari API
    const response = await fetch(
      "https://kosconnect-server.vercel.app/api/boardingHouses/"
    );
    if (!response.ok) throw new Error("Gagal mengambil data kos.");

    const responseData = await response.json(); // Ambil seluruh data
    console.log("responseData:", responseData); // Log data untuk debugging

    // Pastikan responseData.data adalah array yang valid
    const kosList = Array.isArray(responseData.data) ? responseData.data : [];

    if (kosList.length === 0) {
      console.warn("Data kos tidak ditemukan.");
    }

    let tableContent = "";
    let nomor = 1;

    for (const kos of kosList) {
      const { boarding_house_id, name, address } = kos;

      // Ambil kategori dan nama pemilik (owner) dari API detail
      const detailResponse = await fetch(
        `https://kosconnect-server.vercel.app/api/boardingHouses/${boarding_house_id}/detail`
      );

      const category_name = "-";
      const owner_fullname = "-";

      if (detailResponse.ok) {
        const detailData = await detailResponse.json();
        category_name = detailData?.category_name || "-";
        owner_fullname = detailData?.owner_fullname || "-";
      } else {
        console.warn(
          `Gagal mengambil detail untuk Kos ID: ${boarding_house_id}`
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