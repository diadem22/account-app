import express from 'express';
import { createUser, login } from '../controllers/users.controller';

const router = express.Router();

// Route to create a new user
router.post('/register', async (req, res) => {
  const { username, password, email, userType } = req.body;
  await createUser(username, password, email, userType)
    .then((user) =>
      res.status(200).json({
        message: 'User successfully created',
        id: user._id,
      }),
    )
    .catch((error) =>
      res.status(400).json({
        message: 'User not successful created',
        error: error.message,
      }),
    );
});

// Route to login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const loggedInUser = await login(email, password);
    if (loggedInUser) {
      res.status(200).json(loggedInUser);
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
