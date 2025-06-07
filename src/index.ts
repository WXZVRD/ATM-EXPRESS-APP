import express, { Express } from "express";
import {buildContainer} from "./container";
import {createATMRouter} from "./routes/atm.routes";

function createApp(): Express {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const { atmController } = buildContainer();
    const atmRouter = createATMRouter(atmController);

    app.use("/", atmRouter);

    return app;
}

const PORT = 3000;

const createdApp = createApp();

createdApp.listen(PORT, () => {
    console.log(`Interview app listening at http://localhost:${PORT}`);
});
