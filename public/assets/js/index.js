var $noteTitle = $(".note-title");
var $noteText = $(".note-textarea");
var $saveNoteBtn = $(".save-note");
var $newNoteBtn = $(".new-note");
var $noteList = $(".list-container .list-group");

// Track note
var activeNote = {};

// GET notes from the db
var getNotes = function() {
  return $.ajax({
    url: "/api/notes",
    method: "GET"
  });
};

// Save to the db
var saveNote = function(note) {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST"
  });
};

// Delete notes on db
var deleteNote = function(id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE"
  });
};

// Display notes
var renderActiveNote = function() {
  $saveNoteBtn.hide();

  if (activeNote.id) {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

// Edit, clear
var handleEditBtn = function(event) {
  event.stopPropagation();

  $newNoteBtn.hide();
  $saveNoteBtn.show();

  var note = $(this)
  .parent(".list-group-item")
  .data();

  if (activeNote.id === note.id) {
    $saveNoteBtn.show();
  }

  $noteTitle.attr("readonly", false);
  $noteText.attr("readonly", false);
  $noteTitle.val(note.title);
  $noteText.val(note.text);

  deleteNote(note.id)

};

// get , save, show on db
var handleNoteSave = function() {
  var newNote = {
    title: $noteTitle.val(),
    text: $noteText.val()
  };

  saveNote(newNote).then(function(data) {
    getAndRenderNotes();
    renderActiveNote();
    $newNoteBtn.show();
  });
};

// delete note
var handleNoteDelete = function(event) {
  
  event.stopPropagation();

  var note = $(this)
    .parent(".list-group-item")
    .data();

  if (activeNote.id === note.id) {
    activeNote = {};
  }

  deleteNote(note.id).then(function() {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Displays active note
var handleNoteView = function() {
  activeNote = $(this).data();
  renderActiveNote();
};

// Enter a new note
var handleNewNoteView = function() {
  activeNote = {};
  renderActiveNote();
};

// if empty note then hide save btn, else, show save btn
var handleRenderSaveBtn = function() {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

// Title list
var renderNoteList = function(notes) {
  $noteList.empty();

  var noteListItems = [];

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];

    var $li = $("<li class='list-group-item'>").data(note);
    var $span = $("<span>").text(note.title);
    var $editSpan = $("<span class = 'edit-note'>");
    var $editBtn = $(
      "<i class='far fa-edit float-left text-info'></i>"
    );
    var $delSpan = $("<span class = 'delete-note'>");
    var $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger'>"
    );
    
    $editSpan.append($editBtn);
    $delSpan.append($delBtn);
    $li.append($editSpan, $span, $delSpan);
    noteListItems.push($li);
  }

  $noteList.append(noteListItems);
};

// shows on left side bar db notes
var getAndRenderNotes = function() {
  return getNotes().then(function(data) {
    renderNoteList(data);
  });
};

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".edit-note", handleEditBtn);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);


getAndRenderNotes();
