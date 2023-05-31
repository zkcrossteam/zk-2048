import './style.scss';

import { ReactNode, useState } from 'react';
import { CloseButton, Modal, Spinner } from 'react-bootstrap';

import { useAppSelector } from '../app/hooks';
import { CommonButton } from '../components/CommonButton';
import { selectL1Account } from '../data/accountSlice';

export interface ModalCommonProps {
  buttonLabel: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  childrenClass: string;
  valid: boolean;
  onConfirm?: () => any;
  onShow?: () => any;
  onClose?: () => any;
  message: string;
  status: ModalStatus;
  confirmLabel?: ReactNode;
}

export enum ModalStatus {
  PreConfirm,
  Loading,
  Confirmed,
  PostConfirm,
  Error,
}

export const ModalCommon = ({
  buttonLabel,
  title,
  children,
  valid,
  message,
  status,
  confirmLabel,
  onShow,
  onClose,
  onConfirm,
  ...props
}: ModalCommonProps) => {
  const [show, setShow] = useState(false);

  const account = useAppSelector(selectL1Account);
  const handleClose = () => {
    onClose?.();
    setShow(false);
  };
  const handleShow = () => {
    onShow?.();
    setShow(true);
  };

  const Message = () =>
    account?.address ? (
      <div className="modal-error-msg">{message}</div>
    ) : (
      <div>Please connect your wallet before submitting any requests!</div>
    );

  const isLoading = status === ModalStatus.Loading;

  return (
    <>
      <div className="modal-btn" onClick={handleShow}>
        {buttonLabel}
      </div>
      <Modal
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="modal-90w"
        role="dialog"
      >
        <div className="common-card-bg-box">
          <Modal.Header>
            <Modal.Title className="w-100 text-center fs-3">
              {title}
            </Modal.Title>
            <CloseButton variant="white" onClick={handleClose} />
          </Modal.Header>
          <Modal.Body className="show-grid">{children}</Modal.Body>
          <Modal.Footer className="flex-column">
            <Message />

            {onConfirm && (status === ModalStatus.PreConfirm || isLoading) && (
              <CommonButton
                className="px-5 py-2"
                border
                disabled={!valid || !account?.address || isLoading}
                onClick={onConfirm}
              >
                <div className="gradient-content d-flex align-items-center">
                  {isLoading && (
                    <Spinner
                      className="me-2"
                      as="span"
                      animation="border"
                      style={{ color: '#4BFFDF' }}
                    />
                  )}
                  {confirmLabel}
                </div>
              </CommonButton>
            )}
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};
