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

            // Pastikan data.users ada dan berupa array
            if (data.users && Array.isArray(data.users)) {
                const tbody = document.getElementById('user-table-body');
                if (!tbody) {
                    console.error("Elemen tbody tidak ditemukan di DOM.");
                    return;
                }

                // Kosongkan tabel sebelum menambah data baru
                tbody.innerHTML = '';

                data.users.forEach(user => {
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

                    // Kolom Aksi
                    const tdAksi = document.createElement('td');
                    tdAksi.innerHTML = `
                        <button class="btn btn-primary" onclick="showPopupUbahRoleUser('${user.id}', '${user.role}')"><i class="fas fa-user-edit"></i> Ubah Role</button>
                        <button class="btn btn-primary" onclick="showPopupDelete('${user.id}')"><i class="fas fa-trash"></i> Hapus</button>
                    `;
                    tr.appendChild(tdAksi);

                    // Tambahkan baris ke tabel
                    tbody.appendChild(tr);
                });
            } else {
                console.error("Data pengguna tidak ditemukan atau format salah.");
            }
        })
        .catch(error => {
            console.error("Gagal mengambil data pengguna:", error);
        });
}

// Panggil fetch Users saat halaman dimuat
window.addEventListener('load', fetchUsers);


function showPopupUbahRoleUser(userId, currentRole) {
    document.getElementById('popupUbahRoleUser').style.display = 'block';

    // Isi input userName dengan nama pengguna
    document.getElementById('userName').value = userId; // Isi dengan ID pengguna, karena input readonly
    document.getElementById('userRole').value = currentRole; // Isi dengan role pengguna saat ini
}

// PUT
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
            fetchUsers();  // Panggil ulang untuk memperbarui tabel
        })
        .catch(error => {
            console.error("Gagal memperbarui role pengguna:", error);
            alert('Gagal memperbarui role pengguna.');
        });
}

document.getElementById('formUbahRoleUser').addEventListener('submit', function (e) {
    e.preventDefault(); // Mencegah reload halaman

    const userId = document.getElementById('userName').value; // Ambil ID pengguna
    const updatedRole = document.getElementById('userRole').value; // Ambil role baru

    // Panggil fungsi untuk mengupdate data role
    updateUserRole(userId, updatedRole);
});
