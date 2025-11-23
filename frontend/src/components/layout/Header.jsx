import styled from "styled-components";
import { PlusIcon } from "../icons/PlusIcon";

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(2)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h1`
  font-size: 1.5rem;
`;

const AddButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 0.4rem 0.8rem;
  font-weight: 500;

  &:hover {
    opacity: 0.9;
  }
`;

export default function Header({ title, onAdd, addLabel = "Add Task" }) {
  return (
    <HeaderContainer>
      <Title>{title}</Title>
      <AddButton type="button" onClick={onAdd}>
        <PlusIcon size={16} /> {addLabel}
      </AddButton>
    </HeaderContainer>
  );
}
