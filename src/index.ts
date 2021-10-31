import express from "express";
import loki from 'lokijs';
import cors from 'cors';
import { TimeSpanPlan } from "./models";

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
function planAlreadyExists(userId: string) {
    if (plans.find({ userId: userId }).length > 0) {
        return true
    }
    return false
}

function postPlan(plan: TimeSpanPlan) {
    plans.insert(plan);
}
app.post('/plans', function (req, res) {
    try {
        const _plan = req.body.plan
        //makesure this is a valid pla
        //if no
        // send a msg indicating what s wrong
        if (planAlreadyExists(_plan.userId)) {
            console.log("User already has a plan")
            throw Error("I love chocotom");
        } else {
            //else: 
            // assign a unique id to the plan 
            // persist it 
            // send a msg saying alles gut 
            postPlan(_plan)
        }
        console.log(`plan of user "${_plan.userId}" was created`)
        res.send(req.body.plan);
    } catch (error: any) {
        res.status(409).send({
            "title": error.message
        });
    }
})
