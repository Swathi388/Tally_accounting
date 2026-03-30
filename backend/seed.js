const { sequelize, Company, Group, Ledger, User } = require('./models');
const bcrypt = require('bcryptjs');
const { standardGroups } = require('./helpers/tallyGroups');

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('🗑️  Database cleared and synced.');

    // ─── 1. Create Admin User ──────────────────
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await User.create({
      email: 'admin@tally.com',
      password: hashedPassword,
      role: 'Admin'
    });
    console.log('✅ Admin user created: admin@tally.com / admin123');

    // ─── 2. Create Company ─────────────────────
    const company = await Company.create({
      name: 'Indus Enterprises Pvt Ltd',
      gstNumber: '29ABCDE1234F1Z5',
      address: 'Sector 12, Business Park, Bengaluru, Karnataka 560001',
      financialYearStart: new Date('2024-04-01')
    });
    await company.addUser(user);
    console.log('✅ Company created:', company.name);

    // ─── 3. Seed Standard Tally Groups ─────────
    const primaryGroups = standardGroups.filter(g => !g.parent);
    const groupMap = {};

    for (const g of primaryGroups) {
      const created = await Group.create({
        name: g.name,
        nature: g.nature,
        category: 'Primary',
        CompanyId: company.id
      });
      groupMap[g.name] = created.id;
    }

    const subGroups = standardGroups.filter(g => g.parent);
    for (const g of subGroups) {
      const created = await Group.create({
        name: g.name,
        nature: g.nature,
        category: 'Sub-Group',
        parent_id: groupMap[g.parent] || null,
        CompanyId: company.id
      });
      groupMap[g.name] = created.id;
    }
    console.log(`✅ ${Object.keys(groupMap).length} Tally groups created.`);

    // ─── 4. Create Default Ledgers ─────────────
    const ledgers = [
      { name: 'Cash Account', group: 'Cash-in-Hand', opening: 50000 },
      { name: 'HDFC Bank Current A/c', group: 'Bank Accounts', opening: 250000 },
      { name: 'ICICI Bank Savings', group: 'Bank Accounts', opening: 125000 },
      { name: 'Domestic Sales', group: 'Sales Accounts', opening: 0 },
      { name: 'Export Sales', group: 'Sales Accounts', opening: 0 },
      { name: 'Domestic Purchases', group: 'Purchase Accounts', opening: 0 },
      { name: 'Office Rent', group: 'Indirect Expenses', opening: 0 },
      { name: 'Salaries & Wages', group: 'Indirect Expenses', opening: 0 },
      { name: 'Electricity Charges', group: 'Indirect Expenses', opening: 0 },
      { name: 'Telephone Expenses', group: 'Indirect Expenses', opening: 0 },
      { name: 'GST Output (IGST)', group: 'Duties & Taxes', opening: 0 },
      { name: 'GST Input (IGST)', group: 'Duties & Taxes', opening: 0 },
      { name: 'TDS Payable', group: 'Duties & Taxes', opening: 0 },
      { name: 'Sundry Debtors - Client A', group: 'Sundry Debtors', opening: 85000 },
      { name: 'Sundry Creditors - Vendor X', group: 'Sundry Creditors', opening: 42000 },
      { name: 'Owner Capital', group: 'Capital Account', opening: 500000 },
      { name: 'Computers & IT Equipment', group: 'Fixed Assets', opening: 175000 },
      { name: 'Office Furniture', group: 'Fixed Assets', opening: 85000 },
    ];

    for (const l of ledgers) {
      await Ledger.create({
        name: l.name,
        openingBalance: l.opening,
        currentBalance: l.opening,
        GroupId: groupMap[l.group] || null,
        CompanyId: company.id
      });
    }
    console.log(`✅ ${ledgers.length} ledgers created.`);

    console.log('\n🚀 Seed complete! Your Tally system is ready.');
    console.log('   Login: admin@tally.com / admin123');
    console.log(`   Company ID: ${company.id}`);
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
};

seed();
