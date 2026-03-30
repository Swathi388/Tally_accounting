const { Item, Company } = require('./models');

const createProduct = async () => {
  try {
    const company = await Company.findOne({ order: [['createdAt', 'DESC']] });
    if (!company) return console.log('No company found.');

    const newItem = await Item.create({
      name: 'Professional Laptop - X1 Carbon',
      unit: 'Nos',
      openingStock: 25,
      currentStock: 25,
      sellingPrice: 125000,
      gstRate: 18,
      CompanyId: company.id
    });

    console.log(`✅ Success: Created sellable product: ${newItem.name}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createProduct();
