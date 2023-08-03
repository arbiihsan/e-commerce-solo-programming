const express = require('express')
const router = express()
const Controller = require('../controllers/controller')
const UserController = require('../controllers/UserController')


router.get('/', (req, res) => {
    res.render('landingPage') 
 })

router.get('/login', UserController.loginForm)
router.post('/login', UserController.login)
router.get('/register', UserController.registerForm)
router.post('/register', UserController.register)
router.post('/profile', UserController.addProfile)
router.get('/logout', UserController.logout)

router.use(function (req, res, next) {
    if(!req.session.userId) {
        const error = 'You must login first!'
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }
})

router.get('/home', Controller.showHome)
router.get('/cart', Controller.test)
router.get('/stock', Controller.test)
router.get('/home/profile/:id', Controller.test)
router.post('/home/profile/:id', Controller.test)


router.use(function (req, res, next) {
    if(req.session.role !== "admin") {
        const error = 'You must be an Admin to view this page!'
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }
})

router.get('/homeadmin', Controller.showHomeAdmin)
router.get('/homeadmin/viewuser', Controller.test)
router.get('/homeadmin/add', Controller.addProductForm)
router.post('/homeadmin/add', Controller.addProduct)
router.get('/edit/:id', Controller.editProductForm)
router.post('/edit/:id', Controller.editProduct)
router.get('/delete/:id', Controller.deleteProduct)


module.exports = router