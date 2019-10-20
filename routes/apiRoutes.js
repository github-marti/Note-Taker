const db = require('../db/db.json');
const fs = require("fs");
const path = require("path");
const shortid = require("shortid");

// function to check whether user is trying to save note with the same title as an existing note
const checkDuplicates = function(array, note) {
    return array.some(el => el.title === note.title);
};

module.exports = function(app) {
    app.get("/api/notes", function(req, res) {
        data = JSON.stringify(db);
        res.json(data);
    });

    // handles post requests
    app.post("/api/notes", function(req, res) {
        let newNote = req.body;

        // creates GUID for giving each note a unique ID
        let GUID = shortid.generate();
        newNote.id = GUID;

        // if the note title isn't a duplicate
        if (!checkDuplicates(db, newNote)) {

            // push the new note to the db array
            db.push(newNote);
            let newDB = JSON.stringify(db);

            // and write over the db file with the new db json
            fs.writeFile(path.join(__dirname, '../db/db.json'), newDB, 'utf8', function(err) {
                if (err) throw err;
                console.log('file appended successfully!');
            })
            res.json(newNote.title);
        
        // otherwise send back false
        } else {
            console.log('duplicate found');
            res.send(false);
        };
    });

    // handles delete requests
    app.delete("/delete/:title", function(req, res) {
        let noteToDelete = req.params;

        // remove the note to delete from the db array
        for (let i = 0; i < db.length; i++) { 
            if (db[i].title === noteToDelete.title) {
              db.splice(i, 1); 
            };
        };

        let newDB = JSON.stringify(db);

        // write over existing json file with new db json
        fs.writeFile(path.join(__dirname, '../db/db.json'), newDB, 'utf8', function(err) {
            if (err) throw err;
            console.log('file deleted successfully!');
        });

        res.json(noteToDelete.title);
    })
};