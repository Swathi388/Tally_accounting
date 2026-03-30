const { Company, Group } = require('./backend/models');

async function debug() {
    try {
        const companies = await Company.findAll();
        console.log(`Found ${companies.length} companies.`);
        companies.forEach(c => console.log(`- ${c.name} (${c.id})`));
        
        if (companies.length === 0) {
            console.log("No companies in DB. User needs to create one.");
        }
    } catch (err) {
        console.error("Debug Error:", err);
    } finally {
        process.exit();
    }
}
debug();
