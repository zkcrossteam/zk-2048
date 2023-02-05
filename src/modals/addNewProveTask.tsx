// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from "react";
import {
  Container,
  Form,
  Spinner,
} from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  ModalCommon,
  ModalCommonProps,
  ModalStatus,
  WaitingForResponseBar,
} from "./base";
import { addProvingTask, loadStatus, selectTasks } from "../data/statusSlice";
import { loginL1AccountAsync, selectL1Account } from "../data/accountSlice";

import "./style.scss";

interface NewWASMImageProps {
  md5: string;
  inputs: string;
  witness: string;
}

export function NewProveTask(props: NewWASMImageProps) {
  const dispatch = useAppDispatch();
  let account = useAppSelector(selectL1Account);

  const [message, setMessage] = React.useState<string>("");
  const [status, setStatus] = React.useState<ModalStatus>(
    ModalStatus.PreConfirm
  );

  const addNewProveTask = function () {
    let info = {
      user_address: account!.address,
      md5: props.md5,
      public_inputs: [props.inputs],
      private_inputs: [props.witness],
    };
    dispatch(addProvingTask(info))
      .unwrap()
      .then((res) => {
        setStatus(ModalStatus.PostConfirm);
      })
      .catch((err) => {
        console.log("new prove task error", err);
        setMessage("Error creating new prove task.");
        setStatus(ModalStatus.PreConfirm);
      })
      .finally(() => {
        let query = {
            user_address: account!.address,
            md5: props.md5,
            id: "",
            tasktype: "Prove",
            taskstatus: "",
        };
        console.log("update", query);
        dispatch(
          loadStatus(query)
        )
      });
  };

  let content = (
    <>
      <Container>
        <Form.Group className="mb-3 position-relative">
          <Form.Label variant="dark">Image ID(MD5):</Form.Label>
          <Form.Control
            placeholder="Select an image"
            autoComplete="off"
            value={props.md5}
            id="instance-md5"
            name="md5"
            type="text"
            multiple={false}
            disabled={true}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label variant="dark">Public Inputs:</Form.Label>
          <Form.Control
            name="inputs"
            type="text"
            value={props.inputs}
            multiple={false}
            disabled={true}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label variant="dark">Witness Inputs:</Form.Label>
          <Form.Control
            name="inputs"
            type="text"
            value={props.witness}
            multiple={false}
            disabled={true}
          />
        </Form.Group>
      </Container>
    </>
  );

  let modalprops: ModalCommonProps = {
    btnLabel: "Submit",
    title: "Submit Your Game Play",
    childrenClass: "",
    handleConfirm: function (): void {
      addNewProveTask();
    },
    handleClose: () => {
      setStatus(ModalStatus.PreConfirm);
    },
    children: content,
    valid: true,
    message: message,
    status: status,
    confirmLabel: "Confirm",
  };
  return ModalCommon(modalprops);
}
