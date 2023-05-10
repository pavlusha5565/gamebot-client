import { useStore } from "../../stores/GlobalStoreContext";
import { useState } from "react";
import { Api } from "../../stores/Api/Api";

export class GameStore {
  client: Api;

  constructor(client: Api) {
    this.client = client;
    this.getGames();
  }

  async getGames() {
    const response = await this.client.makeRequest("game/all");
    return response.data;
  }
}

export function useGameStore() {
  const apiClient = useStore<Api>("apiClient");

  const [gameStore] = useState(() => new GameStore(apiClient));

  return gameStore;
}
