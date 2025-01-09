function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown-menu');
    // Toggle the display between none and block
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
}

function showPopupUbahRole(userName, currentRole) {
    document.getElementById('popupUbahRoleUser').style.display = 'block';
    document.getElementById('userName').value = userName;
    document.getElementById('userRole').value = currentRole;
}

function closePopup() {
    document.querySelectorAll('.popup').forEach(popup => popup.style.display = 'none');
}

function showPopupDelete() {
    document.getElementById('popupHapusRoleUser').style.display = 'block';
}

function closePopup() {
    document.querySelectorAll('.popup').forEach(popup => popup.style.display = 'none');
}

function confirmDelete() {
    alert('Pengguna berhasil dihapus!'); // Ganti dengan fungsi penghapusan yang sesuai.
    closePopup();
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
// Fetch Users and Populate Table
function fetchUsers() {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    fetch('https://kosconnect-server.vercel.app/api/users', {
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
            console.log("Data pengguna:", data);

            const tbody = document.querySelector('table tbody');
            if (!tbody) {
                console.error("Elemen tbody tidak ditemukan di DOM.");
                return;
            }

            // Kosongkan tabel sebelum menambah data baru
            tbody.innerHTML = '';

            // Loop data dan tambahkan ke tabel
            data.forEach(user => {
                const tr = document.createElement('tr');

                // Kolom Nama Pengguna
                const tdName = document.createElement('td');
                tdName.textContent = user.fullname;
                tr.appendChild(tdName);

                // Kolom Email Pengguna
                const tdEmail = document.createElement('td');
                tdEmail.textContent = user.email;
                tr.appendChild(tdEmail);

                // Kolom Role Pengguna
                const tdRole = document.createElement('td');
                tdRole.textContent = user.role;
                tr.appendChild(tdRole);

                // Kolom Aksi (Ubah Role dan Hapus)
                const tdAksi = document.createElement('td');
                tdAksi.innerHTML = `
                    <button class="btn btn-primary" onclick="showPopupUbahRole('${user.id}', '${user.role}')"><i class="fas fa-user-edit"></i> Ubah Role</button>
                    <button class="btn btn-primary" onclick="showPopupDelete('${user.id}')"><i class="fas fa-trash"></i> Hapus</button>
                `;
                tr.appendChild(tdAksi);

                // Tambahkan baris ke tabel
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error("Gagal mengambil data pengguna:", error);
        });
}

// Panggil fetch Users saat halaman dimuat
window.addEventListener('load', fetchUsers);
