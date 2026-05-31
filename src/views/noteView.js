const renderNote = (note) => {
  return {
    id: note._id,
    title: note.title,
    content: note.content,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt
  };
};

const renderNoteList = (notes) => {
  return notes.map(note => renderNote(note));
};

const renderMessage = (message) => {
  return { message };
};

module.exports = {
  renderNote,
  renderNoteList,
  renderMessage
};
