import { Router } from "express"
import { getbnnmarketcallData } from "../controllers/bnnmarketcall/index"

const router: Router = Router()

router.get("/bnnmarketcall", getbnnmarketcallData)

//boiler plate for future crud
/*
router.post("/add-todo", addTodo)

router.put("/edit-todo/:id", updateTodo)

router.delete("/delete-todo/:id", deleteTodo)
*/

export default router