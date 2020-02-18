module.exports = (sequelize, type) => {
	return sequelize.define('costs', {
		id: {
			field: "ID",
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		amount: {
			field: "Amount",
			type: type.STRING
		}
	})
};