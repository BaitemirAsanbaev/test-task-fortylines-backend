const express = require("express");
const bodyParser = require("body-parser");

const categoryRouter = require("./controller/category-controller");
const productRouter = require("./controller/product-controller");
const cors = require("cors");
const { sequelize } = require("./models/Models");

const app = express();
const port = 5000;


sequelize.sync();

// Middleware for parsing request body
app.use(cors({
    credentials:true,
    origin:"*"
}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/category", categoryRouter)
app.use("/products", productRouter)


// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
