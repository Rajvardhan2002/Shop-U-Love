const mongodb = require("mongodb");
const db = require("../data/database");

class Product {
  constructor(productData) {
    (this.title = productData.title),
      (this.summary = productData.summary),
      (this.price = +productData.price), ////converting string to number cuz we want price as numtype in our database
      (this.description = productData.description),
      (this.image = productData.image); //gives us filename of images
    this.updateImageData();
    if (productData._id) {
      this.id =
        productData._id.toString(); /* we are adding this cuz while mapping we will recieve an _id which can then be used to create 
        dynamic paths which will be used to view that*/
    }
  }

  updateImageData() {
    this.imagePath = `product-data/images/${this.image}`; //used to serve images
    this.imageUrl = `/products/assets/images/${this.image}`; /*used to handle frontend submissions cuz we don't want to be so predictive 
    that attackers can guess path to our images and change them. That's why we create an alternate path to serve our frontend images that can
    be same as well as something totally of our choice.*/
  }

  static async findByID(productId) {
    let productObjectId;
    try {
      productObjectId = new mongodb.ObjectId(productId);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    const product = await db
      .getDb()
      .collection("products")
      .findOne({ _id: productObjectId });

    if (!product) {
      const error = new Error(
        "Sorry, could not find product with provided id."
      );
      error.code = 404;
      throw error;
    }
    //   return product; error bcz we are using products.id in update-product.ejs which isn't available in DB object.
    return new Product(product);
  }





  static async findMultiple(ids) {
    const productIds = ids.map(function(id) {
      return new mongodb.ObjectId(id);
    })
    
    const products = await db
      .getDb()
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray();

    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }






  static async findAll() {
    const products = await db.getDb().collection("products").find({}).toArray();
    //products.map return a new array by changing each single item changed as we did.
    return products.map(function (productDocument) {
      return new Product(productDocument); //returns an object based on class Products
    });
  }

  //Used for inserting new product inside database
  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image, //filename of image
      /**only storing filename in our db because whenever we upadate any path or change the folder,  it will be hard to update in db.
        also, we can construct this easily in our code whenever needed.
       */
    };

    if (this.id) {
      const prodIDInMongoObj = new mongodb.ObjectId(this.id);
      if (!this.image) {
        delete productData.image;
      }
      await db
        .getDb()
        .collection("products")
        .updateOne({ _id: prodIDInMongoObj }, { $set: productData });
    } else {
      await db.getDb().collection("products").insertOne(productData);
    }
  }

  //fxn to replace image cuz sometimes admin uploads image and sometimes he doesn't thus we totally need a different fxn to handle this
  async replaceImage(newImage) {
    //new image evaluates to name of image i.e. req.file.filename
    this.image = newImage;
    this.updateImageData();
  }

 async deleteExistingProduct() {
    const prodIDInMongoObj = new mongodb.ObjectId(this.id);
    await db
      .getDb()
      .collection("products")
      .deleteOne({ _id: prodIDInMongoObj });
  }
}

module.exports = Product;
