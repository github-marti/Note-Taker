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
        // if browser receives a response, clear the text areas and add the note to the list
        if (data) {
            activeNote.guid = data;
            renderNoteList(activeNote);
        } else {
            console.log("note was not saved");
        }
      });
};

// A function for deleting a note from the db
const deleteNote = function(id) {
    $.ajax({url: `/note/${id}`, 
            type: 'DELETE',
            data: id,
            success: function(data) {
                if (data) {
                  console.log(`note with the title ${data} has been deleted!!`);
                } else if (!data) {
                  console.log("check the code, note hasn't been deleted.");
                };
              }
            });
};
   

// If there is an activeNote, display it, otherwise render empty inputs
const renderActiveNote = function() {
    if (activeNote) {
        $noteTitle.val(activeNote.note_title);
        $noteText.val(activeNote.note_text);
    }
};

// Get the note data from the inputs, save it to the db and update the view
const handleNoteSave = function() {

    activeNote = { 
        note_title: $noteTitle.val(), 
        note_text: $noteText.val()
    };

    saveNote(activeNote);

    $noteTitle.val('');
    $noteText.val('');

    $('.fa-save').attr('style', 'display:none');
};

// Delete the clicked note
const handleNoteDelete = function() {
    let id = $(this).parent().attr('data-index');
    $(this).parent().remove();
    deleteNote(id);
};

// Sets the activeNote and displays it
const handleNoteView = function() {
    let id = $(this).attr("data-index");
    $.get(`/note/${id}`, function(note) {
        activeNote.note_title = note.note_title;
        activeNote.note_text = note.note_text;
        renderActiveNote();
    });
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = function() {
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

  listItem.text(note.note_title);
  listItem.attr('data-index', note.guid);
  listItem.append(deleteIcon);
  $('.list-container').prepend(listItem);
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = function() {
    $.get('/api/notes', function(data) {
        data.map(note => renderNoteList(note));
    });
};

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".fa-trash-alt", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

getAndRenderNotes();

