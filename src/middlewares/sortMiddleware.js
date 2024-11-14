module.exports = function sortMiddleware(req, res, next) {
    res.locals._sort = {
        enabled: false,
        column: 'default',
        type: 'default',
    };

    if (req.query.hasOwnProperty('_sort')) {
        // Method 1: Using res.locals
        // res.locals._sort.enabled = true;
        // res.locals._sort.type = req.query.type;
        // res.locals._sort.column = req.query.column;

        // Method 2: Using Object.assign use to merge object from object res.locals._sort on left and object on right
        Object.assign(res.locals._sort, {
            enabled: true,
            column: req.query.column,
            type: req.query.type,
        });
    }

    next();
};
