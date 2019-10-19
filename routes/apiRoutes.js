const db = require('../db/db.json');
const fs = require("fs");
const path = require("path");
const shortid = require("shortid");

const checkDuplicates = function(array, note) {
    for (let i = 0; i < array.length; i++) {
        console.log(array[i].title);
        if (array[i].title === note.title) {
            return false;
        };
    };
    return true;
};

module.exports = function(app) {
    app.get("/api/notes", function(req, res) {
        data = JSON.stringify(db);
        res.json(data);
    });

    app.post("/api/notes", function(req, res) {
        let newNote = req.body;
        let GUID = shortid.generate();
        newNote.id = GUID;

        if (checkDuplicates(db, newNote)) {
            db.push(newNote);
            console.log('db is', db);
            let newDB = JSON.stringify(db);
            fs.writeFile(path.join(__dirname, '../db/db.json'), newDB, 'utf8', function(err) {
                if (err) throw err;
                console.log('file appended successfully!');
            })
            res.json(newNote.title);
        } else {
            console.log('duplicate found');
            res.json(false);
        };
    });

    app.post("/delete/:title", function(req, res) {
        let noteToDelete = req.params;
        for (let i = 0; i < db.length; i++) { 
            if (db[i].title === noteToDelete.title) {
              db.splice(i, 1); 
            };
        };
        let newDB = JSON.stringify(db);
        fs.writeFile(path.join(__dirname, '../db/db.json'), newDB, 'utf8', function(err) {
            if (err) throw err;
            console.log('file deleted successfully!');
        });

        res.json(noteToDelete.title);
    })
};