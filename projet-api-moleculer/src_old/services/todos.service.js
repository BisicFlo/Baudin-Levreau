"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "todos",

	settings: {
 		state: {

 		}
	},

	actions: {

		//	call "todos.create" --name "Name"
		create: {
			params: {
				name: "string"
			},
			handler(ctx) {
				var todo = new Models.Todo(ctx.params).create();
				console.log("Todos - create - ", todo);
				if (todo) {
					return Database()
						.then((db) => {
							return db.get("todos")
								.push(todo)
								.write()
								.then(() => {
									return todo;
								})
								.catch(() => {
									return new MoleculerError("Todos", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
								});
					});
				} else {
					return new MoleculerError("Todos", 417, "ERR_CRITIAL", { code: 417, message: "Todo is not valid" } )
				}
			}
		},

		//	call "todos.getAll"
		getAll: {
			params: {

			},
			handler(ctx) {
				return Database()
					.then((db) => {
						return db.values().__wrapped__;
					});
			}
		},


		//	call "todo.get" --id_todo
		get: {
			params: {
				id_todo: "string"
			},
			handler(ctx) {
				return ctx.call("todos.verify", { id_todo: ctx.params.id_todo })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var user = db.get("todos").find({ id: ctx.params.id_todo }).value();;
								return user;
							})
							.catch(() => {
								return new MoleculerError("Todos", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Todos", 404, "ERR_CRITIAL", { code: 404, message: "Todo doesn't exists" } )
					}
				})
			}
		},

		//	call "todos.verify" --id_todo
		verify: {
			params: {
				id_todo: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("todos")
										.filter({ id: ctx.params.id_todo })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		//	call "todos.edit" --id_todo  --name --completed
		edit: {
			params: {
				id_todo: "string",
				name: "string",
				completed: "boolean"
			},
			handler(ctx) {
				return ctx.call("todos.get", { id_todo: ctx.params.id_todo })
						.then((db_todo) => {
							//
							var todo = new Models.Todo(db_todo).create();
							todo.name = ctx.params.name || db_todo.name;
							todo.completed = ctx.params.completed || false;
							//
							return Database()
								.then((db) => {
									return db.get("todos")
										.find({ id: ctx.params.id_todo })
										.assign(todo)
										.write()
										.then(() => {
											return todo;
										})
										.catch(() => {
											return new MoleculerError("Todos", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
			}
		}



	}
};
