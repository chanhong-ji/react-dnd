import React, { useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { boardState, todosState } from "./atoms";
import Board from "./components/Board";
import CategorySelector from "./components/CategorySelector";

const Container = styled.div`
  height: 100vh;
  width: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding-top: 100px;
  padding-bottom: 50px;
`;

const Boards = styled.div`
  display: flex;
  min-width: 100vw;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0 20px;
  gap: 20px;
  position: relative;
`;

const Trash = styled.div<{ isDraggingOver: boolean }>`
  margin-top: 50px;
  width: 300px;
  display: flex;
  justify-content: center;
  svg {
    color: ${(props) =>
      props.isDraggingOver ? "white" : "rgba(0, 0, 0, 0.3)"};
  }
`;

const Svg = styled.svg`
  width: 50px;
  height: 50px;
`;

function App() {
  const [todoBoards, setTodoBoards] = useRecoilState(todosState);
  const [boards, setBoards] = useRecoilState(boardState);

  function onDragEnd({ source, destination, type }: DropResult) {
    if (!destination) {
      return;
    }
    if (type === "board") {
      if (destination.droppableId === "trash") {
        setTodoBoards((prevBoards) => {
          const copiedBoards = { ...prevBoards };
          delete copiedBoards[boards[source.index]];
          return copiedBoards;
        });
        setBoards((prev) => {
          return prev.filter((board) => board !== prev[source.index]);
        });
      } else {
        setBoards((boards) => {
          const copiedBoards = [...boards];
          const movedBoard = copiedBoards.splice(source.index, 1);
          copiedBoards.splice(destination.index, 0, movedBoard[0]);
          return copiedBoards;
        });
      }
    } else {
      if (source.droppableId === destination?.droppableId) {
        setTodoBoards((allBoards) => {
          const copiedBoard = [...allBoards[source.droppableId]];
          const targetTodo = copiedBoard.splice(source.index, 1);
          copiedBoard.splice(destination.index, 0, targetTodo[0]);
          return {
            ...allBoards,
            [source.droppableId]: copiedBoard,
          };
        });
      } else {
        setTodoBoards((allBoards) => {
          const fromBoard = [...allBoards[source.droppableId]];
          const toBoard = [...allBoards[destination.droppableId]];
          const targetTodo = fromBoard.splice(source.index, 1);
          toBoard.splice(destination?.index, 0, targetTodo[0]);
          return {
            ...allBoards,
            [source.droppableId]: fromBoard,
            [destination.droppableId]: toBoard,
          };
        });
      }
    }
  }

  useEffect(() => {
    localStorage.setItem("todoBoards", JSON.stringify(todoBoards));
  }, [todoBoards]);

  useEffect(() => {
    localStorage.setItem("boards", JSON.stringify(boards));
  }, [boards]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container>
        <CategorySelector />
        <Droppable droppableId="boards" direction="horizontal" type="board">
          {(provided, info) => {
            return (
              <Boards ref={provided.innerRef} {...provided.droppableProps}>
                {boards.map((boardId, index) => (
                  <Board
                    boardId={boardId}
                    todos={todoBoards[boardId]}
                    key={boardId}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </Boards>
            );
          }}
        </Droppable>
        <Droppable droppableId="trash" type="board">
          {(provided, info) => {
            return (
              <Trash
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={info.isDraggingOver}
              >
                <Svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="trash"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="svg-inline--fa fa-trash fa-w-14 fa-3x"
                >
                  <path
                    fill="currentColor"
                    d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"
                  ></path>
                </Svg>
                <div style={{ display: "none" }}>{provided.placeholder}</div>
              </Trash>
            );
          }}
        </Droppable>
      </Container>
    </DragDropContext>
  );
}

export default App;
