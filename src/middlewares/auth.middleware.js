const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Users = require('../models/users.model');
const Reviews = require('../models/reviews.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  const user = await Users.findOne({
    where: {
      id: decoded.id,
      status: 'active',
    },
  });

  if (!user) {
    return next(
      new AppError('The owner of this token it not longer active', 401)
    );
  }

  req.sessionUser = user;
  next();
});

exports.protectAdmin = (req, res, next) => {
  const { sessionUser } = req;

  if (sessionUser.role !== 'admin') {
      return next(
          new AppError('You dont have permissions for this data', 403)
      );
  }

  next();
};

exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  const { user, sessionUser } = req;
  console.log(user)
  if (user.id !== sessionUser.id) {
    return next(new AppError('You do not own this account.', 401));
  }

  next();
});

exports.protectAccountOwnerReview = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { id } = req.params;

  const review = await Reviews.findOne({
    where: { id },
  });

  if (review.userId !== sessionUser.id) {
    return next(new AppError('You do not own this review.', 401));
  }

  next();
});