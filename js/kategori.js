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
document.addEventListener('DOMContentLoaded', function () {
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
    
            const tbody = document.querySelector('#categories-table-body');
            if (!tbody) {
                console.error("Elemen tbody tidak ditemukan di DOM.");
                return;
            }
    
            tbody.innerHTML = ''; // Kosongkan tabel
    
            data.forEach((kategori, index) => {
                const tr = document.createElement('tr');
    
                // Cek apakah kategori memiliki category_id dan name
                const categoryId = kategori.category_id;  // Pastikan field sesuai dengan respons
                const categoryName = kategori.name || 'Tidak ada nama';
    
                // Kolom No
                const tdNo = document.createElement('td');
                tdNo.textContent = index + 1;
                tr.appendChild(tdNo);
    
                // Kolom Nama Kategori
                const tdNamaKategori = document.createElement('td');
                tdNamaKategori.textContent = categoryName;
                tr.appendChild(tdNamaKategori);
    
                // Kolom Aksi
                const tdAksi = document.createElement('td');
                tdAksi.innerHTML = `
                    <button class="btn btn-primary" onclick="showPopupEdit('${categoryId}', '${categoryName}')"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn btn-primary" onclick="showPopupDelete('${categoryId}')"><i class="fas fa-trash"></i> Hapus</button>
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

// Fungsi untuk menangani submit formulir tambah kategori
document.getElementById('formTambahKategori').addEventListener('submit', function (event) {
    event.preventDefault(); // Mencegah reload halaman saat form disubmit

    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    const namaKategori = document.getElementById('namaKategori').value.trim();
    if (!namaKategori) {
        alert("Nama kategori tidak boleh kosong!");
        return;
    }

    const requestBody = {
        name: namaKategori
    };

    // Kirim permintaan POST ke API
    fetch('https://kosconnect-server.vercel.app/api/categories/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
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
            console.log("Kategori berhasil ditambahkan:", data);
            alert("Kategori berhasil ditambahkan!");
            
            // Perbarui tabel kategori
            fetchCategories(jwtToken);
            
            // Tutup popup
            closePopup();
        })
        .catch(error => {
            console.error("Gagal menambahkan kategori:", error);
            alert(`Gagal menambahkan kategori: ${error.message}`);
        });
});

function closePopup() {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => {
        popup.style.display = 'none';
    });
}
