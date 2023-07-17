const mongodb = require('mongodb');

const db = require('../data/database');

class Order {
  // Status => pending, fulfilled, cancelled
  constructor(cart, userData, status = 'pending', date, orderId) {
    this.productData = cart;
    this.userData = userData;
    this.status = status;
    this.date = new Date(date);
    if (this.date) {
      this.formattedDate = this.date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    this.id = orderId;/*if we want to update a order in future, we will need an order id */
  }

  /*this simply takes order data object from database and transform into an object based on orders class.This is a part of below transformOrderDocuments
  code, we have only refracted this, so thAt becomes leaner */
  static transformOrderDocument(orderDoc) {
    return new Order(
      orderDoc.productData,
      orderDoc.userData,
      orderDoc.status,
      orderDoc.date,
      orderDoc._id
    );
  }
  
///orderDocs will be an array retrived from db
  static transformOrderDocuments(orderDocs) {
    return orderDocs.map(this.transformOrderDocument);
    /** same as
     * return orderDocs.map(function (orderDoc){
        return new Order (orderDoc)
        //where orderDoc represents single item of array
    */
  }

  static async findAll() {
    const orders = await db
      .getDb()
      .collection('orders')
      .find()
      .sort({ _id: -1 }) //sorting in descending order in order of orders placed cuz here _id: refers to orderID
      .toArray();

    return this.transformOrderDocuments(orders);
  }

  static async findAllForUser(userId) {
    const uid = new mongodb.ObjectId(userId);

    const orders = await db
      .getDb()
      .collection('orders')
      .find({ 'userData._id': uid })
      .sort({ _id: -1 })
      .toArray();

    return this.transformOrderDocuments(orders);
  }

  static async findById(orderId) {
    const order = await db
      .getDb()
      .collection('orders')
      .findOne({ _id: new mongodb.ObjectId(orderId) });

    return this.transformOrderDocument(order);/**transformOrderDocument is called because in this case we will only get a single object from database */
  }

  //no async and await here cuz we are not doing anything thereafter
  save() {
    //updating status of order
    if (this.id) {
      const orderId = new mongodb.ObjectId(this.id);
      return db
        .getDb()
        .collection('orders')
        .updateOne({ _id: orderId }, { $set: { status: this.status } });
    } else {
        //inserting new order in database
      const orderDocument = {
        userData: this.userData,
        productData: this.productData,
        date: new Date(),
        status: this.status,
      };

      return db.getDb().collection('orders').insertOne(orderDocument);
    }
  }
}

module.exports = Order;