// Dependencies
// Writing to files
const fs = require('fs');
// Path
const path = require('path')




// Post note
function postNote(body, notes) {
    
    const note = body;
    
    notes.push(note);
    
    fs.writeFileSync(
        path.join(__dirname,'../db/db.json'),
        JSON.stringify({ notes }, null, 2)
    )
    
    return note;
}

// Validate a note
function validateNote(note) {
    if(!note.title || typeof note.title !== 'string') {
        return false;
    }
    if(!note.text || typeof note.text !== 'string') {
        return false;
    }
    return true;
}

// Filter the JSON 
function findById(id, notes) {
    const result = notes.filter(note => note.id === id)[0];
    return result;
}

// A function to delete a JSON object 
function deleteByID(id, notes) {
    
    const toBeDeleted = notes.filter(note => note.id === id)[0];
   
    const indexResult = notes.indexOf(toBeDeleted);

    notes.splice(indexResult, 1);
    
    fs.writeFileSync(
        path.join(__dirname,'../db/db.json'),
        JSON.stringify({ notes }, null, 2)
    )
    // return the new notes 
    return notes;
}


// Export the functions
module.exports = {
    postNote,
    validateNote,
    findById,
    deleteByID
  };