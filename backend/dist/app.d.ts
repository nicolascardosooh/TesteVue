import { Server } from 'socket.io';
export declare function createApp(): {
    app: import("express-serve-static-core").Express;
    httpServer: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
    io: Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
};
//# sourceMappingURL=app.d.ts.map