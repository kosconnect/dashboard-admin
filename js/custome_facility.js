// Fetch JWT Token from Cookies
function getJwtToken() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('authToken=')) {
            return cookie.substring('authToken='.length);
        }
    }
    console.error("Token tidak ditemukan.");
    return null;
}

// Objek untuk menyimpan daftar owner (owner_id -> name)
const ownerMap = new Map();

// Fungsi untuk Fetch Data Owner
async function fetchOwners() {
    const jwtToken = getJwtToken();
    if (!jwtToken) return console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");

    try {
        const response = await fetch('https://kosconnect-server.vercel.app/api/users/owner', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const owners = await response.json();
        owners.forEach(owner => {
            ownerMap.set(owner.user_id, owner.fullname); // Simpan owner_id -> fullname dalam Map
        });

    } catch (error) {
        console.error("Gagal mengambil data owner:", error);
    }
}

// Fungsi untuk Fetch Data Custom Facilities dan Populate Table
async function fetchCustomFacilities() {
    const jwtToken = getJwtToken();
    if (!jwtToken) return console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");

    try {
        const response = await fetch('https://kosconnect-server.vercel.app/api/customFacilities/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log("Data fasilitas khusus:", data);

        const tbody = document.querySelector('table tbody');
        if (!tbody) return console.error("Elemen tbody tidak ditemukan di DOM.");

        tbody.innerHTML = ''; // Kosongkan tabel sebelum menambah data baru

        data.forEach((fasilitas, index) => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-id', fasilitas.custom_facility_id);

            // Kolom No
            const tdNo = document.createElement('td');
            tdNo.textContent = index + 1;
            tr.appendChild(tdNo);

            // Kolom Nama Fasilitas
            const tdNama = document.createElement('td');
            tdNama.textContent = fasilitas.name || 'N/A';
            tr.appendChild(tdNama);

            // Kolom Harga
            const tdHarga = document.createElement('td');
            tdHarga.textContent = fasilitas.price ? `Rp ${fasilitas.price.toLocaleString('id-ID')}` : 'N/A';
            tr.appendChild(tdHarga);

            // Kolom Nama Owner (gunakan fullname)
            const tdOwner = document.createElement('td');
            tdOwner.textContent = ownerMap.get(fasilitas.owner_id) || 'Tidak Diketahui';
            tr.appendChild(tdOwner);

            // Kolom Aksi
            const tdAksi = document.createElement('td');
            tdAksi.innerHTML = `
                <button class="btn btn-primary"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn btn-primary"><i class="fas fa-trash"></i> Hapus</button>
            `;
            tr.appendChild(tdAksi);

            // Tambahkan baris ke tabel
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Gagal mengambil data fasilitas khusus:", error);
    }
}

// Panggil fungsi saat halaman dimuat
document.addEventListener("DOMContentLoaded", async () => {
    await fetchOwners(); // Ambil daftar owner dulu
    await fetchCustomFacilities(); // Setelah itu, fetch custom facilities
});


document.addEventListener("DOMContentLoaded", function () {
    window.openPopup = function () {
        document.getElementById("popupTambahFasilitasCustom").style.display = "block";
    }

    window.closePopup = function () {
        document.getElementById("popupTambahFasilitasCustom").style.display = "none";
    }
});
