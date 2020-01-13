CREATE DATABASE notes_DB;

USE notes_DB;

CREATE TABLE notes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  note_title VARCHAR(200) NOT NULL,
  note_text VARCHAR(200) NOT NULL,
  guid VARCHAR(200) NOT NULL
);
 
INSERT INTO notes (note_title, note_text, guid)
VALUES ('Test Note Title', 'Test note text', 'abcdef12345');

SELECT * FROM notes;

DELETE FROM notes WHERE guid = "abcdef12345";
