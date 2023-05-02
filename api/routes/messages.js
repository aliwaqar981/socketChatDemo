const router = require('express').Router();
const Message = require('../models/Message');

// add
router.post('/', async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    const message = await newMessage.save();
    res.send(message);
  } catch (error) {
    res.status(500).json(error);
  }
});
// get
router.get('/:conversationId', async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).send(messages);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
