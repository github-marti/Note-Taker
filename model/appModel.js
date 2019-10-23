'user strict';
const sql = require('../db/db.js');

exports.saveNote = function(title, text, guid, result) {
    sql.query("INSERT INTO notes (note_title, note_text, guid) VALUES (?, ?, ?)", [title, text, guid], function (err, res) {
        if (err) {
            console.log(err);
            result(err, null);
        } else {
            result(null, res);
        };
    });
};

exports.getAllNotes = function(result) {
    sql.query("SELECT * FROM notes", function(err, res) {
        if(err) {
            console.log(err);
            result(err, null);
        } else {
            result(null, res);
        };
    });
};

exports.getNoteById = function(id, result) {
    sql.query("SELECT note_title, note_text FROM notes WHERE guid = ?", id, function (err, res) {
        if(err) {
            console.log(err);
            result(err, null);
        } else {
            result(null, res[0]);
        };
    });
};

exports.removeNote = function(id, result) {
    sql.query("DELETE FROM notes WHERE guid = ?", id, function(err, res) {
        if(err) {
            console.log(err);
            result(err, null);
        } else {
            result(null, res);
        };
    });
};