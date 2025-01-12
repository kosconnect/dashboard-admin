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

// GET Boarding Houses and Populate Table
function fetchBoardingHouses() {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    fetch('https://kosconnect-server.vercel.app/api/boardingHouses/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            console.log(response);  // Tambahkan ini untuk debug
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Data boarding houses:", data);

            const tbody = document.querySelector('table tbody');
            if (!tbody) {
                console.error("Elemen tbody tidak ditemukan di DOM.");
                return;
            }

            // Kosongkan tabel sebelum menambah data baru
            tbody.innerHTML = '';

            // Loop data dan tambahkan ke tabel
            data.data.forEach((house, index) => {
                const tr = document.createElement('tr');

                // Simpan ID boarding house di atribut data-id
                tr.setAttribute('data-id', house.boarding_house_id);

                // Kolom No
                const tdNo = document.createElement('td');
                tdNo.textContent = index + 1;
                tr.appendChild(tdNo);

                // Kolom Nama Pemilik dan ID
                const tdOwnerId = document.createElement('td');
                tdOwnerId.textContent = `Owner ID: ${house.owner_id}`;  // Menampilkan Owner ID
                tr.appendChild(tdOwnerId);

                // Kolom Fasilitas
                const tdFacilities = document.createElement('td');
                tdFacilities.textContent = house.facilities_id.join(", ");  // Menampilkan ID fasilitas
                tr.appendChild(tdFacilities);

                // Kolom Alamat
                const tdAddress = document.createElement('td');
                tdAddress.textContent = house.address || 'N/A';
                tr.appendChild(tdAddress);

                // Kolom Long & Lat
                const tdCoordinates = document.createElement('td');
                tdCoordinates.textContent = `${house.longitude}, ${house.latitude}`;
                tr.appendChild(tdCoordinates);

                // Kolom Foto
                const tdPhoto = document.createElement('td');
                if (house.images.length > 0) {
                    const img = document.createElement('img');
                    img.src = house.images[0];  // Menampilkan gambar pertama
                    img.alt = "Boarding House Image";
                    img.style.width = "100px";  // Mengatur ukuran gambar
                    tdPhoto.appendChild(img);
                } else {
                    tdPhoto.textContent = 'No Image';
                }
                tr.appendChild(tdPhoto);

                // Kolom Aksi
                const tdAction = document.createElement('td');
                tdAction.innerHTML = `
                    <button class="btn btn-primary"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn btn-primary"><i class="fas fa-trash"></i> Hapus</button>
                `;
                tr.appendChild(tdAction);

                // Tambahkan baris ke tabel
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error("Gagal mengambil data boarding houses:", error);
        });
}

// Panggil fungsi fetch ketika halaman dimuat
document.addEventListener('DOMContentLoaded', fetchBoardingHouses);
