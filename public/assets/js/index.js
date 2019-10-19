const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".fa-save");
const $deleteNoteBtn = $(".delete-btn");
const $newNoteBtn = $(".fa-pencil-alt");
const $noteList = $(".list-container");

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

// A function for saving a note to the db
const saveNote = function(note) {
    $.post("/api/notes", note, function(data) {
        if (data) {
            renderNoteList(note);
            console.log("note has been saved!");
        } else if (!data) {
            $noteText.val("You can't save two notes with the same title!")
            $noteText.prop("readonly", true);
            setTimeout(function() {
                $noteText.val('');
                $noteText.prop("readonly", false);
            }, 1500);
            console.log("check the code, note hasn't been saved.");
        }
      });
};

// A function for deleting a note from the db
const deleteNote = function(title) {
    $.post(`/delete/${title}`, title, function(data) {
        if (data) {
          console.log(`note with the title ${data} has been deleted!!`);
        } else if (!data) {
          console.log("check the code, note hasn't been deleted.");
        }
      });
};

// If there is an activeNote, display it, otherwise render empty inputs
const renderActiveNote = function() {
    if (activeNote) {
        $noteTitle.val(activeNote.title);
        $noteText.val(activeNote.text);
    }
};

// Get the note data from the inputs, save it to the db and update the view
const handleNoteSave = function() {
    activeNote = { 
        title: $noteTitle.val(), 
        text: $noteText.val()
    };
    
    $noteTitle.val('');
    $noteText.val('');

    saveNote(activeNote);

    $('.fa-save').attr('style', 'display:none');
};

// Delete the clicked note
const handleNoteDelete = function(event) {
    event.preventDefault();
    let title = $(this).parent().text();
    $(this).parent().remove();
    deleteNote(title);
};

// Sets the activeNote and displays it
const handleNoteView = function() {
    let thisNote = $(this).text();
    $.get('/api/notes', function(data) {
        let notes = JSON.parse(data);
        for (el of notes) {
            if (el.title === thisNote) {
                activeNote.title = el.title;
                activeNote.text = el.text;
                renderActiveNote();
            };
        };
    });
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = function() {
    console.log('new note ready');
    activeNote = {};
    renderActiveNote();
};

// If a note's title or text are empty, hide the save button
// Or else show it
const handleRenderSaveBtn = function() {
    if ($noteTitle.val() === '' || $noteText.val() === '') {
        $('.fa-save').attr('style', 'display:none');
    } else {
        $('.fa-save').attr('style', 'display:inline-block');
    };
};

// Render's the list of note titles
const renderNoteList = function(note) {

  let listItem = $('<div>').addClass('list-group-item');
  let deleteIcon = $('<i>').addClass('fas fa-trash-alt float-right delete-btn');

  listItem.text(note.title);
  listItem.append(deleteIcon);
  $('.list-container').prepend(listItem);
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = function() {
    $.get('/api/notes', function(data) {
        const noteObject = JSON.parse(data);
        noteObject.map(el => {
            renderNoteList(el);
        })
    });
};

getAndRenderNotes();

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".fa-trash-alt", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

