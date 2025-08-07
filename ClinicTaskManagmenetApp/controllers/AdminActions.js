const Users = require('../models/user');
const Tasks = require('../models/Task');


exports.getAllUsers = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can see all Users' });
    }
    try {
        const users = await Users.find({});
        res.status(200).json(users);


    }catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
}