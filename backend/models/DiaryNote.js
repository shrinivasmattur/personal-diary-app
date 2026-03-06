const mongoose = require('mongoose');

const DiaryNoteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    noteText: { type: String, default: '' },
    category: {
        type: String,
        enum: ['Special Moment', 'Important Information', 'Bad News', ''],
        default: ''
    }
}, { timestamps: true });

// Optional: Ensure a user only has one note per date to easily edit "today's note"
DiaryNoteSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DiaryNote', DiaryNoteSchema);
