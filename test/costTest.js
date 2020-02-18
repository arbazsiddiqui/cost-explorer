const request = require('request-promise');
const env = process.env.NODE_ENV || "production";
const config = require('../config')[env];
const Promise = require('bluebird');
const should = require('should');

const {Client, Cost, CostTypes, Project} = require('../app/models/index');
require('../server');
const sleep = ms => new Promise(r => setTimeout(r, ms));

before(async () => {
	await sleep(400);

	//delete all values in tables
	await Promise.all([
		Client.destroy({
			where: {},
		}),
		Cost.destroy({
			where: {},
		}),
		CostTypes.destroy({
			where: {},
		}),
		Project.destroy({
			where: {},
		})
	]);

	const createClientsPromise = Promise.all([
		Client.create({id: 1, name: "Geralt"}),
		Client.create({id: 2, name: "Ciri"})
	]);

	const createProjectsPromise = Promise.all([
		Project.create({id: 1, title: "Rivia", clientId: 1}),
		Project.create({id: 2, title: "Lyria", clientId: 2})
	]);

	const createCostTypesPromise = Promise.all([
		CostTypes.create({id: 1, name: "Hunting", parentCostTypeID: null}),
		CostTypes.create({id: 2, name: "Crafting", parentCostTypeID: null})
	]);

	const createCostsPromise = Promise.all([
		Cost.create({id: 1, amount: '100', costTypeId: 1, projectId: 1}),
		Cost.create({id: 2, amount: '300', costTypeId: 2, projectId: 1}),
		Cost.create({id: 3, amount: '400', costTypeId: 1, projectId: 2}),
		Cost.create({id: 4, amount: '500', costTypeId: 2, projectId: 2}),
	]);

	//create dummy data
	await Promise.all([createClientsPromise, createProjectsPromise, createCostTypesPromise, createCostsPromise])

});

describe('cost-explorer', () => {
	it('it returns correct response without any filter', async () => {
		const res = await request({
			url: `http://localhost:${config.port}/cost-explorer`,
			method: "GET",
			json: true
		});
		res.should.deepEqual([
			{
				"id": "1",
				"name": "Geralt",
				"amount": 400,
				"breakdown": [
					{
						"id": "1",
						"name": "Rivia",
						"amount": 400,
						"breakdown": [
							{
								"id": 1,
								"name": "Hunting",
								"amount": 100,
								"breakdown": []
							},
							{
								"id": 2,
								"name": "Crafting",
								"amount": 300,
								"breakdown": []
							}
						]
					}
				]
			},
			{
				"id": "2",
				"name": "Ciri",
				"amount": 900,
				"breakdown": [
					{
						"id": "2",
						"name": "Lyria",
						"amount": 900,
						"breakdown": [
							{
								"id": 1,
								"name": "Hunting",
								"amount": 400,
								"breakdown": []
							},
							{
								"id": 2,
								"name": "Crafting",
								"amount": 500,
								"breakdown": []
							}
						]
					}
				]
			}
		])
	});

	it('it returns correct response with filter', async () => {
		const res = await request({
			url: `http://localhost:${config.port}/cost-explorer`,
			qs: {
				clients: [1],
				projects: [1],
				cost_types: [2]
			},
			method: "GET",
			json: true
		});
		res.should.deepEqual([
			{
				"id": "1",
				"name": "Geralt",
				"amount": 300,
				"breakdown": [
					{
						"id": "1",
						"name": "Rivia",
						"amount": 300,
						"breakdown": [
							{
								"id": 2,
								"name": "Crafting",
								"amount": 300,
								"breakdown": []
							}
						]
					}
				]
			}
		])
	})
});