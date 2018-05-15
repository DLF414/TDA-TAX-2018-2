const Sequelize = require('Sequelize');
const config = require('config');
const {
    account,
    car,
    client,
    employee,
    order
} = require('./models');


module.exports = () => {
    const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password,{host:config.db.host, dialect:config.db.dialect});

    const Accounts = account(Sequelize, sequelize);
    const Cars = car(Sequelize, sequelize);
    const Clients = client(Sequelize, sequelize);
    const Employees = employee(Sequelize, sequelize);
    const Orders = order(Sequelize, sequelize);
    /*
        Cars.hasOne(Employees, {foreignKey:'attachedTo'});
      //  Employees.belongsTo(Cars, {foreignKey:'Employeeid'});

        Orders.hasMany(Employees, {foreignKey:'acceptedBy'});
      //  Employees.belongsTo(Orders, {foreignKey:'ordAtt'});

        Clients.hasOne(Accounts, {foreignKey:'AccountId'});
      //  Accounts.belongsTo(Clients, {foreignKey:'Id'});

        Employees.hasOne(Accounts, {foreignKey:'AccountId'});
     //   Accounts.belongsTo(Employees, {foreignKey:'Id'});

        Orders.hasMany(Clients, {foreignKey:'client'});
      //  Clients.belongsTo(Orders, {foreignKey:'ClientId'});
    */


    Employees.hasOne(Cars, {foreignKey:'attachedTo'});
    //  Cars.belongsTo(Employees, {foreignKey:'Employeeid'});

    Employees.hasMany(Orders, {foreignKey:'acceptedBy'});
    //  Orders.belongsTo(Employees, {foreignKey:'ordAtt'});

    Accounts.hasOne(Clients, {foreignKey:'id'});
    //  Clients.belongsTo(Accounts, {foreignKey:'Id'});

    Accounts.hasOne(Employees, {foreignKey:'id'});
    //  Employees.belongsTo(Accounts, {foreignKey:'Id'});

    Clients.hasMany(Orders, {foreignKey:'client'});
    //  Orders.belongsTo(Clients, {foreignKey:'ClientId'});





    return {
        Accounts,
        Cars,
        Clients,
        Employees,
        Orders,
        sequelize,
        Sequelize
    };
};