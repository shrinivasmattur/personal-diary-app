const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const DiaryNote = require('../models/DiaryNote');

// Simple Middleware to verify token
const authUser = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Get today's note or a specific date note
router.get('/date/:date', authUser, async (req, res) => {
    try {
        const note = await DiaryNote.findOne({ userId: req.user.id, date: req.params.date });
        res.json(note || { date: req.params.date, noteText: '', category: '' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Save or Update a note for a specific date
router.post('/', authUser, async (req, res) => {
    try {
        const { date, noteText, category } = req.body;
        // Note: update existing or create new; NO DELETE option is implemented

        let note = await DiaryNote.findOne({ userId: req.user.id, date });
        if (note) {
            note.noteText = noteText;
            note.category = category || note.category;
            await note.save();
            return res.json(note);
        }

        note = new DiaryNote({
            userId: req.user.id,
            date,
            noteText,
            category
        });

        await note.save();
        res.json(note);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Search by Month & Year, or by Category
router.get('/search', authUser, async (req, res) => {
    try {
        const { month, year, category } = req.query; // format: YYYY, MM
        let query = { userId: req.user.id };

        if (month && year) {
            query.date = { $regex: `^${year}-${month}` };
        } else if (year) {
            query.date = { $regex: `^${year}` };
        }

        if (category) {
            query.category = category;
        }

        // Exclude empty notes that might have been saved by mistake
        query.noteText = { $ne: '' };

        const notes = await DiaryNote.find(query).sort({ date: -1 });
        res.json(notes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// NO DELETE ROUTE - enforced by requirement!

module.exports = router;
