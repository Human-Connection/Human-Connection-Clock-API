'use strict';

let formidable     = require('formidable'),
    db             = require('./db'),
    fs             = require('fs'),
    crypto         = require('crypto'),
    resize         = require('./resize'),
    mailer         = require('./mailer');

exports.getAll = function(req, res) {
    const ORDER_BY_DATE_ASC = 'asc',
          ORDER_BY_DATE_DESC = 'desc';

    let filter = {};
    filter['limit']       = parseInt(req.query.limit)  || 10;
    filter['offset']      = parseInt(req.query.offset) || 0;
    filter['active']      = parseInt(req.query.isActive) || 1;
    filter['orderByDate'] = (req.query.orderByDate === ORDER_BY_DATE_ASC) ?  ORDER_BY_DATE_ASC : ORDER_BY_DATE_DESC;
    filter['profileImage'] = parseInt(req.query.profileImage) || 0;

    db.getEntries(filter, function(results, err){
        if(!err){
            // format output where required
            let out = [];
            results.forEach(function(item){
                let obj = {};

                obj.id              = item.id;
                obj.email           = item.email;
                obj.firstname       = item.firstname;
                obj.lastname        = item.lastname;
                obj.message         = item.message;
                obj.country         = item.country;
                obj.ipv4            = item.ipv4;
                obj.ipv6            = item.ipv6;
                obj.email_confirmed = item.email_confirmed;
                obj.confirm_key     = item.confirm_key;
                obj.status          = item.status;
                obj.anon            = item.anon;
                obj.created_at      = item.created_at;
                obj.updated_at      = item.updated_at;
                obj.confirmed_at    = item.confirmed_at;

                if(item.image !== ''){
                    obj.image = "https://" + req.hostname + "/uploads/"+item.image;
                }else{
                    obj.image = '';
                }

                out.push(obj);
            });

            res.status(200).json({
                success : true,
                results : out,
                totalCount : results.length,
                page : filter['offset']
            });
        }else{
            res.status(400).json({success : false, message : "error"});
        }
    });
};

exports.toggleStatus = function(req, res){
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {

        if(fields && fields.id !== undefined){
            db.toggleEntryStatus(fields.id, fields.state, function(results, err){
                if(!err){
                    res.status(200).json({success : true, message : "toggled status"});
                }else{
                    res.status(400).json({success : false, message : "error"});
                }
            })
        }
    });
};

exports.getCount = function(req, res) {
    db.getCount(function(results, err){
        if(!err){
            // TODO switch to json when clocks have been adjusted to new API
            // res.status(200).json({success : true, count : results[0]['cnt']});
            res.end(results[0]['cnt'].toString());
        }else{
            res.status(400).json({success : false, message : "error"});
        }
    });
};

exports.getCountries = function(req, res) {
    db.getCountries(function(results, err){
        if(!err){
            res.status(200).json({
                success : true,
                countries : results
            });
        }else{
            res.status(400).json({success : false, message : "error"});
        }
    });
};

exports.verifyEntry = function(req, res) {
    db.verifyEntry(req.params.k, function(results, err){
        if(!err){
            db.getUserByHash(req.params.k, function(results, err){
                if(!err){
                    mailer.sendVerifySuccess({email : results[0].email, firstname : results[0].firstname});
                    res.redirect('https://human-connection.org/uhr-des-wandels/?ns=t');
                }
            });
        }else{
            res.redirect('https://human-connection.org/uhr-des-wandels/?ns=f');
        }
    });
};

exports.createEntry = function(req, res) {
    // process form
    let form            = new formidable.IncomingForm(),
        fields          = {},
        files           = [],
        errorFields     = [],
        requiredFields  = ['email', 'firstname', 'anon', 'message'],
        allowedFields   = ['email', 'firstname', 'lastname', 'anon', 'message', 'country', 'beta', 'newsletter', 'pax'];

    form.uploadDir      =  __dirname + '/../uploads/';
    form.keepExtensions = true;
    form.maxFields      = 5;
    form.maxFieldsSize  = 2 * 1024 * 1024;

    // Send error message back to client.
    form.parse(req).on('field', function(field, value){
        // ensure only fields allowed get into db
        if(allowedFields.indexOf(field) > -1){

            // sanitize int field
            if(field === 'anon' || field === 'beta' || field === 'newsletter' || field === 'pax'){
                value = 0 == parseInt(value) ? 0 : 1;
            }

            let index = requiredFields.indexOf(field);
            if(index > -1){
                requiredFields.splice(index, 1);

                if(value === undefined || value === ''){
                    errorFields.push(field);
                }
            }

            fields[[field]] = value;
        }
    }).on('file', function(field, file){
        files.push({
            size : file.size,
            path : file.path,
            type : file.type,
            name : file.name
        });
    }).on('end', function(){
        // no file attached (use placeholder image) - hence no errors here
        let hasFile = files.length > 0;
        let typeError = false, sizeError = false;
        if(hasFile){
            typeError     = !files[0].name.match(/\.(jpg|jpeg|png)$/i);
            sizeError     = files[0].size > form.maxFieldsSize;
        }

        // TODO: ensure valid email format
        if(requiredFields.length > 0 || typeError || sizeError || errorFields.length > 0){
            let out = {success : false};
            if(hasFile){
                fs.unlinkSync(files[0].path);
            }

            if(typeError){
                out["mimeError"] = "wrong filetype "+files[0].type
            }

            if(sizeError){
                out["sizeError"] = "file size exceeded max size "+form.maxFieldsSize;
            }

            if(requiredFields.length > 0){
                out["missingFields"] = requiredFields;
            }

            if(errorFields.length > 0){
                out["fieldErrors"] = errorFields;
            }

            res.status(400).json(out);
        }else{
            // TODO: handle ipv6
            // bundle required stuff into fields
            fields["ipv4"]  = req.ip;

            if(hasFile){
                fields["image"] = files[0].path.replace(/^.*[\\\/]/, '');

                let newFile = resize(files[0].path, 200, 200);
                fs.unlinkSync(files[0].path);
                newFile.toFile(form.uploadDir + fields["image"], (err, info) => { });
            }else{
                fields["image"] = '';
            }

            let hash = crypto.randomBytes(32).toString('hex');
            fields["randomHash"] = hash;

            // save to db
            db.saveEntry(fields, function(err, results){
                if(!err){
                    // send verification email
                    mailer.sendVerificationMail(hash, {email : fields.email, firstname : fields.firstname});

                    res.status(200).json({success : true});
                }else{
                    res.status(400).json({success : false, message : "error"});
                }
            });
        }
    });
};
