
interface bnnmarketcall {
  _id: string
  month: string
  day: string
  guest: string
  picks: pick[]
  date: date
  focus: string
  text: string
  createdAt?: string
  updatedAt?: string
}

interface bnnmarketcallObject {
  bnnmarketcallObject: bnnmarketcall[]
}

interface articleProps{
  articleText: string
  setCurrentArticleViewing: Function
}
 

interface bnnmarketcallProps {
  bnnmarketcallItem: bnnmarketcall 
  setCurrentArticleViewing: Function
}

type ApiDataType = {
  message: string
  status: string
  todos: ITodo[]
  todo?: ITodo
}