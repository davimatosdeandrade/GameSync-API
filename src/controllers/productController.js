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
                    {
                        model: Category,
                        required: false,
                        where: { dt_deletedAt: null },
                        attributes: ['id_category', 'nm_name'],
                        through: { attributes: [] },
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
                    categories: data.Categories?.map(c => ({
                        id: c.id_category,
                        name: c.nm_name,
                    })) ?? [],
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
                            {
                                model: Category,
                                required: false,
                                where: { dt_deletedAt: null },
                                attributes: ['id_category', 'nm_name'],
                                through: { attributes: [] },
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
                        categories: data.Categories?.map(c => ({
                            id: c.id_category,
                            name: c.nm_name,
                        })) ?? [],
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
    },

    async getSimilarProducts(req, res, next) {
        try {
            const id = req.params.id || req.query.id;
            if (!id) {
                return res.status(400).json({ message: 'Product ID is required.' });
            }

            const targetProduct = await Product.findOne({
                where: { id_product: id, dt_deletedAt: null },
                include: [
                    {
                        model: Category,
                        attributes: ['id_category', 'nm_name'],
                        through: { attributes: [] },
                        where: { dt_deletedAt: null },
                        required: false,
                    },
                ],
            });

            if (!targetProduct) {
                return res.status(404).json({ message: 'Product not found.' });
            }

            const categoryIds = targetProduct.Categories?.map(c => c.id_category) ?? [];
            const candidateScores = new Map();

            // 1. Prioriza produtos com categorias em comum
            if (categoryIds.length > 0) {
                const categoryMatches = await Product.findAll({
                    attributes: ['id_product', 'id_developer', 'id_distributor', 'id_type'],
                    where: {
                        id_product: { [Sequelize.Op.ne]: targetProduct.id_product },
                        dt_deletedAt: null,
                    },
                    include: [
                        {
                            model: Category,
                            attributes: ['id_category'],
                            through: { attributes: [] },
                            where: {
                                id_category: { [Sequelize.Op.in]: categoryIds },
                                dt_deletedAt: null,
                            },
                            required: true,
                        },
                    ],
                });

                for (const prod of categoryMatches) {
                    const sharedCount = prod.Categories?.length || 0;
                    let score = sharedCount * 10;
                    if (prod.id_developer === targetProduct.id_developer) score += 5;
                    if (prod.id_distributor === targetProduct.id_distributor) score += 2;
                    if (prod.id_type === targetProduct.id_type) score += 1;
                    candidateScores.set(prod.id_product, score);
                }
            }

            // 2. Considera tambem produtos do mesmo desenvolvedor
            if (targetProduct.id_developer) {
                const devMatches = await Product.findAll({
                    attributes: ['id_product', 'id_developer', 'id_distributor', 'id_type'],
                    where: {
                        id_developer: targetProduct.id_developer,
                        id_product: { [Sequelize.Op.ne]: targetProduct.id_product },
                        dt_deletedAt: null,
                    },
                });

                for (const prod of devMatches) {
                    if (!candidateScores.has(prod.id_product)) {
                        let score = 5;
                        if (prod.id_distributor === targetProduct.id_distributor) score += 2;
                        if (prod.id_type === targetProduct.id_type) score += 1;
                        candidateScores.set(prod.id_product, score);
                    }
                }
            }

            // Ordena os similares pela pontuacao de afinidade (decrescente)
            const sortedSimilarIds = Array.from(candidateScores.entries())
                .sort((a, b) => b[1] - a[1])
                .map(([prodId]) => prodId);

            // Retorna entre 5 a 10 produtos (limite padrao maximo de 10)
            const requestedLimit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
            const maxLimit = Math.min(Math.max(Number.isNaN(requestedLimit) ? 10 : requestedLimit, 5), 10);
            let selectedIds = sortedSimilarIds.slice(0, maxLimit);

            // 3. Se houver menos de 5 produtos parecidos, completa com outros produtos ativos ate atingir o minimo de 5
            const MIN_PRODUCTS = 5;
            if (selectedIds.length < MIN_PRODUCTS) {
                const excludedIds = [targetProduct.id_product, ...selectedIds];
                const fillerProducts = await Product.findAll({
                    attributes: ['id_product'],
                    where: {
                        id_product: { [Sequelize.Op.notIn]: excludedIds },
                        dt_deletedAt: null,
                    },
                    order: [
                        [Sequelize.literal(`id_type = ${Number(targetProduct.id_type)}`), 'DESC'],
                        ['dt_release', 'DESC'],
                        ['id_product', 'ASC'],
                    ],
                    limit: MIN_PRODUCTS - selectedIds.length,
                });

                selectedIds = [...selectedIds, ...fillerProducts.map(p => p.id_product)];
            }

            if (!selectedIds.length) {
                return res.status(200).json({ data: [] });
            }

            // 4. Busca os dados completos dos produtos selecionados
            const products = await Product.findAll({
                where: { id_product: selectedIds },
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
                    {
                        model: Category,
                        required: false,
                        where: { dt_deletedAt: null },
                        attributes: ['id_category', 'nm_name'],
                        through: { attributes: [] },
                    },
                ],
            });

            const offersByProduct = await getOffersByProductIds(selectedIds);

            // Preserva a ordem de relevancia dos IDs selecionados
            const productMap = new Map(products.map(p => [p.id_product, p]));
            const orderedProducts = selectedIds.map(prodId => productMap.get(prodId)).filter(Boolean);

            const formatted = orderedProducts.map(p => {
                const data = p.toJSON();
                return {
                    id: data.id_product,
                    name: data.nm_name,
                    type: data.Type ? { id: data.Type.id_type, name: data.Type.nm_name } : null,
                    cover: data.Medias?.[0] ? {
                        id: data.Medias[0].id_media,
                        type: data.Medias[0].tp_type,
                        aspect: data.Medias[0].tp_aspect,
                        url: data.Medias[0].url,
                    } : null,
                    categories: data.Categories?.map(c => ({
                        id: c.id_category,
                        name: c.nm_name,
                    })) ?? [],
                    offers: offersByProduct[data.id_product] ?? [],
                };
            });

            return res.status(200).json({ data: formatted });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = productController;