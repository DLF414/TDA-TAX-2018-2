module.exports = (Sequelize, sequelize) => {
    return sequelize.define('Clients', {
        id: {
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.INTEGER
        }
    });
};