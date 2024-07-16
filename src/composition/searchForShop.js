export default function searchForShop(callback) {
  const searchInput = document.querySelector('.searchBar');
  const dropdown = document.getElementById('dropdown');
  const content = JSON.parse(localStorage.shops);

  searchInput.addEventListener('input', () => {
    const searchQuery = searchInput.value.toLowerCase();
    const filteredContent = content.filter((item) => item.shopAddress.toLowerCase().includes(searchQuery));

    // Clear dropdown
    dropdown.innerHTML = '';

    // Add matched items to dropdown
    filteredContent.forEach((item) => {
      const option = document.createElement('a');
      const newLine = document.createElement('br');
      const hr = document.createElement('hr');

      option.textContent = item.shopAddress;

      option.onclick = () => { callback(item); };
      dropdown.appendChild(option);
      dropdown.appendChild(newLine);
      dropdown.appendChild(hr);
    });

    // Show dropdown if there are matched items, otherwise hide it
    dropdown.style.display = (filteredContent.length > 0) ? 'block' : 'none';
    document.querySelector("ion-icon[name='close']").style.display = dropdown.style.display === 'block' ? 'inline-block' : 'none';
  });
}
