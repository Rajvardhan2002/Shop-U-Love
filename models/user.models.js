const bcrypt = require("bcryptjs");
const db = require("../data/database");
const mongodb = require('mongodb')
class User {
  constructor(email, password, name, street, postal, city) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.address = {
      street: street,
      postalcode: postal,
      city: city,
    };
  }
  
  static  getUserById(userId){
    const userMongoId = new mongodb.ObjectId(userId)
    return db.getDb().collection("users").findOne({ _id : userMongoId },{projection :{password : 0}});
  }

  getUserWithSameEmail() {
    return db.getDb().collection("users").findOne({ email: this.email });
  }

  async existsAlready() {
    const existingUser = await this.getUserWithSameEmail();
    if (existingUser) {
      return true;
    }
    return false;
  }

  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    await db.getDb().collection("users").insertOne({
      email: this.email,
      password: hashedPassword,
      name: this.name,
      address: this.address,
    });
  }

  hasmatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }
}

module.exports = User;
