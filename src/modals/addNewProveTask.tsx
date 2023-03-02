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
import { withBrowerWeb3, DelphinusWeb3 } from "web3subscriber/src/client";

import "./style.scss";

import {
  ProvingParams,
  ZkWasmUtil,
  WithSignature,
} from "zkwasm-service-helper";

interface NewWASMImageProps {
  md5: string;
  inputs: string;
  witness: string;
}

export async function signMessage(message: string) {
  let signature = await withBrowerWeb3(async (web3: DelphinusWeb3) => {
    let provider = web3.web3Instance.currentProvider;
    if (!provider) {
      throw new Error("No provider found!");
    }
    const accounts = await web3.web3Instance.eth.getAccounts();
    const account = accounts[0];
    const msg = web3.web3Instance.utils.utf8ToHex(message);
    const msgParams = [msg, account];
    //TODO: type this properly
    const sig = await (provider as any).request({
      method: "personal_sign",
      params: msgParams,
    });
    return sig;
  });
  return signature;
}

export function NewProveTask(props: NewWASMImageProps) {
  const dispatch = useAppDispatch();
  let account = useAppSelector(selectL1Account);

  const [message, setMessage] = React.useState<string>("");
  const [status, setStatus] = React.useState<ModalStatus>(
    ModalStatus.PreConfirm
  );

  const prepareNewProveTask = async function () {
    let info: ProvingParams = {
      user_address: account!.address.toLowerCase(),
      md5: props.md5,
      public_inputs: [props.inputs],
      private_inputs: [props.witness],
    };

    let msgString = ZkWasmUtil.createProvingSignMessage(info);

    let signature: string;
    try {
      setMessage("Waiting for signature...");
      signature = await signMessage(msgString);
      setMessage("Submitting new prove task...");
    } catch (e: unknown) {
      console.log("error signing message", e);
      setStatus(ModalStatus.PreConfirm);
      setMessage("Error signing message");
      throw Error("Unsigned Transaction");
    }

    let task: WithSignature<ProvingParams> = {
      ...info,
      signature: signature,
    };

    return task;
  }

  const addNewProveTask = async function () {
    let task = await prepareNewProveTask();

    dispatch(addProvingTask(task))
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
