const { Category } = require("../models/Models");

const Router = require("express").Router
const categoryRouter = new Router()


categoryRouter.get("/", async (req, res) => {
    const category = await Category.findAll();
    res.json(category);
  });
  
  categoryRouter.get("/:id", async (req, res) => {
    const category = await Category.findByPk(req.params.id);
    res.json(category);
  });
  
  categoryRouter.post("/", async (req, res) => {
    const category = await Category.create(req.body);
    res.json(category);
  });
  
  categoryRouter.put("/:id", async (req, res) => {
    const category = await Category.findByPk(req.params.id);
    if (category) {
      await category.update(req.body);
      res.json(category);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  });
  
  categoryRouter.delete("/:id", async (req, res) => {
    const category = await Category.findByPk(req.params.id);
    if (category) {
      await category.destroy();
      res.json({ message: "Category deleted" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  });

  module.exports = categoryRouter