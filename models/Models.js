const {Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite",
  });



class Category extends Model {}
Category.init(
  {
    name: DataTypes.STRING,
  },
  { sequelize, modelName: "category" }
);


class Product extends Model {}
Product.init(
  {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    price: DataTypes.NUMBER,
    isFav: DataTypes.BOOLEAN,
  },
  { sequelize, modelName: "product" }
);

Product.belongsTo(Category, {
    foreignKey: "categoryId", 
    as: "category", 
});


module.exports = {Category, Product, sequelize}