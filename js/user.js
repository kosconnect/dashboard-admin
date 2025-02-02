// function closePopup() {
//     document.querySelectorAll('.popup').forEach(popup => {
//         popup.style.display = 'none';
//     });
// }

function closePopup() {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => {
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
                     <button class="btn btn-primary" onclick="showPopupEdit('${user.user_id}', \`${user.fullname}\`, \`${user.email}\`)"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn btn-primary" onclick="showPopupDelete('${user.user_id}')">
                    <i class="fas fa-trash"></i> Hapus</button>
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


// Fungsi untuk menampilkan popup Edit User
function showPopupEdit(userId, fullName, email) {
    console.log("User ID yang diterima di showPopupEdit:", userId); // Debug
    if (!userId) {
        console.error("User ID tidak ditemukan!");
        alert("Terjadi kesalahan: User ID tidak ditemukan.");
        return;
    }

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


// Fungsi untuk menutup popup
// function closePopup(popupId) {
//     const popup = document.getElementById(popupId);
//     if (popup) {
//         popup.style.display = 'none';
//     } else {
//         console.error(`Popup dengan ID "${popupId}" tidak ditemukan.`);
//     }
// }

// Fungsi untuk menangani submit formulir Edit User
document.getElementById('formEditUser').addEventListener('submit', function (event) {
    event.preventDefault(); // Mencegah reload halaman saat form disubmit

    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    const userId = document.getElementById('editUserId').value; // Pastikan ini berisi user_id
    const fullNameBaru = document.getElementById('editFullName').value.trim();
    const emailBaru = document.getElementById('editEmail').value.trim();

    if (!userId) {
        console.error("ID user tidak ditemukan.");
        alert("Terjadi kesalahan: ID user tidak ditemukan.");
        return;
    }

    if (!fullNameBaru || !emailBaru) {
        alert("Nama lengkap dan email tidak boleh kosong!");
        return;
    }

    const requestBody = {
        fullname: fullNameBaru,
        email: emailBaru,
    };

    fetch(`https://kosconnect-server.vercel.app/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
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

            // Tutup popup sebelum menampilkan alert
            closePopup('popupEditUser');

            // Tampilkan notifikasi berhasil
            alert("User berhasil diperbarui!");

            // Perbarui tabel user
            fetchUsers(jwtToken);

            // Tutup popup
            closePopup();
        })
        .catch(error => {
            console.error("Gagal memperbarui user:", error);
            alert(`Gagal memperbarui user: ${error.message}`);
        });
})

let selectedUserId = null; // Variabel untuk menyimpan user ID yang akan dihapus

// Fungsi untuk menampilkan popup hapus user
function showPopupDelete(userId) {
    selectedUserId = userId; // Simpan user ID yang akan dihapus
    const popup = document.getElementById('popupHapusRoleUser');
    if (popup) {
        popup.style.display = 'block'; // Tampilkan popup
    } else {
        console.error("Popup Hapus User tidak ditemukan.");
        alert("Popup Hapus User tidak ditemukan."); // Notifikasi jika popup tidak ditemukan
    }
}

// Fungsi untuk menangani konfirmasi penghapusan user
function confirmDelete() {
    const jwtToken = getJwtToken(); // Ambil JWT Token
    if (!jwtToken) {
        alert("Tidak ada token JWT, tidak dapat melanjutkan permintaan."); // Notifikasi jika token tidak ditemukan
        return;
    }

    if (!selectedUserId) {
        alert("User ID tidak valid. Tidak dapat menghapus user."); // Notifikasi jika ID tidak valid
        closePopup(); // Tutup popup jika ID tidak valid
        return;
    }

    // Kirim permintaan DELETE ke API
    fetch(`https://kosconnect-server.vercel.app/api/users/${selectedUserId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
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
            console.log("User berhasil dihapus:", data); // Log hasil penghapusan
            alert("User berhasil dihapus!"); // Tampilkan notifikasi berhasil
            fetchUsers(jwtToken); // Perbarui daftar user
            closePopup(); // Tutup popup setelah alert berhasil
        })
        .catch(error => {
            console.error("Gagal menghapus user:", error); // Log error
            alert(`Gagal menghapus user: ${error.message}`); // Tampilkan notifikasi gagal
        });
}

// Fungsi untuk menutup popup
// function closePopup() {
//     const popup = document.getElementById('popupUbahRoleUser');
//     if (popup) {
//         popup.style.display = 'none';
//     }
// }

function showPopupUbahRoleUser(userId, userName, currentRole) {
    console.log("User ID:", userId);  // Debug ID pengguna
    console.log("User Name:", userName);  // Debug nama pengguna
    console.log("Current Role:", currentRole);  // Debug role pengguna

    if (!userId || !userName || !currentRole) {
        alert("Terjadi kesalahan: Data pengguna tidak lengkap.");
        return;
    }

    const popup = document.getElementById('popupUbahRoleUser');
    if (popup) {
        popup.style.display = 'block'; // Tampilkan popup
        document.getElementById('userIdHidden').value = userId;
        document.getElementById('userName').value = userName;
        document.getElementById('userRole').value = currentRole;
    } else {
        console.error("Popup Ubah Role User tidak ditemukan.");
    }
}

// Fungsi untuk menangani submit formulir Ubah Role User
document.getElementById('formUbahRoleUser').addEventListener('submit', function (event) {
    event.preventDefault(); // Mencegah reload halaman

    const userId = document.getElementById('userIdHidden').value; // ID pengguna dari hidden input
    const userRole = document.getElementById('userRole').value; // Role baru yang dipilih
    const jwtToken = getJwtToken();

    if (!jwtToken || !userId || !userRole) {
        alert("Data tidak lengkap.");
        return;
    }

    // Kirim permintaan PUT untuk mengubah role
    fetch(`https://kosconnect-server.vercel.app/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: userRole })
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
            // Tampilkan notifikasi berhasil
            alert("Role pengguna berhasil diubah!");

            // Setelah alert diklik OK, tutup popup
            closePopup('popupUbahRoleUser');

            // Perbarui daftar pengguna (panggil fungsi fetchUsers jika ada)
            fetchUsers(jwtToken);
        })
        .catch(error => {
            console.error("Gagal mengubah role pengguna:", error);
            alert(`Gagal mengubah role pengguna: ${error.message}`);
        });
});



// Fungsi untuk menampilkan popup Reset Password
function showPopupResetPassword(userId) {
    const popup = document.getElementById('popupResetPassword');
    if (popup) {
        popup.style.display = 'block'; // Tampilkan popup
        document.getElementById('resetUserId').value = userId; // Set user ID ke hidden input
    } else {
        console.error("Popup Reset Password tidak ditemukan.");
    }
}

// Fungsi untuk menutup popup
function closePopup() {
    const popup = document.getElementById('popupResetPassword');
    if (popup) {
        popup.style.display = 'none'; // Sembunyikan popup
    } else {
        console.error("Popup tidak ditemukan.");
    }
}

// Fungsi untuk toggle visibility password
function togglePasswordVisibility(passwordId, iconId) {
    const passwordInput = document.getElementById(passwordId);
    const passwordIcon = document.getElementById(iconId);

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text'; // Tampilkan password
        passwordIcon.classList.remove('fa-eye'); // Ubah ikon
        passwordIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password'; // Sembunyikan password
        passwordIcon.classList.remove('fa-eye-slash'); // Ubah ikon
        passwordIcon.classList.add('fa-eye');
    }
}

// Fungsi untuk menangani submit form Reset Password
document.getElementById('formResetPassword').addEventListener('submit', function (event) {
    event.preventDefault(); // Mencegah reload halaman

    const userId = document.getElementById('resetUserId').value; // Ambil ID pengguna
    const newPassword = document.getElementById('newPassword').value; // Ambil password baru
    const jwtToken = getJwtToken(); // Fungsi untuk mengambil token JWT

    if (!userId || !newPassword) {
        alert("Data tidak lengkap. Pastikan semua input diisi.");
        return;
    }

    // Kirim permintaan PUT ke API untuk reset password
    fetch(`https://kosconnect-server.vercel.app/api/users/${userId}/reset-password`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword: newPassword })
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
            alert("Password berhasil direset!");
            closePopup(); // Tutup popup setelah berhasil
        })
        .catch(error => {
            console.error("Gagal mereset password:", error);
            alert(`Gagal mereset password: ${error.message}`);
        });
});
