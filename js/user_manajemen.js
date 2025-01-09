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
                usersData = data.users; // Simpan data pengguna di variabel global
                populateUserTable(usersData); // Isi tabel dengan data pengguna
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

        // Kolom Aksi
        const tdAksi = document.createElement('td');
        tdAksi.innerHTML = `
            <button class="btn btn-primary" onclick="showPopupUbahRoleUser('${user.fullname}', '${user.role}')">
                <i class="fas fa-user-edit"></i> Ubah Role
            </button>
            <button class="btn btn-primary" onclick="showPopupDelete('${user.id}')">
                <i class="fas fa-trash"></i> Hapus
            </button>
        `;
        tr.appendChild(tdAksi);

        // Tambahkan baris ke tabel
        tbody.appendChild(tr);
    });
}

// Panggil fetchUsers saat halaman dimuat
window.addEventListener('load', fetchUsers);


function showPopupUbahRoleUser(fullname, currentRole) {
    const popup = document.getElementById('popupUbahRoleUser');
    popup.style.display = 'block'; // Tampilkan popup

    // Isi input dengan nama pengguna (readonly)
    document.getElementById('userName').value = fullname;

    // Setel role saat ini pada dropdown
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
            alert('Role pengguna berhasil diperbarui!');
            closePopup();  // Tutup popup setelah sukses
            fetchUsers();  // Panggil ulang untuk memperbarui tabel
        })
        .catch(error => {
            console.error("Gagal memperbarui role pengguna:", error);
            alert('Gagal memperbarui role pengguna.');
        });
}

// Menangani form submit untuk perubahan role pengguna
document.getElementById('formUbahRoleUser').addEventListener('submit', function (e) {
    e.preventDefault(); // Mencegah reload halaman

    const userName = document.getElementById('userName').value; // Ambil Nama Pengguna
    const updatedRole = document.getElementById('userRole').value; // Ambil Role Baru

    // Panggil fungsi untuk mengupdate data role
    updateUserRole(userName, updatedRole);
});