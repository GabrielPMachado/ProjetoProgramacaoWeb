const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("keypress", function (e) {
    // Só age ao pressionar Enter
    if (e.key === "Enter") {
      const value = searchInput.value.trim();

      // Ignora se o campo estiver vazio
      if (value === "") return;

      // TODO: implementar busca real
      console.log("Buscar por:", value);
    }
  });
}
