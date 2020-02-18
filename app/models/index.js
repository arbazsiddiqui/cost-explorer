const Sequelize = require('sequelize');
const ClientModel = require('./clients');
const CostModel = require('./costs');
const CostTypesModel = require('./costTypes');
const ProjectModel = require('./projects');
const env = process.env.NODE_ENV || "production";
const config = require('../../config')[env];

const sequelize = new Sequelize(config.dbName, config.dbUsername, config.dbPassword, {
	host: config.host,
	dialect: config.dialect,
	pool: config.dbPool,
	define: {
		timestamps: false,
		paranoid: true,
	}
}); //initialize db connection

const Client = ClientModel(sequelize, Sequelize);
const Cost = CostModel(sequelize, Sequelize);
const CostTypes = CostTypesModel(sequelize, Sequelize);
const Project = ProjectModel(sequelize, Sequelize);

//define associations
Project.belongsTo(Client, {
	foreignKey: {
		name: 'clientId',
		field: 'Client_ID'
	}
});

Cost.belongsTo(CostTypes, {
	foreignKey: {
		name: 'costTypeId',
		field: 'Cost_Type_ID'
	}
});

Cost.belongsTo(Project, {
	foreignKey: {
		name: 'projectId',
		field: 'Project_Id'
	}
});


sequelize.sync({force: false})
	.then(() => {
		console.log(`Database synced`)
	});

module.exports = {
	Client,
	Cost,
	CostTypes,
	Project
};

