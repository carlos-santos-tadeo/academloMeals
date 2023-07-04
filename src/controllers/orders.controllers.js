const Orders = require('../models/orders.model');
const Meals = require('../models/meals.model');
const Restaurants = require('../models/restaurants.model');

const catchAsync = require('../utils/catchAsync');
const generateJWT = require('../utils/jwt');
const AppError = require('../utils/appError');

exports.createOrder = catchAsync(async (req, res, next) => {
  const { quantity, mealId } = req.body;
  const { sessionUser } = req;

  const meal = await Meals.findOne({
    where: { id: mealId, status: 'active' },
  });

  if (!meal) {
    return next(new AppError('This meal has not been found', 404));
  }

  const newOrder = await Orders.create({
    mealId,
    userId: sessionUser.id,
    totalPrice: quantity * meal.price,
    quantity,
  });

  res.status(201).json({
    message: 'Order created successfully',
    newOrder,
    meal,
  });
});

exports.findUserOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const order = await Orders.findAll({
    where: {
      userId: sessionUser.id,
    },
    include: [
      {
        model: Meals,
        attributes: {
          exclude: ['status'],
        },
        include: [
          {
            model: Restaurants,
            attributes: {
              exclude: ['status'],
            },
          },
        ],
      },
    ],
  });

  if (!order || order.length === 0) {
    return res
      .status(403)
      .json({ error: 'There is no order in existing for this user' });
  }

  res.json({
    status: 'success',
    user: {
      id: sessionUser.id,
      name: sessionUser.name,
      email: sessionUser.email,
    },
    order,
  });
});


exports.updateOrder = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { id } = req.params;

  const order = await Orders.findOne({
    where: { id, status: 'active' },
  });

  if (!order) {
    return next(new AppError('This order is not active or not found', 404));
  }

  if (order.userId === sessionUser.id) {
    await order.update({ status: 'completed' });

    return res.status(200).json({
      status: 'success',
      message: `The order with id:${id} completed`,
    });
  }

  res.status(403).json({
    status: 'error',
    message: `You do not own this order`,
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { id } = req.params;

  const order = await Orders.findOne({
    where: { id, status: 'active' },
  });

  if (!order) {
    return next(new AppError('This order is not active or not found', 404));
  }

  if (order.userId === sessionUser.id) {
    await order.update({ status: 'cancelled' });

    return res.status(200).json({
      status: 'success',
      message: `The order with id:${id} cancelled`,
    });
  }

  res.status(403).json({
    status: 'error',
    message: `You do not own this order`,
  });
});
