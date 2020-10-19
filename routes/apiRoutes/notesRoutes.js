// Dependencies
const router = require('express').Router();
const { postNote, validateNote, findById, deleteByID } = require('../../lib/notes');
const shortid = require('shortid');
const { notes } = require('../../db/db');

// Notes API

router.get('/notes', (req, res) => {
    let results = notes;
    res.json(results);
});

// NOtes data by id
router.get('/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes);
    if (result) {
      res.json(result);
    } else {
      res.send(404);
    }
});

// Post new
router.post('/notes', (req, res) => {
    // sID for the new note
    req.body.id = shortid.generate();
    if(!validateNote(req.body)) {
        res.status(400).send('The note is not properly formatted.');
    } else {
        const note = postNote(req.body, notes);
        res.json(note);
    }
});

// A route for deleting a note
router.delete('/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const noteExists = findById(noteId, notes);
    if (noteExists) {
      const newNotes = deleteByID(noteId, notes);
      res.json(newNotes);
    } 
    else {
      res.send(404);
    }
})

module.exports = router;