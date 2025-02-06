// Fungsi untuk mendapatkan JWT token
function getJwtToken() {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith("authToken=")) {
      return cookie.substring("authToken=".length);
    }
  }
  console.error("Token tidak ditemukan.");
  return null;
}

// Tunggu hingga seluruh DOM dimuat
document.addEventListener("DOMContentLoaded", function () {
  const jwtToken = getJwtToken();
  if (!jwtToken) {
    console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
    return;
  }
  fetchKosList(jwtToken);
});

// Fungsi untuk mengambil data kos
async function fetchKosList(jwtToken) {
  try {
    const response = await fetch(
      "https://kosconnect-server.vercel.app/api/boardingHouses/",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Data dari API:", data);

    const tbody = document.getElementById("kos-table-body");
    if (!tbody) {
      console.error("Elemen tbody tidak ditemukan di DOM.");
      return;
    }

    const boardingHouses = data.data;
    if (!Array.isArray(boardingHouses) || boardingHouses.length === 0) {
      console.error("Data kos tidak valid atau tidak tersedia.");
      return;
    }

    // Proses setiap boarding house dalam data
    boardingHouses.forEach(async (boardingHouse) => {
      const { boarding_house_id, name, address, rules, description } = boardingHouse;

      try {
        // Ambil detail boarding house
        const detailResponse = await fetch(
          `https://kosconnect-server.vercel.app/api/boardingHouses/${boarding_house_id}/detail`
        );
        if (!detailResponse.ok) throw new Error("Gagal mengambil detail kos.");

        const detail = await detailResponse.json();

        const categoryName =
          detail?.category_name || "Kategori Tidak Diketahui";
        const ownerFullname = detail?.owner_fullname || "Owner Tidak Diketahui";
        const facilityList = detail?.facilities || [];

        // Ambil detail kamar kos untuk aturan dan deskripsi
        const boardingHouseResponse = await fetch(
          `https://kosconnect-server.vercel.app/api/boardingHouses/`
        );
        if (!boardingHouseResponse.ok)
          throw new Error("Gagal mengambil data kamar kos.");

        const boardingHouseData = await boardingHouseResponse.json();

        // Format fasilitas
        const facilityDisplay =
          facilityList.length > 0
            ? facilityList.join(", ")
            : "Tidak ada fasilitas tersedia.";

        // Buat elemen tr untuk menambahkan data ke dalam tabel
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${ownerFullname}</td>
          <td>${categoryName}</td>
          <td>${name}</td>
          <td>${address}</td>
          <td>${rules}</td>
          <td>${description}</td>
          <td>${facilityDisplay}</td>
        `;

        tbody.appendChild(tr);
      } catch (error) {
        console.error(
          "Gagal mengambil detail untuk boarding house:",
          boardingHouse.name,
          error
        );
      }
    });
  } catch (error) {
    console.error("Gagal mengambil data kos:", error);
  }
}

// Fungsi untuk mengarahkan ke halaman detail
function lihatDetail(boardingHouseId) {
  window.location.href = `detail_kos.html?boarding_house_id=${boardingHouseId}`;
}