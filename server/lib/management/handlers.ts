import { Errors, mapErrorDetails, sanitizeErrorMessage } from "../util";
import { v4 as uuid } from "uuid";
import { Components } from "../app";
import Joi = require("joi");
import { Location, LocationID } from "./repository";
import { ClientEvents, Response, ServerEvents } from "../events";
import { Socket } from "socket.io";

const idSchema = Joi.string().guid({
    version: "uuidv4",
});

const locationSchema = Joi.object({
    id: idSchema.alter({
        create: (schema) => schema.forbidden(),
        update: (schema) => schema.required(),
    }),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
});

export default function (components: Components) {
    const { locationRepository } = components;
    return {
        createLocation: async function (
            payload: Omit<Location, "id">,
            callback: (res: Response<LocationID>) => void
        ) {
            // @ts-ignore
            const socket: Socket<ClientEvents, ServerEvents> = this;

            // validate the payload
            const { error, value } = locationSchema
                .tailor("create")
                .validate(payload, {
                    abortEarly: false,
                    stripUnknown: true,
                });

            if (error) {
                return callback({
                    error: Errors.INVALID_PAYLOAD,
                    errorDetails: mapErrorDetails(error.details),
                });
            }

            value.id = uuid();

            // persist the entity
            try {
                await locationRepository.save(value);
            } catch (e) {
                return callback({
                    error: sanitizeErrorMessage(e),
                });
            }

            // acknowledge the creation
            callback({
                data: value.id,
            });

            // notify the other users
            socket.broadcast.emit("location:created", value);
        },

        readLocation: async function (
            id: LocationID,
            callback: (res: Response<Location>) => void
        ) {
            const { error } = idSchema.validate(id);

            if (error) {
                return callback({
                    error: Errors.ENTITY_NOT_FOUND,
                });
            }

            try {
                const todo = await locationRepository.findById(id);
                callback({
                    data: todo,
                });
            } catch (e) {
                callback({
                    error: sanitizeErrorMessage(e),
                });
            }
        },

        // updateTodo: async function (
        //     payload: Todo,
        //     callback: (res?: Response<void>) => void
        // ) {
        //     // @ts-ignore
        //     const socket: Socket<ClientEvents, ServerEvents> = this;

        //     const { error, value } = todoSchema
        //         .tailor("update")
        //         .validate(payload, {
        //             abortEarly: false,
        //             stripUnknown: true,
        //         });

        //     if (error) {
        //         return callback({
        //             error: Errors.INVALID_PAYLOAD,
        //             errorDetails: mapErrorDetails(error.details),
        //         });
        //     }

        //     try {
        //         await todoRepository.save(value);
        //     } catch (e) {
        //         return callback({
        //             error: sanitizeErrorMessage(e),
        //         });
        //     }

        //     callback();
        //     socket.broadcast.emit("todo:updated", value);
        // },

        // deleteTodo: async function (
        //     id: TodoID,
        //     callback: (res?: Response<void>) => void
        // ) {
        //     // @ts-ignore
        //     const socket: Socket<ClientEvents, ServerEvents> = this;

        //     const { error } = idSchema.validate(id);

        //     if (error) {
        //         return callback({
        //             error: Errors.ENTITY_NOT_FOUND,
        //         });
        //     }

        //     try {
        //         await todoRepository.deleteById(id);
        //     } catch (e) {
        //         return callback({
        //             error: sanitizeErrorMessage(e),
        //         });
        //     }

        //     callback();
        //     socket.broadcast.emit("todo:deleted", id);
        // },

        listLocation: async function (
            callback: (res: Response<Location[]>) => void
        ) {
            try {
                callback({
                    data: await locationRepository.findAll(),
                });
            } catch (e) {
                callback({
                    error: sanitizeErrorMessage(e),
                });
            }
        },
    };
}
