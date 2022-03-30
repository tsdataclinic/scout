/* @jsxImportSource @emotion/react */
import { ReactNode } from 'react';
import { css } from '@emotion/react';
import { Dialog } from '@reach/dialog';
import { VisuallyHidden } from '@reach/visually-hidden';
import '@reach/dialog/styles.css';

type Props = {
  children: ReactNode;
  isOpen: boolean;
  onDismiss: () => void;
};

export default function Modal({
  children,
  isOpen,
  onDismiss,
}: Props): JSX.Element {
  return (
    <Dialog isOpen={isOpen} onDismiss={onDismiss}>
      <div style={{ position: 'relative' }}>
        <button
          css={css`
            background: none;
            color: black;
            font-size: 16px;
            height: 30px;
            position: absolute;
            right: -22px;
            top: -22px;
            width: 40px;
            transition: all 250ms;

            &:hover,
            &:focus {
              color: #054382;
              background: #e7e9ea;
              outline: none;
            }
            &:focus-visible {
              outline: 5px auto -webkit-focus-ring-color;
            }
          `}
          type="button"
          onClick={onDismiss}
        >
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden>x</span>
        </button>
      </div>
      <div>{children}</div>
    </Dialog>
  );
}
