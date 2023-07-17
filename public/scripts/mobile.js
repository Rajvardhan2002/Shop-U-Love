const mobileMenuBtnElement = document.getElementById("mobile-menu-btn");
const monileMenuElememt = document.getElementById("mobile-menu");

function toggleMobileMenu() {
  monileMenuElememt.classList.toggle("open");
}

mobileMenuBtnElement.addEventListener("click", toggleMobileMenu);
