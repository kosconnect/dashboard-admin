// Function to toggle the dropdown menu display
function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown-menu');
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
}

// Function to close the popup
function closePopup() {
    document.querySelectorAll('.popup').forEach(popup => popup.style.display = 'none');
}

// Function to handle form submission for adding category
document.getElementById('formTambahKategori').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Kategori berhasil ditambahkan!');
    closePopup();
});

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


// Function to show Popup for adding category
function showPopup() {
    document.getElementById('popupTambahKategori').style.display = 'block';
}

// POST 
// Fungsi untuk menambah kategori baru
function addCategory(event) {
    event.preventDefault(); // Menghindari reload halaman saat form disubmit

    const jwtToken = getJwtToken(); // Ambil JWT Token
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    // Ambil data dari form input
    const namaKategori = document.getElementById('namaKategori').value;

    // Membuat data kategori yang akan dikirim
    const data = {
        name: namaKategori
    };

    // Kirim data ke server menggunakan POST
    fetch('https://kosconnect-server.vercel.app/api/categories/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Mengirim data kategori dalam format JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Kategori berhasil ditambahkan:", data);
        // Menutup popup setelah data berhasil ditambahkan
        closePopup();
        fetchCategories(); // Memperbarui data kategori setelah penambahan
    })
    .catch(error => {
        console.error("Gagal menambah kategori:", error);
    });
}

// Tambahkan event listener untuk form tambah kategori
document.getElementById('formTambahKategori').addEventListener('submit', addCategory);

// Fungsi untuk menutup popup
function closePopup() {
    document.getElementById('popupTambahKategori').style.display = 'none';
}

// Fungsi untuk menampilkan popup
function showPopup() {
    document.getElementById('popupTambahKategori').style.display = 'block';
}