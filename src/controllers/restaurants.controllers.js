const Restaurants = require('../models/restaurants.model');
const Reviews = require('../models/reviews.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createNewRestaurant = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;

  const restaurant = await Restaurants.create({
    name: name.toLowerCase(),
    address: address.toLowerCase(),
    rating,
  });

  res.status(201).json({
    status: 'success',
    message: 'The restaurant was created.',
    restaurant: {
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      rating: restaurant.rating,
    },
  });
});

exports.findRestaurants = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurants.findAll({
    where: {
      status: 'active',
    },
    include:[
      {
        model: Reviews
      }
    ]
  });

  res.status(200).json({
    status: 'success',
    results: restaurants.length,
    restaurants,
  });
});

exports.findRestaurantById = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  res.status(200).json({
    status: 'success',
    restaurant,
  });
});

exports.updateRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  const { name, address } = req.body;

  const updatedRestaurant = await restaurant.update({
    name: name.toLowerCase(),
    address: address.toLowerCase(),
  });

  res.status(200).json({
    status: 'success',
    message: 'The restaurant was updated.',
    updatedRestaurant,
  });
});

exports.deleteRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  await restaurant.update({ status: 'disabled' });

  res.status(200).json({
    status: 'success',
    message: 'The restaurant was deleted.',
  });
});

exports.createNewReview = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  const { sessionUser } = req;
  const { comment, rating } = req.body;

  const review = await Reviews.create({
    comment,
    rating,
    restaurantId: restaurant.id,
    userId: sessionUser.id,
  });

  res.status(200).json({
    status: 'success',
    message: 'You have created a new review',
    review: {
      comment: review.comment,
      rating: review.rating,
      restaurant: restaurant.name,
    },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const { review } = req;
  const { comment, rating } = req.body;

  const updatedReview = await review.update({ comment, rating });

  res.status(200).json({
    status: 'success',
    message: 'The review was updated.',
    updatedReview,
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const { review } = req;

  await review.update({ status: 'deleted' });
  res.status(200).json({
    status: 'success',
    message: 'The review was deleted.',
  });
});