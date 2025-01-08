// Toggle Dropdown Menu
function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown-menu');
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
}

// Show and Close Popups
function showPopup(popupId) {
    document.getElementById(popupId).style.display = 'block';
}

function closePopup() {
    document.querySelectorAll('.popup').forEach(popup => popup.style.display = 'none');
}

// Form Submission Handler
document.getElementById('formTambahFasilitas')?.addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Fasilitas berhasil ditambahkan!');
    closePopup();
});

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
                    <button class="btn btn-danger" onclick="confirmDelete('${fasilitas.id}')">
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
