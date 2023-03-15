import * as IconType from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Select from '@radix-ui/react-select';
import styled from 'styled-components';
import type { DropdownOption } from './types';

const StyledSelectItem = styled(Select.Item)`
  align-items: center;
  all: unset;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  padding: 4px 35px 4px 25px;
  position: relative;
  user-select: none;

  &[data-highlighted] {
    color: white;
    background: #3b82f6;
  }

  &[data-disabled] {
    color: #94a3b8;
    cursor: unset;
  }
`;

const StyledItemIndicator = styled(Select.ItemIndicator)`
  align-items: center;
  display: inline-flex;
  justify-content: center;
  height: 100%;
  left: 0;
  position: absolute;
  width: 25px;
  top: 0;
`;

export default function DropdownOptionItem<T extends string>({
  option,
}: {
  option: DropdownOption<T>;
}): JSX.Element {
  return (
    <StyledSelectItem value={option.value} disabled={!!option.disabled}>
      <Select.ItemText>{option.displayValue}</Select.ItemText>
      <StyledItemIndicator>
        <FontAwesomeIcon icon={IconType.faCheck} size="sm" />
      </StyledItemIndicator>
    </StyledSelectItem>
  );
}
