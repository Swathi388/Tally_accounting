const { Item } = require('../../models');

exports.createItem = async (req, res) => {
  try {
    const { 
      name, unit, openingStock, standardRate, companyId,
      type, sellingPrice, salesAccount, salesDescription,
      costPrice, purchaseAccount, purchaseDescription, preferredVendor, imageUrl
    } = req.body;
    
    const item = await Item.create({
      name,
      unit,
      openingStock: openingStock || 0,
      currentStock: openingStock || 0,
      standardRate: standardRate || 0,
      type: type || 'Goods',
      sellingPrice: sellingPrice || 0,
      salesAccount: salesAccount || 'Sales',
      salesDescription,
      costPrice: costPrice || 0,
      purchaseAccount: purchaseAccount || 'Cost of Goods Sold',
      purchaseDescription,
      preferredVendor,
      imageUrl,
      CompanyId: companyId
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const { companyId } = req.params;
    const items = await Item.findAll({ where: { CompanyId: companyId } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity, type } = req.body; // type: 'add' or 'subtract'
    const item = await Item.findByPk(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const newStock = type === 'add' 
      ? parseFloat(item.currentStock) + parseFloat(quantity)
      : parseFloat(item.currentStock) - parseFloat(quantity);
    
    await item.update({ currentStock: newStock });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
