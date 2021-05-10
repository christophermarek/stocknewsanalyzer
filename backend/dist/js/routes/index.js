"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../controllers/bnnmarketcall/index");
const router = express_1.Router();
router.get("/bnnmarketcall", index_1.getbnnmarketcallData);
//boiler plate for future crud
/*
router.post("/add-todo", addTodo)

router.put("/edit-todo/:id", updateTodo)

router.delete("/delete-todo/:id", deleteTodo)
*/
exports.default = router;
