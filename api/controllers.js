'use strict'

const fs = require('fs');
const path = require('path');
const tv4 = require('tv4');
const config = require('../config');
const util = require("util");

const SCHEMA = path.join(__dirname, '/..', config.DATA_DIR, '/reviewer-schema.json');
const DATA_PATH = path.join(__dirname, '/..', config.DATA_DIR, '/reviewer-data.json');

const readFilePromise = util.promisify(fs.readFile);
const writeFilePromise = util.promisify(fs.writeFile);
const unlinkPromise = util.promisify(fs.unlink);
const readdirPromise = util.promisify(fs.readdir);

const controllers = {
  hello: (req, res) => {
    res.json({ message: 'hello!' });
  },

  getItems: async (req, res, next) => {
    try {
      const list = await readFilePromise(DATA_PATH, 'utf-8');
      const parsedList = JSON.parse(list);
      res.json(parsedList)
    } catch (err) {
      if (err && err.code === 'ENOENT') {
        res.status(404).end();
        return;
      }
      if (err) {
        next(err);
      }
    }
  },

  getItem: async (req, res, next) => {
    const itemID = req.params.id;
    const itemIDN = Number(itemID);

    try {
      const itemContent = await readFilePromise(DATA_PATH, 'utf-8');
      const parsedContent = JSON.parse(itemContent);
      const itemWithId = parsedContent.items.find(item => item.id === itemIDN);

      if (itemWithId) {
        res.json(itemWithId);
      } else {
        res.status(404).end("No such an item with the selected id");
      }
    } catch (err) {
      if (err && err.code === 'ENOENT') {
        res.status(404).end();
        return;
      }
      if (err) {
        next(err);
      }
    }
  },


};

module.exports = controllers;
