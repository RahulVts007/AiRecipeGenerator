import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/' , (req , res) => {
    res.json({message: 'API Working'});
});

const PORT = process.env.PORT || 8000;

app.listen(PORT , () => {
    console.log(`Server Running on Port ${PORT}`)
})

