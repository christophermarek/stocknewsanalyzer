import express, { Express } from 'express'
import * as dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import bnnmarketcallRoutes from './routes'

dotenv.config();
console.log("dotenv", dotenv);

const app: Express = express()

const PORT: string | number = process.env.PORT || 4000

app.use(cors())
app.use(bnnmarketcallRoutes)

app.get('/', (req, res) => { res.send('Server is Running')})

const uri: string = `mongodb+srv://chris:${process.env.MONGO_PASSWORD}@cluster0.vgjbs.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
const options = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.set('useFindAndModify', false)

mongoose
    .connect(uri, options)
    .then(() =>
        app.listen(PORT, () =>
            console.log(`Server running on http://localhost:${PORT}`)
        )
    )
    .catch((error) => {
        throw error
    })