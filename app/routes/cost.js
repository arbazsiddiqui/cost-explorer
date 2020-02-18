const costController = require('../controllers/costController');

module.exports = function (app) {
	app.get('/cost-explorer', async (req, res) => {
		try {
			const {clients, projects, cost_types} = req.query;
			const result = await costController.getClients(clients, projects, cost_types);
			res.send(200, result);
		} catch (err) {
			console.log({err}, "error in db call");
			res.send(500, {message: "Something went wrong"})
		}
	});
};