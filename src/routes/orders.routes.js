const express = require('express');

//controllers
const ordersController = require('../controllers/orders.controllers');

// middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const usersMiddleware = require('../middlewares/users.middleware');
const validationsMiddleware = require('../middlewares/validations.middleware');

const router = express.Router();

router.use(authMiddleware.protect);

// router.post('/', usersMiddleware.validSessionUser, ordersController.createOrder);
router.post('/', ordersController.createOrder);

router.get('/me', ordersController.findUserOrders);

router
  // .use(authMiddleware.protectAccountOwner)
  .route('/:id')
  .patch(ordersController.updateOrder)
  .delete(ordersController.deleteOrder);

module.exports = router;
