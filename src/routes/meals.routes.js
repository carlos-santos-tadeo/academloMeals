const express = require('express');

const mealsController = require('../controllers/meals.controllers');

// middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const mealsMiddleware = require('../middlewares/meals.middleware');
const restaurantsMiddleware = require('../middlewares/restaurants.middleware');
const validationsMiddleware = require('../middlewares/validations.middleware');

const router = express.Router();

router.get('/', mealsController.findMeals);

router.post(
  '/:id',
  authMiddleware.protect,
  authMiddleware.protectAdmin,
  validationsMiddleware.createMealValidation,
  restaurantsMiddleware.validRestaurant,
  mealsController.createNewMeal
);

router
  .use('/:id', mealsMiddleware.validMeal)
  .route('/:id')
  .get(mealsController.findMealById)
  .patch(
    authMiddleware.protect,
    authMiddleware.protectAdmin,
    mealsController.updateMeal
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.protectAdmin,
    mealsController.deleteMeal
  );

module.exports = router;
