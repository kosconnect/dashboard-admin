function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown-menu');
    // Toggle the display between none and block
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
}

//Function show POP UP
function showPopup() {
    document.getElementById('popupTambahKategori').style.display = 'block';
}

function closePopup() {
    document.getElementById('popupTambahKategori').style.display = 'none';
}

document.getElementById('formTambahKategori').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Kategori berhasil ditambahkan!');
    closePopup();
});

function showPopupEdit() {
    document.getElementById('popupEditKategori').style.display = 'block';
}

function showPopupDelete() {
    document.getElementById('popupHapusKategori').style.display = 'block';
}

function closePopup() {
    document.querySelectorAll('.popup').forEach(popup => popup.style.display = 'none');
}