import { observer } from "mobx-react-lite";
import React from "react";
import { Container } from "react-bootstrap";
import { useGameStore } from "./GamesStore";

export default observer(function GamesPage() {
  const game = useGameStore();

  return <Container></Container>;
});
