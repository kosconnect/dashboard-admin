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

// Fungsi untuk mendapatkan JWT token dari cookie
function getJwtToken() {
    const cookieString = document.cookie;  // Mengambil semua cookie
    console.log("Cookie saat ini:", cookieString);  // Debugging untuk memastikan cookie terbaca

    const cookies = cookieString ? cookieString.split('; ') : [];
    const tokenCookie = cookies.find(cookie => cookie.startsWith('auth='));  // Mencari cookie dengan nama 'auth'

    if (!tokenCookie) {
        console.error("Token tidak ditemukan");
        return null;
    }

    const token = tokenCookie.split('=')[1];  // Mendapatkan nilai token setelah '='
    if (!token) {
        console.error("Format token tidak valid");
        return null;
    }

    return token;
}

// Fungsi untuk melakukan fetch data room facilities
function fetchRoomFacilities() {
    const jwtToken = getJwtToken();  // Mengambil token JWT

    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    fetch('https://kosconnect-server.vercel.app/api/roomfacilities', {  // Ganti dengan URL API Anda
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Data fasilitas kamar:", data);  // Ganti dengan logika untuk menampilkan data di halaman
    })
    .catch(error => {
        console.error("Terjadi kesalahan saat mengambil data fasilitas kamar:", error);
    });
}

// Panggil fungsi untuk mengambil data saat halaman dimuat
window.addEventListener('load', fetchRoomFacilities);
