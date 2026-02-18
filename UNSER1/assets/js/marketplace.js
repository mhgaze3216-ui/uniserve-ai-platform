const filters = document.querySelectorAll(".filter");
const products = document.querySelectorAll(".product");

filters.forEach(filter => {
  filter.addEventListener("click", () => {
    filters.forEach(f => f.classList.remove("active"));
    filter.classList.add("active");

    const category = filter.dataset.category;

    products.forEach(product => {
      if (category === "all" || product.dataset.category === category) {
        product.style.display = "flex";
      } else {
        product.style.display = "none";
      }
    });
  });
});
