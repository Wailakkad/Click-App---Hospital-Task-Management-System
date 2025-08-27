const User = require('../models/user');
const resetToken = require('../models/resetToken');
const bcrypt = require('bcryptjs'); 
const crypto = require("crypto");
const jwt = require('jsonwebtoken');


// POST /api/auth/register
exports.register = async (req, res) => {
    const { name, email, password, profileImage, role } = req.body;

    if (!name || !email || !password) { 
        return res.status(400).json({ message: 'All fields are required' });
    }

    try{
        const existUser = await User.find({ email });
        if (existUser.length > 0) {
            return res.status(400).json({ message: 'User already exists , use diffirent info' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            passwordHash,
            profileImage: profileImage || null, // default to null if no image is provided
            role: role || 'staff' // default to 'staff' if no role is provided
        });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    }
    catch(err) {

     console.log(err);
     res.status(500).json({ message: 'Server error' });
     return;
  
   }

}

// POST /api/auth/login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, image: user.profileImage ,role: user.role } });

    }catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
        return;
    }
}

// POST /api/auth/forgotpassword
exports.forgotPassword = async (req, res) => {
    try{
        const { email } = req.body || {} ;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const user = await User.findOne({ email });
         // Always return the same response for privacy, even if user not found
          if (!user) {
              return res.json({
               message:
                 "If an account exists for that email, a reset link has been generated.",
              });
           }
           const token = crypto.randomBytes(32).toString("hex");
    const ttlMs = Number(process.env.TOKEN_TTL_MINUTES || 15) * 60 * 1000;
    const expiresAt = new Date(Date.now() + ttlMs);

    const newResetToken = new resetToken({
       userId: user._id,
       token,
       createdAt: new Date(),
       expiresAt,
    });

    await newResetToken.save();

    const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";
    const resetLink = `${clientOrigin}/reset/${token}`;

    // DEV: log the link to the server console
    console.log("🔗 Password reset link:", resetLink);

    // PROD (optional): send email with Nodemailer/SendGrid here

    return res.json({
      message:
        "If an account exists for that email, a reset link has been generated.",
    });
          
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
        return;
    }
}

// POST /api/auth/reset-password/:token
exports.restePassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body || {};
    if (!token) return res.status(400).json({ message: "Token is required" });
    if (!password || password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const record = await resetToken.findOne({ token });
    if (!record) return res.status(400).json({ message: "Invalid token" });

    const expiryMs = 3600 * 1000; // 1 hour
if (record.createdAt.getTime() + expiryMs < Date.now()) {
  await resetToken.deleteOne({ _id: record._id });
  return res.status(400).json({ message: "Token has expired" });
}

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
    const hash = await bcrypt.hash(password, saltRounds);

    // Update user's passwordHash field
    await User.updateOne({ _id: record.userId }, { $set: { passwordHash: hash } });

    // Single-use token: delete after use
    await resetToken.deleteOne({ _id: record._id });

    return res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}