module.exports = (sequelize, type) => {
	return sequelize.define('projects', {
		id: {
			field : "ID",
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		title: {
			field : "Title",
			type: type.STRING,
		}
	})
};