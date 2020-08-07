const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('../logger')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

const bookmarks = [
  {
    id: 1,
    title: "Google",
    url: "http://www.google.com",
    description: "Bookmark for Google",
    rating: 5
  }
];

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks)
  })
  .post(bodyParser, (req, res) => {
    // get the data from the body
    const { title, url, description, rating } = req.body;

    // validate that bookmark fields exist
    if (!title) {
      logger.error(`Title is required`);
      return res
        .status(400)
        .send('Invalid data');
    }

    if (!url) {
      logger.error(`URL is required`);
      return res
        .status(400)
        .send('Invalid data');
    }

    if (!description) {
      logger.error(`Description is required`);
      return res
        .status(400)
        .send('Invalid data');
    }

    if (!rating) {
      logger.error(`Rating is required`);
      return res
        .status(400)
        .send('Invalid data');
    }

    // get an id 
    // if the fields do exist, then generate an ID and push a bookmark object into the array
    const id = uuid();

    const bookmark = {
      id,
      title,
      description,
      url,
      rating
    };

    try {
      const valid = validateBookmark(bookmark)
    } catch (error) {
      //
      console.log(error)
    }

    bookmarks.push(bookmark);

    // log the bookmark creation and send a response including a location header
    logger.info(`Bookmark with id ${id} created`);

    res
      .status(201)
      .location(`http://localhost:8000/card/${id}`)
      .json(bookmark);
  })

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find(bm => bm.id == id);

    // make sure we found a card
    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Bookmark Not Found');
    }

    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;
    const bookmarkIndex = bookmarks.findIndex(bm => bm.id == id);

    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Not found');
    }

    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`Bookmark with id ${id} deleted.`);

    res
      .status(204)
      .end();
  })

module.exports = bookmarksRouter