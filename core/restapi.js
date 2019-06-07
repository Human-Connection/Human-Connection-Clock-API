'use strict';

let db = require('./db');
let entryController = require('./entryController');

module.exports = function(app) {

    // non-auth routes
    // TODO: tmp until path can be changed
    app.route('/cube.php').get(entryController.getCount);
    app.route('/entries/verify/:k').get(entryController.verifyEntry);

    // intercept request and check for api key
    app.use((req, res, next) => {
        let apiKey = req.get('API-Key');
        db.isValidApiKey(apiKey, function(results, err){
            if(!err && results.length > 0){
                next();
            }else{
                res.status(401).json({error: 'unauthorised'});
            }
        });
    });

    // routes which require auth
    app.route('/entries').post(entryController.createEntry);
    app.route('/entries/toggle').post(entryController.toggleStatus);
    app.route('/entries').get(entryController.getAll);
    app.route('/countries').get(entryController.getCountries);
};
