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

  createItem: async (req, res, next) => {
    const newItem = req.body;

    try {
      const itemContent = await readFilePromise(DATA_PATH, 'utf-8');
      const parsedContent = JSON.parse(itemContent);

      newItem.id = parsedContent.nextId;
      parsedContent.nextId++;

      const isValid = tv4.validate(newItem, SCHEMA);

      if (!isValid) {
        const error = tv4.error;
        console.error(error);

        res.status(400).json({
          error: {
            message: error.message,
            dataPath: error.dataPath
          }
        });
        return
      }

      parsedContent.items.push(newItem);
      
      const dataToString = JSON.stringify(parsedContent, null, ' ');
      await writeFilePromise(DATA_PATH, dataToString);
      res.json(newItem);
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

  updItem: async (req, res, next) => {
    const updId = Number(req.params.id);
    const item = req.body;
    item.id = updId;
    const isValid = tv4.validate(item, SCHEMA)


    if (!isValid) {
      const error = tv4.error
      console.error(error)

      res.status(400).json({
        error: {
          message: error.message,
          dataPath: error.dataPath
        }
      })
      return
    }

    try {
      const itemContent = await readFilePromise(DATA_PATH, 'utf-8');
      const parsedContent = JSON.parse(itemContent);

      const entrytoUpdate = parsedContent.items.find(item => item.id === updId);

      if (entrytoUpdate) {
        const itemIndex = parsedContent.items.indexOf(entrytoUpdate);
        parsedContent.items[itemIndex] = item;
        const dataToString = JSON.stringify(parsedContent, null, ' ');
        await writeFilePromise(DATA_PATH, dataToString);
        res.json(item);
      } else {
        res.json('No item with requested id')
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

  deleteItem: async (req, res, next) => {
    const itemId = req.params.id;
    const idToDelete = Number(itemId);

    try {
      const itemContent = await readFilePromise(DATA_PATH, 'utf-8');
      const parsedContent = JSON.parse(itemContent);

      const entryToDelete = parsedContent.items
        .find(item => item.id === idToDelete);
      if (entryToDelete) {

        parsedContent.items = parsedContent.items.filter(item => item.id !== entryToDelete.id);

        const dataToString = JSON.stringify(parsedContent, null, '  ');

        await writeFilePromise(DATA_PATH, dataToString);

        res.json('Item deleted');
      } else {
        res.send('No item with requested id');
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
