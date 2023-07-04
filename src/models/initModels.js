const Users = require('./users.model');
const Meals = require('./meals.model');
const Orders = require('./orders.model');
const Reviews = require('./reviews.model');
const Restaurants = require('./restaurants.model');

const initModel = () => {
  Meals.hasOne(Orders, { foreignKey: 'mealId' });
  Orders.belongsTo(Meals, { foreignKey: 'mealId' });

  Restaurants.hasMany(Meals, { foreignKey: 'restaurantId' });
  Meals.belongsTo(Restaurants, { foreignKey: 'restaurantId' });

  Restaurants.hasMany(Reviews, { foreignKey: 'restaurantId' });
  Reviews.belongsTo(Restaurants, { foreignKey: 'restaurantId' });

  Users.hasMany(Orders, { foreignKey: 'userId' });
  Orders.belongsTo(Users, { foreignKey: 'userId' });

  Users.hasMany(Reviews, { foreignKey: 'userId' });
  Reviews.belongsTo(Users, { foreignKey: 'userId' });
};

module.exports = initModel;
