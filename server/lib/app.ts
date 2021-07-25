import { Server as HttpServer } from "http";
import { Server, ServerOptions } from "socket.io";
import { ClientEvents, ServerEvents } from "./events";
import { LocationRepository } from "./management/repository";
import createLocationHandlers from "./management/handlers";

export interface Components {
    locationRepository: LocationRepository;
}

export function createApplication(
    httpServer: HttpServer,
    components: Components,
    serverOptions: Partial<ServerOptions> = {}
): Server<ClientEvents, ServerEvents> {
    const io = new Server<ClientEvents, ServerEvents>(
        httpServer,
        serverOptions
    );

    const { createLocation, readLocation, listLocation } =
        createLocationHandlers(components);

    io.on("connection", (socket) => {
        socket.on("location:create", createLocation);
        socket.on("location:read", readLocation);
        // socket.on("todo:update", updateTodo);
        // socket.on("todo:delete", deleteTodo);
        socket.on("location:list", listLocation);
    });

    return io;
}
