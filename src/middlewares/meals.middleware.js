const Restaurants = require('../models/restaurants.model');
const Meals = require('../models/meals.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validMeal = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const meal = await Meals.findOne({
    where: {
      id,
      status: 'active'
    },
    include: [
      {
        model: Restaurants
      },
    ],
  });

  if (!meal) {
    return next(new AppError(`The meal with id:${id} was not found 🥶`, 404));
  }

  req.meal = meal;
  next();
});
