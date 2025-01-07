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
function fetchFacilities() {
    const jwtToken = getJwtToken();
    console.log("JWT Token:", jwtToken); // Debug: Periksa token JWT
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
            console.log("Fetch Response Status:", response.status); // Debug: Periksa status respons
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Facilities Data:", data); // Debug: Periksa data yang diterima

            // Ambil elemen tabel
            const tbody = document.querySelector('table tbody');
            if (!tbody) {
                console.error("Tabel tbody tidak ditemukan di DOM."); // Debug: Periksa tabel
                return;
            }

            // Kosongkan tabel sebelum menambah data baru
            tbody.innerHTML = '';

            // Loop melalui data dan masukkan ke dalam tabel
            data.forEach(facility => {
                const tr = document.createElement('tr');

                const tdId = document.createElement('td');
                tdId.textContent = facility.id;
                tr.appendChild(tdId);

                const tdName = document.createElement('td');
                tdName.textContent = facility.name;
                tr.appendChild(tdName);

                const tdActions = document.createElement('td');
                tdActions.innerHTML = `
                    <button class="btn btn-primary" onclick="showPopupEdit('${facility.id}', '${facility.name}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-primary" onclick="confirmDelete('${facility.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                `;
                tr.appendChild(tdActions);

                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error("Gagal mengambil data facilities:", error); // Debug: Tangkap error
        });
}