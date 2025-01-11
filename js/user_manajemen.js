function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown-menu');
    // Toggle the display between none and block
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
}

function closePopup() {
    document.querySelectorAll('.popup').forEach(popup => popup.style.display = 'none');
}

function showPopupDelete(userId) {
    document.getElementById('popupHapusRoleUser').style.display = 'block';
    document.getElementById('userIdToDelete').value = userId; // Pastikan ada input field dengan id userIdToDelete
}

function confirmDelete() {
    const userId = document.getElementById('userIdToDelete').value;
    alert(`Pengguna dengan ID ${userId} berhasil dihapus!`); // Ganti dengan fungsi penghapusan yang sesuai.
    closePopup();
}


// Fungsi untuk mendapatkan token JWT dari cookies
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

// Variabel global untuk menyimpan data pengguna
let usersData = [];

// Fungsi untuk mengambil data pengguna dan mengisi tabel
// Sinkronisasi data dari server
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
            throw new Error(`Gagal mengambil data pengguna, status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        usersData = data.users || [];
        populateUserTable(usersData); // Isi tabel dengan data terbaru
    })
    .catch(error => console.error("Gagal mengambil data pengguna:", error));
}

// Fungsi untuk mengisi tabel dengan data pengguna
function populateUserTable(users) {
    const tbody = document.getElementById('user-table-body');
    if (!tbody) {
        console.error("Elemen tbody tidak ditemukan di DOM.");
        return;
    }

    // Kosongkan tabel sebelum menambahkan data baru
    tbody.innerHTML = '';

    // Iterasi data pengguna untuk menambahkan baris ke tabel
    users.forEach(user => {
        const tr = document.createElement('tr');

        // Kolom Nama Pengguna
        const tdFullName = document.createElement('td');
        tdFullName.textContent = user.fullname;
        tr.appendChild(tdFullName);

        // Kolom Email Pengguna
        const tdEmail = document.createElement('td');
        tdEmail.textContent = user.email;
        tr.appendChild(tdEmail);

        // Kolom Role Pengguna
        const tdRole = document.createElement('td');
        tdRole.textContent = user.role;
        tr.appendChild(tdRole);

        // Kolom Aksi dengan Dropdown
        const tdAksi = document.createElement('td');
        tdAksi.innerHTML = `
        <button class="btn btn-primary" onclick="showPopupEdit('${user.fullname}')"><i class="fas fa-edit"></i> Edit</button>
        <button class="btn btn-primary" onclick="showPopupDelete('${user.id}')">
        <i class="fas fa-trash"></i> Hapus</button>
        <div class="dropdown">
        <button class="btn btn-primary dropdown-button">
            <i class="fas fa-ellipsis-v"></i> Lainnya</button>
        <div class="dropdown-content">
            <button class="btn btn-primary" style="background-color: #4A90E2;" onclick="showPopupUbahRoleUser('${user.fullname}', '${user.role}')">
                <i class="fas fa-user-cog"></i> Update Role
            </button>
            <button class="btn btn-primary" style="background-color: #FFBD59;" onclick="changePassword('${user.id}')">
                <i class="fas fa-key"></i> Change Password
            </button>
            <button class="btn btn-primary" style="background-color: #E53935;" onclick="resetPassword('${user.id}')">
                <i class="fas fa-redo"></i> Reset Password
            </button>
        </div>
    </div>
`;

        tr.appendChild(tdAksi);

        // Tambahkan baris ke tabel
        tbody.appendChild(tr);
    });
}

// Panggil fetchUsers saat halaman dimuat
window.addEventListener('load', fetchUsers);


// Popup untuk ubah role pengguna
function showPopupUbahRoleUser(fullname, currentRole) {
    const popup = document.getElementById('popupUbahRoleUser');
    popup.style.display = 'block';
    document.getElementById('userName').value = fullname;

    const user = usersData.find(user => user.fullname === fullname);
    if (user) {
        document.getElementById('userName').setAttribute('data-id', user.id);
    }

    document.getElementById('userRole').value = currentRole;
}

// PUT
// Fungsi untuk memperbarui role pengguna berdasarkan nama dan role
function updateUserRole(userName, updatedRole) {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    // Pertama, cari userId berdasarkan userName
    const user = usersData.find(user => user.fullname === userName); // Menyesuaikan dengan data yang sudah dimuat

    if (!user) {
        console.error("Pengguna tidak ditemukan.");
        return;
    }

    const userId = user.id;  // Ambil ID pengguna yang sesuai

    fetch(`https://kosconnect-server.vercel.app/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: updatedRole })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Role pengguna berhasil diperbarui:", data);

            // Update role pengguna di array usersData
            const userIndex = usersData.findIndex(user => user.id === userId);
            if (userIndex !== -1) {
                usersData[userIndex].role = updatedRole; // Perbarui role di array
                localStorage.setItem('usersData', JSON.stringify(usersData));
            }

            alert('Role pengguna berhasil diperbarui!');
            closePopup(); // Tutup popup
            populateUserTable(usersData); // Refresh tabel
        })
        .catch(error => {
            console.error("Gagal memperbarui role pengguna:", error);
            alert('Gagal memperbarui role pengguna.');
        });
}

// Form submit untuk ubah role pengguna
document.getElementById('formUbahRoleUser').addEventListener('submit', function (e) {
    e.preventDefault();

    const userName = document.getElementById('userName').value;
    const updatedRole = document.getElementById('userRole').value;
    updateUserRole(userName, updatedRole);
});