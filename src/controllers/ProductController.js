const Product = require('../models/Product');

class ProductController {
    // [GET] /products
    index(req, res, next) {
        Product.find({})
            .then((products) => {
                res.render('products', {
                    products: multipleMongooseToObject(products),
                });
            })
            .catch(next);
    }
}

module.exports = new ProductController();
