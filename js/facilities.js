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
    fetchFacilities(jwtToken);
});

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
        const tbody = document.querySelector('.facility-management tbody');
        if (!tbody) {
            console.error("Elemen tbody tidak ditemukan di DOM.");
            return;
        }
        tbody.innerHTML = ''; 
        data.forEach((facility, index) => {
            const tr = document.createElement('tr');
            const facilityId = facility.facility_id;
            const facilityName = facility.name || 'Tidak ada nama';

            const tdNo = document.createElement('td');
            tdNo.textContent = index + 1;
            tr.appendChild(tdNo);

            const tdNamaFasilitas = document.createElement('td');
            tdNamaFasilitas.textContent = facilityName;
            tr.appendChild(tdNamaFasilitas);

            const tdAksi = document.createElement('td');
            tdAksi.innerHTML = `
                <button class="btn btn-primary" onclick="showPopupEdit('${facilityId}', '${facilityName}')"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn btn-primary" onclick="showPopupDelete('${facilityId}')"><i class="fas fa-trash"></i> Hapus</button>
            `;
            tr.appendChild(tdAksi);
            tbody.appendChild(tr);
        });
    })
    .catch(error => {
        console.error("Gagal mengambil data fasilitas:", error);
    });
}



function showPopup() {
    const popup = document.getElementById('popupTambahFasilitas');
    if (popup) {
        // Kosongkan nilai input formulir
        document.getElementById('namaFasilitas').value = '';
        document.getElementById('typeFasilitas').value = '';

        popup.style.display = 'block'; // Tampilkan popup
    } else {
        console.error("Popup dengan ID 'popupTambahFasilitas' tidak ditemukan.");
    }
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
    const typeFasilitas = document.getElementById('typeFasilitas').value.trim();

    if (!namaFasilitas || !typeFasilitas) {
        alert("Nama fasilitas dan tipe fasilitas tidak boleh kosong!");
        return;
    }

    const requestBody = {
        name: namaFasilitas,
        type: typeFasilitas
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

// Fungsi untuk menutup popup
function closePopup() {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => {
        popup.style.display = 'none';
    });
}


function showPopupEdit(facilityId, facilityName, facilityType) {
    const popup = document.getElementById('popupEditFasilitas');
    if (popup) {
        // Isi data ke dalam form edit
        document.getElementById('editFacilityId').value = facilityId;
        document.getElementById('editNamaFasilitas').value = facilityName;
        document.getElementById('editTypeFasilitas').value = facilityType;

        // Tampilkan popup
        popup.style.display = 'block';
    } else {
        console.error("Popup Edit Fasilitas tidak ditemukan.");
    }
}


// Fungsi untuk menangani submit formulir edit fasilitas
document.getElementById('formEditFasilitas').addEventListener('submit', function (event) {
    event.preventDefault(); // Mencegah reload halaman saat form disubmit

    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    const facilityId = document.getElementById('editFacilityId').value.trim();
    const namaFasilitas = document.getElementById('editNamaFasilitas').value.trim();
    const typeFasilitas = document.getElementById('editTypeFasilitas').value.trim();

    if (!facilityId || !namaFasilitas || !typeFasilitas) {
        alert("Semua field wajib diisi!");
        return;
    }

    const requestBody = {
        name: namaFasilitas,
        type: typeFasilitas
    };

    // Kirim permintaan PUT ke API
    fetch(`https://kosconnect-server.vercel.app/api/facility/${facilityId}`, {
        method: 'PUT',
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
            console.log("Fasilitas berhasil diperbarui:", data);
            alert("Fasilitas berhasil diperbarui!");

            // Perbarui tabel fasilitas
            fetchFacilities(jwtToken);

            // Tutup popup
            closePopup();
        })
        .catch(error => {
            console.error("Gagal memperbarui fasilitas:", error);
            alert(`Gagal memperbarui fasilitas: ${error.message}`);
        });
});
