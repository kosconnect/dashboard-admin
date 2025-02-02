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

// Objek untuk menyimpan daftar owner (owner_id -> name)
const ownerMap = new Map();

// Fungsi untuk Fetch Data Owner
async function fetchOwners() {
    const jwtToken = getJwtToken();
    if (!jwtToken) return console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");

    try {
        const response = await fetch('https://kosconnect-server.vercel.app/api/users/owner', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const owners = await response.json();
        owners.forEach(owner => {
            ownerMap.set(owner.user_id, owner.fullname);
        });

        populateOwnerDropdown();

    } catch (error) {
        console.error("Gagal mengambil data owner:", error);
    }
}

// Fungsi untuk Populate Dropdown Owner
function populateOwnerDropdown() {
    const ownerDropdown = document.getElementById("ownerFasilitas");
    if (!ownerDropdown) {
        console.error("Element #ownerFasilitas tidak ditemukan!");
        return;
    }

    ownerDropdown.innerHTML = '<option value="" disabled selected>Pilih Owner</option>';

    ownerMap.forEach((fullname, user_id) => {
        const option = document.createElement("option");
        option.value = user_id;
        option.textContent = fullname;
        ownerDropdown.appendChild(option);
    });
}

// Fungsi untuk Fetch Data Custom Facilities dan Populate Table
async function fetchCustomFacilities() {
    const jwtToken = getJwtToken();
    if (!jwtToken) return console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");

    try {
        const response = await fetch('https://kosconnect-server.vercel.app/api/customFacilities/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log("Data fasilitas khusus:", data);

        const tbody = document.querySelector('table tbody');
        if (!tbody) return console.error("Elemen tbody tidak ditemukan di DOM.");

        tbody.innerHTML = '';

        data.forEach((fasilitas, index) => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-id', fasilitas.custom_facility_id);

            const tdNo = document.createElement('td');
            tdNo.textContent = index + 1;
            tr.appendChild(tdNo);

            const tdNama = document.createElement('td');
            tdNama.textContent = fasilitas.name || 'N/A';
            tr.appendChild(tdNama);

            const tdHarga = document.createElement('td');
            tdHarga.textContent = fasilitas.price ? `Rp ${fasilitas.price.toLocaleString('id-ID')}` : 'N/A';
            tr.appendChild(tdHarga);

            const tdOwner = document.createElement('td');
            tdOwner.textContent = ownerMap.get(fasilitas.owner_id) || 'Tidak Diketahui';
            tr.appendChild(tdOwner);

            const tdAksi = document.createElement('td');
            tdAksi.innerHTML = `
                <button class="btn btn-primary"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn btn-primary"><i class="fas fa-trash"></i> Hapus</button>
            `;
            tr.appendChild(tdAksi);

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Gagal mengambil data fasilitas khusus:", error);
    }
}

// Fungsi untuk handle submit form tambah fasilitas custom
document.getElementById("formTambahFasilitasCustom").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("namaFasilitasTambah").value.trim();
    const price = parseInt(document.getElementById("hargaFasilitasTambah").value, 10);
    const ownerId = document.getElementById("ownerFasilitas").value;

    if (!name || isNaN(price) || !ownerId) {
        alert("Semua field harus diisi dengan benar!");
        return;
    }

    const jwtToken = getJwtToken();
    if (!jwtToken) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    const formData = {
        name,
        price,
        owner_id: ownerId
    };

    console.log("Mengirim data fasilitas custom:", formData);

    try {
        const response = await fetch('https://kosconnect-server.vercel.app/api/customFacilities/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const responseText = await response.text();
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status} - ${responseText}`);

        const data = JSON.parse(responseText);
        alert("Fasilitas custom berhasil ditambahkan!");
        closePopup();
        await fetchCustomFacilities();

    } catch (error) {
        console.error("Gagal menambah fasilitas custom:", error);
        alert(`Terjadi kesalahan: ${error.message}`);
    }
});

// Panggil fungsi saat halaman dimuat
document.addEventListener("DOMContentLoaded", async () => {
    await fetchOwners();
    await fetchCustomFacilities();
});

// Popup control
document.addEventListener("DOMContentLoaded", function () {
    window.openPopup = function () {
        document.getElementById("popupTambahFasilitasCustom").style.display = "block";
    }

    window.closePopup = function () {
        document.getElementById("popupTambahFasilitasCustom").style.display = "none";
    }
});
