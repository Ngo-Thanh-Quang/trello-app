const express = require('express');
const router = express.Router();
const inviteModel = require('../models/inviteModel');
const { authToken } = require('../middlewares/auth');
const db = require('../firebase');


// Lay danh sach duoc moi cua user
router.get('/', authToken, async (req, res) => {
    try {
        const email = req.userEmail;
        const invites = await inviteModel.getInvitationsForUser(email);

        const invitesWithBoard = await Promise.all(invites.map(async (invite) => {
            let boardData = {};
            try {
                const boardSnap = await db.collection('boards').doc(invite.board_id).get();
                if (boardSnap.exists) {
                    const data = boardSnap.data();
                    boardData = {
                        board_name: data.name || '',
                        board_description: data.description || '',
                    };
                }
            } catch (e) { }
            return { ...invite, ...boardData };
        }));
        res.status(200).json(invitesWithBoard);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy lời mời' });
    }
});

module.exports = router;