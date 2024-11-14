const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

// Create a new mongoose schema
const Schema = mongoose.Schema;

// Create a new schema is Course
const Product = new Schema({
  _id: { type: Number },
  name: { type: String, required: true, maxLength: 255 },
  description: { type: String, maxLength: 600 },
  image: { type: String, maxLength: 255 },
  videoId: { type: String, maxLength: 255 },
  slug: { type: String, slug: "name", unique: true },
});

// Add slug to mongoose
mongoose.plugin(slug);

// Export model 'Product' to use in other files
module.exports = mongoose.model("Product", Product);
