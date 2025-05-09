const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const galleryItems = document.querySelectorAll(".gallery-item img");
const closeBtn = document.getElementsByClassName("close")[0];

galleryItems.forEach((item) => {
  item.onclick = function () {
    modal.style.display = "block";
    modalImg.src = this.src;
  };
});

closeBtn.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

window.addEventListener("scroll", () => {
  const productos = document.querySelectorAll(".producto");
  const galleryItems = document.querySelectorAll(".gallery-item");

  productos.forEach((producto) => {
    const rect = producto.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      producto.style.opacity = 1;
    }
  });

  galleryItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      item.style.opacity = 1;
    }
  });
});
