module.exports = (Sequelize, sequelize) => {
    return sequelize.define('Cars', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
         model: {
            type: Sequelize.STRING
        },
        sign: {
            type: Sequelize.STRING
        },
        inPark:{
            type: Sequelize.BOOLEAN, defaultValue: true
        },
        attachedTo:{
          type: Sequelize.INTEGER
        },
        VIN:{
            type: Sequelize.INTEGER
        }
    });
};