const { formatRupiah } = require('../helpers/formatRupiah')
const { User, Product, Category, UserProfile } = require('../models')
const { Op } = require('sequelize')


class Controller{
    static test(req,res){
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
}


module.exports = Controller