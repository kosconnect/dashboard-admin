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

// Mengambil token JWT dari cookies
function getJwtToken() {
    const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
    return token;
}

// Fungsi untuk mengambil data room facilities
function fetchRoomFacilities() {
    const token = getJwtToken();

    if (!token) {
        console.log("Token tidak ditemukan");
        return;
    }

    fetch('https://kosconnect-server.vercel.app/api/roomfacilities', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Menambahkan token JWT di header
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Gagal mengambil data');
        }
        return response.json();
    })
    .then(data => {
        // Menampilkan data di konsol (atau bisa disesuaikan untuk menampilkan di tabel)
        console.log(data);

        // Jika ingin menampilkan data di tabel HTML
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = ''; // Membersihkan tabel sebelum menambah data baru

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.roomfacility_id}</td>
                <td>${item.name}</td>
                <td>
                    <button class="btn btn-primary" onclick="showPopupEdit()">Edit</button>
                    <button class="btn btn-primary" onclick="showPopupDelete()">Hapus</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Panggil fungsi untuk fetch data saat halaman dimuat
window.onload = fetchRoomFacilities;
