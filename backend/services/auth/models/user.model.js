import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    unique: true
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true
  },
  avatar : {
    type: String,
  }
},{
   timestamps: true 
});

const User = mongoose.model('User', userSchema);
export default User;