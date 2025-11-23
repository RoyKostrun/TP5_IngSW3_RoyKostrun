import styled, { css } from "styled-components";

export const HomeContainer = styled.div`
  padding: ${({ theme }) => theme.spacing(3)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const TaskForm = styled.form`
  background: white;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing(2)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

export const FieldLabel = styled.label`
  font-weight: 600;
  font-size: 0.95rem;
`;

const inputStyles = css`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 0.5rem 0.75rem;
  width: 100%;
  font-size: 0.95rem;
  background: white;
`;

export const TextInput = styled.input`
  ${inputStyles}
`;

export const TextArea = styled.textarea`
  ${inputStyles}
  min-height: 100px;
  resize: vertical;
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const baseButton = css`
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 0.35rem 0.9rem;
  font-weight: 500;
  border: none;
`;

export const PrimaryButton = styled.button`
  ${baseButton}
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  ${baseButton}
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
`;

export const DangerButton = styled.button`
  ${baseButton}
  background-color: #dc2626;
  color: white;
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

export const TaskDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

export const InlineEditForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

export const CheckboxField = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`;

export const TaskBody = styled.p`
  margin: 0;
  color: #4b5563;
`;

export const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

export const Tag = styled.span`
  background-color: ${({ theme }) => theme.colors.tagBg};
  color: ${({ theme }) => theme.colors.tagText};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 0.1rem 0.5rem;
  font-size: 0.75rem;
  margin-right: 0.3rem;
`;
