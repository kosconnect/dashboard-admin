function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown-menu');
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
}

document.addEventListener("DOMContentLoaded", () => {
    // Fungsi membaca nilai cookie berdasarkan nama
    function getCookie(name) {
        const cookies = document.cookie.split("; ");
        for (let cookie of cookies) {
            const [key, value] = cookie.split("=");
            if (key === name) return decodeURIComponent(value);
        }
        return null;
    }

    // Ambil token dan elemen yang dibutuhkan
    const authToken = getCookie("authToken");
    const userRole = getCookie("userRole");
    const userNameElement = document.querySelector(".user-dropdown .name");
    const adminWidgetElement = document.querySelector(".widget-info");

    if (authToken) {
        fetch("https://kosconnect-server.vercel.app/api/users/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        })
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch user data");
                return response.json();
            })
            .then(data => {
                const user = data.user;
                const userName = user?.fullname || userRole || "Admin Tidak Diketahui";
                userNameElement.textContent = userName;
                adminWidgetElement.textContent = userName; // Tambahkan nama admin ke widget
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
                userNameElement.textContent = userRole || "Guest";
                adminWidgetElement.textContent = "Gagal Memuat Nama Admin";
            });
    } else {
        userNameElement.textContent = "Guest";
        adminWidgetElement.textContent = "Guest";
    }

    // Logika logout
    const logoutBtn = document.querySelector(".dropdown-menu li a");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (event) => {
            event.preventDefault();
            document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax; Secure";
            document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax; Secure";

            // Arahkan ke halaman login setelah logout
            window.location.href = "https://kosconnect.github.io/login/";
        });
    }
});


/////

// Fungsi untuk menutup semua popup
function closePopup() {
    // Menutup semua popup yang ada
    document.querySelectorAll('.popup').forEach(popup => {
        popup.style.display = 'none';
    });
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
// Fetch Facilities and Populate Table
function fetchFacilities() {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    fetch('https://kosconnect-server.vercel.app/api/facilitytypes/', {
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
            console.log("Data fasilitas kamar:", data);

            const tbody = document.querySelector('table tbody');
            if (!tbody) {
                console.error("Elemen tbody tidak ditemukan di DOM.");
                return;
            }

            // Kosongkan tabel sebelum menambah data baru
            tbody.innerHTML = '';

            // Loop data dan tambahkan ke tabel
            data.forEach(fasilitas => {
                const tr = document.createElement('tr');

                // Kolom ID
                const tdId = document.createElement('td');
                tdId.textContent = fasilitas.id;
                tr.appendChild(tdId);

                // Kolom Nama Fasilitas
                const tdNamaFasilitas = document.createElement('td');
                tdNamaFasilitas.textContent = fasilitas.name;
                tr.appendChild(tdNamaFasilitas);

                // Kolom Aksi
                // Kolom Aksi pada tabel fasilitas
                const tdAksi = document.createElement('td');
                tdAksi.innerHTML = `
                <button class="btn btn-primary" onclick="showPopupEdit('${fasilitas.id}', '${fasilitas.name}')"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn btn-primary" onclick="showPopupDelete('${fasilitas.id}')"><i class="fas fa-trash"></i> Hapus</button>
                `;

                tr.appendChild(tdAksi);

                // Tambahkan baris ke tabel
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error("Gagal mengambil data fasilitas kamar:", error);
        });
}

// Panggil fetch Facilities saat halaman dimuat
window.addEventListener('load', fetchFacilities);


function showPopup() {
    const popup = document.getElementById('popupTambahFasilitas');
    if (popup) {
        popup.style.display = 'block';
    } else {
        console.error("Popup dengan ID 'popupTambahFasilitas' tidak ditemukan.");
    }
}


// POST
// Fungsi untuk menambahkan fasilitas baru
function addFacility() {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    // Ambil data dari form
    const facilityName = document.getElementById('namaFasilitas').value;
    if (!facilityName) {
        alert('Nama fasilitas tidak boleh kosong!');
        return;
    }

    const newFacility = {
        name: facilityName
    };

    fetch('https://kosconnect-server.vercel.app/api/facilitytypes/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFacility)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Fasilitas berhasil ditambahkan:", data);
            alert("Fasilitas berhasil ditambahkan!");
            closePopup(); // Tutup popup setelah berhasil
            fetchFacilities(); // Refresh tabel
        })
        .catch(error => {
            console.error("Gagal menambahkan fasilitas:", error);
            alert("Gagal menambahkan fasilitas. Silakan coba lagi.");
        });
}

// Event Listener untuk form Tambah Fasilitas
document.getElementById('formTambahFasilitas').addEventListener('submit', function (e) {
    e.preventDefault(); // Mencegah halaman refresh
    addFacility();
});

// Fungsi untuk menampilkan popup Edit dan mengisi data fasilitas
function showPopupEdit(facilityId, facilityName) {
    document.getElementById('popupEditFasilitas').style.display = 'block';

    // Isi input tersembunyi untuk ID
    document.getElementById('editFacilityId').value = facilityId;

    // Isi input nama untuk diedit
    document.getElementById('editNamaFasilitas').value = facilityName;
}

// PUT
// Fungsi untuk memperbarui fasilitas
function updateFacility(facilityId, updatedName) {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    fetch(`https://kosconnect-server.vercel.app/api/facilitytypes/${facilityId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: updatedName })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Fasilitas kamar berhasil diperbarui:", data);
            alert('Fasilitas berhasil diperbarui!');
            closePopup();  // Tutup popup setelah sukses
            fetchFacilities();  // Panggil ulang untuk memperbarui tabel
        })
        .catch(error => {
            console.error("Gagal memperbarui fasilitas kamar:", error);
            alert('Gagal memperbarui fasilitas kamar.');
        });
}

fetchFacilities();  // Memastikan tabel diperbarui

// Event listener untuk form edit fasilitas
document.getElementById('formEditFasilitas').addEventListener('submit', function (e) {
    e.preventDefault(); // Mencegah reload halaman

    const facilityId = document.getElementById('editFacilityId').value; // Ambil ID fasilitas
    const updatedName = document.getElementById('editNamaFasilitas').value; // Ambil nama fasilitas baru

    // Panggil fungsi untuk mengupdate data
    updateFacility(facilityId, updatedName);
});

let selectedFacilityId = null;  // Menyimpan ID fasilitas yang dipilih

// Fungsi untuk menampilkan popup Hapus Fasilitas
function showPopupDelete(facilityId) {
    selectedFacilityId = facilityId; // Simpan ID fasilitas yang dipilih
    document.getElementById('popupHapusFasilitas').style.display = 'block'; // Tampilkan popup
    console.log("Facility ID untuk dihapus:", selectedFacilityId); // Debug log
}


// DELETE
function executeDelete() {
    if (!selectedFacilityId) {
        console.error("ID fasilitas tidak valid.");
        return;
    }

    const jwtToken = getJwtToken();  // Ambil token JWT
    if (!jwtToken) {
        console.error("Token tidak ditemukan, tidak dapat melanjutkan permintaan.");
        return;
    }

    // Kirim permintaan DELETE ke API untuk menghapus fasilitas
    fetch(`https://kosconnect-server.vercel.app/api/facilitytypes/${selectedFacilityId}`, {
        method: 'DELETE',
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
            console.log("Fasilitas berhasil dihapus:", data);
            alert("Fasilitas berhasil dihapus!");
            closePopup(); // Tutup popup
            fetchFacilities(); // Refresh tabel setelah penghapusan
        })
        .catch(error => {
            console.error("Gagal menghapus fasilitas:", error);
            alert("Gagal menghapus fasilitas.");
        });
}