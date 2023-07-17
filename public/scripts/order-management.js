const updateOrderFormElements = document.querySelectorAll(
    '.order-actions form'
  );
  
  async function updateOrder(event) {
    event.preventDefault();
    const form = event.target;
  
    const formData = new FormData(form);//gives us access to all the elements having name attribute in an object format based on FormData
    const newStatus = formData.get('status');//status is name attribute of select element i.e. our drop-down list
    const orderId = formData.get('orderid');//hidden html element. Previously we have used dataset to achieve this. THis time we just added a hidden input field.
    const csrfToken = formData.get('_csrf'); // 
  
    let response;
  
    try {
      response = await fetch(`/admin/orders/${orderId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          newStatus: newStatus,
          _csrf: csrfToken,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      alert('Something went wrong - could not update order status.');
      return;
    }
  
    if (!response.ok) {
      alert('Something went wrong - could not update order status.');
      return;
    }
  
    const responseData = await response.json();
  
    form.parentElement.parentElement.querySelector('.badge').textContent =
      responseData.newStatus.toUpperCase();
  }
  
  for (const updateOrderFormElement of updateOrderFormElements) {
    updateOrderFormElement.addEventListener('submit', updateOrder);
  }