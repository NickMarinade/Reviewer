'use strict'

const fs = require('fs');
const path = require('path');
const tv4 = require('tv4');
const config = require('../config');

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

};

module.exports = controllers;
