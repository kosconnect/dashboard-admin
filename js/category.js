
// Fungsi untuk menutup semua popup
function closePopup() {
    // Menutup semua popup yang ada
    document.querySelectorAll('.popup').forEach(popup => {
        popup.style.display = 'none';
    });
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
        data.forEach((kategori, index) => {
            const tr = document.createElement('tr');
        
            // Kolom No (Nomor Urut)
            const tdNo = document.createElement('td');
            tdNo.textContent = index + 1; // Mulai dari 1
            tr.appendChild(tdNo);
        
            // Kolom Nama Kategori
            const tdNamaKategori = document.createElement('td');
            tdNamaKategori.textContent = kategori.name || 'Tidak ada nama';
            tr.appendChild(tdNamaKategori);
        
            // Kolom Slug Kategori
            const tdSlugKategori = document.createElement('td');
            tdSlugKategori.textContent = kategori.slug || 'Tidak ada slug';
            tr.appendChild(tdSlugKategori);
            
            // Kolom Aksi
            const tdAksi = document.createElement('td');
            tdAksi.innerHTML = `
                <button class="btn btn-primary" onclick="showPopupEdit('${kategori.id}', '${kategori.name}', '${kategori.slug}')"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn btn-primary" onclick="showPopupDelete('${kategori.id}')"><i class="fas fa-trash"></i> Hapus</button>
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


// Fungsi untuk menampilkan popup Edit dan mengisi data kategori
function showPopupEdit(categoryId, categoryName) {
    document.getElementById('popupEditKategori').style.display = 'block';

    // Isi input tersembunyi untuk ID kategori
    document.getElementById('editCategoryId').value = categoryId;

    // Isi input nama kategori untuk diedit
    document.getElementById('editNamaKategori').value = categoryName;
}


// PUT
// Fungsi untuk memperbarui kategori
function updateCategory(categoryId, updatedName) {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    fetch(`https://kosconnect-server.vercel.app/api/categories/${categoryId}`, {
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
            console.log("Kategori berhasil diperbarui:", data);
            alert('Kategori berhasil diperbarui!');
            closePopup();  // Tutup popup setelah sukses
            fetchCategories();  // Panggil ulang untuk memperbarui tabel
        })
        .catch(error => {
            console.error("Gagal memperbarui kategori:", error);
            alert('Gagal memperbarui kategori.');
        });
}

// Event listener untuk form edit kategori
document.getElementById('formEditKategori').addEventListener('submit', function (e) {
    e.preventDefault(); // Mencegah reload halaman

    const categoryId = document.getElementById('editCategoryId').value; // Ambil ID kategori
    const updatedName = document.getElementById('editNamaKategori').value; // Ambil nama kategori baru

    // Panggil fungsi untuk mengupdate data
    updateCategory(categoryId, updatedName);
});


let selectedCategoryId = null;  // Menyimpan ID kategori yang dipilih

// Fungsi untuk menampilkan popup Hapus Kategori
function showPopupDelete(categoryId) {
    selectedCategoryId = categoryId; // Simpan ID kategori yang dipilih
    document.getElementById('popupHapusKategori').style.display = 'block'; // Tampilkan popup
    console.log("Category ID untuk dihapus:", selectedCategoryId); // Debug log
}

// DELETE
function executeDelete() {
    if (!selectedCategoryId) {
        console.error("ID kategori tidak valid.");
        return;
    }

    const jwtToken = getJwtToken();  // Ambil token JWT
    if (!jwtToken) {
        console.error("Token tidak ditemukan, tidak dapat melanjutkan permintaan.");
        return;
    }

    // Kirim permintaan DELETE ke API untuk menghapus kategori
    fetch(`https://kosconnect-server.vercel.app/api/categories/${selectedCategoryId}`, {
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
            console.log("Kategori berhasil dihapus:", data);
            alert("Kategori berhasil dihapus!");
            closePopup(); // Tutup popup
            fetchCategories(); // Refresh tabel kategori setelah penghapusan
        })
        .catch(error => {
            console.error("Gagal menghapus kategori:", error);
            alert("Gagal menghapus kategori.");
        });
}
