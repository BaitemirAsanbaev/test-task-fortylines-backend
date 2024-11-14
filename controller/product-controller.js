const { Product, Category } = require("../models/Models");
const express = require("express");
const productRouter = express.Router();

// Fetch all products with their associated category
productRouter.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      include: {
        model: Category,
        as: "category", // Assuming you have the alias defined in your associations
      },
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// Fetch a product by its ID with its associated category
productRouter.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: {
        model: Category,
        as: "category",
      },
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

// Create a new product
productRouter.post("/", async (req, res) => {
  try {
    const { name, description, price, categoryId, image, isFav } = req.body;
    if (!name || !price || !categoryId) {
      return res
        .status(400)
        .json({ message: "Name, price, and category are required" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      categoryId, // Assuming categoryId is passed in the request body
      image,
      isFav,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create product" });
  }
});

// Update an existing product by ID
productRouter.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validate input before updating
    const { name, description, price, categoryId, image, isFav } = req.body;
    if (!name || !price || !categoryId) {
      return res
        .status(400)
        .json({ message: "Name, price, and category are required" });
    }

    await product.update({
      name,
      description,
      price,
      categoryId,
      image,
      isFav,
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update product" });
  }
});

productRouter.patch("/toggle-fav/:id", async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      product.isFav = !product.isFav;
      await product.save();
  
      res.json({ message: "Favorite status toggled successfully", product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });
  

// Delete a product by ID
productRouter.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

module.exports = productRouter;
