const express = require('express')
const cors = require('cors')
const dotEnv = require('dotenv')
const connectDB = require('./models/db')
const app = express()
const port = 5000

dotEnv.config().parsed
const corsOptions = {
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
};
connectDB()

app.use(cors(corsOptions));
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})