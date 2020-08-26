const express = require('express');
// const MongoClient = require('mongodb').MongoClient;
const monk = require('monk');
let ejs = require('ejs');

const pdf = require('html-pdf');
// const pdfTemplate = require('./pdf');
// const Joi = require('@hapi/joi');

const db = monk(process.env.MONGO_URI);
db.then(() => {
  console.log('REPO3 : Connected correctly to server');
});
const REPO3 = db.get('REPO3');

const router = express.Router();

//POST - pdf generation and fetching of data (partydetail)
router.post('/create-pdf', (req, res) => {
  console.log("req", req.body);
  ejs.renderFile('src/api/pdf.ejs', (req.body), {}, (err, str) => {
    // str => Rendered HTML string
    if (err) {
      console.log(err)
    } else {
      console.log(str)
    }
    pdf.create(str).toFile('./src/api/assets/result.pdf', (err) => {
      console.log('babu')
      if (err) {
        res.send(err);
      }
      res.send("File created successfully");
    });
  })

});

//GET - send the generated pdf to client (partydetail)
router.get('/fetch-pdf', (req, res) => {
  res.sendFile(`${__dirname}/assets/result.pdf`)
})

//POST - pdf generation and fetching of data of particular party (partylist)
router.post('/create-pdf-s', (req, res) => {
  console.log("req", req.body);
  ejs.renderFile('src/api/pdf-s.ejs', (req.body), {}, (err, str) => {
    // str => Rendered HTML string
    if (err) {
      console.log(err)
    } else {
      console.log(str)
    }
    pdf.create(str).toFile('./src/api/assets/result-s.pdf', (err) => {
      console.log('babu')
      if (err) {
        res.send(err);
      }
      res.send("File created successfully");
    });
  })

});

//GET - send the generated pdf to client (partylist)
router.get('/fetch-pdf-s', (req, res) => {
  res.sendFile(`${__dirname}/assets/result-s.pdf`)
})

//get list of parties
router.get('/listofparties', async (req, res, next) => {
  try {
    const items = await REPO3.aggregate(
      [
        {
          "$group": {
            _id: {
              partyName: "$partyName",
              brokerName: "$brokerName"
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
})

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
})

module.exports = router;