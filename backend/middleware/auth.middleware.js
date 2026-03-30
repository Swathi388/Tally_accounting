const jwt = require('jsonwebtoken');
const { User, Company } = require('../models');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token failed' });
  }
};

exports.tenantAccess = async (req, res, next) => {
  const companyId = req.headers['x-company-id'];
  if (!companyId) {
    return res.status(400).json({ error: 'Company context required' });
  }
  
  // Verify if user belongs to this company
  const user = await User.findByPk(req.user.id, {
    include: [{ model: Company, where: { id: companyId } }]
  });

  if (!user || user.Companies.length === 0) {
    return res.status(403).json({ error: 'Access denied to this company' });
  }

  req.companyId = companyId;
  next();
};
