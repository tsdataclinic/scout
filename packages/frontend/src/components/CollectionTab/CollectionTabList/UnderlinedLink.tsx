import styled from '@emotion/styled/macro';
import { Link } from 'react-router-dom';

const UnderlinedLink = styled(Link)`
  color: black;
  &:hover {
    text-decoration: underline;
  }
`;

export default UnderlinedLink;
