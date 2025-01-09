// Function to toggle the dropdown menu display
function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown-menu');
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
}

// Fungsi untuk menutup semua popup
function closePopup() {
    // Menutup semua popup yang ada
    document.querySelectorAll('.popup').forEach(popup => {
        popup.style.display = 'none';
    });
}

// Function to show popup for editing a category
function showPopupEdit() {
    document.getElementById('popupEditKategori').style.display = 'block';
}

// Function to show popup for deleting a category
function showPopupDelete() {
    document.getElementById('popupHapusKategori').style.display = 'block';
}

// Fungsi untuk mendapatkan JWT token
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

    // Panggil fungsi fetchCategories setelah token ditemukan
    fetchCategories(jwtToken);
});

// Fungsi untuk mengambil kategori
function fetchCategories(jwtToken) {
    fetch('https://kosconnect-server.vercel.app/api/categories/', {
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
        console.log("Data kategori:", data);

        const tbody = document.querySelector('#categories-table-body'); // Pastikan ini sesuai dengan id yang ditambahkan di HTML
        if (!tbody) {
            console.error("Elemen tbody tidak ditemukan di DOM.");
            return;
        }

        // Kosongkan tabel sebelum menambah data baru
        tbody.innerHTML = '';

        // Loop data kategori dan tambahkan ke tabel
        data.forEach(kategori => {
            const tr = document.createElement('tr');

            // Kolom ID
            const tdId = document.createElement('td');
            tdId.textContent = kategori.id.toString(); // ID sebagai string
            tr.appendChild(tdId);

            // Kolom Nama Kategori
            const tdNamaKategori = document.createElement('td');
            tdNamaKategori.textContent = kategori.name;
            tr.appendChild(tdNamaKategori);

            // Kolom Slug Kategori
            const tdSlugKategori = document.createElement('td');
            tdSlugKategori.textContent = kategori.slug;
            tr.appendChild(tdSlugKategori);

            // Kolom Aksi
            const tdAksi = document.createElement('td');
            tdAksi.innerHTML = `
                <button class="btn btn-primary" onclick="showPopupEditCategory('${kategori.id}', '${kategori.name}', '${kategori.slug}')"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn btn-primary" onclick="showPopupDeleteCategory('${kategori.id}')"><i class="fas fa-trash"></i> Hapus</button>
            `;
            tr.appendChild(tdAksi);

            // Tambahkan baris ke tabel
            tbody.appendChild(tr);
        });
    })
    .catch(error => {
        console.error("Gagal mengambil data kategori:", error);
    });
}


function showPopup() {
    const popup = document.getElementById('popupTambahKategori');
    if (popup) {
        popup.style.display = 'block';
    } else {
        console.error("Popup dengan ID 'popupTambahKategori' tidak ditemukan.");
    }
}

// POST
// Fungsi untuk menambahkan kategori baru
function addCategory() {
    const jwtToken = getJwtToken(); // Fungsi Anda untuk mengambil token JWT
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    // Ambil data dari form
    const categoryName = document.getElementById('namaKategori').value;
    if (!categoryName) {
        alert('Nama kategori tidak boleh kosong!');
        return;
    }

    const newCategory = {
        name: categoryName
    };

    fetch('https://kosconnect-server.vercel.app/api/categories/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCategory)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Kategori berhasil ditambahkan:", data);
            alert("Kategori berhasil ditambahkan!");
            closePopup(); // Tutup popup setelah berhasil
            fetchCategories(); // Refresh tabel kategori
        })
        .catch(error => {
            console.error("Gagal menambahkan kategori:", error);
            alert("Gagal menambahkan kategori. Silakan coba lagi.");
        });
}

// Event Listener untuk form Tambah Kategori
document.getElementById('formTambahKategori').addEventListener('submit', function (e) {
    e.preventDefault(); // Mencegah halaman refresh
    addCategory();
});
