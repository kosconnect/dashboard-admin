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
    const cookieString = document.cookie;
    const cookies = cookieString ? cookieString.split('; ') : [];
    const tokenCookie = cookies.find(cookie => cookie.startsWith('authToken='));
    
    if (!tokenCookie) {
        return null;  // Langsung kembalikan null tanpa log tambahan
    }

    const token = tokenCookie.split('=')[1];
    return token || null;
}

// Fungsi untuk melakukan fetch data room facilities
function fetchRoomFacilities() {
    const jwtToken = getJwtToken();  // Mengambil token JWT

    if (!jwtToken) {
        alert("Tidak ada token JWT, silakan login kembali.");
        return;
    }

    fetch('https://example.com/api/room_facilities', {  // Sesuaikan dengan endpoint API
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
        // Logika untuk memproses data, seperti menampilkan daftar fasilitas
        console.log("Data fasilitas kamar:", data);  // Sesuaikan dengan elemen di halaman
    })
    .catch(error => {
        console.error("Gagal mengambil data fasilitas kamar:", error);
    });
}

// Panggil fetchRoomFacilities saat halaman dimuat
window.addEventListener('load', fetchRoomFacilities);
