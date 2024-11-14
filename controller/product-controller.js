const { Product, Category } = require("../models/Models");
const express = require("express");
const productRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API for managing products
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Fetch all products with their associated category
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products with categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                   image:
 *                     type: string
 *                   isFav:
 *                     type: boolean
 *                   categoryId:
 *                     type: integer
 *                   category:
 *                     $ref: '#/components/schemas/Category'
 */
productRouter.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      include: { model: Category, as: "category" },
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Fetch a product by ID with its associated category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
productRouter.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: { model: Category, as: "category" },
    });
    product ? res.json(product) : res.status(404).json({ message: "Product not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *               image:
 *                 type: string
 *               isFav:
 *                 type: boolean
 *             required:
 *               - name
 *               - price
 *               - categoryId
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Required fields are missing
 */
productRouter.post("/", async (req, res) => {
  try {
    const { name, description, price, categoryId, image, isFav } = req.body;
    if (!name || !price || !categoryId) {
      return res.status(400).json({ message: "Name, price, and category are required" });
    }
    const product = await Product.create({ name, description, price, categoryId, image, isFav });
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create product" });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update an existing product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *               image:
 *                 type: string
 *               isFav:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Required fields are missing
 *       404:
 *         description: Product not found
 */
productRouter.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const { name, description, price, categoryId, image, isFav } = req.body;
    if (!name || !price || !categoryId) {
      return res.status(400).json({ message: "Name, price, and category are required" });
    }
    await product.update({ name, description, price, categoryId, image, isFav });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update product" });
  }
});

/**
 * @swagger
 * /products/toggle-fav/{id}:
 *   patch:
 *     summary: Toggle the favorite status of a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Favorite status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
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

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Product not found
 */
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
