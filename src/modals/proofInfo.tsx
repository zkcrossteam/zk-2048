// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import { Container, ListGroup } from "react-bootstrap";
import { useAppSelector } from "../app/hooks";
import './style.scss';
import { ModalCommon, ModalCommonProps, ModalStatus } from "./base";
import { Task } from "zkwasm-service-helper";
import { bytesToBN } from "../utils/proof";
import { contract_abi, parseArgs } from "../data/image";
import BN from "bn.js";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {
  selectL1Account,
} from "../data/accountSlice";
import { zkwasmImageHelper } from '../data/endpoint';
import { Inputs } from "../utils/inputs";


export interface ProofInfoProps {
  task: Task;
}

export function ProofInfoModal(info:ProofInfoProps) {
  let account = useAppSelector(selectL1Account);
  let task = info.task;
  let aggregate_proof = bytesToBN(task.proof);
  let instances = bytesToBN(task.instances);
  let aux = bytesToBN(task.aux);
  async function testverify() {
    if (account) {
      let web3 = account.web3!;
      let image = await zkwasmImageHelper.queryImage(info.task.md5);
      if (image.deployment.length>0) {
        let address = image.deployment[0].address;
        let verify_contract = new web3.eth.Contract(contract_abi.abi, address, {
          from:account!.address
        });
        let args = parseArgs(task.public_inputs).map((x)=> x.toString(10));
        console.log("args are:", args);
        let result = await verify_contract.methods.verify(aggregate_proof, instances, aux, [args]).send();
        console.log("verification result:", result.toString());
      }
      let address = image.deployment
    } else {
      console.error("wallet not connected");
    }
  }
  let taskproof = (
    <>
    <Container>
    <Tabs
        defaultActiveKey="Inputs"
        className="mb-3"
        justify
    >
      <Tab eventKey="Inputs" title="Inputs">
        <p>Public Inputs: <Inputs inputs={task.public_inputs}></Inputs></p>
        <p>Witness: <Inputs inputs={task.private_inputs}></Inputs></p>
      </Tab>
      <Tab eventKey="Instances" title="Instances">
        {instances.map((proof:BN) => {
          return (<ListGroup.Item key={proof.toString("hex")}>0x{proof.toString("hex")}</ListGroup.Item>);
        })}
      </Tab>
      <Tab eventKey="prooftranscript" title="Proof Transcripts">
        <div className="scroll-300">
        {aggregate_proof.map((proof:BN) => {
          return (<ListGroup.Item key={proof.toString("hex")} >0x{proof.toString("hex")}</ListGroup.Item>);
        })}
        </div>
      </Tab>
      <Tab eventKey="auxdata" title="Aux Data">
        {aux.map((proof:BN) => {
           return (<ListGroup.Item key={proof.toString("hex")} >0x{proof.toString("hex")}</ListGroup.Item>);
        })}
      </Tab>
    </Tabs>
    </Container>
    </>
  );
  let props:ModalCommonProps = {
    btnLabel: <i className="bi bi-eye"></i>,
    title: "Proof Information",
    childrenClass: "",
    handleConfirm: function (): void {
      testverify();
    },
    valid: true,
    status: ModalStatus.PreConfirm,
    children:  taskproof,
    message: "",
    confirmLabel: "verify on chain"
  }
  return ModalCommon(props);
}

