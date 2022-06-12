import { MenuItem } from '@reach/menu-button';
import styled, { css } from 'styled-components/macro';

export const menuItemHoverCSS = css`
  background-color: #f7fafc;
  color: black;
`;

export const menuItemMaxWidth = css`
  max-width: 340px;
`;

const BasicMenuItem = styled(MenuItem)`
  overflow: hidden;
  text-overflow: ellipsis;
  ${menuItemMaxWidth}

  &:hover {
    ${menuItemHoverCSS}
  }
`;

export default BasicMenuItem;
