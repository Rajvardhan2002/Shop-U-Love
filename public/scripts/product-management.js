const deleteProductsBtnElementArray = document.querySelectorAll(
  ".product-item button"
);

async function deleteProduct(event) {
  const choosedBtn = event.target; // to derive productId and csrf
  const productId = choosedBtn.dataset.productid;
  const csrfToken = choosedBtn.dataset.csrf;

  const response = await fetch(
    '/admin/products/' + productId + "?_csrf=" + csrfToken,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) {
    alert("Oops! Something went wrong. Please try again.");
    return;
  }

  choosedBtn.parentElement.parentElement.parentElement.parentElement.remove(); /*btn's 1st parent was a div then another div then an article tag
  and at last list-item. So, we are basically removing that list-item, whenever we delete a product */
}

for (const deleteBtn of deleteProductsBtnElementArray) {
  deleteBtn.addEventListener("click", deleteProduct);
}
