import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
declare const app: import("express-serve-static-core").Express;
declare const httpServer: HttpServer<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
declare const io: SocketServer<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export { app, httpServer, io };
//# sourceMappingURL=server.d.ts.map