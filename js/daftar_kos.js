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
    console.log("Data dari API:", data); // Log respons API untuk memeriksa

    const tbody = document.getElementById("kos-table-body");
    if (!tbody) {
      console.error("Elemen tbody tidak ditemukan di DOM.");
      return;
    }

    // Pastikan data yang diterima valid
    if (!Array.isArray(data) || data.length === 0) {
      console.error("Data kos tidak valid atau tidak tersedia.");
      return;
    }

    // Proses setiap boarding house dalam data
    data.forEach(async (boardingHouse, index) => {
      const { boarding_house_id, images, name, address, description, rules } =
        boardingHouse;

      try {
        const detailResponse = await fetch(
          `https://kosconnect-server.vercel.app/api/boardingHouses/${boarding_house_id}/detail`
        );
        const detail = await detailResponse.json();

        // Pastikan detail[0] tersedia sebelum mengakses properti
        const categoryName =
          detail.length > 0
            ? detail[0]?.category_name
            : "Kategori Tidak Diketahui";
        const ownerFullname =
          detail.length > 0
            ? detail[0]?.owner_fullname
            : "Owner Tidak Diketahui";

        // Membuat elemen tr untuk menambahkan data ke dalam tabel
        const tr = document.createElement("tr");

        const tdNo = document.createElement("td");
        tdNo.textContent = index + 1;
        tr.appendChild(tdNo);

        const tdNamaKos = document.createElement("td");
        tdNamaKos.textContent = name;
        tr.appendChild(tdNamaKos);

        const tdCategory = document.createElement("td");
        tdCategory.textContent = categoryName;
        tr.appendChild(tdCategory);

        const tdAlamat = document.createElement("td");
        tdAlamat.textContent = address;
        tr.appendChild(tdAlamat);

        const tdPemilik = document.createElement("td");
        tdPemilik.textContent = ownerFullname;
        tr.appendChild(tdPemilik);

        const tdAksi = document.createElement("td");
        tdAksi.innerHTML = `
          <button class="btn btn-primary" onclick="lihatDetail('${boarding_house_id}')">Detail</button>
        `;
        tr.appendChild(tdAksi);

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