document.addEventListener("DOMContentLoaded", async function () {
  const tableBody = document.getElementById("kos-table-body");

  try {
    // Ambil daftar kos dari API
    const response = await fetch(
      "https://kosconnect-server.vercel.app/api/boardingHouses/"
    );
    if (!response.ok) throw new Error("Gagal mengambil data kos.");

    const kosList = await response.json();

    let tableContent = "";
    let nomor = 1;

    for (const kos of kosList) {
      const { boarding_house_id, name, address } = kos;

      // Ambil detail kos untuk mendapatkan kategori dan owner
      const detailResponse = await fetch(
        `https://kosconnect-server.vercel.app/api/boardingHouses/${boarding_house_id}/detail`
      );
      if (!detailResponse.ok) {
        console.error(
          `Gagal mengambil detail untuk Kos ID: ${boarding_house_id}`
        );
        continue; // Lewati kos ini jika gagal mengambil detail
      }

      const detailData = await detailResponse.json();
      const { category_name, owner_fullname } = detailData;

      // Tambahkan baris ke dalam tabel
      tableContent += `
                <tr>
                    <td>${nomor++}</td>
                    <td>${name}</td>
                    <td>${category_name || "-"}</td>
                    <td>${address}</td>
                    <td>${owner_fullname || "-"}</td>
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