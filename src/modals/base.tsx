// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from "react";
import { Button, Container, FloatingLabel, Form, FormLabel, ListGroup, Modal, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import './style.scss';
import React from "react";

export interface ModalCommonProps {
  btnLabel: string;
  title: string;
  children?:  React.ReactNode;
  childrenClass: string;
  valid: boolean;
  handleConfirm?: () => void;
  message: string;
  status: ModalStatus;
}

export enum ModalStatus {
  PreConfirm,
  Confirmed,
  PostConfirm,
}

export function ModalCommon(props: ModalCommonProps) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  }
  const dispatch = useAppDispatch();
  return (
    <>
      <div className="modal-btn" onClick={handleShow}>
        {props.btnLabel}
      </div>
      <Modal show={show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered dialogClassName="modal-90w" role="dialog">
        <Modal.Header>
          <h2>{props.title}</h2>
        </Modal.Header>
        <Modal.Body className="show-grid">
          {props.children}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {props.handleConfirm && (props.status === ModalStatus.PreConfirm) &&
          <Button variant="primary" disabled={props.valid !== true} onClick={props.handleConfirm}>
            Confirm
          </Button>
          }
        </Modal.Footer>
      </Modal>
    </>
  );
}
