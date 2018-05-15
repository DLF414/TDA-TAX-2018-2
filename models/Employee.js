module.exports = (Sequelize, sequelize) => {
    return sequelize.define('Employees', {
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
        },
        role: {
            type: Sequelize.STRING
        },
        salary:{
            type: Sequelize.INTEGER
        },
        online:{
            type: Sequelize.BOOLEAN, defaultValue: false
        }
    });
};