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
    console.error("Token tidak ditemukan.");
    return null;
}

// Fungsi untuk mengambil data fasilitas dari API
function fetchFacilities() {
    const jwtToken = getJwtToken();
    console.log("JWT Token:", jwtToken); // Debugging token

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
            console.log("Fetch Response Status:", response.status); // Debugging respons
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Data fasilitas yang diterima:", data); // Debugging data

            // Ambil elemen tabel
            const tbody = document.querySelector('table tbody');
            if (!tbody) {
                console.error("Elemen tabel tbody tidak ditemukan di DOM.");
                return;
            }

            // Kosongkan tabel sebelum mengisi data baru
            tbody.innerHTML = '';

            // Loop melalui data dan masukkan ke dalam tabel
            data.forEach(facility => {
                console.log("Memasukkan fasilitas:", facility); // Debugging setiap item

                const tr = document.createElement('tr');

                // Kolom ID
                const tdId = document.createElement('td');
                tdId.textContent = facility.id || 'N/A'; // Gunakan default jika data tidak ada
                tr.appendChild(tdId);

                // Kolom Nama Fasilitas
                const tdName = document.createElement('td');
                tdName.textContent = facility.name || 'N/A';
                tr.appendChild(tdName);

                // Kolom Aksi
                const tdActions = document.createElement('td');
                tdActions.innerHTML = `
                    <button class="btn btn-primary" onclick="showPopupEdit('${facility.id}', '${facility.name}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="confirmDelete('${facility.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                `;
                tr.appendChild(tdActions);

                // Tambahkan baris ke tabel
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error("Gagal mengambil data fasilitas:", error); // Debugging error
        });
}