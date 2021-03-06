/**
 * External dependencies
 */
import { useState, useCallback, useMemo, useRef } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { rgba } from 'polished';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import {
  isKeyboardUser,
  KEYBOARD_USER_SELECTOR,
} from '../../../utils/keyboardOnlyOutline';
import { Dropdown as DropdownIcon } from '../../../icons';
import Popup, { Placement } from '../../popup';
import DropDownList from './list';

/* same min-width as ListContainer */
const DropDownContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.black};
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body1.font};
  border-radius: 4px;
  border: 1px solid transparent;
  ${KEYBOARD_USER_SELECTOR} &:focus-within {
    border-color: ${({ theme }) => theme.DEPRECATED_THEME.colors.whiteout};
  }
`;

export const DropDownSelect = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  border: 0;
  background-color: ${({ theme, lightMode }) =>
    lightMode
      ? rgba(theme.DEPRECATED_THEME.colors.fg.white, 0.1)
      : rgba(theme.DEPRECATED_THEME.colors.bg.black, 0.3)};
  border-radius: 4px;
  padding: 2px 0 2px 6px;
  cursor: pointer;
  width: ${({ fitContentWidth }) =>
    fitContentWidth ? `fit-content` : `inherit`};
  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 0.3;
    `}

  svg {
    width: 28px;
    height: 28px;
    color: ${({ theme, lightMode }) =>
      lightMode
        ? theme.DEPRECATED_THEME.colors.fg.white
        : rgba(theme.DEPRECATED_THEME.colors.fg.white, 0.3)};
  }
`;

export const DropDownTitle = styled.span`
  user-select: none;
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.white};
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.label.family};
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.label.size};
  line-height: ${({ theme }) => theme.DEPRECATED_THEME.fonts.label.lineHeight};
  font-weight: ${({ theme }) => theme.DEPRECATED_THEME.fonts.label.weight};
  letter-spacing: ${({ theme }) =>
    theme.DEPRECATED_THEME.fonts.label.letterSpacing};
`;

function DropDown({
  value = '',
  onChange = () => {},
  options = [],
  disabled = false,
  lightMode = false,
  placement = Placement.BOTTOM_END,
  placeholder = __('Select an option', 'web-stories'),
  ...rest
}) {
  const selectRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const isNullOrUndefined = (item) => item === null || item === undefined;

  const activeItem = useMemo(
    () =>
      options.find(
        (item) =>
          !isNullOrUndefined(value) &&
          item.value.toString() === value.toString()
      ),
    [value, options]
  );

  const toggleOptions = useCallback(() => {
    setIsOpen(false);
    if (isKeyboardUser()) {
      // Return keyboard focus to button when closing dropdown
      selectRef.current.focus();
    }
  }, []);

  const handleCurrentValue = useCallback(
    (option) => {
      if (onChange) {
        onChange(option);
      }
      setIsOpen(false);
      selectRef.current.focus();
    },
    [onChange]
  );

  const handleSelectClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <DropDownContainer>
      <DropDownSelect
        onClick={handleSelectClick}
        aria-pressed={isOpen}
        aria-haspopup
        aria-expanded={isOpen}
        aria-disabled={disabled}
        disabled={disabled}
        ref={selectRef}
        lightMode={lightMode}
        {...rest}
      >
        <DropDownTitle>
          {(activeItem && activeItem.name) || placeholder}
        </DropDownTitle>
        <DropdownIcon />
      </DropDownSelect>
      <Popup anchor={selectRef} isOpen={isOpen} placement={placement} fillWidth>
        <DropDownList
          handleCurrentValue={handleCurrentValue}
          value={activeItem && activeItem.value}
          options={options}
          toggleOptions={toggleOptions}
          {...rest}
        />
      </Popup>
    </DropDownContainer>
  );
}

DropDown.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  options: PropTypes.array,
  disabled: PropTypes.bool,
  lightMode: PropTypes.bool,
  placeholder: PropTypes.string,
  labelledBy: PropTypes.string,
  placement: PropTypes.string,
};

export default DropDown;
