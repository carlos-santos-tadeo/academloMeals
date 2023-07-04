const express = require('express');

//controllers
const usersController = require('../controllers/users.controller');

// middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const usersMiddleware = require('../middlewares/users.middleware');
const validationsMiddleware = require('../middlewares/validations.middleware');

const router = express.Router();

router.post('/signup', validationsMiddleware.createUserValidation, usersController.signup);

router.post('/login', validationsMiddleware.loginUserValidation, usersController.login);

router.use(authMiddleware.protect);

router.get('/orders', usersMiddleware.validSessionUser, usersController.findOrdersByUser);

router.get('/orders/:id', usersMiddleware.validSessionUser, usersController.findOneOrderById);

router.use('/:id', usersMiddleware.validUser);

router
  .use(authMiddleware.protectAccountOwner)
  .route('/:id')
  .patch(validationsMiddleware.updateUserValidation, usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
