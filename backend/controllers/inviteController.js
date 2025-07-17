const inviteModel = require('../models/inviteModel');
const db = require('../firebase');

// Gui loi moi
exports.inviteToBoard = async (req, res) => {
    const { member_id, email_member, status = 'pending' } = req.body;
    const boardId = req.params.boardId;
    const board_owner_id = req.userEmail; // email nguoi tao bao

    if (!member_id) {
        return res.status(400).json({ message: 'Thieu member_id' });
    }

    try {
        const invitation = await inviteModel.createInvitation({
            invite_id: Date.now().toString(), 
            board_owner_id,
            board_id: boardId,
            member_id,
            email_member,
            status,
        });
        // Lay thong tin tu db
        
        let boardName = '', boardDescription = '';
        try {
            const boardSnap = await db.collection('boards').doc(boardId).get();
            if (boardSnap.exists) {
                const data = boardSnap.data();
                boardName = data.name || '';
                boardDescription = data.description || '';
            }
        } catch (e) {}
        // Ham gui email
        const emailUtils = require('../utils/email');
        emailUtils.sendBoardInviteEmail(email_member, boardName, boardDescription);
        return res.status(200).json({ success: true, invitation });
    } catch (error) {
        console.error('Err:', error);
        return res.status(500).json({ message: 'Fail' });
    }
};

// Chap nhna hoac tu choi loi moi
exports.acceptInvite = async (req, res) => {
    const { invite_id, card_id, member_id, status } = req.body;
    if (!invite_id || !member_id || !status) {
        return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    try {
        const result = await inviteModel.updateInvitationStatus({
            invite_id,
            card_id,
            member_id,
            status,
        });
        return res.status(200).json({ success: true, result });
    } catch (error) {
        console.error('Lỗi xác nhận lời mời:', error);
        return res.status(500).json({ message: 'Xác nhận lời mời thất bại' });
    }
};
// Lay danh sach member(email) da duoc moi
exports.getInvitedEmails = async (req, res) => {
    const boardId = req.params.boardId;
    try {
        const emails = await inviteModel.getInvitedEmailsForBoard(boardId);
        res.json(emails);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch invited emails" });
    }
};

//Lay danh sach member (email + name + image) da duoc moi voi status accepted
exports.getAcceptedMembers = async (req, res) => {
    const boardId = req.params.boardId;
    try {
        const snapshot = await db.collection("invitations")
            .where("board_id", "==", boardId)
            .where("status", "==", "accepted")
            .limit(100)
            .get();
        const emails = snapshot.docs.map(doc => doc.data().email_member);
        // lay thong tin tu emails
        const userModel = require("../models/userModel");
        const members = await Promise.all(emails.map(email => userModel.getUser(email)));
        res.json(members.filter(Boolean)); 
    } catch (err) {
        console.error('Error in getAcceptedMembers:', err);
        res.status(500).json({ error: "Failed to fetch accepted members" });
    }
};