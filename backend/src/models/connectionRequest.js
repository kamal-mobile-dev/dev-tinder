const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'User'
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'User'
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['ignored', 'interested', 'accepted', 'rejected'],
        message: `{VALUE} is incorret status type`
      }
    }
  },
  { timestamps: true }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

connectionRequestSchema.pre('save', function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error('Cannnot send connection request to yourself!');
  }
  next();
});

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);
