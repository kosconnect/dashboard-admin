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

// GET Custom Facilities and Populate Table
function fetchCustomFacilities() {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    fetch('https://kosconnect-server.vercel.app/api/customFacilities/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            console.log(response);  // Tambahkan ini
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })        
        .then(data => {
            console.log("Data fasilitas khusus:", data);

            const tbody = document.querySelector('table tbody');
            if (!tbody) {
                console.error("Elemen tbody tidak ditemukan di DOM.");
                return;
            }

            // Kosongkan tabel sebelum menambah data baru
            tbody.innerHTML = '';

            // Loop data dan tambahkan ke tabel
            data.forEach((fasilitas, index) => {
                const tr = document.createElement('tr');

                // Simpan ID fasilitas di atribut data-id
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

                // Kolom Owner ID
                const tdOwnerId = document.createElement('td');
                tdOwnerId.textContent = fasilitas.owner_id;  // Pastikan 'owner_id' sesuai dengan struktur data API
                tr.appendChild(tdOwnerId);

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
        })
        .catch(error => {
            console.error("Gagal mengambil data fasilitas khusus:", error);
        });
}

// Panggil fungsi fetch ketika halaman dimuat
document.addEventListener('DOMContentLoaded', fetchCustomFacilities);
