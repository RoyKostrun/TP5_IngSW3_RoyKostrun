import styled from "styled-components";

export const HomeContainer = styled.div`
  padding: ${({ theme }) => theme.spacing(3)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const TaskCard = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing(2)};
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  align-items: flex-start;

  h3 {
    margin-bottom: ${({ theme }) => theme.spacing(1)};
    font-size: 1rem;
  }
`;

export const Tag = styled.span`
  background-color: ${({ theme }) => theme.colors.tagBg};
  color: ${({ theme }) => theme.colors.tagText};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 0.1rem 0.5rem;
  font-size: 0.75rem;
  margin-right: 0.3rem;
`;
