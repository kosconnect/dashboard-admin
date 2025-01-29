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
    container.innerHTML = ""; // Bersihkan kontainer

    if (boardingHouses.length === 0) {
        container.innerHTML = `<div class="card"><p>Tidak ada boarding house yang ditemukan.</p></div>`;
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
                <button class="btn btn-primary" onclick="deleteBoardingHouse('${boarding_house_id}')">Hapus</button>
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

// async function populateFormFields() {
//     try {
//         const owners = await fetchOwners();
//         const categories = await fetchCategories();
//         const facilities = await fetchFacilities();

//         const ownerSelect = document.getElementById("ownerKos");
//         const categorySelect = document.getElementById("categoryKos");
//         const facilitySelect = document.getElementById("fasilitasKos");

//         if (!ownerSelect || !categorySelect || !facilitySelect) {
//             console.error("Dropdown tidak ditemukan di halaman.");
//             return;
//         }

//         ownerSelect.innerHTML = `<option value="">Pilih Owner</option>`;
//         owners.forEach(owner => {
//             ownerSelect.innerHTML += `<option value="${owner.id}">${owner.full_name}</option>`;
//         });

//         categorySelect.innerHTML = `<option value="">Pilih Kategori</option>`;
//         categories.forEach(category => {
//             categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
//         });

//         facilitySelect.innerHTML = `<option value="">Pilih Fasilitas</option>`;
//         facilities.forEach(facility => {
//             facilitySelect.innerHTML += `<option value="${facility.id}">${facility.name}</option>`;
//         });
//     } catch (error) {
//         console.error("Error mengisi dropdown:", error);
//     }
// }

// Panggil fungsi populateFormFields saat halaman dimuat
document.addEventListener("DOMContentLoaded", async () => {
    await populateFormFields();
});

// Fungsi untuk mengirim data boarding house (POST)
async function addBoardingHouse(formData) {
    try {
        const authToken = getCookie("authToken");

        const response = await fetch("https://kosconnect-server.vercel.app/api/boardingHouses/", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            body: formData, // Kirim sebagai FormData, bukan JSON
        });

        if (!response.ok) {
            throw new Error("Gagal menambahkan boarding house");
        }

        const data = await response.json();
        if (data.success) {
            alert("Boarding House berhasil ditambahkan");
            window.location.reload();
        } else {
            alert(data.error || "Terjadi kesalahan");
        }
    } catch (error) {
        console.error("Error saat menambahkan boarding house:", error);
        alert("Gagal menambahkan boarding house");
    }
}

function submitAddBoardingHouseForm(event) {
    event.preventDefault();

    const formData = new FormData();

    formData.append("name", document.getElementById("namaKos").value);
    formData.append("address", document.getElementById("alamatKos").value);
    formData.append("description", document.getElementById("descriptionKos").value);
    formData.append("rules", document.getElementById("rulesKos").value);
    formData.append("category_id", document.getElementById("categoryKos").value);
    formData.append("owner_id", document.getElementById("ownerKos").value);
    formData.append("latitude", document.getElementById("latitudeKos").value);
    formData.append("longitude", document.getElementById("longitudeKos").value);

    const selectedFacilities = Array.from(document.getElementById("fasilitasKos").selectedOptions)
        .map(option => option.value);
    selectedFacilities.forEach(facility => formData.append("facilities[]", facility));

    // Ambil file gambar dan pastikan format benar
    const imageFiles = document.getElementById("imagesKos").files;
    if (imageFiles.length > 5) {
        alert("Maksimal hanya bisa memilih 5 gambar untuk boarding house.");
        return;
    }
    
    for (let i = 0; i < imageFiles.length; i++) {
        formData.append("images[]", imageFiles[i]); // Menggunakan "images[]" agar server mengenali sebagai array
    }

    console.log("FormData sebelum dikirim:", [...formData.entries()]); // Debugging
    addBoardingHouse(formData);
}


// document.getElementById("imagesKos").addEventListener("change", function () {
//     const maxImages = 5;
//     const images = this.files;
    
//     if (images.length > maxImages) {
//         alert(`Maksimal hanya bisa memilih ${maxImages} gambar untuk boarding house.`);
//         this.value = ""; // Reset input file
//         return; //  Sekarang return berada dalam fungsi
//     }
// });


document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formTambahKos");
    if (form) {
        form.addEventListener("submit", submitAddBoardingHouseForm);
    } else {
        console.error("Form tambah kos tidak ditemukan.");
    }
});
