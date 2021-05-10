import { Response, Request } from "express"
import { bnnmarketcallType } from "../../types/bnnmarketcall"
import bnnmarketcall from "../../models/bnnmarketcall"

const getbnnmarketcallData = async (req: Request, res: Response): Promise<void> => {
  try {
    //console.log(await bnnmarketcall.find({}));
    const bnnmarketcallData: bnnmarketcallType[] = await bnnmarketcall.find().exec()
    //console.log(bnnmarketcallData)
    res.status(200).json({ bnnmarketcallData })
  } catch (error) {
    throw error
  }
}

//Just boiler plater code for the future
/*
const addTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Pick<ITodo, "name" | "description" | "status">

    const todo: ITodo = new Todo({
      name: body.name,
      description: body.description,
      status: body.status,
    })

    const newTodo: ITodo = await todo.save()
    const allTodos: ITodo[] = await Todo.find()

    res
      .status(201)
      .json({ message: "Todo added", todo: newTodo, todos: allTodos })
  } catch (error) {
    throw error
  }
}

const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      params: { id },
      body,
    } = req
    const updateTodo: ITodo | null = await Todo.findByIdAndUpdate(
      { _id: id },
      body
    )
    const allTodos: ITodo[] = await Todo.find()
    res.status(200).json({
      message: "Todo updated",
      todo: updateTodo,
      todos: allTodos,
    })
  } catch (error) {
    throw error
  }
}

const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedTodo: ITodo | null = await Todo.findByIdAndRemove(
      req.params.id
    )
    const allTodos: ITodo[] = await Todo.find()
    res.status(200).json({
      message: "Todo deleted",
      todo: deletedTodo,
      todos: allTodos,
    })
  } catch (error) {
    throw error
  }
}
*/

//export { getTodos, addTodo, updateTodo, deleteTodo }

export {getbnnmarketcallData}