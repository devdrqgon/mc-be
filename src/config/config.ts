
import dotenv from 'dotenv';

dotenv.config();

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost'
const SERVER_PORT = process.env.SERVER_PORT || 8000
const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 3600 // In seconds
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || "Amdev"
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || "superencryptedsecret"



const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    token: {
        expireTime: SERVER_TOKEN_EXPIRETIME, 
        issure: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET
    }
};

const config = {
    server: SERVER
};

export default config;