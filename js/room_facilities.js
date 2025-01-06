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

document.getElementById('formTambahFasilitas').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Fasilitas berhasil ditambahkan!');
    closePopup();
});

function showPopupEdit() {
    document.getElementById('popupEditFasilitas').style.display = 'block';
}

function showPopupDelete() {
    document.getElementById('popupHapusFasilitas').style.display = 'block';
}

function closePopup() {
    document.querySelectorAll('.popup').forEach(popup => popup.style.display = 'none');
}

function confirmDelete() {
    alert('Fasilitas kamar berhasil dihapus!'); // Ganti dengan fungsi penghapusan yang sesuai.
    closePopup();
}

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
                <button class="btn btn-primary" onclick="showPopupEdit()"><i class="fas fa-edit"></i> Edit</button>
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

document.getElementById('formTambahFasilitas').addEventListener('submit', function(e) {
    e.preventDefault();
    addRoomFacility();  // Pastikan fungsi ini mengambil input yang benar
});
