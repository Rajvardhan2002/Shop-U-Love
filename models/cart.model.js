const Product = require('./product.model');

class Cart {
  constructor(items = [], totalqty = 0, totalPrice = 0) {
    this.items = items;
    this.totalQuantity = totalqty;
    this.totalPrice = totalPrice;
  }

  /*updating prices during an order placing , if we changethe price or let's say it's not available in store anymore. 
  SO, our user doesn't purchases items with wrong prices. We can call this fxn inside our middleware so that we can app.use it and hence every
  request will be filtered with that middleware
  
  1.We find all the ids of products that is present in our cart.To do so, we first created a helper fxn which takes all the array
  present in our session by accessing this.items and call a map fxn whichin turn returns us an array full of productIDs.

  2.Then we find all the products using findMultiple fxn we declared in Products class which returns a product array in which every item is based
  on product blueprint.

  3.Then we created an empty array in which we will later push items which we wanna delete.

  4.
  */
  async updatePrices() {
    const productIds = this.items.map(function (item) {
      return item.product.id;// returns an array with product ids of all the products in the cart
    });

    const products = await Product.findMultiple(productIds);

    const deletableCartItemProductIds = [];

    for (const cartItem of this.items) {
      /*the first element in the array that satisfies the provided condition. It checks all the elements of the array and whichever the 
      first element satisfies the condition is going to print.  */
      const product = products.find(function (prod) {
        return prod.id === cartItem.product.id;//if this condition satisfies then return
      });

      if (!product) {
        //if we don't get any product this means it's not available any more. SO, we need to delete it from cart.
        // product was deleted!
        // "schedule" for removal from cart
        deletableCartItemProductIds.push(cartItem.product.id);
        continue;
      }

      // product was not deleted
      // set product data and total price to latest price from database
      cartItem.product = product;
      cartItem.totalPrice = cartItem.quantity * cartItem.product.price;
    }

    if (deletableCartItemProductIds.length > 0) {
      this.items = this.items.filter(function (item) {
        return deletableCartItemProductIds.indexOf(item.product.id) < 0;
      });
    }

    // re-calculate cart totals
    this.totalQuantity = 0;
    this.totalPrice = 0;

    for (const item of this.items) {
      this.totalQuantity = this.totalQuantity + item.quantity;
      this.totalPrice = this.totalPrice + item.totalPrice;
    }
  }






  addItem(productParameter) {
    //productParameter is an object full of data (retrived from database and then converted into an object based on class Products)
    const cartItem = {
      product: productParameter,
      quantity: 1, // initially
      totalPrice: productParameter.price,
    };
    //If we have same product already added in the cart then we just need to modify our cartItem object and then replace this with old one.
    for (let i = 0; i < this.items.length; i++) {
      let itemObject = this.items[i];
      if (itemObject.product.id === productParameter.id) {
        cartItem.quantity = +itemObject.quantity + 1;
        cartItem.totalPrice = itemObject.totalPrice + productParameter.price;
        //this new modified cartItem object is replaced with old cartItem that was put initially.
        this.items[i] = cartItem;

        this.totalQuantity++;
        this.totalPrice += productParameter.price;
        return;
      }
    }
    this.items.push(cartItem);
    this.totalQuantity++;
    this.totalPrice += productParameter.price;
  }

  updateItem(productId, newQuantity) {
    for (let i = 0; i < this.items.length; i++) {
      let itemObject = this.items[i];

      if (itemObject.product.id === productId && newQuantity > 0) {
        const cartItem = { ...itemObject };
        const changeInQuantity = newQuantity - itemObject.quantity;
        cartItem.quantity = newQuantity;
        cartItem.totalPrice = newQuantity * itemObject.product.price;
        //this new modified cartItem object is replaced with old cartItem that was put initially.
        this.items[i] = cartItem;

        this.totalQuantity += changeInQuantity;
        this.totalPrice += changeInQuantity * itemObject.product.price; // price of all the items available in the cart
        return { updatedItemPrice: cartItem.totalPrice }; // price of single type of item which gets updated
      } else if (itemObject.product.id === productId && newQuantity <= 0) {
        this.items.splice(i, 1); // seedha wo item array se remove hogaya so no need to update that anymore
        this.totalQuantity = this.totalQuantity - itemObject.quantity;
        this.totalPrice -= itemObject.totalPrice;
        return { updatedItemPrice: 0 }; // we definetly doesn't want to again loop through and then match id and then send price, therefore sending it so that we can access this later.
      }
    }
  }
}

module.exports = Cart;
