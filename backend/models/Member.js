const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [60, 'Name cannot exceed 60 characters']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  avatar: {
    type: String,
    default: ''
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  phone: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on-leave'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Auto-generate avatar initials
memberSchema.pre('save', function(next) {
  if (this.isModified('name') || !this.avatar) {
    this.avatar = this.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
  next();
});

module.exports = mongoose.model('Member', memberSchema);
