const db = require("../firebase");

// Tao loi moi
exports.createInvitation = async (data) => {
  const docRef = await db.collection("invitations").add(data);
  return { ...data, id: docRef.id };
};

// Cap nhat trang thai loi moi
exports.updateInvitationStatus = async ({ invite_id, card_id, member_id, status }) => {
  const snapshot = await db.collection("invitations")
    .where("invite_id", "==", invite_id)
    .where("member_id", "==", member_id)
    .limit(5)
    .get();
  if (snapshot.empty) throw new Error('Không tìm thấy lời mời');
  const doc = snapshot.docs[0];
//Chi update card_id if it exists
  const updateData = { status };
  if (typeof card_id !== 'undefined') updateData.card_id = card_id;

  await doc.ref.update(updateData);
  return { ...doc.data(), ...updateData };
};

// Lay danh sach loi moi cua user
exports.getInvitationsForUser = async (email_member) => {
  const snapshot = await db.collection("invitations")
    .where("email_member", "==", email_member)
    .where("status", "==", "pending")
    .limit(50)
    .get();
  return snapshot.docs.map(doc => doc.data());
};

exports.getInvitedEmailsForBoard = async (board_id) => {
  const snapshot = await db.collection("invitations")
    .where("board_id", "==", board_id)
    .where("status", "in", ["pending", "accepted", "declined"])
    .limit(100)
    .get();
  return snapshot.docs.map(doc => doc.data().email_member);
};