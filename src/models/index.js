const Type = require('./Type');
const Distributor = require('./Distributor');
const Developer = require('./Developers');
const Product = require('./Product');
const Language = require('./Language');
const ProductLanguage = require('./ProductLanguage');
const Category = require('./Category');
const ProductCategory = require('./ProductCategory');
const System = require('./System');
const Platform = require('./Platform');
const Store = require('./Store');
const RequirementSet = require('./RequirementSet');
const RequirementKey = require('./RequirementKey');
const RequirementItem = require('./RequirementItem');
const StorePlatform = require('./StorePlatform');
const PlatformSystem = require('./PlatformSystem');
const Offer = require('./Offer');
const Code = require('./Code');
const Highlight = require('./Highlight');
const ProductHighlight = require('./ProductHighlight');
const User = require('./User');
const Cart = require('./Cart');
const CartItem = require('./CartItem');

Type.hasMany(Product, { foreignKey: 'id_type' });
Distributor.hasMany(Product, { foreignKey: 'id_distributor' });
Developer.hasMany(Product, { foreignKey: 'id_developer' });
Product.belongsTo(Type, { foreignKey: 'id_type' });
Product.belongsTo(Distributor, { foreignKey: 'id_distributor' });
Product.belongsTo(Developer, { foreignKey: 'id_developer' });
Product.belongsToMany(Language, { through: ProductLanguage, foreignKey: 'id_product', otherKey: 'id_language' });
Language.belongsToMany(Product, { through: ProductLanguage, foreignKey: 'id_language', otherKey: 'id_product' });
Product.belongsToMany(Category, { through: ProductCategory, foreignKey: 'id_product', otherKey: 'id_category' });
Category.belongsToMany(Product, { through: ProductCategory, foreignKey: 'id_category', otherKey: 'id_product' });
Product.hasMany(RequirementSet, { foreignKey: 'id_product' });
RequirementSet.belongsTo(Product, { foreignKey: 'id_product' });
System.hasMany(RequirementSet, { foreignKey: 'id_system' });
RequirementSet.belongsTo(System, { foreignKey: 'id_system' });
RequirementSet.hasMany(RequirementItem, { foreignKey: 'id_requirement_set' });
RequirementItem.belongsTo(RequirementSet, { foreignKey: 'id_requirement_set' });
RequirementKey.hasMany(RequirementItem, { foreignKey: 'id_requirement_key' });
RequirementItem.belongsTo(RequirementKey, { foreignKey: 'id_requirement_key' });
Store.belongsToMany(Platform, { through: StorePlatform, foreignKey: 'id_store', otherKey: 'id_platform' });
Platform.belongsToMany(Store, { through: StorePlatform, foreignKey: 'id_platform', otherKey: 'id_store' });
Platform.belongsToMany(System, { through: PlatformSystem, foreignKey: 'id_platform', otherKey: 'id_system' });
System.belongsToMany(Platform, { through: PlatformSystem, foreignKey: 'id_system', otherKey: 'id_platform' });
Product.hasMany(Offer, { foreignKey: 'id_product' });
Offer.belongsTo(Product, { foreignKey: 'id_product' });
Store.hasMany(Offer, { foreignKey: 'id_store' });
Offer.belongsTo(Store, { foreignKey: 'id_store' });
Offer.hasMany(Code, { foreignKey: 'id_offer' });
Code.belongsTo(Offer, { foreignKey: 'id_offer'});
Product.belongsToMany(Highlight, { through: ProductHighlight, foreignKey: 'id_product', otherKey: 'id_highlight' });
Highlight.belongsToMany(Product, { through: ProductHighlight, foreignKey: 'id_highlight', otherKey: 'id_product' });
User.hasOne(Cart, { foreignKey: 'id_user' });
Cart.belongsTo(User, { foreignKey: 'id_user' });
Cart.hasMany(CartItem, { foreignKey: 'id_cart' });
CartItem.belongsTo(Cart, { foreignKey: 'id_cart' });
Offer.hasMany(CartItem, { foreignKey: 'id_offer' });
CartItem.belongsTo(Offer, { foreignKey: 'id_offer' });

module.exports = {
    Type,
    Distributor,
    Developer,
    Product,
    Language,
    ProductLanguage,
    Category,
    ProductCategory,
    System,
    Platform,
    Store,
    RequirementSet,
    RequirementKey,
    RequirementItem,
    StorePlatform,
    PlatformSystem,
    Offer,
    Code,
    Highlight,
    ProductHighlight,
    User,
    Cart,
    CartItem
};