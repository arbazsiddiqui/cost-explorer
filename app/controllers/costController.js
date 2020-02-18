const _ = require('lodash');
const {Client, Cost, CostTypes, Project} = require('../models/index');

const getClients = async (clients = [], projects = [], cost_types = []) => {
	const clientsFromDb = await Cost.findAll({
		include: [{
			model: CostTypes,
			where: {...(!_.isEmpty(cost_types) && {'id': cost_types})},
		}, {
			model: Project,
			where: {...(!_.isEmpty(projects) && {'id': projects})},
			include: [{
				model: Client,
				where: {...(!_.isEmpty(clients) && {'id': clients})}
			}]
		}],
		raw: true,
		nest: true
	});

	return formatDbResponse(clientsFromDb);
};

const formatDbResponse = (clients) => {
	const GroupClients = _.groupBy(clients, 'project.client.id');
	const result = [];
	_.forEach(GroupClients, (projects, clientId) => {
		const client = { //create client
			id: clientId,
			name: projects[0].project.client.name,
			amount: _.sumBy(projects, (project) => {
				if (project.cost_type.parentCostTypeID === null) {
					return parseInt(project.amount)
				}
				return 0
			}),
			breakdown: [],
		};
		const groupedProjects = _.groupBy(projects, 'projectId');
		_.forEach(groupedProjects, (costTypes, projectId) => {
			const project = { //create project
				id: projectId,
				name: costTypes[0].project.title,
				amount: _.sumBy(costTypes, (costType) => {
					if (costType.cost_type.parentCostTypeID === null) {
						return parseInt(costType.amount)
					}
					return 0
				}),
				breakdown: recurCost(costTypes, null), //create costs
			};
			client.breakdown.push(project);
		});
		result.push(client);
	});
	return result
};


const recurCost = (costTypes, parentNode) => {
	const parentCostTypes = costTypes.filter(costType => costType.cost_type.parentCostTypeID === parentNode);
	const result = [];
	_.forEach(parentCostTypes, (cost) => {
		result.push({
			id: cost.costTypeId,
			name: cost.cost_type.name,
			amount: parseInt(cost.amount),
			breakdown: recurCost(costTypes, cost.costTypeId)
		});
	});
	return result;
};

module.exports = {
	getClients
};