// Fungsi untuk mengambil nilai cookie berdasarkan nama
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// Fungsi untuk mengambil data total kos
async function getTotalKos() {
  try {
    const token = getCookie("authToken");
    const response = await fetch(
      "https://kosconnect-server.vercel.app/api/boardingHouses/",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    if (Array.isArray(data.data)) {
      document.getElementById("total-kos").innerText = data.data.length;
    } else {
      console.error("Data kos tidak dalam format array", data);
    }
  } catch (error) {
    console.error("Error fetching total kos:", error);
  }
}

// Fungsi untuk mendapatkan total transaksi dan pendapatan
async function getTransaksiDanPendapatan() {
  try {
    const token = getCookie("authToken");
    const response = await fetch(
      "https://kosconnect-server.vercel.app/api/transaction/",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();

    if (Array.isArray(data.data)) {
      // Update jumlah transaksi
      document.getElementById("total-transaksi").innerText = `${data.data.length} Transaksi`;

      // Filter transaksi yang memiliki payment_status = "settlement"
      const settlementTransactions = data.data.filter((t) => t.payment_status === "settlement");
      const totalPendapatan = settlementTransactions.reduce((sum, t) => sum + t.total, 0);

      // Update total pendapatan
      document.getElementById("total-pendapatan").innerText = `Rp ${totalPendapatan.toLocaleString("id-ID")}`;
    } else {
      console.error("Data transaksi tidak dalam format array", data);
    }
  } catch (error) {
    console.error("Error fetching transaksi dan pendapatan:", error);
  }
}

// Fungsi untuk mendapatkan jumlah pemilik kos dan user
async function getUserCounts() {
  try {
    const token = getCookie("authToken");
    const response = await fetch(
      "https://kosconnect-server.vercel.app/api/users/",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();

    if (Array.isArray(data.users)) {
      const owners = data.users.filter((user) => user.role === "owner").length;
      const users = data.users.filter((user) => user.role === "user").length;

      // Perbaiki pemilihan elemen dengan ID yang benar
      document.getElementById("total-pemilik").innerText = owners;
      document.getElementById("total-user").innerText = users;
    } else {
      console.error("Data pengguna tidak dalam format array", data);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

// Panggil semua fungsi
document.addEventListener("DOMContentLoaded", function () {
getTotalKos();
getTransaksiDanPendapatan();
getUserCounts();
});