const db = require("../firebase");

exports.getUser = async (email) => {
    const snapshot = await db.collection("user").where("email", "==", email).get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data();
}

exports.createUser = async (user) => {
  return await db.collection("user").add(user);
};

exports.updateUser = async (email, update) => {
  const snapshot = await db.collection("user").where("email", "==", email).get();
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  await doc.ref.update(update);
}


exports.getAllUsersExcept = async (emailToExclude) => {
  const snapshot = await db.collection("user").get();
  if (snapshot.empty) return [];

  const users = snapshot.docs
    .map((doc) => doc.data())
    .filter((user) => user.email && user.email.trim() !== emailToExclude?.trim());

  return users;
};
