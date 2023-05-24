import './style.scss';

import { ReactNode, useState } from 'react';
import { CloseButton, Modal, Spinner } from 'react-bootstrap';

import { useAppSelector } from '../app/hooks';
import { CommonButton } from '../components/CommonButton';
import { selectL1Account } from '../data/accountSlice';

export interface ModalCommonProps {
  buttonLabel: ReactNode;
  title: string[];
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
  Confirmed,
  PostConfirm,
  Error,
}

export const WaitingForResponseBar = () => (
  <Spinner animation="border" variant="light" />
);

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
              <span className="gradient-content">{title[0]}</span>
              <span>{title[1]}</span>
            </Modal.Title>
            <CloseButton onClick={handleClose} />
          </Modal.Header>
          <Modal.Body className="show-grid">{children}</Modal.Body>
          <Modal.Footer className="flex-column">
            <Message />

            {onConfirm && status === ModalStatus.PreConfirm && (
              <CommonButton
                className="px-5 py-2"
                border
                disabled={!valid || !account?.address}
                onClick={onConfirm}
              >
                <span className="gradient-content">
                  {!show && <WaitingForResponseBar />}
                  {confirmLabel}
                </span>
              </CommonButton>
            )}
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};
