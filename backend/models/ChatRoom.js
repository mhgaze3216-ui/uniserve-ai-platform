const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user','consultant','system'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatRoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  messages: [chatMessageSchema]
}, { timestamps: true });

chatRoomSchema.methods.addMessage = function(sender, content){
  this.messages.push({ sender, content });
  return this.save();
};

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
