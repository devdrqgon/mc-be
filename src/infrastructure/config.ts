
import dotenv from 'dotenv';
import { ConnectOptions } from 'mongoose';
import mongoose from 'mongoose'
import logging from './logging';
dotenv.config();

export enum namespaces {
    infrastructure="infra",
    persistence ="persistence",
    api ="api"

}
const MONGO_OPTIONS: ConnectOptions = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    autoIndex: false,
    retryWrites: true
}

const MONGO_USERNAME = process.env.MONGO_USERNAME || 'dbUser'
const MONGO_PASSWORD = process.env.MONGO_USERNAME || 'admin'
const MONGO_HOST = process.env.MONGO_URL || `cluster0.b7lrz.mongodb.net/mcDB?w=majority`

const MONGO = {
    host: MONGO_HOST,
    password: MONGO_PASSWORD,
    username: MONGO_USERNAME,
    options: MONGO_OPTIONS,
    url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`
}


const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost'
const SERVER_PORT = process.env.SERVER_PORT || 8000
const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 3600 // In minutes
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || "Amdev"
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || "superencryptedsecret"



const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    token: {
        expireTime: SERVER_TOKEN_EXPIRETIME,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET
    }
};




const config = {
    mongo: MONGO,
    server: SERVER,
    connectDB
};


function connectDB() {
    mongoose.connect(config.mongo.url, config.mongo.options)
        .then(() => {
            logging.info("INFRASTRUCTURE", "MongoDB Connected!")
        })
        .catch(error => {
            logging.error("INFRASTRUCTURE", "Could not connect to MongoDB!", error)
        })


}
export default config;