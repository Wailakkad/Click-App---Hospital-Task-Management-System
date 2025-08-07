const User = require('../models/user').User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });

    }catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
        return;
    }
}