import { IUser, RoomType, GameType, WinnersType } from "./types";
import { type WebSocket } from "ws";

export const connections: { [key: string]: WebSocket } = {};
export const users: IUser = {};
export const rooms: RoomType[] = [];
export const game: GameType[] = [];
export const winners: WinnersType[] = [];
