function closePopup() {
    document.querySelectorAll('.popup').forEach(popup => {
        popup.style.display = 'none';
    });
}

// Fungsi untuk mendapatkan JWT token dari cookie
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

// Tunggu hingga seluruh DOM dimuat
document.addEventListener('DOMContentLoaded', function () {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    // Panggil fungsi fetchUsers setelah token ditemukan
    fetchUsers(jwtToken);
});

// Fungsi untuk mengambil data pengguna
function fetchUsers(jwtToken) {
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
            console.log("Data pengguna:", data);

            const tbody = document.querySelector('#user-table-body');
            if (!tbody) {
                console.error("Elemen tbody tidak ditemukan di DOM.");
                return;
            }

            // Kosongkan tabel sebelum menambah data baru
            tbody.innerHTML = '';

            // Loop data pengguna dan tambahkan ke tabel
            data.users.forEach(user => {
                const tr = document.createElement('tr');

                // Kolom Nama
                const tdNama = document.createElement('td');
                tdNama.textContent = user.fullname || "N/A";
                tr.appendChild(tdNama);

                // Kolom Email
                const tdEmail = document.createElement('td');
                tdEmail.textContent = user.email || "N/A";
                tr.appendChild(tdEmail);

                // Kolom Role
                const tdRole = document.createElement('td');
                tdRole.textContent = user.role || "N/A";
                tr.appendChild(tdRole);

                // Kolom Aksi dengan Dropdown
                const tdAksi = document.createElement('td');
                tdAksi.innerHTML = `
                    <button class="btn btn-primary" onclick="showPopupEdit('${user.id}', \`${user.fullname}\`, \`${user.email}\`)"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn btn-primary" onclick="showPopupDelete('${user.id}')">
                    <i class="fas fa-trash"></i> Hapus</button>
                    <div class="dropdown-aksi">
                    <button class="btn btn-primary dropdown-button">
                        <i class="fas fa-ellipsis-v"></i> Lainnya</button>
                    <div class="dropdown-aksi-content">
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
        })
        .catch(error => {
            console.error("Gagal mengambil data pengguna:", error);
        });
}


// Fungsi untuk menutup popup Edit User
function closePopup() {
    const popup = document.getElementById('popupEditUser');
    if (popup) {
        popup.style.display = 'none'; // Sembunyikan popup
    }
}

// Fungsi untuk membuka popup edit dengan data pengguna
function showPopupEdit(fullname) {
    const user = usersData.find(user => user.fullname === fullname);
    if (!user) {
        console.error("Pengguna tidak ditemukan.");
        return;
    }

    // Isi data pengguna di popup edit
    document.getElementById('editUserId').value = user.user_id;
    document.getElementById('editFullName').value = user.fullname;
    document.getElementById('editEmail').value = user.email;

    // Tampilkan popup edit
    document.getElementById('popupEditUser').style.display = 'block';
}

// Fungsi untuk menyembunyikan popup
function closePopup() {
    document.getElementById('popupEditUser').style.display = 'none';
}

// Fungsi untuk memperbarui data pengguna
function updateUser() {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    // Ambil data dari form
    const userId = document.getElementById('editUserId').value;
    const updatedFullName = document.getElementById('editFullName').value;
    const updatedEmail = document.getElementById('editEmail').value;

    // Validasi data input
    if (!userId || !updatedFullName || !updatedEmail) {
        alert("Semua field wajib diisi.");
        return;
    }

    // Lakukan permintaan PUT ke server
    fetch(`https://kosconnect-server.vercel.app/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fullname: updatedFullName,
            email: updatedEmail
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Pengguna berhasil diperbarui:", data);

            // Tutup popup
            closePopup();

            // Refresh data pengguna di tabel
            fetchUsers();

            // Tampilkan notifikasi berhasil
            alert("Data pengguna berhasil diperbarui.");
        })
        .catch(error => {
            console.error("Gagal memperbarui pengguna:", error);
            alert("Terjadi kesalahan saat memperbarui pengguna.");
        });
}

// Tambahkan event listener untuk form submit
document.getElementById('formEditUser').addEventListener('submit', function (event) {
    event.preventDefault(); // Cegah form melakukan submit default
    updateUser(); // Panggil fungsi update user
});
