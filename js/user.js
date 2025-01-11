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


// Fungsi untuk menampilkan popup edit
function showPopupEdit(userId, fullname, email) {
    document.getElementById('editUserId').value = userId;
    document.getElementById('editFullName').value = fullname || '';
    document.getElementById('editEmail').value = email || '';
    document.getElementById('popupEditUser').style.display = 'block';
}

function closePopup() {
    document.getElementById('popupEditUser').style.display = 'none';
}

document.getElementById('fetchUser').addEventListener('click', async () => {
    const userID = document.getElementById('userID').value.trim();
    if (!userID) {
        alert('Please enter a User ID');
        return;
    }

    const token = 'authToken'; // Ganti dengan token autentikasi valid

    try {
        const response = await fetch(`http://localhost:8080/users/${userID}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('User not found or invalid credentials');
        }

        const data = await response.json();
        const user = data.user;

        document.getElementById('userIdOutput').textContent = user._id || 'N/A';
        document.getElementById('fullNameOutput').textContent = user.fullname || 'N/A';
        document.getElementById('emailOutput').textContent = user.email || 'N/A';
    } catch (error) {
        alert(`Error: ${error.message}`);
        document.getElementById('userIdOutput').textContent = '';
        document.getElementById('fullNameOutput').textContent = '';
        document.getElementById('emailOutput').textContent = '';
    }
});

// Fungsi untuk memperbarui data pengguna
function updateUser(userId, updatedData, jwtToken) {
    fetch(`https://kosconnect-server.vercel.app/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Gagal memperbarui data pengguna. Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Data pengguna berhasil diperbarui:", data);
        closePopup();
        // fetchUsers(jwtToken);  // Pastikan fungsi ini tersedia
    })
    .catch(error => {
        console.error("Terjadi kesalahan saat memperbarui pengguna:", error);
    });
}

function showPopupUbahRoleUser(userId, fullname, role) {
    document.getElementById('userIdHidden').value = userId;
    document.getElementById('userName').value = fullname;
    document.getElementById('userRole').value = role;
    document.getElementById('popupUbahRoleUser').style.display = 'block';
}

function showPopupUbahRoleUser(userId, fullname, role) {
    // Isi form dengan data pengguna yang akan diubah
    document.getElementById('userIdHidden').value = userId;
    document.getElementById('userName').value = fullname;
    document.getElementById('userRole').value = role;

    // Tampilkan popup
    document.getElementById('popupUbahRoleUser').style.display = 'block';
}

// Fungsi untuk memperbarui role pengguna
function updateUserRole(userId, updatedRole) {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

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
            alert('Role pengguna berhasil diperbarui!');
            closePopup();  // Tutup popup setelah sukses
            fetchUsers();  // Perbarui tabel pengguna
        })
        .catch(error => {
            console.error("Gagal memperbarui role pengguna:", error);
            alert('Gagal memperbarui role pengguna.');
        });
}

document.getElementById('formUbahRoleUser').addEventListener('submit', function (event) {
    event.preventDefault();

    const userId = document.getElementById('userIdHidden').value;  // ID pengguna tersembunyi
    const updatedRole = document.getElementById('userRole').value;

    updateUserRole(userId, updatedRole);
});



