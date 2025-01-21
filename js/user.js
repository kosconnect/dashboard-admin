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


// Fungsi untuk menampilkan popup Edit User dan mengisi data pengguna
function showPopupEdit(userId, fullname, email) {
    // Isi data di dalam form dengan data pengguna yang dipilih
    document.getElementById('editUserId').value = userId;
    document.getElementById('editFullName').value = fullname;
    document.getElementById('editEmail').value = email;

    // Tampilkan popup
    document.getElementById('popupEditUser').style.display = 'block';
}

// Fungsi untuk menutup popup
function closePopup() {
    document.getElementById('popupEditUser').style.display = 'none';
}

// Fungsi untuk menangani form submit Edit User
document.getElementById('formEditUser').addEventListener('submit', function(event) {
    event.preventDefault(); // Mencegah form untuk refresh halaman

    const userId = document.getElementById('editUserId').value;
    const fullname = document.getElementById('editFullName').value;
    const email = document.getElementById('editEmail').value;

    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Token tidak ditemukan.");
        return;
    }

    // Request untuk mengupdate data pengguna
    fetch(`https://kosconnect-server.vercel.app/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fullname: fullname,
            email: email
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("User updated successfully!");
            // Refresh data pengguna setelah edit
            fetchUsers(jwtToken);
        } else {
            alert("Error updating user.");
        }
        closePopup(); // Tutup popup setelah selesai
    })
    .catch(error => {
        console.error("Error updating user:", error);
    });
});
