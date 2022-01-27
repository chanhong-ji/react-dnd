import { atom } from "recoil";

const defaultBoard = {
  "To Do": [],
  Doing: [],
  Done: [],
};

export interface ITodo {
  id: number;
  text: string;
}

interface ITodos {
  [key: string]: ITodo[];
}

export const todosState = atom<ITodos>({
  key: "todos",
  default: JSON.parse(
    localStorage.getItem("todoBoards") || JSON.stringify(defaultBoard)
  ),
});

export const boardState = atom<string[]>({
  key: "boardState",
  default: JSON.parse(
    localStorage.getItem("boards") || JSON.stringify(["To Do", "Doing", "Done"])
  ),
});
