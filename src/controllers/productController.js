const Sequelize = require('sequelize');
const { Product, Offer, Category, Media, Type, Developer, Distributor, Language } = require('../models');

const productController = {
    async getCatalog(res, next) {
        try {
            const catalog = await Product.findAll({
                where: { dt_deleted: null },
                attributes: [
                    'id_product', 
                    'nm_name', 
                    [Sequelize.fn('MIN', Sequelize.col('Offers.vl_price')), 'lowest_price'],
                    [Sequelize.fn('MAX', Sequelize.col('Offers.vl_price')), 'highest_price']
                ],
                include: [
                    {
                        model: Offer,
                        attributes: [],
                        where: { dt_deletedAt: null },
                        required: false,
                    },
                    {
                        model: Category,
                        attributes: ['nm_name'],
                        through: { attributes: [] },
                        where: { dt_deletedAt: null },
                        required: false,
                    },
                    {
                        model: Media,
                        attributes: ['url'],
                        where: { tp_type: 'image' },
                        required: false,
                        limit: 1,
                        order: [['order_index', 'ASC']],
                    },
                ],
                group: ['Product.id_product'], 
                order: [
                [Sequelize.literal('MIN(`Offers`.`vl_price`) IS NOT NULL'), 'DESC'],
                ['nm_name', 'ASC'],
            ],
                subQuery: false
            });

            const formatted = catalog.map(p => {
                const data = p.toJSON();
                return {
                    id: data.id_product,
                    name: data.nm_name,
                    lowest_price: data.lowest_price ?? null,
                    highest_price: data.highest_price ?? null,
                    categories: data.Categories?.map(c => c.nm_name) ?? [],
                    image: data.Media?.[0]?.url ?? null,
                };
            });

            return res.status(200).json({ data: formatted });
        } catch (error) {
            next(error);
        }
    },

    async getHighlights(res, next) {
        try {
            const highlights = await Highlight.findAll({
                where: { dt_deletedAt: null },
                attributes: ['id_highlight', 'nm_name'],
                include: [
                    {
                        model: Product,
                        attributes: [
                            'id_product',
                            'nm_name',
                            [Sequelize.fn('MIN', Sequelize.col('Products->Offers.vl_price')), 'lowest_price'],
                            [Sequelize.fn('MAX', Sequelize.col('Products->Offers.vl_price')), 'highest_price'],
                        ],
                        through: { attributes: [] },
                        where: { dt_deletedAt: null },
                        required: false,
                        include: [
                            {
                                model: Offer,
                                attributes: [],
                                where: { dt_deletedAt: null },
                                required: false,
                            },
                            {
                                model: Category,
                                attributes: ['nm_name'],
                                through: { attributes: [] },
                                required: false,
                            },
                            {
                                model: Media,
                                attributes: ['url'],
                                where: { tp_type: 'image' },
                                required: false,
                                limit: 1,
                                order: [['order_index', 'ASC']],
                            },
                        ],
                    },
                ],
                group: ['Highlight.id_highlight', 'Products.id_product'],
                subQuery: false,
            });

            const formatted = highlights.map(h => {
                const data = h.toJSON();
                return {
                    id: data.id_highlight,
                    name: data.nm_name,
                    products: data.Products?.map(p => ({
                        id: p.id_product,
                        name: p.nm_name,
                        lowest_price: p.lowest_price ?? null,
                        highest_price: p.highest_price ?? null,
                        categories: p.Categories?.map(c => c.nm_name) ?? [],
                        image: p.Media?.[0]?.url ?? null,
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
        }
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