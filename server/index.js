import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './models/db.js'
const app = express()
const port = 5000
import userRouter from './routes/User.js'

//example for auth
//https://github.com/codedamn/full-mern-stack-video/blob/part1/server/index.js
dotenv.config().parsed
const corsOptions = {
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
};
connectDB()

app.use(cors());
app.use(express.json())


app.use('/api/users', userRouter)
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})