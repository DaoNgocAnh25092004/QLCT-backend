const productRoutes = require('./product');
const playerRoutes = require('./player');
const userRoutes = require('./user');

function route(app) {
    app.use('/products', productRoutes);

    app.use('/api/player', playerRoutes);

    app.use('/api/user', userRoutes);
}

module.exports = route;
