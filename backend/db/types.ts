type IUserRegMessage = {
  type: "reg";
  data: {
    name: string;
    password: string;
  };
  id: number;
};

type CreateRoomMessage = {
  type: "create_room";
  data: string;
  id: number;
};

type AddUserRoomMessage = {
  type: "add_user_to_room";
  data: { indexRoom: string };
  id: number;
};

type ShipsType = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: "small" | "medium" | "large" | "huge";
};

type AddShipsMessage = {
  type: "add_ships";
  data: {
    gameId: number | string;
    ships: Array<ShipsType>;
    indexPlayer: number | string;
  };
  id: number;
};

type AttackMessage = {
  type: "attack";
  data: {
    gameId: number | string;
    x: number;
    y: number;
    indexPlayer: number | string;
  };
  id: number;
};

type MessageType =
  | IUserRegMessage
  | CreateRoomMessage
  | AddUserRoomMessage
  | AddShipsMessage
  | AttackMessage;

type IUser = {
  [key: string]: {
    name: string;
    password: string;
  };
};

type RoomType = {
  roomId: number | string;
  roomUsers: Array<{
    name: string;
    index: number | string;
  }>;
};

type GameType = {
  gameId: number | string;
  data: Array<{
    ships: Array<ShipsType>;
    indexPlayer: number | string;
  }>;
};

type WinnersType = {
  name: string;
  wins: number;
};

export type {
  IUserRegMessage,
  MessageType,
  IUser,
  CreateRoomMessage,
  RoomType,
  AddShipsMessage,
  GameType,
  ShipsType,
  AttackMessage,
  WinnersType,
  AddUserRoomMessage
};
