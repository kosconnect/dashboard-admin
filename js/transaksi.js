// Fungsi untuk membaca nilai cookie berdasarkan nama
function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }
  
  // Variabel global untuk menyimpan semua data orders
  let allOrderData = [];
  
  // Fungsi untuk merender tabel transaksi
  async function renderOrderTable(orders) {
    const tbody = document.querySelector("table tbody");
  
    // Bersihkan konten tabel sebelumnya
    tbody.innerHTML = "";
  
    if (orders.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6">Tidak ada transaksi yang ditemukan.</td>
        </tr>
      `;
      return;
    }
  
    // Tambahkan baris untuk setiap transaksi
    orders.data.forEach((order, index) => {
      const totalFormatted = `Rp ${order.total.toLocaleString("id-ID")}`;
      const row = document.createElement("tr");
  
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${order.transaction_code}</td>
        <td>${order.user_name || "Tidak Diketahui"}</td>
        <td>${order.room_name || "Tidak Diketahui"}</td>
        <td>${totalFormatted}</td>
        <td>
          <a href="detail.html?transaction_id=${order.transaction_id}" class="btn btn-primary" style="text-decoration: none;">
            <i class="fas fa-info-circle"></i> Detail
          </a>
        </td>
      `;
  
      tbody.appendChild(row);
    });
  }
  
  // Ambil data transaksi saat halaman dimuat
  window.onload = async () => {
    try {
      const authToken = getCookie("authToken");
      const response = await fetch(
        `https://kosconnect-server.vercel.app/api/transaction/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Gagal mengambil data transaksi");
      }
  
      allOrderData = await response.json();
      await renderOrderTable(allOrderData);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };
  