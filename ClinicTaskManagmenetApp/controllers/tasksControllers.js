const Task = require('../models/Task');
const User = require('../models/user');




exports.createTask = async (req, res) => {

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can create tasks' });
    }
    const { title, description, assignedTo } = req.body;

    if (!title || !description || !assignedTo) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const user = await User.findById(assignedTo);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const newTask = new Task({
    title,
    description,
    assegnedTo: assignedTo, // Use the misspelled field name from schema
    createdBy: req.user.id,
    status: 'pending'
});
        await newTask.save();
        res.status(201).json({ message: 'Task created successfully', task: newTask });

    }catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
}


exports.getTasksByUser = async (req, res) => {
  try {
    const userId = req.params.userId; // assuming you pass userId in the route like /tasks/:userId

    const tasks = await Task.find({ assegnedTo: userId })
      

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for this user' });
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.GetCompletedTasks = async (req , res) => {

  try{

     if(req.user.role !== 'admin'){
        return res.status(403).json({ message: 'Forbidden: Only admins can view all completed tasks' });
     }

     const completedTasks = await Task.find({ status: 'pending' }).populate('assegnedTo', 'name email role profileImage');
      res.status(200).json(completedTasks);

  }catch(err){

    console.log(err);
    res.status(500).json({ message: 'Server error' });

  }
}

