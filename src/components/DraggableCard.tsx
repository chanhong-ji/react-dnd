import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { todosState } from "../atoms";

const Card = styled.div<{ isDragging: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px;
  background-color: ${(props) =>
    props.isDragging ? "#e4f2ff" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.05)" : "none"};
`;

const Svg = styled.svg`
  width: 15px;
  height: 15px;
  color: rgba(0, 0, 0, 0.1);
  :hover {
    color: rgba(0, 0, 0, 0.5);
  }
`;

interface IDraggableCard {
  todoText: string;
  todoId: number;
  index: number;
  boardId: string;
}

const DraggableCard = ({
  todoText,
  todoId,
  index,
  boardId,
}: IDraggableCard) => {
  const setTodoBoards = useSetRecoilState(todosState);

  function onDelete() {
    setTodoBoards((allBoards) => {
      const targetBoard = [...allBoards[boardId]];
      targetBoard.splice(index, 1);
      return { ...allBoards, [boardId]: targetBoard };
    });
  }

  return (
    <Draggable index={index} draggableId={todoId + ""}>
      {(provided, info) => {
        return (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            isDragging={info.isDragging}
          >
            {todoText}
            <Svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="trash"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="svg-inline--fa fa-trash fa-w-14 fa-3x"
              onClick={onDelete}
            >
              <path
                fill="currentColor"
                d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"
              ></path>
            </Svg>
          </Card>
        );
      }}
    </Draggable>
  );
};

export default React.memo(DraggableCard);
