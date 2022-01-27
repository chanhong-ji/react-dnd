import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { ITodo, todosState } from "../atoms";
import DraggableCard from "./DraggableCard";

const Container = styled.div`
  width: 300px;
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 2px solid rgba(0, 0, 0, 0.3);
`;

const Title = styled.h2<{ isDragging: boolean }>`
  text-align: center;
  font-weight: 500;
  margin-bottom: 10px;
  padding: 10px;
  font-size: 18px;
  background-color: ${(props) =>
    props.isDragging ? "rgba(0, 0, 0, 0.6)" : "transparent"};
  color: ${(props) => (props.isDragging ? "white" : "inherit")};
`;

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  padding: 0 20px;
  input {
    width: 100%;
    height: 30px;
    border: none;
  }
  button {
    background: none;
    border: none;
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
interface IBoardProps {
  todos: ITodo[];
  boardId: string;
  index: number;
}

interface IAreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

interface IForm {
  todo: string;
}

const Board = ({ todos, boardId, index }: IBoardProps) => {
  const setTodos = useSetRecoilState(todosState);
  const { register, handleSubmit, setValue } = useForm<IForm>();

  function onValid({ todo }: IForm) {
    const newTodo = {
      id: Date.now(),
      text: todo,
    };
    setTodos((prevBoards) => {
      return {
        ...prevBoards,
        [boardId]: [...prevBoards[boardId], newTodo],
      };
    });
    setValue("todo", "");
  }

  return (
    <Draggable draggableId={boardId} index={index}>
      {(provided, info) => (
        <Container ref={provided.innerRef} {...provided.draggableProps}>
          <Title {...provided.dragHandleProps} isDragging={info.isDragging}>
            {boardId}
          </Title>
          <Form onSubmit={handleSubmit(onValid)}>
            <input
              {...register("todo", { required: "Required" })}
              placeholder="Write Todo..."
            />
            <button>Create</button>
          </Form>
          <Droppable droppableId={boardId} type="card">
            {(provided, info) => (
              <Area
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={info.isDraggingOver}
                isDraggingFromThis={Boolean(info.draggingFromThisWith)}
              >
                {todos.map((todo, index) => (
                  <DraggableCard
                    todoText={todo.text}
                    todoId={todo.id}
                    index={index}
                    key={todo.id}
                    boardId={boardId}
                  />
                ))}
                {provided.placeholder}
              </Area>
            )}
          </Droppable>
        </Container>
      )}
    </Draggable>
  );
};

export default React.memo(Board);
