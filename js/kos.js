// Fungsi untuk membaca nilai cookie berdasarkan nama
function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

// Variabel global untuk menyimpan semua data boarding houses
let allBoardingHouseData = [];

// Fungsi untuk merender tabel boarding house
async function renderBoardingHouseTable(boardingHouses) {
    const container = document.querySelector(".cards-container");
    container.innerHTML = ""; // Menghapus konten sebelumnya

    if (boardingHouses.length === 0) {
        container.innerHTML = `
        <div class="card">
            <p>Tidak ada boarding house yang ditemukan.</p>
        </div>
      `;
        return;
    }

    // Ambil detail untuk setiap boarding house
    for (let boardingHouse of boardingHouses) {
        const { boarding_house_id, images, name, address, description, rules } = boardingHouse;

        // Ambil detail (full_name dan category_name) untuk setiap boarding house
        const detailResponse = await fetch(`https://kosconnect-server.vercel.app/api/boardingHouses/${boarding_house_id}/detail`);
        const detail = await detailResponse.json();
        
        // Ambil data full_name (owner) dan category_name dari detail
        const ownerName = detail[0]?.owner_fullname || "Owner Tidak Diketahui"; // Menggunakan full_name
        const categoryName = detail[0]?.category_name || "Kategori Tidak Diketahui";

    // Membuat card untuk setiap boarding house
    container.innerHTML += `
        <div class="card">
            <img src="${images[0]}" alt="Kos Image" class="card-image">
            <div class="card-content">
                <h3>${name}</h3>
                <p>Alamat: ${address}</p>
                <p>Owner: ${ownerName}</p>
                <p>Kategori: ${categoryName}</p>
                <p>Deskripsi: ${description}</p>
                <p>Aturan: ${rules}</p>

                <h3>Aksi</h3>
                <button class="btn btn-primary" onclick="editBoardingHouse('${boarding_house_id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteBoardingHouse('${boarding_house_id}')">Hapus</button>
            </div>
        </div>
    `;
}
}

// Ambil data boarding house saat halaman dimuat
window.onload = async () => {
    try {
        const authToken = getCookie("authToken");
        const response = await fetch(
            "https://kosconnect-server.vercel.app/api/boardingHouses/",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error("Gagal mengambil data boarding house");
        }

        const data = await response.json(); // Dapatkan data dalam bentuk JSON
        allBoardingHouseData = data.data; // Ambil array dari 'data'
        await renderBoardingHouseTable(allBoardingHouseData);
    } catch (error) {
        console.error("Gagal mengambil data:", error);
    }
};


//POST
// Fungsi untuk mengambil data owner
async function fetchOwners() {
    try {
        const authToken = getCookie("authToken");
        const response = await fetch("https://kosconnect-server.vercel.app/api/users/owner", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        if (!response.ok) {
            throw new Error("Gagal mengambil data owner");
        }
        const data = await response.json();
        return data.data; // Data owner yang diterima
    } catch (error) {
        console.error("Error mengambil data owner:", error);
        return [];
    }
}

// Fungsi untuk mengambil data kategori
async function fetchCategories() {
    try {
        const authToken = getCookie("authToken");
        const response = await fetch("https://kosconnect-server.vercel.app/api/categories/", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        if (!response.ok) {
            throw new Error("Gagal mengambil data kategori");
        }
        const data = await response.json();
        return data.data; // Data kategori yang diterima
    } catch (error) {
        console.error("Error mengambil data kategori:", error);
        return [];
    }
}

// Fungsi untuk mengambil data fasilitas
async function fetchFacilities() {
    try {
        const authToken = getCookie("authToken");
        const response = await fetch("https://kosconnect-server.vercel.app/api/facility/type?type=boarding_house", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        if (!response.ok) {
            throw new Error("Gagal mengambil data fasilitas");
        }
        const data = await response.json();
        return data.data; // Data fasilitas yang diterima
    } catch (error) {
        console.error("Error mengambil data fasilitas:", error);
        return [];
    }
}

// Fungsi untuk mengisi dropdown Owner, Kategori, dan Fasilitas
async function populateFormFields() {
    try {
        const owners = await fetchOwners();
        const categories = await fetchCategories();
        const facilities = await fetchFacilities();

        // Mengisi dropdown Owner
        const ownerSelect = document.getElementById("ownerKos");
        ownerSelect.innerHTML = `<option value="">Pilih Owner</option>`;
        owners.forEach(owner => {
            ownerSelect.innerHTML += `<option value="${owner.id}">${owner.full_name}</option>`;
        });

        // Mengisi dropdown Kategori
        const categorySelect = document.getElementById("categoryKos");
        categorySelect.innerHTML = `<option value="">Pilih Kategori</option>`;
        categories.forEach(category => {
            categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
        });

        // Mengisi dropdown Fasilitas
        const facilitySelect = document.getElementById("fasilitasKos");
        facilitySelect.innerHTML = `<option value="">Pilih Fasilitas</option>`;
        facilities.forEach(facility => {
            facilitySelect.innerHTML += `<option value="${facility.id}">${facility.name}</option>`;
        });
    } catch (error) {
        console.error("Error mengisi dropdown:", error);
    }
}

// Panggil fungsi populateFormFields saat halaman dimuat
window.onload = async () => {
    await populateFormFields();
};

// Fungsi untuk mengirim data boarding house (POST)
async function addBoardingHouse(formData) {
    try {
        const authToken = getCookie("authToken");

        const response = await fetch("https://kosconnect-server.vercel.app/api/boardingHouses/", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData), // Kirim data dalam bentuk JSON
        });

        if (!response.ok) {
            throw new Error("Gagal menambahkan boarding house");
        }

        const data = await response.json();
        if (data.success) {
            alert("Boarding House berhasil ditambahkan");
            window.location.reload(); // Reload halaman untuk menampilkan data terbaru
        } else {
            alert(data.error || "Terjadi kesalahan");
        }
    } catch (error) {
        console.error("Error saat menambahkan boarding house:", error);
        alert("Gagal menambahkan boarding house");
    }
}

// Fungsi untuk mengumpulkan data dari form dan mengirimkan ke server
function submitAddBoardingHouseForm(event) {
    event.preventDefault();

    // Mengambil data dari form
    const formData = {
        name: document.getElementById("namaKos").value,
        address: document.getElementById("alamatKos").value,
        description: document.getElementById("descriptionKos").value,
        rules: document.getElementById("rulesKos").value,
        category_id: document.getElementById("categoryKos").value, // ID kategori
        owner_id: document.getElementById("ownerKos").value, // ID owner
        latitude: document.getElementById("latitudeKos").value,
        longitude: document.getElementById("longitudeKos").value,
        facilities: Array.from(document.getElementById("fasilitasKos").selectedOptions).map(option => option.value), // Fasilitas yang dipilih
        images: document.getElementById("imagesKos").files, // Gambar yang dipilih
    };

    // Mengirim data ke server
    addBoardingHouse(formData);
}

// Tambahkan event listener pada form submit
document.getElementById("formTambahKos").addEventListener("submit", submitAddBoardingHouseForm);
