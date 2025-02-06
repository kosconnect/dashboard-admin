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
function fetchKosList(jwtToken) {
  fetch("https://kosconnect-server.vercel.app/api/boardingHouses/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const tbody = document.getElementById("kos-table-body");
      if (!tbody) {
        console.error("Elemen tbody tidak ditemukan di DOM.");
        return;
      }
      tbody.innerHTML = "";
      data.data.forEach((kos, index) => {
        const tr = document.createElement("tr");
        const { boarding_house_id, name, address } = kos;

        // Ambil detail kos seperti kategori dan pemilik
        let category_name = "Kategori Tidak Diketahui";
        let owner_fullname = "Owner Tidak Diketahui";
        fetchKosDetail(boarding_house_id, (category_name, owner_fullname) => {
          const tdNo = document.createElement("td");
          tdNo.textContent = index + 1;
          tr.appendChild(tdNo);

          const tdNamaKos = document.createElement("td");
          tdNamaKos.textContent = name;
          tr.appendChild(tdNamaKos);

          const tdCategory = document.createElement("td");
          tdCategory.textContent = category_name;
          tr.appendChild(tdCategory);

          const tdAlamat = document.createElement("td");
          tdAlamat.textContent = address;
          tr.appendChild(tdAlamat);

          const tdPemilik = document.createElement("td");
          tdPemilik.textContent = owner_fullname;
          tr.appendChild(tdPemilik);

          const tdAksi = document.createElement("td");
          tdAksi.innerHTML = `
            <button class="btn btn-primary" onclick="lihatDetail('${boarding_house_id}')">Detail</button>
          `;
          tr.appendChild(tdAksi);
          tbody.appendChild(tr);
        });
      });
    })
    .catch((error) => {
      console.error("Gagal mengambil data kos:", error);
    });
}

// Fungsi untuk mengambil detail kos berdasarkan boarding_house_id
function fetchKosDetail(boardingHouseId, callback) {
  fetch(
    `https://kosconnect-server.vercel.app/api/boardingHouses/${boardingHouseId}/detail`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Gagal mengambil detail untuk Kos ID: ${boardingHouseId}`
        );
      }
      return response.json();
    })
    .then((detailData) => {
      const category_name =
        detailData.category_name || "Kategori Tidak Diketahui";
      const owner_fullname =
        detailData.owner_fullname || "Owner Tidak Diketahui";
      callback(category_name, owner_fullname);
    })
    .catch((error) => {
      console.error("Error mengambil detail kos:", error);
      callback("Kategori Tidak Diketahui", "Owner Tidak Diketahui");
    });
}

// Fungsi untuk mengarahkan ke halaman detail
function lihatDetail(boardingHouseId) {
  window.location.href = `detail_kos.html?boarding_house_id=${boardingHouseId}`;
}