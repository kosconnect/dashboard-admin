// Fungsi untuk mendapatkan JWT token
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

// Tunggu hingga seluruh DOM dimuat
document.addEventListener('DOMContentLoaded', function () {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    // Panggil fungsi fetchFacilities setelah token ditemukan
    fetchFacilities(jwtToken);
});

// GET
// Fungsi untuk mengambil data fasilitas
function fetchFacilities(jwtToken) {
    fetch('https://kosconnect-server.vercel.app/api/facility/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Data fasilitas:", data);

        const tbody = document.querySelector('.facility-management table tbody');
        if (!tbody) {
            console.error("Elemen tbody tidak ditemukan di DOM.");
            return;
        }

        tbody.innerHTML = ''; // Kosongkan tabel

        data.forEach((facility, index) => {
            const tr = document.createElement('tr');

            // Kolom No
            const tdNo = document.createElement('td');
            tdNo.textContent = index + 1;
            tr.appendChild(tdNo);

            // Kolom Nama Fasilitas
            const tdNamaFasilitas = document.createElement('td');
            tdNamaFasilitas.textContent = facility.name || 'Tidak ada nama';
            tr.appendChild(tdNamaFasilitas);

            // Kolom Aksi
            const tdAksi = document.createElement('td');
            tdAksi.innerHTML = `
                <button class="btn btn-primary" onclick="showPopupEdit('${facility.facility_id}', '${facility.name}')"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn btn-primary" onclick="showPopupDelete('${facility.facility_id}')"><i class="fas fa-trash"></i> Hapus</button>
            `;
            tr.appendChild(tdAksi);

            // Tambahkan baris ke tabel
            tbody.appendChild(tr);
        });
    })
    .catch(error => {
        console.error("Gagal mengambil data fasilitas:", error);
    });
}


// POST
// Fungsi untuk menampilkan popup Tambah Fasilitas
function showPopup() {
    const popup = document.getElementById('popupTambahFasilitas');
    if (popup) {
        popup.style.display = 'block'; // Tampilkan popup
    } else {
        console.error("Popup Tambah Fasilitas tidak ditemukan.");
    }
}

// Fungsi untuk menangani submit formulir tambah fasilitas
document.getElementById('formTambahFasilitas').addEventListener('submit', function (event) {
    event.preventDefault(); // Mencegah reload halaman saat form disubmit

    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    const namaFasilitas = document.getElementById('namaFasilitas').value.trim();
    if (!namaFasilitas) {
        alert("Nama fasilitas tidak boleh kosong!");
        return;
    }

    const requestBody = {
        name: namaFasilitas,
        type: "boarding_house" // Sesuaikan dengan tipe fasilitas
    };

    // Kirim permintaan POST ke API
    fetch('https://kosconnect-server.vercel.app/api/facility/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || `HTTP error! status: ${response.status}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log("Fasilitas berhasil ditambahkan:", data);
            alert("Fasilitas berhasil ditambahkan!");
            
            // Perbarui tabel fasilitas
            fetchFacilities(jwtToken);
            
            // Tutup popup
            closePopup();
        })
        .catch(error => {
            console.error("Gagal menambahkan fasilitas:", error);
            alert(`Gagal menambahkan fasilitas: ${error.message}`);
        });
});

// Fungsi untuk menutup semua popup
function closePopup() {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => {
        popup.style.display = 'none';
    });
}