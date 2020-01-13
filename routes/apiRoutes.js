const shortid = require("shortid");
const noteTaker = require("../model/appModel.js")

module.exports = function(app) {
    // handles get request for all notes and note create request
    app.route("/api/notes")
        .get(function(req, res) {
            noteTaker.getAllNotes(function(err, notes) {
                if (err) throw (err);
                res.send(notes);
            });
        })
        .post(function(req, res) {
            let newNote = req.body;
            newNote.guid = shortid.generate();
            const {note_title, note_text, guid} = newNote;
            noteTaker.saveNote(note_title, note_text, guid, function(err) {
                if (err) throw (err);
                res.send(guid);
            });
        });

    // handles requests to get or delete a specific note
    app.route("/note/:id")
        .get(function(req, res) {
            noteTaker.getNoteById(req.params.id, function(err, data) {
                if (err) throw err;
                res.send(data);
            });
        })
        .delete(function(req, res) {
            noteTaker.removeNote(req.params.id, function(err, data) {
                if (err) throw err;
                res.send(data);
        });
    })
};