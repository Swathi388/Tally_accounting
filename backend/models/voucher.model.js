module.exports = (sequelize, DataTypes) => {
  const Voucher = sequelize.define('Voucher', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    voucherType: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['Payment', 'Receipt', 'Sales', 'Purchase', 'Journal', 'Contra', 'Debit Note', 'Credit Note']]
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    narration: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    voucherNumber: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Voucher;
};
