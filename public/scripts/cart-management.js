const addToCartBtnElement = document.querySelector("#product-details button");
const cartBadgeElements = document.querySelectorAll(".nav-items .badge");

async function addToCart() {
  const productIdWeHaveSetInBtnHtmlTag = addToCartBtnElement.dataset.productid;
  const csrfTokeninBtnHtmlTag = addToCartBtnElement.dataset.csrf;

  let response;
  try {
    response = await fetch("/cart/items", {
      method: "POST",
      body: JSON.stringify({
        productIdkey: productIdWeHaveSetInBtnHtmlTag,
        _csrf: csrfTokeninBtnHtmlTag,
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

  const responseData = await response.json(); //returns data sent as response from fxn we defined in our route, in json format
  const totalItemsInCart = responseData.newTotalItemsInCart;
  for (const cartBadgeElement of cartBadgeElements) {
    cartBadgeElement.textContent = totalItemsInCart;
  }
}

addToCartBtnElement.addEventListener("click", addToCart);
