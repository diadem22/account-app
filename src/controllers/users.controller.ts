import { User } from 'src/models/users';

export async function createUser(username, password, email, userType) {
  const user = await User.create({
    username: username,
    password: password,
    email: email,
    userType: userType,
  });

  try {
    const result = await user.save();
    return result;
  } catch (ex) {
    return ex.errors.message;
  }
}

export async function login(email, password) {
  try {
    const result = await User.findOne({
      attributes: ['username', 'email'],
      where: { email: email, password: password },
    });

    return result;
  } catch (error) {
    console.error('Login failed:', error.message);
    throw error;
  }
}
