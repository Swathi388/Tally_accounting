const { User } = require('../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user already exists to prevent generic 'Validation error'
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
       return res.status(400).json({ error: 'This email is already registered. Please sign in.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Include name in payload for future schema upgrades
    const user = await User.create({ email, password: hashedPassword, name: name || undefined });
    res.status(201).json({ message: 'User created', user: { id: user.id, email: user.email } });
  } catch (err) {
    // If it's still a validation error, grab the specific field error
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
       return res.status(400).json({ error: err.errors[0].message });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
