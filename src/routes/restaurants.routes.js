const express = require('express');

const restaurantsController = require('../controllers/restaurants.controllers');

// middlewares
const validationsMiddleware = require('../middlewares/validations.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const restaurantsMiddleware = require('../middlewares/restaurants.middleware');

const router = express.Router();


router
  .route('/')
  .get(restaurantsController.findRestaurants)
  .post(
    authMiddleware.protect,
    authMiddleware.protectAdmin,
    validationsMiddleware.createRestaurantValidation,
    restaurantsController.createNewRestaurant
  );

router
  .route('/reviews/:restaurantId/:id')
  .patch(
    authMiddleware.protect,
    authMiddleware.protectAccountOwnerReview,
    validationsMiddleware.reviewValidation,
    restaurantsMiddleware.validReview,
    restaurantsController.updateReview
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.protectAccountOwnerReview,
    restaurantsMiddleware.validReview,
    restaurantsController.deleteReview
  );

router.post(
  '/reviews/:id',
  authMiddleware.protect,
  validationsMiddleware.reviewValidation,
  restaurantsMiddleware.validRestaurant,
  restaurantsController.createNewReview
);

router.use('/:id', restaurantsMiddleware.validRestaurant);

router
  .route('/:id')
  .get(restaurantsController.findRestaurantById)
  .patch(
    authMiddleware.protect,
    authMiddleware.protectAdmin,
    validationsMiddleware.updateRestaurantValidation,
    restaurantsController.updateRestaurant
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.protectAdmin,
    restaurantsController.deleteRestaurant
  );

module.exports = router;
