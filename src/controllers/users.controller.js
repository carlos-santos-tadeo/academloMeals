const Users = require('../models/users.model');
const Orders = require('../models/orders.model')
const Meals = require('../models/meals.model')
const Restaurants = require('../models/restaurants.model')
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/jwt');
const AppError = require('../utils/appError');

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const existentUser = await Users.findOne({
    where: {
      email,
    },
  });

  if (existentUser) {
    return res.status(404).json({
      status: 'error',
      message: `There is already a user created with this email: ${email}`,
    });
  }

  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const user = await Users.create({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password: encryptedPassword,
    role,
  });

  const token = await generateJWT(user.id);

  res.status(201).json({
    message: 'User created successfully',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await Users.findOne({
    where: {
      email: email.toLowerCase(),
      status: 'active',
    },
  });

  if (!user) {
    return next(new AppError(`User with email:${email} was not found`, 404));
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError(`Invalid email or password`, 401));
  }

  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

//actualizamos usuario
exports.updateUser = catchAsync(async (req, res, next) => {
  const { user, sessionUser } = req;
  //traemos info del req.body
  const { name, email } = req.body;


  if (user.id === sessionUser.id) {
    await user.update({ name, email });

    return res.status(200).json({
      status: 'success',
      message: `The user with id:${user.id} updated`,
    });
  }

  res.status(403).json({
    status: 'error',
    message: `You do not own this account`,
  });
});

//eliminamos usuario
exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user, sessionUser } = req;

  if (user.id === sessionUser.id) {

    await user.update({ status: 'disabled' });

    return res.status(200).json({
      status: 'success',
      message: `User with id:${user.id} been deleted`,
    });
  }

  res.status(403).json({
    status: 'error',
    message: `You do not own this account`,
  });
});


exports.findOrdersByUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({
    status: 'success',
    results: user.orders.length,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    orders: user.orders,
    meals: user.meals,
    restaurants: user.restaurants,
  });
});

exports.findOneOrderById = catchAsync(async (req, res, next) => {

  const { id } = req.params;//id de la orden que quiero
  const {user} = req;//usuario en sesion

  const order = await Orders.findOne({
    where: {
      id,
    },
  });

  if (!order || order.userId !== user.id) {
    return res.status(403).json({ error: 'The order does not exist or you do not have permission' });
  }

  const meal = await Meals.findOne({
    where: {
      id:order.mealId,
    },
  });

  const restaurant = await Restaurants.findOne({
    where: {
      id:meal.restaurantId,
    },
  });

  res.status(200).json({
    status: 'success',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    order,
    meal,
    restaurant,
  });
});

