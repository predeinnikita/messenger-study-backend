import { Socket } from 'socket.io';
import express from 'express';
import { WsException } from '@nestjs/websockets';
import { UnauthorizedException } from '@nestjs/common';

export const jwtFromRequestFunction = (request: express.Request | Socket) => {
    //websocket
    if (request instanceof Socket) {
        return request.handshake.headers.authorization.split(' ')[1];
    }

    //http
    return request.headers['authorization'].split(' ')[1];
};