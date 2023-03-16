import { ReactNode } from 'react';
import styled from 'styled-components/macro';

const StyledDiv = styled.div`
  align-items: center;
  display: flex;
  padding: 10px 12px;
  text-align: center;
  width: 100%;
`;

type Props = {
  children: ReactNode;
};

export default function EmptyPanelContent({ children }: Props): JSX.Element {
  return <StyledDiv>{children}</StyledDiv>;
}
