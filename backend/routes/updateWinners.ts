import { connections, winners } from "../db/db";

export const updateWinners = () => {
  Object.keys(connections).forEach((item) => {
    connections[item].send(
      JSON.stringify({
        type: "update_winners",
        data: JSON.stringify(winners),
        id: 0,
      })
    );
  });
};
