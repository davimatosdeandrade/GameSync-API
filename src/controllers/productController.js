const Sequelize = require('sequelize');
const { Product, Type, Developer, Distributor, Language, Offer, Store } = require('../models');

const productController = {
    // 1. TELA DE CATÁLOGO: Traz os jogos calculando o menor e maior preço de suas ofertas
    async getCatalog(req, res) {
        try {
            const products = await Product.findAll({
                attributes: [
                    'id_product', 
                    'nm_name', 
                    'img_image',
                    // Cria uma coluna customizada com o menor preço encontrado nas ofertas
                    [Sequelize.fn('MIN', Sequelize.col('Offers.vl_price')), 'lowest_price'],
                    // Cria uma coluna customizada com o maior preço encontrado nas ofertas
                    [Sequelize.fn('MAX', Sequelize.col('Offers.vl_price')), 'highest_price']
                ],
                include: [
                    {
                        model: Offer,
                        attributes: [], // Não queremos os dados brutos das ofertas aqui, só o cálculo
                        required: false // false garante que o jogo apareça mesmo se não tiver NENHUMA oferta
                    }
                ],
                group: ['Product.id_product'], // Agrupa por jogo para o cálculo de MIN/MAX funcionar por produto
                subQuery: false
            });

            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ 
                message: "Erro ao carregar o catálogo.", 
                error: error.message 
            });
        }
    },

    // 2. TELA DE DETALHES: Traz o jogo com todas as suas ofertas detalhadas com o nome da loja
    async getProductDetails(req, res) {
        try {
            const { id } = req.params;

            const product = await Product.findByPk(id, {
                attributes: ['id_product', 'nm_name', 'ds_desc', 'img_image', 'dt_release'],
                include: [
                    {
                        model: Offer,
                        attributes: ['id_offer', 'vl_price'],
                        include: [
                            {
                                model: Store,
                                attributes: ['nm_name'] // Puxa o nome da loja (Steam, Epic, etc.) para o seu botão seletor
                            }
                        ]
                    }
                ]
            });

            if (!product) {
                return res.status(404).json({ message: "Jogo não encontrado." });
            }

            return res.status(200).json(product);
        } catch (error) {
            return res.status(500).json({ 
                message: "Erro ao carregar os detalhes do produto.", 
                error: error.message 
            });
        }
    },

    async create(req, res) {
        try {
            const newProduct = await Product.create(req.body);
            return res.status(201).json(newProduct);
        } catch (error) {
            console.log(error);
            return res.status(400).json({ error: 'Error creating product.'})
        }
    }
};

module.exports = productController;