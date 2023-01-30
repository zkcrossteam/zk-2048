import React, { createRef, useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { loadStatus, selectTasks, tasksLoaded, addProvingTask, addNewWasmImage } from "../data/statusSlice";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {QRCodeSVG} from 'qrcode.react';
import initGameInstance from "../js/g1024";

import "./style.scss";
import "bootswatch/dist/slate/bootstrap.min.css";

import {
  loginL1AccountAsync,
  selectL1Account,
} from "../data/accountSlice";
import { Container } from 'react-bootstrap';


export function Main() {
  const dispatch = useAppDispatch();
  const [board, setBoard] = useState([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
  const [focus, setFocus] = useState(-1);
  const [currency, setCurrency] = useState(40);
  const [commands, setCommands] = useState<Array<number>>([]);
  const [submitURI, setSubmitURI] = useState("");
  let ready = useAppSelector(tasksLoaded);

  function appendCommand(cmds: Array<number>) {
    setCommands(commands => {return [...commands.concat(cmds)]});
  }

  function arrowFunction(event:KeyboardEvent) {
    if (event.key === "ArrowUp") {
      appendCommand([0]);
      step(0);
    } else if (event.key == "ArrowLeft") {
      appendCommand([1]);
      step(1);
    } else if (event.key == "ArrowDown") {
      appendCommand([2]);
      step(2);
    } else if (event.key == "ArrowRight") {
      appendCommand([3]);
      step(3);
    }
  }

  useEffect(() => {
    initGameInstance().then((ins:any) => {
      for (var i=0;i<16;i++) {
        board[i] = ins.getBoard(i);
      }
      setBoard([...board]);
      ins.setCurrency(40);
      setCurrency(ins.getCurrency());
    });
    document.addEventListener("keydown", arrowFunction, false);
    return () => {
      document.removeEventListener("keydown", arrowFunction, false);
    };
  }, [])

  function getURI() {
    let uri = `${commands.length}:i64 0x`;
    for (var c of commands) {
      uri = uri + "0" + c.toString(16);
    };
    uri = uri+":bytes-packed";
    return uri;
  };

  async function step(k:number) {
    let ins = await initGameInstance();
    if (ins.getCurrency() == 0) {
      alert("not enough current to proceed!")
      return;
    }
    setFocus(-1);
    ins.step(k);
    for (var i=0;i<16;i++) {
      board[i] = ins.getBoard(i);
    }
    setBoard([...board]);
    setCurrency(ins.getCurrency())
  }

  async function toggleSelect(focus: number) {
    setFocus(focus);
  }

  async function sell() {
    let ins = await initGameInstance();
    if (focus !=-1) {
      let focusValue = ins.getBoard(focus);
      for (var i=0; i<16; i++) {
        let compare = ins.getBoard(i);
        if (compare > focusValue) {
          alert("can only sell highest value block");
          return;
        }
      }
      ins.sell(focus);
      for (var i=0;i<16;i++) {
        board[i] = ins.getBoard(i);
      }
      setBoard([...board]);
      setCurrency(ins.getCurrency())
      appendCommand([4,focus]);
      setFocus(-1);
    }
  }

  function cellClass(index:number) {
    if (index === focus) {
      return "board-cell-selected";
    } else {
      if (board[index] === 0) {
        return "board-cell"
      } else {
        return `board-cell-${board[index]}`
      }
    }
  }

  return (
    <Container className="justify-content-center'">
    <Row>
        <Col>use keyboard up, down, left, right to play</Col>
        <Col>currency: {currency} </Col>
        <Col>total steps: {commands.length} </Col>
        <Col><button onClick={()=>sell()}> Sell </button></Col>
    </Row>
    <Row>
      <Col>
    <div className="content">
    {[...Array(4)].map((_, r) => {
      return (<div className="board-row">
        {[...Array(4)].map((_, c) => {
          return <div className={cellClass(r*4+c)} onClick={() => toggleSelect(r*4+c)}></div>
        })}
      </div>)
    })}
    </div>
    </Col>
    </Row>
    <Row className="pt-4">
    <QRCodeSVG value={getURI()} />
    </Row>
  </Container>);
}

