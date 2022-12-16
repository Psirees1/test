const express = require('express');
const router = express.Router();
const apparalController = require('../controllers/apparalController');
const { isLoggedIn, isOwner } = require('../middlewares/auth');
const { validateId } = require('../middlewares/validator'); 

//GET /connections: send all connections to the user
router.get('/', apparalController.index);

//GET /connections/new: send html form for creating a new connection
router.get('/new', isLoggedIn, apparalController.new);

//POST /connections: create a new connection
router.post('/', isLoggedIn, apparalController.create);

//GET /connections/:id: send details of connection identified by id
router.get('/:id', validateId, apparalController.show);

//GET /connections/:id: send html form for editing an existing connection
router.get('/:id/edit', validateId, isLoggedIn, isOwner, apparalController.edit);

//PUT /connections/:id: update the connection identified by id
router.put('/:id', validateId, isLoggedIn, isOwner, apparalController.update);

//DELETE /connections/:id: delete the connection identified by id
router.delete('/:id', validateId, isLoggedIn, isOwner, apparalController.delete);

module.exports=router;