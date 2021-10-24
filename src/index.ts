import express from "express";
import loki from 'lokijs';
import cors from 'cors';
import { Timespan } from "./models";

//Create db
const db = new loki('mc');

const plans = db.addCollection('plans');

const app = express();
app.use(cors());
const PORT = 8000;
// Configuring express to parse incoming json 
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

function getPlans() {
    return plans.find()
}
app.get('/plans', function (req, res) {
    res.json(getPlans())
})
function planAlreadyExists(_id: string) {
    if (plans.find({ id: _id }).length > 0) {
        return true
    }
    return false
}

function postPlan(plan: Timespan) {
    plans.insert(plan);
}
app.post('/plans', function (req, res) {
    const _plan = req.body;
    console.info("_plan:", req)
    try {
        if (planAlreadyExists(_plan.id)) {
            throw Error("Resource already exists");
        } else {
            postPlan(_plan)
        }
        res.send(`plan "${_plan.name}" was added to db!`);
    } catch (error: any) {
        res.status(409).send(error.message);
    }
})
