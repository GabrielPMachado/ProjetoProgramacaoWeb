const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      const value = searchInput.value.trim();
      if (value !== "") console.log("Buscar por:", value);
    }
  });
}