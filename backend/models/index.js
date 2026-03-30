const sequelize = require('../config/db.config');
const { DataTypes } = require('sequelize');

const User = require('./user.model')(sequelize, DataTypes);
const Company = require('./company.model')(sequelize, DataTypes);
const Group = require('./group.model')(sequelize, DataTypes);
const Ledger = require('./ledger.model')(sequelize, DataTypes);
const Voucher = require('./voucher.model')(sequelize, DataTypes);
const Transaction = require('./transaction.model')(sequelize, DataTypes);
const Item = require('./item.model')(sequelize, DataTypes);
const BankTransaction = require('./bankTransaction.model')(sequelize, DataTypes);
const SalesOrder = require('./salesOrder.model')(sequelize, DataTypes);
const PurchaseOrder = require('./purchaseOrder.model')(sequelize, DataTypes);
const AuditLog = require('./audit.model')(sequelize, DataTypes);

// Associations
User.belongsToMany(Company, { through: 'UserCompanies' });
Company.belongsToMany(User, { through: 'UserCompanies' });

Company.hasMany(Group);
Group.belongsTo(Company);

Group.hasMany(Ledger);
Ledger.belongsTo(Group);

Group.hasMany(Group, { as: 'SubGroups', foreignKey: 'parent_id' });
Group.belongsTo(Group, { as: 'ParentGroup', foreignKey: 'parent_id' });

Company.hasMany(Ledger);
Ledger.belongsTo(Company);

Company.hasMany(Voucher);
Voucher.belongsTo(Company);

Voucher.hasMany(Transaction);
Transaction.belongsTo(Voucher);

Ledger.hasMany(Transaction);
Transaction.belongsTo(Ledger);

Company.hasMany(Item);
Item.belongsTo(Company);

Company.hasMany(BankTransaction);
BankTransaction.belongsTo(Company);

Ledger.hasMany(SalesOrder);
SalesOrder.belongsTo(Ledger);
Company.hasMany(SalesOrder);
SalesOrder.belongsTo(Company);

Ledger.hasMany(PurchaseOrder);
PurchaseOrder.belongsTo(Ledger);
Company.hasMany(PurchaseOrder);
PurchaseOrder.belongsTo(Company);

Company.hasMany(AuditLog);
AuditLog.belongsTo(Company);
User.hasMany(AuditLog);
AuditLog.belongsTo(User);

Item.hasMany(Transaction);
Transaction.belongsTo(Item);

module.exports = {
  sequelize,
  User,
  Company,
  Group,
  Ledger,
  Voucher,
  Transaction,
  Item,
  BankTransaction,
  SalesOrder,
  PurchaseOrder,
  AuditLog
};
