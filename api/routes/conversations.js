const router = require('express').Router();
const Conversation = require('../models/Conversation');

// new conv
router.post('/', async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.recieverId],
  });

  try {
    const saveConversation = await newConversation.save();
    res.send(saveConversation);
  } catch (error) {
    res.status(500).json(error);
  }
});
// get conv of user
router.get('/:userId', async (req, res) => {
  try {
    const conv = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.send(conv);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
