const userControl = require('../controllers/userControl');
const { authenticate } = require('../middleware/auth');

module.exports = function(app) {
  app.get('/users', authenticate, getUsersByUsername);
  app.get('/users/:id', authenticate, getUserById);
  app.get('/allusers', authenticate, getAllUsers)
  app.post('/users/add', addUser);
  app.post('/users/update', authenticate, updateUser);
  app.post('/users/login', login);
  app.delete('/users/:id', authenticate, deleteUser);
};

async function getUsersByUsername(req, res) {
  try {
    const username = req.query.username;
    const users = await userControl.getUsersByUsername(username);
    if(users) 
    {
      res.status(200).json(users);
    }else
    {
      res.status(404).json({ message: 'User not found' });
    }
  } 
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getUserById(req, res) {
  try {
    const id = req.params.id;
    const users = await userControl.getUserById(id);
    if(users) 
    {
      res.status(200).json(users);
    }else
    {
      res.status(404).json({ message: 'User not found' });
    }
  } 
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getAllUsers(req, res) {
  try {
    const username = req.query.username;
    const users = await userControl.getAllUsers();
    if(users) 
    {
      res.status(200).json(users);
    }else
    {
      res.status(404).json({ message: 'User not found' });
    }
  } 
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function addUser(req, res) {
  try {
    const newUser = req.body.user;
    const user = await userControl.addUser(newUser);
    res.status(201).json(user);
  } catch (error) {
    if (error.message === 'User already exists') {
      return res.status(409).json({ message: error.message });
    }
    if (error.message === 'Missing user data') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}

async function updateUser(req, res) {
  try {
    const userToUpdate = req.body.user;
    console.log("Updating user:", userToUpdate);
    const updated = await userControl.updateUser(userToUpdate);
    console.log("Updated user:", updated);
    if (updated) 
    {
      res.status(200).json(updated);
    }
    else 
    {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

 

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) 
  {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  try {
    const user = await userControl.loginUser(username, password);
    if (user) 
    {
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteUser(req, res) {
  try{
    const userId = parseInt(req.params.id);
    if(!userId)
    {
      return res.status(400).json({ message: 'UserId is required'});
    }

    const deleted = await userControl.deleteUser(userId);
    if(deleted)
    {
      res.status(200).json({ message: `User ${userId} deleted successfully`})
    }
    else
    {
      res.status(404).json({ message: 'User not found' });
    }
  } catch(error){
    res.status(500).json({ message: error.message });
  }
}
