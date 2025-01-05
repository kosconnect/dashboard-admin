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
    const cookies = document.cookie.split('; ').map(cookie => cookie.split('='));
    const authTokenCookie = cookies.find(([key]) => key === 'authToken');
    return authTokenCookie ? authTokenCookie[1] : null;
}

// Fungsi untuk melakukan fetch data room facilities
function fetchRoomFacilities() {
    const jwtToken = getJwtToken();

    if (!jwtToken) {
        alert("Tidak ada token JWT, silakan login kembali.");
        return;
    }

    fetch('https://kosconnect-server.vercel.app/api/roomfacilities', {
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
        displayRoomFacilities(data);  // Menampilkan data ke UI
    })
    .catch(error => {
        console.error("Gagal mengambil data fasilitas kamar:", error);
    });
}

// Panggil fetchRoomFacilities saat halaman dimuat
window.addEventListener('load', fetchRoomFacilities);

// Contoh fungsi untuk menampilkan data ke UI
function displayRoomFacilities(data) {
    const roomFacilitiesContainer = document.getElementById('roomFacilities');
    roomFacilitiesContainer.innerHTML = data.map(facility => `
        <div class="facility-item">
            <h3>${facility.name}</h3>
            <p>${facility.description}</p>
        </div>
    `).join('');
}
