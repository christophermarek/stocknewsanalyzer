
interface bnnmarketcall {
  _id: string
  month: string
  day: string
  guest: string
  picks: pick[]
  date: date
  createdAt?: string
  updatedAt?: string
}

interface bnnmarketcallProps {
  newsbnn: bnnmarketcall 
}

type ApiDataType = {
  message: string
  status: string
  todos: ITodo[]
  todo?: ITodo
}