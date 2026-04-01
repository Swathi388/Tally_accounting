const { Company, Group } = require('./models');
const { standardGroups } = require('./helpers/tallyGroups');

async function fixGroups() {
  try {
    const companies = await Company.findAll();
    
    for (const company of companies) {
      const groupCount = await Group.count({ where: { CompanyId: company.id } });
      if (groupCount === 0) {
        console.log(`Company "${company.name}" has no groups. Seeding standard groups...`);
        
        const primaryGroups = standardGroups.filter(g => !g.parent);
        const groupMap = {};

        // 1. Create Primary Groups
        for (const g of primaryGroups) {
          const created = await Group.create({
            name: g.name,
            nature: g.nature,
            category: 'Primary',
            CompanyId: company.id
          });
          groupMap[g.name] = created.id;
        }

        // 2. Create Sub-Groups
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
        console.log(`✅ Default groups created for ${company.name}`);
      }
    }
    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
fixGroups();
