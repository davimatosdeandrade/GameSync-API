const Sequelize = require('sequelize');
const { Product, Offer, Category, Media, Type, Developer, Distributor, Language, Store } = require('../models');

const productController = {
    async getCatalog(req, res, next) {
        try {
            const catalog = await Product.findAll({
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
                        where: { tp_type: 'cover', tp_aspect: '9:16', dt_deletedAt: null },
                        attributes: ['id_media', 'tp_type', 'tp_aspect', 'url'], 
                    },
                    {
                        model: Offer,
                        required: false,
                        where: { dt_deletedAt: null },
                        attributes: ['id_offer', 'vl_price'],  
                        include: {
                            model: Store,
                            required: true,
                            where: { dt_deletedAt: null },
                            attributes: ['id_store', 'nm_name'], 
                        },
                    },
                ],
                subQuery: false,
            });

            const formatted = catalog.map(p => {
                const data = p.toJSON();
                return {
                    id: data.id_product,
                    name: data.nm_name,
                    type: { 
                        id: data.Type.id_type, 
                        name: data.Type.nm_name, 
                    },
                    cover: data.Medias?.[0] ? {
                        id: data.Medias[0].id_media,
                        type: data.Medias[0].tp_type,
                        aspect: data.Medias[0].tp_aspect,
                        url: data.Medias[0].url,
                    } : [],
                    offers: data.Offers?.map(o => ({
                        id: o.id_offer,
                        price: o.vl_price,
                        store: { 
                            id: o.Store.id_store, 
                            name: o.Store.nm_name, 
                        },
                    })) ?? [],
                };
            });

            return res.status(200).json({ data: formatted });
        } catch (error) {
            next(error);
        };
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
                        attributes: ['id_product','nm_name'],
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
                            },
                            {
                                model: Offer,
                                required: false,
                                where: { dt_deletedAt: null },
                                attributes: ['id_offer', 'vl_price'],
                                include: [
                                    {
                                        model: Store,
                                        required: true,
                                        where: { dt_deletedAt: null },
                                        attributes: ['id_store', 'nm_name'],
                                    },
                                ],
                            },
                        ],
                    },
                ],
                subQuery: false,
                group: ['Highlight.id_highlight', 'Products.id_product'],
            });

            const formatted = highlights.map(h => {
                const data = h.toJSON();
                return {
                    id: data.id_highlight,
                    name: data.nm_name,
                    products: data.Products?.map(p => ({
                        id: p.id_product,
                        name: p.nm_name,
                        type: { 
                            id: p.Type.id_type, 
                            name: p.Type.nm_name,
                        },
                        cover: p.Medias?.[0] ? { 
                            id: p.Medias[0].id_media, 
                            type: p.Medias[0].tp_type, 
                            aspect: p.Medias[0].tp_aspect, 
                            url: p.Medias[0].url, 
                        } : [],
                        offers: p.Offers?.map(o => ({
                            id: o.id_offer,
                            price: o.vl_price,
                            store: { 
                                id: o.Store.id_store, 
                                name: o.Store.nm_name,
                            },
                        })) ?? [],
                    })) ?? [],
                };
            });

            return res.status(200).json({ data: formatted });
        } catch (error) {
            next(error);
        };
    },

    async getProductByPk(req, res, next) {
        try {
            const { id } = req.params;

            const product = await Product.findByPk(id, {
                attributes: ['id_product', 'nm_name', 'ds_desc', 'dt_release'],
                include: [
                    {
                        model: Type,
                        attributes: ['id_type', 'nm_name'],
                        where: { dt_deletedAt: null },
                        required: false,
                    },
                    {
                        model: Distributor,
                        attributes: ['id_distributor', 'nm_name'],
                        where: { dt_deletedAt: null },
                        required: false,
                    },
                    {
                        model: Developer,
                        attributes: ['id_developer', 'nm_name'],
                        where: { dt_deletedAt: null },
                        required: false,
                    },
                    {
                        model: Media,
                        attributes: ['id_media', 'tp_type', 'url', 'order_index'],
                        where: { dt_deletedAt: null },
                        required: null,
                    },
                    {
                        model: Language,
                        attributes: ['id_language', 'nm_name'],
                        through: {
                            attributes: ['bt_audio', 'bt_interface', 'bt_subtitles'],
                        },
                        where: { dt_deletedAt: null },
                        required: false,
                    },
                    {
                        model: Category,
                        attributes: ['id_category', 'nm_name'],
                        where: { dt_deletedAt: null },
                        required: false,
                    }
                ],
            });

            if (!product || product.dt_deletedAt) {
                return res.status(404).json({ message: 'Product not found.' });
            }

            const data = product.toJSON();

            const formatted = {
                id: data.id_product,
                name: data.nm_name,
                desc: data.ds_desc,
                release: data.dt_release,
                type: data.Type ? { id: data.Type.id_type, name: data.Type.nm_name } : null,
                distributor: data.Distributor ? { id: data.Distributor.id_distributor, name: data.Distributor.nm_name } : null,
                developer: data.Developer ? { id: data.Developer.id_developer, name: data.Developer.id_developer } : null,

                medias: data.Media?.map(m => ({
                    id: m.id_media,
                    type: m.tp_type,
                    url: m.url,
                    order: m.order_index,
                })) ?? [],

                languages: data.Language?.map(l => ({
                    id: l.id_language,
                    name: l.nm_language,
                    audio: l.tb_product_languages?.bt_audio ?? false,
                    interface: l.tb_product_languages?.bt_interface ?? false,
                    subtitles: l.tb_product_languages?.bt_subtitles ?? false,
                })) ?? [],

                categories: data.Category?.map(c => ({
                    id: c.id_category,
                    name: c.nm_name,
                })) ?? [],
            };

            return res.status(200).json({ data: formatted });
        } catch (error) {
            next(error);
        };
    }

    // // 2. TELA DE DETALHES: Traz o jogo com todas as suas ofertas detalhadas com o nome da loja
    // async getProductDetails(req, res) {
    //     try {
    //         const { id } = req.params;

    //         const product = await Product.findByPk(id, {
    //             attributes: ['id_product', 'nm_name', 'ds_desc', 'img_image', 'dt_release'],
    //             include: [
    //                 {
    //                     model: Offer,
    //                     attributes: ['id_offer', 'vl_price'],
    //                     include: [
    //                         {
    //                             model: Store,
    //                             attributes: ['nm_name'] // Puxa o nome da loja (Steam, Epic, etc.) para o seu botão seletor
    //                         }
    //                     ]
    //                 }
    //             ]
    //         });

    //         if (!product) {
    //             return res.status(404).json({ message: "Jogo não encontrado." });
    //         }

    //         return res.status(200).json(product);
    //     } catch (error) {
    //         return res.status(500).json({ 
    //             message: "Erro ao carregar os detalhes do produto.", 
    //             error: error.message 
    //         });
    //     }
    // },

    // async create(req, res) {
    //     try {
    //         const newProduct = await Product.create(req.body);
    //         return res.status(201).json(newProduct);
    //     } catch (error) {
    //         console.log(error);
    //         return res.status(400).json({ error: 'Error creating product.'})
    //     }
    // }
};

module.exports = productController;