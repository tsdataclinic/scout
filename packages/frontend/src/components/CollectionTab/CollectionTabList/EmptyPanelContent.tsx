import { ReactNode } from 'react';
import styled from 'styled-components/macro';

const StyledDiv = styled.div`
  align-items: center;
  display: flex;
  padding: 10px 12px;
  text-align: center;
  width: 100%;
  p {
    width: 100%;
    font-size: 1.2rem;
    line-height: 1.4rem;
  }
`;

type Props = {
  children: ReactNode;
};

export default function EmptyPanelContent({ children }: Props): JSX.Element {
  return (
    <StyledDiv>
      <p>{children}</p>
    </StyledDiv>
  );
}
