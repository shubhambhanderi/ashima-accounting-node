const express = require('express');
// const MongoClient = require('mongodb').MongoClient;
const monk = require('monk');
let ejs = require('ejs');

// const pdf = require('html-pdf');
// const pdfTemplate = require('./pdf');
// const Joi = require('@hapi/joi');

const db = monk(process.env.MONGO_URI);
db.then(() => {
  console.log('REPO3 : Connected correctly to server');
});

//collections
const REPO3 = db.get('REPO3');
const DailyReport = db.get('DailyReport');
const BeamStock = db.get('BeamStock');
const WorpingMeter = db.get('WorpingMeter');
const StockReport = db.get('StockReport');
const XH69Report = db.get('XH69Report');
const MetaData = db.get('MetaData');

const router = express.Router();


//get Date
router.get(('/metadata'), async (req, res, next) => {
  try {
    const items = await MetaData.find({});
    res.json(items);
  } catch (error) {
    next(error);
  }
});

//get Report
router.get(('/report'), async (req, res, next) => {
  try {
    const items = await XH69Report.find({});
    res.json(items);
  } catch (error) {
    next(error);
  }
});

//get list of parties
router.get('/listofparties', async (req, res, next) => {
  try {
    const items = await REPO3.aggregate(
      [
        {
          "$group": {
            _id: {
              partyName: "$partyName",
              brokerName: "$brokerName",
              OYN: "$OYN",
            }
          }
        }
      ]
    );
    res.json(items);
  } catch (error) {
    next(error);
  }
});

//get party data
router.get('/partydata/:pn/:bn', async (req, res, next) => {
  try {
    // console.log(req.params);
    const { pn, bn } = req.params;
    const items = await REPO3.find(
      { "partyName": pn, "brokerName": bn }
    );
    res.json(items);
  } catch (error) {
    next(error);
  }
});

//get party data
router.get('/partydata/', async (req, res, next) => {
  try {
    // console.log(req.params);
    const { pn, bn } = req.params;
    const items = await REPO3.find({});
    res.json(items);
  } catch (error) {
    next(error);
  }
});

//getDailyReport
router.get('/dailyreport/', async (req, res, next) => {
  try {
    const items = await DailyReport.find({});
    res.json(items);
  } catch (error) {
    next(error);
  }
});

//getBeamStock
router.get('/beamstock/', async (req, res, next) => {
  try {
    const items = await BeamStock.find({});
    res.json(items);
  } catch (error) {
    next(error);
  }
});

//getWorpingMeter
router.get('/worpingmeter/', async (req, res, next) => {
  try {
    const items = await WorpingMeter.find({});
    res.json(items);
  } catch (error) {
    next(error);
  }
});

//getStockReport
router.get('/stockreport/', async (req, res, next) => {
  try {
    const items = await StockReport.find({});
    res.json(items);
  } catch (error) {
    next(error);
  }
});

module.exports = router;