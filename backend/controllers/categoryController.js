const { getCategories } = require("../db/queries");

const getAllCategories = async (req, res) => {
    try {
        const categories = await getCategories();

        res.json(categories);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch categories"
        });
    }
};

module.exports = {
    getAllCategories
};