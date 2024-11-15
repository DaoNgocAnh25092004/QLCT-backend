const playerRoutes = require('./player');
const accountRoutes = require('./account');

function route(app) {
    app.use('/api/player', playerRoutes);

    app.use('/api/account', accountRoutes);
}

module.exports = route;
