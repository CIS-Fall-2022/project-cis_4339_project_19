const express = require("express");
const router = express.Router();

//importing data model schemas
let { eventdata } = require("../models/models"); 

//GET all entries
router.get("/", (req, res, next) => { 
    eventdata.find( 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//GET single entry by ID
router.get("/id/:id", (req, res, next) => { 
    eventdata.find({ _id: req.params.id }, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

//GET entries based on search query
//Ex: '...?eventName=Food&searchBy=name' 
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { eventName: { $regex: `^${req.query["eventName"]}`, $options: "i" } }
    } else if (req.query["searchBy"] === 'date') {
        dbQuery = {
            date:  req.query["eventDate"]
        }
    };
    eventdata.find( 
        dbQuery, 
        (error, data) => { 
            if (data.length===0) {
                error = Error('Event not found', { statusCode: 404 })
            }
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//GET events for which a client is signed up
router.get("/client/:id", (req, res, next) => { 
    eventdata.find( 
        { attendees: req.params.id }, 
        (error, data) => { 
            
            if (data.length===0) {
                error = Error('Id not found', { statusCode: 404 })
            }
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//POST - Create an event entry
router.post("/", (req, res, next) => { 
    eventdata.create( 
        req.body, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//PUT - Find an event by id and update
router.put("/:id", (req, res, next) => {
    eventdata.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//PUT add attendee to event
router.put("/addAttendee/:id", (req, res, next) => {
    //only add attendee if not yet signed uo
    eventdata.find( 
        { _id: req.params.id, attendees: req.body.attendee }, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                if (data.length == 0) {
                    eventdata.updateOne(
                        { _id: req.params.id }, 
                        { $addToSet: { attendees: req.body.attendee } },
                        (error, data) => {
                            if (data.modifiedCount==0){
                                error = Error('attendee is already added', { statusCode: 404 })
                            }
                            if (error) {
                                return next(error);
                            } else {
                                res.json(data);
                            }
                        }
                    );
                }
                
            }
        }
    );
    
});
// delete eventdata entry by id
// Route based off the following link: https://www.bezkoder.com/node-express-mongodb-crud-rest-api/#Delete_an_object
router.delete("/:id", (req, res, next) => {
    eventdata.findByIdAndRemove(
        { _id: req.params.id },
        req.body,
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});
//Get the clients from the past two months
// Route based off the following link: https://mongoosejs.com/docs/api.html
//https://www.mongodb.com/docs/manual/reference/operator/query/gte/, https://www.mongodb.com/docs/manual/reference/operator/query/lt/
router.get("/pasttwo", (req, res, next) => {
    let previousD = new Date();
    previousD.setMonth(previousD.getMonth() - 2);
    eventdata.find({"date": { "$gte": previousD, "$lt": new Date()}, "Org_Id": process.env.primarydata},
     (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.json(data);
        }
    });
});



module.exports = router;
