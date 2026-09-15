const Sequelize = require('sequelize');
const {
    Product, Offer, Category, Media, Type,
    Developer, Distributor, Language, Store,
    Code, Highlight,
} = require('../models');

async function getOffersByProductIds(productIds) {
    if (!productIds.length) return {};

    const offers = await Offer.findAll({
        where: { dt_deletedAt: null, id_product: productIds },
        attributes: [
            'id_offer',
            'id_product',
            'vl_price',
            [Sequelize.fn('COUNT', Sequelize.col('Codes.id_code')), 'stock'],
        ],
        include: [
            {
                model: Store,
                required: true,
                where: { dt_deletedAt: null },
                attributes: ['id_store', 'nm_name'],
            },
            {
                model: Code,
                required: false,
                where: { tp_status: 'available', dt_deletedAt: null },
                attributes: [],
            },
        ],
        group: ['Offer.id_offer', 'Store.id_store'],
        subQuery: false,
    });

    return offers.reduce((acc, o) => {
        const data = o.toJSON();
        if (Number(data.stock) <= 0) return acc;

        if (!acc[data.id_product]) acc[data.id_product] = [];
        acc[data.id_product].push({
            id: data.id_offer,
            price: data.vl_price,
            stock: Number(data.stock),
            store: { id: data.Store.id_store, name: data.Store.nm_name },
        });
        return acc;
    }, {});
}

const productController = {
    async getCatalog(req, res, next) {
        try {
            const { search } = req.query;

            const where = { dt_deletedAt: null };
            if (search) {
                where.nm_name = { [Sequelize.Op.like]: `%${search}%` };
            }

            const products = await Product.findAll({
                where,
                attributes: ['id_product', 'nm_name'],
                include: [
                    {
                        model: Type,
                        required: true,
                        where: { dt_deletedAt: null },
                        attributes: ['id_type', 'nm_name'],
                    },
                    {
                        model: Media,
                        as: 'Medias',
                        required: false,
                        where: { tp_type: 'cover', tp_aspect: '9:16', dt_deletedAt: null },
                        attributes: ['id_media', 'tp_type', 'tp_aspect', 'url'],
                    },
                ],
            });

            const productIds = products.map(p => p.id_product);
            const offersByProduct = await getOffersByProductIds(productIds);

            const formatted = products.map(p => {
                const data = p.toJSON();
                return {
                    id: data.id_product,
                    name: data.nm_name,
                    type: { id: data.Type.id_type, name: data.Type.nm_name },
                    cover: data.Medias?.[0] ? {
                        id: data.Medias[0].id_media,
                        type: data.Medias[0].tp_type,
                        aspect: data.Medias[0].tp_aspect,
                        url: data.Medias[0].url,
                    } : null,
                    offers: offersByProduct[data.id_product] ?? [],
                };
            });

            return res.status(200).json({ data: formatted });
        } catch (error) {
            next(error);
        }
    },

    async getHighlights(req, res, next) {
        try {
            const highlights = await Highlight.findAll({
                where: { dt_deletedAt: null },
                attributes: ['id_highlight', 'nm_name'],
                include: [
                    {
                        model: Product,
                        required: true,
                        where: { dt_deletedAt: null },
                        attributes: ['id_product', 'nm_name'],
                        include: [
                            {
                                model: Type,
                                required: true,
                                where: { dt_deletedAt: null },
                                attributes: ['id_type', 'nm_name'],
                            },
                            {
                                model: Media,
                                required: false,
                                where: { tp_type: 'cover', tp_aspect: '16:9', dt_deletedAt: null },
                                attributes: ['id_media', 'tp_type', 'tp_aspect', 'url'],
                                as: 'Medias',
                            },
                        ],
                    },
                ],
            });

            const allProductIds = highlights.flatMap(h => h.Products.map(p => p.id_product));
            const offersByProduct = await getOffersByProductIds(allProductIds);

            const formatted = highlights.map(h => {
                const data = h.toJSON();
                return {
                    id: data.id_highlight,
                    name: data.nm_name,
                    products: data.Products?.map(p => ({
                        id: p.id_product,
                        name: p.nm_name,
                        type: { id: p.Type.id_type, name: p.Type.nm_name },
                        cover: p.Medias?.[0] ? {
                            id: p.Medias[0].id_media,
                            type: p.Medias[0].tp_type,
                            aspect: p.Medias[0].tp_aspect,
                            url: p.Medias[0].url,
                        } : null,
                        offers: offersByProduct[p.id_product] ?? [],
                    })) ?? [],
                };
            });

            return res.status(200).json({ data: formatted });
        } catch (error) {
            next(error);
        }
    },

    async getProductByPk(req, res, next) {
        try {
            const { id } = req.params;

            const product = await Product.findOne({
                where: { id_product: id, dt_deletedAt: null },
                attributes: ['id_product', 'nm_name', 'ds_desc', 'dt_release'],
                include: [
                    {
                        model: Type,
                        required: true,
                        where: { dt_deletedAt: null },
                        attributes: ['id_type', 'nm_name'],
                    },
                    {
                        model: Distributor,
                        required: true,
                        where: { dt_deletedAt: null },
                        attributes: ['id_distributor', 'nm_name'],
                    },
                    {
                        model: Developer,
                        required: true,
                        where: { dt_deletedAt: null },
                        attributes: ['id_developer', 'nm_name'],
                    },
                    {
                        model: Media,
                        required: false,
                        where: { dt_deletedAt: null, tp_type: ['screenshot', 'trailer', 'gameplay', 'cover'], },
                        attributes: ['id_media', 'tp_type', 'tp_aspect', 'url'],
                        as: 'Medias',
                        order: [
                            [Sequelize.literal(`FIELD(tp_type, 'screenshot', 'trailer', 'gameplay', 'cover')`), 'ASC'],
                        ],
                    },
                    {
                        model: Language,
                        required: false,
                        where: { dt_deletedAt: null },
                        attributes: ['id_language', 'nm_name'],
                        through: { attributes: ['bt_audio', 'bt_interface', 'bt_subtitles'] },
                    },
                    {
                        model: Category,
                        required: false,
                        where: { dt_deletedAt: null },
                        attributes: ['id_category', 'nm_name'],
                    },
                ],
            });

            if (!product) {
                return res.status(404).json({ message: 'Product not found.' });
            }

            const offersByProduct = await getOffersByProductIds([product.id_product]);
            const data = product.toJSON();

            const formatted = {
                id: data.id_product,
                name: data.nm_name,
                desc: data.ds_desc,
                release: data.dt_release,
                type: data.Type ? { id: data.Type.id_type, name: data.Type.nm_name } : null,
                distributor: data.Distributor ? { id: data.Distributor.id_distributor, name: data.Distributor.nm_name } : null,
                developer: data.Developer ? { id: data.Developer.id_developer, name: data.Developer.nm_name } : null,
                medias: data.Medias?.map(m => ({
                    id: m.id_media, 
                    type: m.tp_type, 
                    aspect: m.tp_aspect, 
                    url: m.url,
                })) ?? [],
                languages: data.Languages?.map(l => {
                    const pivot = l.tb_product_languages || l.ProductLanguage;
                    return {
                        id: l.id_language,
                        name: l.nm_name,
                        audio: pivot?.bt_audio ?? false,
                        interface: pivot?.bt_interface ?? false,
                        subtitles: pivot?.bt_subtitles ?? false,
                    };
                }) ?? [],
                categories: data.Categories?.map(c => ({ 
                    id: c.id_category, 
                    name: c.nm_name 
                })) ?? [],

                offers: offersByProduct[data.id_product] ?? [],
            };

            return res.status(200).json({ data: formatted });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = productController;