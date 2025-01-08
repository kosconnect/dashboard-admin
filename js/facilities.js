// Toggle Dropdown Menu
function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown-menu');
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
}

function showPopup() {
    const popup = document.getElementById('popupTambahFasilitas');
    if (popup) {
        popup.style.display = 'block';
    } else {
        console.error("Popup dengan ID 'popupTambahFasilitas' tidak ditemukan.");
    }
}

function closePopup() {
    document.getElementById('popupTambahFasilitas').style.display = 'none';
}

// Fungsi untuk menampilkan popup Edit dan mengisi data fasilitas
function showPopupEdit(facilityId, facilityName) {
    document.getElementById('popupEditFasilitas').style.display = 'block';
    
    // Isi input tersembunyi untuk ID
    document.getElementById('editFacilityId').value = facilityId;

    // Isi input nama untuk diedit
    document.getElementById('editNamaFasilitas').value = facilityName;
}


// Form Submission Handler
// document.getElementById('formTambahFasilitas')?.addEventListener('submit', function (e) {
//     e.preventDefault();
//     alert('Fasilitas berhasil ditambahkan!');
//     closePopup();
// });

// Confirm Delete
function confirmDelete(id) {
    alert(`Fasilitas dengan ID ${id} berhasil dihapus!`);
    closePopup();
    // TODO: Tambahkan fungsi penghapusan di sini
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
// Fetch Room Facilities and Populate Table
function fetchRoomFacilities() {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    fetch('https://kosconnect-server.vercel.app/api/facilitytypes/', {
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

                // Kolom ID
                const tdId = document.createElement('td');
                tdId.textContent = fasilitas.id;
                tr.appendChild(tdId);

                // Kolom Nama Fasilitas
                const tdNamaFasilitas = document.createElement('td');
                tdNamaFasilitas.textContent = fasilitas.name;
                tr.appendChild(tdNamaFasilitas);

                // Kolom Aksi
                const tdAksi = document.createElement('td');
                tdAksi.innerHTML = `
                    <button class="btn btn-primary" onclick="showPopup('popupEditFasilitas')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-primary" onclick="confirmDelete('${fasilitas.id}')">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
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

// Panggil fetchRoomFacilities saat halaman dimuat
window.addEventListener('load', fetchRoomFacilities);


// POST
// Fungsi untuk menambahkan fasilitas baru
function addFacility() {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    // Ambil data dari form
    const facilityName = document.getElementById('namaFasilitas').value;
    if (!facilityName) {
        alert('Nama fasilitas tidak boleh kosong!');
        return;
    }

    const newFacility = {
        name: facilityName
    };

    fetch('https://kosconnect-server.vercel.app/api/facilitytypes/', {
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
            fetchRoomFacilities(); // Refresh tabel
        })
        .catch(error => {
            console.error("Gagal menambahkan fasilitas:", error);
            alert("Gagal menambahkan fasilitas. Silakan coba lagi.");
        });
}

// Event Listener untuk form Tambah Fasilitas
document.getElementById('formTambahFasilitas').addEventListener('submit', function (e) {
    e.preventDefault(); // Mencegah halaman refresh
    addFacility();
});


// PUT
// Fungsi untuk memperbarui fasilitas
function updateRoomFacility(facilityId, updatedName) {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    fetch(`https://kosconnect-server.vercel.app/api/facilitytypes/${facilityId}`, {
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
        console.log("Fasilitas kamar berhasil diperbarui:", data);
        alert('Fasilitas berhasil diperbarui!');
        closePopup();  // Tutup popup setelah sukses
        fetchRoomFacilities();  // Panggil ulang untuk memperbarui tabel
    })  
    .catch(error => {
        console.error("Gagal memperbarui fasilitas kamar:", error);
        alert('Gagal memperbarui fasilitas kamar.');
    });
}

// Event listener untuk form edit fasilitas
document.getElementById('formEditFasilitas').addEventListener('submit', function (e) {
    e.preventDefault(); // Mencegah reload halaman
    
    const facilityId = document.getElementById('editFacilityId').value; // Ambil ID fasilitas
    const updatedName = document.getElementById('editNamaFasilitas').value; // Ambil nama fasilitas baru
    
    // Panggil fungsi untuk mengupdate data
    updateRoomFacility(facilityId, updatedName);
});