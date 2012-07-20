

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

exports.pubs_near_with_distances = function(req, res){

    var lon = parseFloat(req.params.lon);
    var lat = parseFloat(req.params.lat);

    var range = 300 / 6378; //300KM (result in radians, earth radius is 6378km)
    var numberOfPubs = 6;

    return Pub.db.db.executeDbCommand({geoNear : "pubs", near : [lon,lat], spherical: true, maxDistance : range, num : numberOfPubs  },
        function(err,pubs) {
            if (!err) {
                console.log(pubs.documents[0].results);
                return res.send(pubs.documents[0].results);
            }
        });
};

exports.pubs_near = function(req, res){

    var lon = parseFloat(req.params.lon);
    var lat = parseFloat(req.params.lat);

    var numberOfPubs = 20;

    /*
    //Chaining example
    var q = Pub.find({"location" : { "$nearSphere" : [ lon, lat ] } }).limit(numberOfPubs);

    return q.execFind(function(err,pubs){
        if (!err) {
            console.log("Long:" + req.params.lon + ",Lat:" + req.params.lat);
            return res.send(pubs);
        }
    });
    */


    return Pub.find({"location" : { "$nearSphere" : [ lon, lat ] } },[],{limit: numberOfPubs},function(err,pubs){
        if (!err) {
            console.log("Long:" + req.params.lon + ",Lat:" + req.params.lat);
            return res.send(pubs);
        }
    });


};


