// Fungsi untuk menutup semua popup
function closePopup() {
    document.querySelectorAll('.popup').forEach(popup => {
        popup.style.display = 'none';
    });
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
function fetchUsers() {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    fetch('https://kosconnect-server.vercel.app/api/users/', {
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
            console.log("Data pengguna yang diterima dari server:", data);

            // Simpan data pengguna ke dalam variabel global
            if (data.users && Array.isArray(data.users)) {
                usersData = data.users; // Simpan data pengguna
                populateUserTable(usersData); // Isi tabel
            } else {
                console.error("Data pengguna tidak ditemukan atau format salah.");
            }
        })
        .catch(error => {
            console.error("Gagal mengambil data pengguna:", error);
        });
}

// Fungsi untuk mengisi tabel dengan data pengguna
function populateUserTable(users) {
    const tbody = document.getElementById('user-table-body');
    if (!tbody) {
        console.error("Elemen tbody tidak ditemukan di DOM.");
        return;
    }

    tbody.innerHTML = ''; // Kosongkan tabel sebelum menambahkan data baru

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
            <button class="btn btn-primary" onclick="showPopupEdit('${user.id}', '${user.fullname}', '${user.email}')">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-primary" onclick="showPopupDelete('${user.id}')">
                <i class="fas fa-trash"></i> Hapus
            </button>
            <div class="dropdown-aksi">
                <button class="btn btn-primary dropdown-button">
                    <i class="fas fa-ellipsis-v"></i> Lainnya
                </button>
                <div class="dropdown-aksi-content">
                    <button class="btn btn-primary" style="background-color: #4A90E2;" onclick="showPopupUbahRoleUser('${user.id}', '${user.role}')">
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

        tbody.appendChild(tr); // Tambahkan baris ke tabel
    });
}

// Fungsi untuk menampilkan popup Edit User
function showPopupEdit(userId, fullName, email) {
    const popup = document.getElementById('popupEditUser');
    if (popup) {
        popup.style.display = 'block'; // Tampilkan popup
        document.getElementById('editUserId').value = userId;
        document.getElementById('editFullName').value = fullName;
        document.getElementById('editEmail').value = email;
    } else {
        console.error("Popup Edit User tidak ditemukan.");
    }
}

// Fungsi untuk menangani submit formulir Edit User
document.getElementById('formEditUser').addEventListener('submit', function (event) {
    event.preventDefault(); // Mencegah reload halaman saat form disubmit

    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    const userId = document.getElementById('editUserId').value;
    const fullNameBaru = document.getElementById('editFullName').value.trim();
    const emailBaru = document.getElementById('editEmail').value.trim();

    if (!fullNameBaru || !emailBaru) {
        alert("Nama lengkap dan email tidak boleh kosong!");
        return;
    }

    const requestBody = {
        fullname: fullNameBaru,
        email: emailBaru
    };

    fetch(`https://kosconnect-server.vercel.app/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || `HTTP error! status: ${response.status}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log("User berhasil diperbarui:", data);
            alert("User berhasil diperbarui!");

            fetchUsers(); // Perbarui tabel user
            closePopup(); // Tutup popup
        })
        .catch(error => {
            console.error("Gagal memperbarui user:", error);
            alert(`Gagal memperbarui user: ${error.message}`);
        });
});
