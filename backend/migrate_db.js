const { sequelize } = require('./models');

const migrate = async () => {
  try {
    console.log('🚀 Starting Database Migration...');
    
    // Add missing columns one by one
    const queries = [
      'ALTER TABLE Transactions ADD COLUMN quantity DOUBLE DEFAULT 0',
      'ALTER TABLE Transactions ADD COLUMN rate DOUBLE DEFAULT 0',
      'ALTER TABLE Transactions ADD COLUMN unit VARCHAR(255) DEFAULT "Nos"',
      'ALTER TABLE Transactions ADD COLUMN ItemId CHAR(36) REFERENCES Items(id)'
    ];

    for (const query of queries) {
      try {
        await sequelize.query(query);
        console.log(`✅ Executed: ${query.split('ADD COLUMN ')[1]}`);
      } catch (e) {
        if (e.message.includes('duplicate column name')) {
          console.log(`ℹ️  Skipped: ${query.split('ADD COLUMN ')[1]} (already exists)`);
        } else {
          console.error(`❌ Failed: ${query}`, e.message);
        }
      }
    }

    console.log('✨ Migration Complete! Database is now Invoicing-Ready.');
    process.exit(0);
  } catch (err) {
    console.error('💥 Migration Fatal Error:', err);
    process.exit(1);
  }
};

migrate();
