const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

const columns = [
  'openingBalanceType VARCHAR(255)',
  'description TEXT',
  'gstNumber VARCHAR(255)',
  'address TEXT',
  'email VARCHAR(255)',
  'phone VARCHAR(255)',
  'creditLimit DOUBLE'
];

db.serialize(() => {
  let pending = columns.length;
  columns.forEach(col => {
    db.run(`ALTER TABLE Ledgers ADD COLUMN ${col}`, err => {
      console.log(col, err ? err.message : 'OK');
      pending--;
      if (pending === 0) {
        db.close();
        console.log("Migration finished.");
      }
    });
  });
});
