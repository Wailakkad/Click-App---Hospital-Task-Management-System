const jwt = require('jsonwebtoken');



const middleware = (req , res , next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Received token:', token); 
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }


    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next(); // Proceed to the next middleware or route handler

}catch(err) {  
        console.log(err);
        return res.status(500).json({ message: 'Server error' });
    
}
};

module.exports = middleware;