import { Shape } from "../utils/objects";

export enum EMessageType {
  text = "text",
  image = "image",
}

export interface IScenePointer {
  scene: string;
  payload?: Shape;
}

export interface IReply {
  type: EMessageType;
  content: string;
}

export interface IAnswers {
  type: EMessageType;
  content: string;
  nextScene: IScenePointer;
}

export interface IStoryData {
  replies: IReply[];
  answers?: IAnswers[];
  nextScene?: IScenePointer;
}
