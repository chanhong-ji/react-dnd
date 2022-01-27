import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { boardState, todosState } from "../atoms";

const Wrapper = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
`;

const CategoryBtn = styled.div<{ btnClicked: boolean }>`
  width: min-content;
  height: min-content;
  padding: 10px;
  border-radius: 20px;
  background-color: ${(props) => props.theme.green};
  font-family: "Mochiy Pop P One", sans-serif;
  color: white;
  opacity: ${(props) => (props.btnClicked ? 1 : 0.5)};
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 1;
  }
`;

const CategoryForm = styled.form<{ btnClicked: boolean }>`
  margin-left: 10px;
  display: ${(props) => (props.btnClicked ? "flex" : "none")};
  align-items: center;
  width: 120px;
  z-index: 1;
  border-radius: 10px;
  input {
    font-family: "Mochiy Pop P One", sans-serif;
    text-align: center;
    width: 100%;
    height: 50%;
    background: none;
    border: none;
    border-bottom: 3px whitesmoke solid;
    color: white;
    font-size: 15px;
    &:focus {
      outline: none;
    }
  }
`;

function CategorySelector() {
  const [todoBoards, setTodoBoards] = useRecoilState(todosState);
  const setBoards = useSetRecoilState(boardState);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
  } = useForm();

  const [btnClicked, setBtnClicked] = useState(false);

  const toggleClicked = () => {
    setBtnClicked((prev) => !prev);
  };

  function onCategorySubmit(category: string) {
    if (category in todoBoards) {
      setError("category", { message: "Already exist" }, { shouldFocus: true });
      return;
    }
    setTodoBoards((prevBoards) => ({ ...prevBoards, [category]: [] }));
    setBoards((prevBoards) => [...prevBoards, category]);
    setValue("category", "");
    toggleClicked();
  }

  return (
    <Wrapper>
      <CategoryBtn onClick={toggleClicked} btnClicked={btnClicked}>
        New Category
      </CategoryBtn>
      <CategoryForm
        btnClicked={btnClicked}
        onSubmit={handleSubmit(({ category }) => onCategorySubmit(category))}
      >
        <input
          {...register("category", {
            required: true,
            minLength: 2,
          })}
          placeholder="Press Enter.."
        />
        <span>{errors?.category?.message}</span>
      </CategoryForm>
    </Wrapper>
  );
}

export default CategorySelector;
