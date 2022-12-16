const express = require('express');
const controller = require('../controllers/userController');
const { isGuest, isLoggedIn } = require('../middlewares/auth');


const router = express.Router();

//GET /user/new: send html form for creating a new user account

router.get('/new', isGuest, controller.new);

//POST /user: create a new user account

router.post('/', isGuest, controller.create);

//GET /user/login: send html for logging in
router.get('/login', isGuest, controller.getUserLogin);

//POST /user/login: authenticate user's login
router.post('/login', isGuest, controller.login);

//GET /user/profile: send user's profile page
router.get('/profile', isLoggedIn, controller.profile);

//POST /user/logout: logout a user
router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;