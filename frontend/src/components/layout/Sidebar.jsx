import styled from "styled-components";

const SidebarContainer = styled.div`
  width: 240px;
  background-color: #f8fafc;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing(2)};
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const CollectionList = styled.ul`
  flex: 1;
`;

const CollectionItem = styled.li`
  padding: ${({ theme }) => theme.spacing(1)};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.text};
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.tagBg : "transparent"};

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

export default function Sidebar({ collections, current, onSelect }) {
  return (
    <SidebarContainer>
      <Title>Collections</Title>
      <CollectionList>
        {collections.map((c) => (
          <CollectionItem
            key={c.name}
            $active={current === c.name}
            onClick={() => onSelect(c.name)}
          >
            {c.name}
            <span>{c.count}</span>
          </CollectionItem>
        ))}
      </CollectionList>
    </SidebarContainer>
  );
}
