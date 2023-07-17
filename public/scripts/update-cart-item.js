const cartItemUpdateFormElement = document.querySelectorAll(
  ".cart-item-management"
);
const totalPriceOfCartElement = document.getElementById("cart-total-price");
const cartBadgeElements = document.querySelectorAll(".nav-items .badge");

async function updateItemInCart(event) {
  event.preventDefault(); // default form submission.
  const form = event.target;
  const prodid = form.dataset.productid;
  const csrfToken = form.dataset.csrf;
  const quantity = form.firstElementChild.value;
  let response;
  try {
    response = await fetch("/cart/items", {
      method: "PATCH",
      body: JSON.stringify({
        _csrf: csrfToken,
        productId: prodid,
        newQuantity: quantity,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("Something went wrong!");
    return;
  }

  if (!response.ok) {
    alert("Something went wrong!");
    return;
  }

  const responseData = await response.json();

  const newTotalQuantity = responseData.updatedCart.newTotalQuantity;
  const newTotalPrice = responseData.updatedCart.newTotalPrice;
  const newItemPrice = responseData.updatedCart.newItemPrice;

  if (newItemPrice === 0) {
    form.parentElement.parentElement.remove();
  } else {
    const cartItemTotalPriceElement =
      form.parentElement.querySelector(".cart-item-price");
    cartItemTotalPriceElement.textContent = newItemPrice.toFixed(2);
  }

  totalPriceOfCartElement.textContent = newTotalPrice.toFixed(2);
for(const cartBadgeElement of cartBadgeElements){
  cartBadgeElement.textContent = newTotalQuantity;
}
  
}

for (const updateForm of cartItemUpdateFormElement) {
  updateForm.addEventListener("submit", updateItemInCart);
}
