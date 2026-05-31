const Note = require("../models/Note");
const { renderNote, renderNoteList, renderMessage } = require("../views/noteView"); 

const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.userId;

    if (!title) {
      return res.status(400).json(renderMessage("Title is required"));
    }

    const note = await Note.create({ user: userId, title, content });
    
    res.status(201).json(renderNote(note));
  } catch (error) {
    res.status(500).json(renderMessage("Server error"));
  }
};

const getNotes = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notes = await Note.find({ user: userId });
    
    res.json(renderNoteList(notes));
  } catch (error) {
    res.status(500).json(renderMessage("Server error"));
  }
};

const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json(renderMessage("Note not found"));
    }

    if (note.user.toString() !== req.user.userId) {
      return res.status(403).json(renderMessage("Access denied"));
    }

    res.json(renderNote(note));
  } catch (error) {
    res.status(500).json(renderMessage("Server error"));
  }
};

const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json(renderMessage("Note not found"));
    }

    if (note.user.toString() !== req.user.userId) {
      return res.status(403).json(renderMessage("Access denied"));
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;

    await note.save();

    res.json(renderNote(note));
  } catch (error) {
    console.error("UPDATE NOTE ERROR:", error);
    res.status(500).json(renderMessage("Server error"));
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json(renderMessage("Note not found"));
    }

    if (note.user.toString() !== req.user.userId) {
      return res.status(403).json(renderMessage("Access denied"));
    }

    await note.deleteOne();

    res.json(renderMessage("Note deleted successfully"));
  } catch (error) {
    res.status(500).json(renderMessage("Server error"));
  }
};

module.exports = { createNote, getNotes, getNoteById, updateNote, deleteNote };