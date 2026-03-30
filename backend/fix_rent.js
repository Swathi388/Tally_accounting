const { Group, Ledger } = require('./models');

async function fix() {
  try {
    const groups = await Group.findAll();
    const rentGroups = groups.filter(g => g.name.toLowerCase() === 'rent');
    
    console.log('Found groups named "rent" (IDs):', rentGroups.map(g => ({id: g.id, name: g.name})));

    if (rentGroups.length > 1) {
      for (let i = rentGroups.length - 1; i >= 0; i--) {
        const group = rentGroups[i];
        const ledgerCount = await Ledger.count({ where: { GroupId: group.id } });
        const subGroupCount = await Group.count({ where: { parent_id: group.id } });
        
        console.log(`Group ${group.id} (${group.name}): ledgers=${ledgerCount}, subgroups=${subGroupCount}`);
        
        if (ledgerCount === 0 && subGroupCount === 0) {
          console.log(`Deleting empty duplicate rent group ${group.id}`);
          await group.destroy();
          console.log('Deleted successfully.');
          return;
        }
      }
      console.log('Could not find an empty duplicate group to safely delete.');
    } else {
      console.log(`Found ${rentGroups.length} groups for "rent".`);
    }

    // Check ledgers just in case
    const ledgers = await Ledger.findAll();
    const rentLedgers = ledgers.filter(l => l.name.toLowerCase() === 'rent');
    if (rentLedgers.length > 1) {
      console.log('Found duplicate ledgers named "rent":', rentLedgers.map(l => ({id: l.id, name: l.name})));
      let duplicateDeleted = false;
      for (let i = rentLedgers.length - 1; i >= 0; i--) {
        const ledger = rentLedgers[i];
        if (Number(ledger.currentBalance) === 0 && Number(ledger.openingBalance) === 0) {
           console.log(`Deleting duplicate Rent Ledger ${ledger.id}`);
           await ledger.destroy();
           console.log('Deleted ledger successfully.');
           duplicateDeleted = true;
           break;
        }
      }
      if (!duplicateDeleted) console.log('Could not safely delete duplicate ledger as balances are non-zero.');
    }

  } catch (err) {
    console.error(err);
  }
}

fix();
