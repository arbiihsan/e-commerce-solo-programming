const { formatRupiah } = require('../helpers/formatRupiah')
const { Transaction, User, Product, Category, UserProfile } = require('../models');
const { Op } = require('sequelize')
const transporter = require('../emailConfig');


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
        const { errors } = req.query
        res.render('addProductForm', { errors })
    }
    static addProduct(req, res) {
        const { productName, image, description, price, stock, CategoryId } = req.body;

        Product.create({ productName, image, description, price, stock, CategoryId })
            .then(() => {
                res.redirect('/homeadmin');
            })
            .catch((err) => {
                if (err.name === 'SequelizeValidationError') {
                    const errors = err.errors.map(el => el.message)
                    res.redirect(`/homeadmin/add?errors=${errors}`)
                } else {
                    res.send(err)
                }
            })
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
    static async checkout(req, res) {
        const cart = req.session.cart || {};

        try {
            const transactionPromises = Object.keys(cart).map(async (productId) => {
                const product = await Product.findByPk(productId);
                const quantity = cart[productId].quantity;
                const userId = req.session.userId;

                await Transaction.create({
                    status: true,
                    nameOfTransaction: product.productName + new Date().toISOString(),
                    UserId: userId,
                    ProductId: productId,
                });

                product.stock -= quantity;
                await product.save();

                return { product, quantity };
            });

            const cartItems = await Promise.all(transactionPromises);

            req.session.cart = {};

            const userProfile = await UserProfile.findOne({
                where: { UserId: req.session.userId },
            });

            const userEmail = userProfile.email;
            const userAddress = userProfile.address;
            const productDetails = cartItems
                .map(({ product, quantity }) => `${quantity}x ${product.productName}`)
                .join(', ');

            const mailOptions = {
                from: 'arbiihsan@gmail.com',
                to: userEmail,
                subject: 'Transaction Completed',
                text: `Transaction has been completed, your purchase of ${productDetails} will be sent to ${userAddress}.`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            res.redirect('/home');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error processing the checkout.');
        }
    }
    static showTransactionData(req, res) {
        const { searchProduct } = req.query;

        if (searchProduct) {
            Transaction.getTransactionsByProduct(searchProduct)
            .then((transactions) => {
                transactions.forEach((transaction) => {
                    transaction.formattedDate = transaction.formatDate();
                });

                res.render('transactionData', { transactions, formatRupiah });
            })
            .catch(error => {
                res.send(error);
            });
        }
        Transaction.findAll({
            include: [
                {
                    model: User,
                    include: {
                        model: UserProfile,
                    },
                },
                {
                    model: Product,
                },
            ],
        })
            .then((transactions) => {
                transactions.forEach((transaction) => {
                    transaction.formattedDate = transaction.formatDate();
                });

                res.render('transactionData', { transactions, formatRupiah });
            })
            .catch(error => {
                res.send(error);
            });
    }
}


module.exports = Controller