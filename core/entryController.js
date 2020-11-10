'use strict';

let formidable = require('formidable'),
    db = require('./db'),
    fs = require('fs'),
    crypto = require('crypto'),
    resize = require('./resize'),
    mailer = require('./mailer'),
    validator = require('validator'),
    sharp = require('sharp');

exports.getAll = function (req, res) {
    const ORDER_BY_DATE_ASC = 'asc',
        ORDER_BY_DATE_DESC = 'desc';

    const orderByAcceptedAttributes = [
        'id',
        'email',
        'firstname',
        'lastname',
        'country',
        'email_confirmed',
        'status',
        'anon',
        'created_at',
        'confirmed_at',
    ];

    let filter = {};
    filter['limit'] = parseInt(req.query.limit) || 10;
    filter['offset'] = parseInt(req.query.offset) || 0;
    filter['active'] = parseInt(req.query.isActive) === 0 ? 0 : 1;
    filter['profileImage'] = parseInt(req.query.profileImage) || 0;
    filter['confirmed'] = req.query.confirmed === 'yes' || req.query.confirmed === 'no' ? req.query.confirmed : 'all';
    filter['status'] = req.query.status === 'active' || req.query.status === 'inactive' ? req.query.status : 'all';
    filter['country'] = req.query.country && req.query.country.length > 0  ? req.query.country : null;
    filter['search'] = req.query.search && req.query.search.length > 0  ? req.query.search : null;

    // 'orderBy' && 'order' are parameters from the WP admin backend for ordering the entries list
    if (req.query.orderBy && orderByAcceptedAttributes.includes(req.query.orderBy)) {
        if (req.query.order && (req.query.order === 'asc' || req.query.order === 'desc')) {
            filter['orderBy'] = req.query.orderBy;
            filter['order'] = req.query.order;
        }
    }

    db.getEntries(filter, function (results, err) {
        if (!err) {
            // format output where required
            let out = [];
            results.forEach(function (item) {
                let obj = {};

                obj.id = item.id;
                obj.email = item.email;
                obj.firstname = item.firstname;
                obj.lastname = item.lastname;
                obj.message = item.message;
                obj.country = item.country;
                obj.email_confirmed = item.email_confirmed;
                obj.confirm_key = item.confirm_key;
                obj.status = item.status;
                obj.anon = item.anon;
                obj.created_at = item.created_at;
                obj.updated_at = item.updated_at;
                obj.confirmed_at = item.confirmed_at;

                if (item.image !== '') {
                    obj.image = 'https://' + req.hostname + '/uploads/' + item.image;
                } else {
                    obj.image = '';
                }

                out.push(obj);
            });

            res.status(200).json({
                success: true,
                results: out,
                totalCount: results.length,
                page: filter['offset']
            });
        } else {
            res.status(400).json({success: false, message: 'error'});
        }
    });
};

exports.toggleStatus = function (req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {

        if (fields && fields.id !== undefined) {
            db.toggleEntryStatus(fields.id, fields.state, function (results, err) {
                if (!err) {
                    res.status(200).json({success: true, message: 'toggled status'});
                } else {
                    res.status(400).json({success: false, message: 'error'});
                }
            });
        }
    });
};

exports.toggleEmailConfirmed = function (req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {

        if (fields && fields.id !== undefined && parseInt(fields.id) > 0 && fields.state !== undefined &&
            (parseInt(fields.state) === 0 || parseInt(fields.state) === 1)) {
            db.toggleEmailConfirmed(fields.id, fields.state, function (results, err) {
                if (!err) {
                    res.status(200).json({success: true, message: 'toggled email confirmed'});
                } else {
                    res.status(400).json({success: false, message: 'error'});
                }
            });
        } else {
            res.status(400).json({success: false, message: 'error'});
        }
    });
};

exports.deleteEntry = function (request, response) {
    if (request.params.id && request.params.id > 0) {
        db.getEntry(request.params.id, function (result, error) {
            if (!error) {
                db.deleteEntry(request.params.id, function (error) {
                    if (!error) {
                        console.log('!error');
                        response.status(200).json({success: true});
                    } else {
                        response.status(400).json({error: error});
                    }
                });
            } else {
                response.status(400).json({error: error});
            }
        });
    } else {
        response.status(400).json({error: 'No entry id specified'});
    }
};

exports.deleteImage = function (request, response) {
    if (request.params.id && request.params.id > 0) {
        db.getEntry(request.params.id, function (result, error) {
            if (!error && result) {
                db.deleteImage(request.params.id, function (error) {
                    if (!error) {
                        const path = './uploads/' + result[0].image;
                        try {
                            if (fs.existsSync(path)) {
                                //file exists
                            }
                        } catch(error) {
                            response.status(400).json({error: error});
                            return;
                        }

                        try {
                            fs.unlinkSync(path);
                        } catch (error) {
                            response.status(400).json({error: error});
                            return;
                        }

                        response.status(200).json({success: true});
                    } else {
                        console.log('error when deleting image');
                        response.status(400).json({error: error});
                    }
                });
            } else {
                response.status(400).json({error: error});
            }
        });
    } else {
        response.status(400).json({error: 'No entry id specified'});
    }
};

exports.rotateImage = function (request, response) {
    if (request.params.id && request.params.id > 0 && request.params.degree && request.params.degree >= 0) {
        const allowedDegress = [0, 90, 180, 270];

        if (!allowedDegress.includes(parseInt(request.params.degree))) {
            response.status(400).json({error: 'Degree accepts only the following values: ' + allowedDegress.join(', ')});
            return;
        }

        db.getEntry(request.params.id, function (result, error) {
            if (!error && result) {

                if (result[0].image == '' ) {
                    response.status(400).json({error: 'Entry has no image'});
                    return;
                }

                const imagePath = './uploads/' + result[0].image;
                try {
                    if (fs.existsSync(imagePath)) {
                        //file exists
                    }
                } catch (error) {
                    response.status(400).json({error: error});
                    return;
                }

                try {
                    sharp(imagePath)
                        .rotate(parseInt(request.params.degree))
                        .withMetadata()
                        .toBuffer(function(error, buffer) {
                            if(error) {
                                throw error;
                            }
                            fs.writeFile(imagePath, buffer, function() {
                                response.status(200).json({success: true});
                            });
                        })
                } catch (error) {
                    console.log(`error when trying to rotate image ${imagePath}`, error);
                    response.status(400).json({error: 'No entry id specified'});
                }


        // try {
                //     fs.unlinkSync(path);
                // } catch (error) {
                //     response.status(400).json({error: error});
                //     return;
                // }


            } else {
                response.status(400).json({error: 'No entry id specified'});
            }
        });
    } else {
        response.status(400).json({error: 'No entry id or degree specified'});
    }
};

exports.getCount = function (req, res) {
    let filter = {};
    filter['active'] = parseInt(req.query.isActive) === 0 ? 0 : 1;
    filter['profileImage'] = parseInt(req.query.profileImage) || 0;
    filter['confirmed'] = req.query.confirmed === 'yes' || req.query.confirmed === 'no' ? req.query.confirmed : 'all';
    filter['status'] = req.query.status === 'active' || req.query.status === 'inactive' ? req.query.status : 'all';
    filter['search'] = req.query.search && req.query.search.length > 0  ? req.query.search : null;

    db.getCount(filter, function (results, err) {
        if (!err) {
            // TODO switch to json when clocks have been adjusted to new API
            // res.status(200).json({success : true, count : results[0]['cnt']});
            res.end(results[0]['cnt'].toString());
        } else {
            res.status(400).json({success: false, message: 'error'});
        }
    });
};

exports.getCountries = function (req, res) {
    db.getCountries(function (results, err) {
        if (!err) {
            res.status(200).json({
                success: true,
                countries: results
            });
        } else {
            res.status(400).json({success: false, message: 'error'});
        }
    });
};

exports.verifyEntry = function (req, res) {
    db.verifyEntry(req.params.k, function (results, err) {
        if (!err) {
            db.getUserByHash(req.params.k, function (results, err) {
                if (!err) {
                    mailer.sendVerifySuccess({email: results[0].email, firstname: results[0].firstname});
                    res.redirect('https://human-connection.org/uhr-des-wandels/?ns=t');
                }
            });
        } else {
            res.redirect('https://human-connection.org/uhr-des-wandels/?ns=f');
        }
    });
};

exports.createEntry = function (req, res) {
    // process form
    let form = new formidable.IncomingForm(),
        fields = {},
        files = [],
        errorFields = [],
        out = {},
        requiredFields = ['email', 'firstname', 'anon', 'country'],
        allowedFields = ['email', 'firstname', 'lastname', 'anon', 'message', 'country', 'beta', 'newsletter', 'pax'];

    form.uploadDir = __dirname + '/../uploads/';
    form.keepExtensions = true;
    form.maxFields = 5;
    form.maxFieldsSize = 2 * 1024 * 1024;

    // Send error message back to client.
    form.parse(req).on('field', function (field, value) {
        // ensure only fields allowed get into db
        if (allowedFields.indexOf(field) > -1) {

            // sanitize int field
            if (field === 'anon' || field === 'beta' || field === 'newsletter' || field === 'pax') {
                value = 0 == parseInt(value) ? 0 : 1;
            }

            let index = requiredFields.indexOf(field);
            if (index > -1) {
                requiredFields.splice(index, 1);

                if (value === undefined || value === '') {
                    errorFields.push(field);
                    out[field] = 'Missing required field';
                }
            }

            fields[[field]] = value;
        }
        if (field === 'firstname') {
            fields[[field]] = validator.escape(validator.trim(value));
            if (!validator.isLength(value, {min: 1, max: 200})) {
                errorFields.push('firstname');
                out['firstname'] = 'This field needs to have between 1 and 200 characters';
            }
        }
        if (field === 'lastname') {
            fields[[field]] = validator.escape(validator.trim(value));
            if (!validator.isLength(value, {max: 200})) {
                errorFields.push('lastname');
                out['lastname'] = 'Limit of 200 characters for this field exceeded';
            }
        }
        if (field === 'email') {
            fields[[field]] = validator.escape(validator.trim(value));
            if (!validator.isEmail(value)) {
                errorFields.push('email');
                out['email'] = 'No valid email address';
            }
            if (!validator.isLength(value, {max: 200})) {
                errorFields.push('email');
                out['message'] = 'Limit of 200 characters for this field exceeded';
            }
        }
        if (field === 'country') {
            fields[[field]] = validator.escape(validator.trim(value));
            if (!validator.isISO31661Alpha2(value)) {
                errorFields.push('country');
                out['country'] = 'No valid country code';
            }
        }
        if (field === 'message') {
            fields[[field]] = validator.escape(validator.trim(value));
            if (!validator.isLength(value, {max: 500})) {
                errorFields.push('message');
                out['message'] = 'Limit of 500 characters for this field exceeded';
            }
        }

    }).on('file', function (field, file) {
        files.push({
            size: file.size,
            path: file.path,
            type: file.type,
            name: file.name
        });
    }).on('end', function () {
        // no file attached (use placeholder image) - hence no errors here
        let hasFile = files.length > 0;
        let typeError = false, sizeError = false;
        if (hasFile) {
            typeError = !files[0].name.match(/\.(jpg|jpeg|png)$/i);
            sizeError = files[0].size > form.maxFieldsSize;
        }

        if (requiredFields.length > 0 || typeError || sizeError || errorFields.length > 0) {
            out ['success'] = false;
            out['test'] = true;
            if (hasFile) {
                fs.unlinkSync(files[0].path);
            }

            if (typeError) {
                out['file'] = 'Wrong filetype ' + files[0].type;
            }

            if (sizeError) {
                out['file'] = 'File size exceeded max size of ' + form.maxFieldsSize;
            }

            res.status(400).json(out);
        } else {
            if (hasFile) {
                fields['image'] = files[0].path.replace(/^.*[\\\/]/, '');

                let newFile = resize(files[0].path, 200, 200);
                fs.unlinkSync(files[0].path);
                newFile.toFile(form.uploadDir + fields['image'], (err, info) => {
                });
            } else {
                fields['image'] = '';
            }

            let hash = crypto.randomBytes(32).toString('hex');
            fields['randomHash'] = hash;

            // save to db
            db.saveEntry(fields, function (err, results) {
                if (!err) {
                    // send verification email
                    mailer.sendVerificationMail(hash, {email: fields.email, firstname: fields.firstname});

                    res.status(200).json({success: true});
                } else {
                    console.log(err);
                    res.status(400).json(Object.assign({success: false}, err));
                }
            });
        }
    });
};

exports.updateEntry = function (request, response) {
    if (request.params.id && request.params.id > 0) {
        db.getEntry(request.params.id, function (result, error) {
            if (!error) {

                let form = new formidable.IncomingForm(),
                fields = {},
                errorFields = [];

                // Send error message back to client.
                form.parse(request).on('field', function (field, value) {
                    console.log(field);
                    if (field === 'message') {
                        fields[[field]] = validator.escape(validator.trim(value));
                        if (!validator.isLength(value, {min: 1, max: 500})) {
                            errorFields.push('message');
                        }
                    }
                }).on('end', function () {
                    if (errorFields.length === 0 && Object.keys(fields).length > 0) {
                        db.updateEntry(request.params.id, fields, function (error, results) {
                            if (!error) {
                                response.status(200).json({success: true});
                            } else {
                                console.log(error);
                                response.status(400).json(Object.assign({success: false}, error));
                            }
                        });
                    } else {
                        response.status(400).json({error: "error"});
                    }
                });
            } else {
                response.status(400).json({error: error});
            }
        });
    } else {
        response.status(400).json({error: 'No entry id specified'});
    }
};
