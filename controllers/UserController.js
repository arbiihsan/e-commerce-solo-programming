const { User, UserProfile } = require('../models')
const bcrypt = require('bcryptjs')

class UserController {
    static test(req, res) {
        res.send('ini test')
    }
    static registerForm(req, res) {
        res.render('registerForm')
    }
    static register(req, res) {
        const { username, password, role } = req.body

        User.create({ username, password: password, role })
            .then(() => {
                // res.redirect('/profile')
                res.render('profileForm')
            })
            .catch(err => {
                res.send(err)
            })
    }
    static addProfile(req, res) {
        const { firstName, lastName, email, phoneNumber, address } = req.body

        User.findAll({
            limit: 1,
            order: [['createdAt', 'DESC']]
        })
            .then((data) => {
                // console.log(data);
                let UserId = data[0].id
                return UserProfile.create({ firstName, lastName, email, phoneNumber, address, UserId })
            })
            .then(() => {
                res.redirect('/login')
            })
            .catch(err => {
                res.send(err)
            })
    }
    static loginForm(req, res) {
        const { error } = req.query
        res.render('loginForm', { error })
    }
    static login(req, res) {
        const { username, password } = req.body

        User.findOne({ where: { username } })
            .then(user => {
                if (user) {
                    const isValidPassword = bcrypt.compareSync(password, user.password)

                    if (isValidPassword) {
                        req.session.userId = user.id
                        req.session.role = user.role
                        if (req.session.role === "admin") {
                            return res.redirect('/homeadmin')
                        } else {
                            return res.redirect('/home')
                        }
                    } else {
                        const error = "Invalid password or username"
                        return res.redirect(`/login?error=${error}`)
                    }
                } else {
                    const error = "Invalid username"
                    return res.redirect(`/login?error=${error}`)
                }
            })
            .catch(err => {
                res.send(err)
            })
    }
    static logout(req, res) {
        req.session.destroy((err) => {
            if(err) res.send(err);
            else{
                res.redirect('/login')
            }
        })
    }
}


module.exports = UserController