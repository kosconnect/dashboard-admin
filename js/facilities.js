// Fungsi untuk menutup semua popup
function closePopup() {
    // Menutup semua popup yang ada
    document.querySelectorAll('.popup').forEach(popup => {
        popup.style.display = 'none';
    });
}

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

// GET
// Fetch Facilities and Populate Table
function fetchFacilities() {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

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
            console.log("Data fasilitas kamar:", data);

            const tbody = document.querySelector('table tbody');
            if (!tbody) {
                console.error("Elemen tbody tidak ditemukan di DOM.");
                return;
            }

            // Kosongkan tabel sebelum menambah data baru
            tbody.innerHTML = '';

            // Loop data dan tambahkan ke tabel
            data.forEach(fasilitas => {
                const tr = document.createElement('tr');
            
                // Simpan ID fasilitas di atribut data-id, bukan di kolom tabel
                tr.setAttribute('data-id', fasilitas.id);
            
                // Kolom Nama Fasilitas
                const tdNamaFasilitas = document.createElement('td');
                tdNamaFasilitas.textContent = fasilitas.name;
                tr.appendChild(tdNamaFasilitas);
            
                // Kolom Aksi
                const tdAksi = document.createElement('td');
                tdAksi.innerHTML = `
                    <button class="btn btn-primary" onclick="showPopupEdit(this.parentElement.parentElement.dataset.id, '${fasilitas.name}')"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn btn-primary" onclick="showPopupDelete(this.parentElement.parentElement.dataset.id)"><i class="fas fa-trash"></i> Hapus</button>
                `;
                tr.appendChild(tdAksi);
            
                // Tambahkan baris ke tabel
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error("Gagal mengambil data fasilitas kamar:", error);
        });
}

// Panggil fetch Facilities saat halaman dimuat
window.addEventListener('load', fetchFacilities);


function showPopup() {
    const popup = document.getElementById('popupTambahFasilitas');
    if (popup) {
        popup.style.display = 'block';
    } else {
        console.error("Popup dengan ID 'popupTambahFasilitas' tidak ditemukan.");
    }
}


// POST
// Fungsi untuk menambahkan fasilitas baru
function addFacility() {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    const facilityName = document.getElementById('namaFasilitas').value;
    if (!facilityName) {
        alert('Nama fasilitas tidak boleh kosong!');
        return;
    }

    const newFacility = { name: facilityName };

    fetch('https://kosconnect-server.vercel.app/api/facility/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFacility)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Fasilitas berhasil ditambahkan:", data);
        alert("Fasilitas berhasil ditambahkan!");
        closePopup(); // Tutup popup setelah berhasil
        fetchFacilities(); // Refresh tabel
    })
    .catch(error => {
        console.error("Gagal menambahkan fasilitas:", error);
        alert("Gagal menambahkan fasilitas. Silakan coba lagi.");
    });
}

document.getElementById('formTambahFasilitas').addEventListener('submit', function (e) {
    e.preventDefault();
    addFacility();
});

function showPopupEdit(facilityId, facilityName) {
    document.getElementById('popupEditFasilitas').style.display = 'block';
    document.getElementById('editFacilityId').value = facilityId;
    document.getElementById('editNamaFasilitas').value = facilityName;
}

// PUT
function updateFacility(facilityId, updatedName) {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    fetch(`https://kosconnect-server.vercel.app/api/facility/${facilityId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: updatedName })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Fasilitas berhasil diperbarui:", data);
        alert('Fasilitas berhasil diperbarui!');
        closePopup();
        fetchFacilities();
    })
    .catch(error => {
        console.error("Gagal memperbarui fasilitas:", error);
        alert('Gagal memperbarui fasilitas.');
    });
}

document.getElementById('formEditFasilitas').addEventListener('submit', function (e) {
    e.preventDefault();
    const facilityId = document.getElementById('editFacilityId').value;
    const updatedName = document.getElementById('editNamaFasilitas').value;
    updateFacility(facilityId, updatedName);
});

let selectedFacilityId = null;

function showPopupDelete(facilityId) {
    selectedFacilityId = facilityId;
    document.getElementById('popupHapusFasilitas').style.display = 'block';
    console.log("Facility ID untuk dihapus:", selectedFacilityId);
}

// DELETE
function executeDelete() {
    if (!selectedFacilityId) {
        console.error("ID fasilitas tidak valid.");
        return;
    }

    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Token tidak ditemukan, tidak dapat melanjutkan permintaan.");
        return;
    }

    fetch(`https://kosconnect-server.vercel.app/api/facility/${selectedFacilityId}`, {
        method: 'DELETE',
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
        console.log("Fasilitas berhasil dihapus:", data);
        alert("Fasilitas berhasil dihapus!");
        closePopup();
        fetchFacilities();
    })
    .catch(error => {
        console.error("Gagal menghapus fasilitas:", error);
        alert("Gagal menghapus fasilitas.");
    });
}

fetchFacilities();