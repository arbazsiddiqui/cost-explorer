module.exports = (sequelize, type) => {
	return sequelize.define('cost_types', {
		id: {
			field : "ID",
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			field : "Name",
			type : type.STRING,
		},
		parentCostTypeID : {
			field : "Parent_Cost_Type_ID",
			type : type.INTEGER,
			allowNull : true
		}
	})
};