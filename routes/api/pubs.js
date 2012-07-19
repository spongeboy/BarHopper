

var mongoose = require('mongoose');



//TODO - Put in model file
// model
mongoose.connect('mongodb://localhost/test');

var Pub = mongoose.model('Pub', new mongoose.Schema({})); //any thing goes schema
//end of model

exports.pubs = function(req, res){

    //res.render('index', { title: 'BarHopper' });

    return Pub.find(function(err, pubs) {
        return res.send(pubs);
    });
};

exports.pub_by_id = function(req, res){
    return Pub.findById(req.params.id, function(err, pub) {
        if (!err) {
            return res.send(pub);
        }
    });
};

exports.pub_update = function(req, res){
    return Pub.findById(req.params.id, function(err, pub) {
        pub.name = req.body.name;
        pub.address = req.body.address;
        return pub.save(function(err) {
            if (!err) {
                console.log("updated");
            }
            return res.send(pub);
        });
    });
};

exports.pub_create = function(req, res){
    var pub;
    pub = new Pub({
        name: req.body.name,
        address: req.body.address
    });
    pub.save(function(err) {
        if (!err) {
            return console.log("created");
        }
    });
    return res.send(pub);
};

exports.pub_delete = function(req, res){
    return Pub.findById(req.params.id, function(err, pub) {
        return pub.remove(function(err) {
            if (!err) {
                console.log("removed");
                return res.send('')
            }
        });
    });
};

exports.pubs_near = function(req, res){

    var long = parseFloat(req.params.long);
    var lat = parseFloat(req.params.lat);

    Pub.db.db.executeDbCommand({geoNear : "pubs", near : [long,lat], spherical: true, maxDistance : 300 / 6378, num : 2  },
        function(err,res) {
            console.log(res.documents[0].results);
            return res.send(res);
        });

    /*return Pub.find({"location" : { "geoNear" : [ long, lat ] } }, {spherical : true },function(err,pubs){
        if (!err) {
            console.log("Long:" + req.params.long + ",Lat:" + req.params.lat);
            return res.send(pubs);
        }
    });
    */

    /*return Pub.find({"location" : { "$nearSphere" : [ long, lat ] } },function(err,pubs){
        if (!err) {
            console.log("Long:" + req.params.long + ",Lat:" + req.params.lat);
            return res.send(pubs);
        }
    });
    */
};



