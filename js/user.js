function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown-menu');
    // Toggle the display between none and block
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
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
document.addEventListener('DOMContentLoaded', function() {
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

            // Kolom ID
            const tdId = document.createElement('td');
            tdId.textContent = user.id.toString();
            tr.appendChild(tdId);

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
                <div class="dropdown">
                    <button class="btn btn-primary dropdown-toggle" type="button">
                        <i class="fas fa-ellipsis-v"></i> Aksi
                    </button>
                    <div class="dropdown-menu">
                        <button class="dropdown-item" onclick="showPopupEdit('${user.fullname}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="dropdown-item" onclick="showPopupDelete('${user.id}')">
                            <i class="fas fa-trash"></i> Hapus
                        </button>
                        <button class="dropdown-item" onclick="showPopupUbahRoleUser('${user.fullname}', '${user.role}')">
                            <i class="fas fa-user-cog"></i> Update Role
                        </button>
                        <button class="dropdown-item" onclick="changePassword('${user.id}')">
                            <i class="fas fa-key"></i> Change Password
                        </button>
                        <button class="dropdown-item" onclick="resetPassword('${user.id}')">
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
