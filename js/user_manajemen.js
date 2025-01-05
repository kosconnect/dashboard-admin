function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown-menu');
    // Toggle the display between none and block
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
}

function showPopupUbahRole(userName, currentRole) {
    document.getElementById('popupUbahRoleUser').style.display = 'block';
    document.getElementById('userName').value = userName;
    document.getElementById('userRole').value = currentRole;
}

function closePopup() {
    document.querySelectorAll('.popup').forEach(popup => popup.style.display = 'none');
}

function showPopupDelete() {
    document.getElementById('popupHapusRoleUser').style.display = 'block';
}

function closePopup() {
    document.querySelectorAll('.popup').forEach(popup => popup.style.display = 'none');
}

function confirmDelete() {
    alert('Pengguna berhasil dihapus!'); // Ganti dengan fungsi penghapusan yang sesuai.
    closePopup();
}
