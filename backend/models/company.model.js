module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gstNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    financialYearStart: {
      type: DataTypes.DATE,
      allowNull: false
    },
    booksBeginningFrom: {
      type: DataTypes.DATE,
      allowNull: true
    },
    features: {
      type: DataTypes.JSON,
      defaultValue: {
        maintainAccountsOnly: false,
        integrateAccountsInventory: true,
        multiCurrency: false,
        billWiseDetails: true,
        zeroValuedTransactions: false,
        multipleGodowns: false,
        stockCategories: false,
        purchaseOrders: true
      }
    }
  });

  return Company;
};
