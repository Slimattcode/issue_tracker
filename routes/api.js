'use strict';
const mongoose = require("mongoose");

// connecting to server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// default connection
const db = mongoose.connection;

// notification of connection errors
db.on("error", console.error.bind(console, "mongoBD connection error:"));

// Schema
const issuesSchema = new mongoose.Schema({
  project: String,
  issue_title: {
    type: String,
    required: true
  },
  issue_text: {
    type: String,
    required: true
  },
  created_on: Date,
  updated_on: Date,
  created_by: {
    type: String,
    required: true
  },
  assigned_to: String,
  open: Boolean,
  status_text: String,
});

//model
let Issue = mongoose.model("Issue", issuesSchema);

module.exports = function (app) {
  app.route('/api/issues/:project')
    .get(function (req, res){
      let project = req.params.project;
      let object = Object.entries(req.query).reduce((a, [k, v]) => (v ? {...a, [k]: v} : a), {});
      if (Object.entries(object).length) {
        Issue.find(object, "assigned_to status_text open _id issue_title issue_text created_by created_on updated_on", (err, data) => {
          if (err) throw new Error(`Fetching data error: ${err}`);
          return res.json(data);
        })
      } else {
        Issue.find({project: project}, "assigned_to status_text open _id issue_title issue_text created_by created_on updated_on", (err, data) => {
          if (err) throw new Error(`Fetching data error: ${err}`);
          res.json(data);
        })
      }
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let issue_title = req.body.issue_title;
      let issue_text = req.body.issue_text;
      let created_by = req.body.created_by;
      let assigned_to = req.body.assigned_to;
      let status_text = req.body.status_text;
      let issue = new Issue({
        project: project,
        issue_title: issue_title,
        issue_text: issue_text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: created_by,
        assigned_to: assigned_to === undefined ? "" : assigned_to,
        open: true,
        status_text: status_text === undefined ? "" : status_text,
      })
      issue.save((err, data) => {
        if (err) {res.json({error: "required field(s) missing"})};
        res.json(data);
      })
    })
    
    .put(function (req, res){
      let _id = req.body._id;
      if (_id === undefined || _id === "") {
        return res.json({error: "missing _id"});
      }
      let object = Object.entries(req.body).reduce((a, [k, v]) => (v ? {...a, [k]: v} : a), {});
      if (Object.entries(object).length <= 1) {
        return res.json({error: "no update field(s) sent", _id: _id});
      }
      object.updated_on = new Date()
      Issue.findByIdAndUpdate(_id, object, { useFindAndModify: false }, (err, data) => {
        if (err || data === null) {return res.json({error: "could not update", _id: _id})}
        res.json({result: "successfully updated", _id: data._id});
      })
    })
    
    .delete(function (req, res){
      let _id = req.body._id;
      if (_id === undefined || _id === "") {
        return res.json({error: "missing _id"});
      };
      Issue.findByIdAndDelete(_id, (err, data) => {
        if (err || data === null) {return res.json({error: "could not delete", _id: _id})}
        res.json({result: "successfully deleted", _id: data._id});
      })
    });

    /*Issue.deleteMany({ created_by: "Alice" }, function(err, data) {
      if (err) return `error: ${err}`
    });*/

};
