import { User } from "./auth.dto";
import { Shape } from "../utils/objects";
import { IStoryData } from "../interfaces/Story.interface";

export enum EPrivacy {
  private = "private",
  public = "public",
}

export interface Game {
  id: string;
  userId: string;
  storyId: string;
  eventId: string;
  attributes: Shape;
  saves: Game[];
  user: User;
  story: Story;
  event: StoryEvent;
  createdAt: Date;
  updatedAt: Date;
}

export interface Story {
  id: string;
  user: User;
  startEvent: StoryEvent;
  events: StoryEvent[];
  name: string;
  description: string;
  playtime: number;
  privacy: EPrivacy;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoryEvent {
  id: string;
  name: string;
  replies: IStoryData["replies"];
  asnwers: IStoryData["answers"];
  nextScene: IStoryData["nextScene"];
  story: Story;
}
