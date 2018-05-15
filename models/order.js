module.exports = (Sequelize, sequelize) => {
    return sequelize.define('Orders', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
       client: {
           type: Sequelize.INTEGER
       },
        date: {
            type: Sequelize.DATE
        },
        address:{
            type: Sequelize.STRING
        },
        isAccepted:{
            type: Sequelize.BOOLEAN, defaultValue: false
        },
        accepedBy:{
            type: Sequelize.INTEGER
        },
        distance:{
            type: Sequelize.INTEGER
        },
        bill:{
            type: Sequelize.INTEGER
        }
    });
};
