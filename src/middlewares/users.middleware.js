const Users = require('../models/users.model');
const Orders = require('../models/orders.model');
const Meals = require('../models/meals.model');
const Restaurants = require('../models/restaurants.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await Users.findOne({
    where: {
      id,
      status: 'active',
    },
  });

  if (!user) {
    return next(new AppError(`User with id:${id} was not found 😔`, 404));
  }

  req.user = user;
  next();
});

exports.validSessionUser = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const user = await Users.findOne({
    where: {
      id: sessionUser.id,
      status: 'active',
    },
    include: [
      {
        model: Orders,
        include: [
          {
            model: Meals,
            include: [
              {
                model: Restaurants,
              },
            ],
          },
        ],
      },
    ],
  });

  if (!user) {
    return next(new AppError(`User with id:${id} was not found 😔`, 404));
  }

  req.user = user;
  next();
});
