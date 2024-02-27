import dotenv from "dotenv";
import fnSetupExpress from "./serve/serve-express/generalExpressServer";
dotenv.config();

const expressPort = process.env.EXPRESS_PORT;

fnSetupExpress(expressPort);
