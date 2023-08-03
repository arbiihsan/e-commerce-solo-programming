const { formatRupiah } = require('../helpers/formatRupiah')
const { Transaction, User, Product, Category, UserProfile } = require('../models');
const { Op } = require('sequelize')


class Controller {
    static test(req, res) {
        res.send('ini test')
    }
    static showHome(req, res) {
        const { searchProduct, categoryTag } = req.query;
        let option = {};

        if (searchProduct) {
            option.where = {
                productName: { [Op.iLike]: `%${searchProduct}%` }
            };
        }

        if (categoryTag) {
            option.include = {
                model: Category,
                where: {
                    categoryTag: categoryTag
                }
            };
        }

        Product.findAll(option)
            .then((productsData) => {
                res.render('home', { productsData, formatRupiah });
            })
            .catch((err) => {
                res.send(err);
            });
    }
    static showHomeAdmin(req, res) {
        const { searchProduct } = req.query;

        if (searchProduct) {
            Product.findAll({ where: { productName: { [Op.iLike]: `%${searchProduct}%` } } })
                .then((productsData) => {
                    res.render('homeadmin', { productsData, formatRupiah })
                })
                .catch((err) => {
                    res.send(err)
                })
        }

        Product.findAll()
            .then((productsData) => {
                res.render('homeadmin', { productsData, formatRupiah })
            })
            .catch((err) => {
                res.send(err)
            })
    }
    static deleteProduct(req, res) {
        const { id } = req.params
        Product.destroy({
            where: {
                id: id
            }
        })
            .then(() => {
                res.redirect('/homeadmin')
            })
            .catch(error => {
                res.send(error)
            });
    }
    static addProductForm(req, res) {
        res.render('addProductForm')
    }
    static addProduct(req, res) {
        const { productName, image, description, price, stock, CategoryId } = req.body;

        Product.create({ productName, image, description, price, stock, CategoryId })
            .then(() => {
                res.redirect('/homeadmin');
            })
            .catch(error => {
                res.send(error);
            });
    }
    static editProductForm(req, res) {
        const { id } = req.params
        Product.findByPk(id, {
            include: {
                model: Category,
                foreignKey: 'CategoryId'
            }
        })
            .then((item) => {
                res.render('editProductForm', { item })
            })
            .catch(error => {
                res.send(error)
            })
    }
    static editProduct(req, res) {
        const { id } = req.params
        const { productName, image, description, price, stock, CategoryId } = req.body;
        Product.update(
            { productName, image, description, price, stock, CategoryId },
            {
                where: {
                    id
                }
            }
        )
            .then(() => {
                res.redirect('/homeadmin');
            })
            .catch(error => {
                res.send(error)
            })
    }
    static addToCart(req, res) {
        const productId = req.params.id;
        const cart = req.session.cart || {};
        const product = cart[productId];

        if (product) {
            product.quantity += 1;
        } else {
            cart[productId] = { quantity: 1 };
        }

        req.session.cart = cart;
        res.redirect('/home');
    }

    static showCart(req, res) {
        const cart = req.session.cart || {};
        const cartItems = [];

        const productIds = Object.keys(cart);
        Product.findAll({ where: { id: productIds } })
            .then((productsData) => {
                productsData.forEach((product) => {
                    const productId = product.id;
                    const quantity = cart[productId].quantity;
                    cartItems.push({ product, quantity });
                });

                res.render('cart', { cartItems, formatRupiah });
            })
            .catch((err) => {
                res.send(err);
            });
    }
    static checkout(req, res) {
        const { cart } = req.session;
        const productIds = Object.keys(cart);

        // Create a transaction for each cart item
        Promise.all(
            productIds.map((productId) => {
                const quantity = cart[productId].quantity;
                return Product.findByPk(productId).then((product) => {
                    if (!product) {
                        throw new Error('Product not found.');
                    }

                    if (product.stock < quantity) {
                        throw new Error('Insufficient stock for product: ' + product.productName);
                    }

                    // Decrement the product stock
                    product.stock -= quantity;
                    return product.save().then(() => {
                        const nameOfTransaction = product.productName + ' - ' + new Date().toISOString();
                        return Transaction.create({
                            status: true,
                            nameOfTransaction,
                            UserId: req.session.userId,
                            ProductId: productId,
                        });
                    });
                });
            })
        )
        .then(() => {
            // After successful checkout, clear the cart and redirect to the home page
            req.session.cart = {};
            res.redirect('/home');
        })
        .catch((error) => {
            console.error('Checkout error:', error);
            // Handle the error, display a message, etc.
            res.send('Checkout failed: ' + error.message);
        });
    }
    
}


module.exports = Controller