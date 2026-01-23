const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { createNote, getNotes, getNoteById, updateNote, deleteNote } = require("../controllers/notes.controller");

router.post("/", auth, createNote);   
router.get("/", auth, getNotes); 
router.get("/:id", auth, getNoteById);
router.put("/:id", auth, updateNote);
router.delete("/:id", auth, deleteNote);    

module.exports = router;