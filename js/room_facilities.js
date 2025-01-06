function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown-menu');
    // Toggle the display between none and block
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
}

//Function show POP UP
function showPopup() {
    document.getElementById('popupTambahFasilitas').style.display = 'block';
}

function closePopup() {
    document.getElementById('popupTambahFasilitas').style.display = 'none';
}

// POPUP EDIT
function showPopupEdit(facilityId, facilityName) {
    document.getElementById('popupEditFasilitas').style.display = 'block';
    
    // Isi input tersembunyi untuk ID
    document.getElementById('editFacilityId').value = facilityId;

    // Isi input nama untuk diedit
    document.getElementById('editNamaFasilitas').value = facilityName;
}

// function showPopupDelete(facilityId) {
//     document.getElementById('popupHapusFasilitas').style.display = 'block';
//     // Pass the facility ID for deletion
//     selectedFacilityId = facilityId;
// }


// Fungsi untuk menampilkan popup delete dan menyimpan ID fasilitas
function showPopupDelete(facilityId) {
    selectedFacilityId = facilityId; // Simpan ID fasilitas
    document.getElementById('popupHapusFasilitas').style.display = 'block'; // Tampilkan popup
}

function closePopup() {
    document.querySelectorAll('.popup').forEach(popup => popup.style.display = 'none');
}

function confirmDelete() {
    alert('Fasilitas kamar berhasil dihapus!'); // Ganti dengan fungsi penghapusan yang sesuai.
    closePopup();
}

// GET 
// Fungsi untuk mendapatkan token JWT dari cookie
function getJwtToken() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('authToken=')) {
            return cookie.substring('authToken='.length);
        }
    }
    console.error("Token tidak ditemukan");
    return null;
}

// Fungsi untuk mengambil data fasilitas kamar
function fetchRoomFacilities() {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    fetch('https://kosconnect-server.vercel.app/api/roomfacilities/', {
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
            console.log("Data fasilitas kamar:", data); // Tampilkan data di console untuk debugging
            // TODO: Tampilkan data fasilitas di halaman
        })
        .catch(error => {
            console.error("Gagal mengambil data fasilitas kamar:", error);
        });
}

// Panggil fetchRoomFacilities saat halaman dimuat
window.addEventListener('load', fetchRoomFacilities);

function fetchRoomFacilities() {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    fetch('https://kosconnect-server.vercel.app/api/roomfacilities/', {
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
            console.log("Data fasilitas kamar:", data); // Tampilkan data di console untuk debugging

            // Ambil elemen tabel
            const tbody = document.querySelector('table tbody');

            // Kosongkan tabel sebelum menambah data baru
            tbody.innerHTML = '';

            // Loop melalui data dan masukkan ke dalam tabel
            data.forEach(fasilitas => {
                const tr = document.createElement('tr');

                const tdId = document.createElement('td');
                tdId.textContent = fasilitas.id;  // Ganti sesuai data yang diterima
                tr.appendChild(tdId);

                const tdNamaFasilitas = document.createElement('td');
                tdNamaFasilitas.textContent = fasilitas.name;  // Ganti sesuai data yang diterima
                tr.appendChild(tdNamaFasilitas);

                const tdAksi = document.createElement('td');
                tdAksi.innerHTML = `
                <button class="btn btn-primary" onclick="showPopupEdit('${fasilitas.id}', '${fasilitas.name}')"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn btn-primary" onclick="showPopupDelete()"><i class="fas fa-trash"></i> Hapus</button>
            `;
                tr.appendChild(tdAksi);

                // Tambahkan row ke tabel
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error("Gagal mengambil data fasilitas kamar:", error);
        });
}

// POST
function addRoomFacility() {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    const facilityName = document.getElementById('namaFasilitas').value;    // Perbarui ID di sini

    fetch('https://kosconnect-server.vercel.app/api/roomfacilities/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: facilityName })  // Pastikan body JSON sesuai
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Fasilitas kamar berhasil ditambahkan:", data);
            alert('Fasilitas berhasil ditambahkan!');
            closePopup();  // Sembunyikan popup setelah penambahan
            fetchRoomFacilities();  // Perbarui tabel dengan data terbaru
        })
        .catch(error => {
            console.error("Gagal menambahkan fasilitas kamar:", error);
            alert('Gagal menambahkan fasilitas kamar.');
        });
}

document.getElementById('formTambahFasilitas').addEventListener('submit', function (e) {
    e.preventDefault();
    addRoomFacility();  // Pastikan fungsi ini mengambil input yang benar
});

// PUT
function updateRoomFacility(facilityId, updatedName) {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    fetch(`https://kosconnect-server.vercel.app/api/roomfacilities/${facilityId}`, {
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

fetchRoomFacilities();  // Memastikan tabel diperbarui

document.getElementById('formEditFasilitas').addEventListener('submit', function (e) {
    e.preventDefault(); // Mencegah reload halaman
    
    const facilityId = document.getElementById('editFacilityId').value; // Ambil ID fasilitas
    const updatedName = document.getElementById('editNamaFasilitas').value; // Ambil nama fasilitas baru
    
    // Panggil fungsi untuk mengupdate data
    updateRoomFacility(facilityId, updatedName);
});

console.log("Mengupdate fasilitas:", facilityId, updatedName);
console.log("Data fasilitas kamar setelah update:", data);

// DELETE
// Fungsi untuk melakukan penghapusan data fasilitas kamar
function confirmDelete() {
    const jwtToken = getJwtToken(); // Ambil token JWT dari cookie
    if (!jwtToken) {
        console.error("Token tidak ditemukan, tidak dapat melanjutkan permintaan.");
        return;
    }

    // Kirim permintaan DELETE ke API
    fetch(`https://kosconnect-server.vercel.app/api/roomfacilities/${selectedFacilityId}`, {
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
        console.log("Fasilitas kamar berhasil dihapus:", data);
        alert('Fasilitas kamar berhasil dihapus!');
        closePopup(); // Tutup popup
        fetchRoomFacilities(); // Perbarui tabel
    })
    .catch(error => {
        console.error("Gagal menghapus fasilitas kamar:", error);
        alert('Gagal menghapus fasilitas kamar.');
    });
}

// Fungsi untuk menutup semua popup
function closePopup() {
    document.querySelectorAll('.popup').forEach(popup => {
        popup.style.display = 'none';
    });
}

const tdAksi = document.createElement('td');
tdAksi.innerHTML = `
    <button class="btn btn-primary" onclick="showPopupEdit('${fasilitas.id}', '${fasilitas.name}')">
        <i class="fas fa-edit"></i> Edit
    </button>
    <button class="btn btn-primary" onclick="showPopupDelete('${fasilitas.id}')">
        <i class="fas fa-trash"></i> Hapus
    </button>
`;
tr.appendChild(tdAksi);