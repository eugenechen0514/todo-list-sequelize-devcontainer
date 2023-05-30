const express = require('express')
const router = express.Router()

const passport = require('passport')
const LocalStrategy = require('passport-local')

const db = require('../models')
const User = db.User

passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
	return User.findOne({
		attributes: ['id', 'name', 'email', 'password'],
		where: { email: username },
		raw: true
	})
		.then((user) => {
			if (!user || user.password !== password) {
				return done(null, false, { message: 'email 或密碼錯誤' })
			}
			return done(null, user)
		})
		.catch((error) => {
			error.errorMessage = '登入失敗'
			done(error)
		})
}))

passport.serializeUser((user, done) => {
	const { id, name, email } = user
	return done(null, { id, name, email })
})


// passport.deserializeUser(function (user, done) {
// 	User.findOne({where: {id: user.id}})
// 	.then(u => {
// 		done(null, u)
// 	}).catch(e => {
// 		done(e)
// 	})
// })

const todos = require('./todos')
const users = require('./users')

router.use('/todos', todos)
router.use('/users', users)

router.get('/', (req, res) => {
	res.render('index')
})

router.get('/register', (req, res) => {
	return res.render('register')
})

router.get('/login', (req, res) => {
	return res.render('login')
})

router.post('/login', passport.authenticate('local', {
	successRedirect: '/todos',
	failureRedirect: '/login',
	failureFlash: true
}))

router.post('/logout', (req, res) => {
	return res.send('logout')
})

module.exports = router