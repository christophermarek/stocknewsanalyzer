
interface bnnmarketcall {
  _id: string
  month: string
  day: string
  guest: string
  picks: pick[]
  date: date
  focus: string
  createdAt?: string
  updatedAt?: string
}

interface bnnmarketcallObject {
  bnnmarketcallObject: bnnmarketcall[]
}

interface bnnmarketcallProps {
  bnnmarketcallItem: bnnmarketcall 
}

type ApiDataType = {
  message: string
  status: string
  todos: ITodo[]
  todo?: ITodo
}