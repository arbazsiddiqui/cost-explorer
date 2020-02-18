module.exports = (sequelize, type) => {
	return sequelize.define('clients', {
		id: {
			field: "ID",
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			field: "Name",
			type: type.STRING,
		}
	})
};