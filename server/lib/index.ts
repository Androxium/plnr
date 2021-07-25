import { createServer } from "http";
import { createApplication } from "./app";
import { InMemoryLocationRepository } from "./management/repository";

const httpServer = createServer();

createApplication(
    httpServer,
    {
        locationRepository: new InMemoryLocationRepository(),
    },
    {
        cors: {
            origin: ["http://localhost:4200"],
        },
    }
);

httpServer.listen(3000);
