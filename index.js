'use strict'
let net = require("net");
// import net from "net"

if (process.env.NODE_ENV === "development")
{
    const easyMonitor = require("easy-monitor");
    easyMonitor("backend");
}

let proxyPort = 8000;
let targetPort = 50446;

net.createServer((socket) => {
    socket.once('data', (buf) => {
        console.log(buf[0] === 22 ? "tls" : "tcp");
        var proxy = net.createConnection(targetPort, "localhost", () => {
            proxy.write(buf);
            //反向代理的过程，tcp接受的数据交给代理链接，代理链接服务器端返回数据交由socket返回给客户端
            socket.pipe(proxy).pipe(socket);
        });

        proxy.on('error', (err) => {
            console.log(err);
            proxy.destroy();
        });
    });

    socket.on('error', (err) => {
        console.log(err);
        socket.destroy();
    });
}).listen(proxyPort);
console.log("代理初始化完成","0.0.0.0:"+proxyPort,"=>","localhost:"+targetPort)