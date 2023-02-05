import React, { createRef, useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { loadStatus, selectTasks, tasksLoaded, addProvingTask } from "../data/statusSlice";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {QRCodeSVG} from 'qrcode.react';
import initGameInstance from "../js/g1024";
import History from "../components/History";
import { NewProveTask } from "../modals/addNewProveTask";

import "bootstrap-icons/font/bootstrap-icons.css";

import "./style.scss";
import "bootswatch/dist/slate/bootstrap.min.css";

import { Container } from 'react-bootstrap';
import { MainNavBar } from '../components/Nav';


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
      step(0);
    } else if (event.key == "ArrowLeft") {
      step(1);
    } else if (event.key == "ArrowDown") {
      step(2);
    } else if (event.key == "ArrowRight") {
      step(3);
    }
  }

  useEffect(() => {
    initGameInstance().then((ins:any) => {
      for (var i=0;i<16;i++) {
        board[i] = ins.getBoard(i);
      }
      setBoard([...board]);
      //ins.setCurrency(40);
      setCurrency(ins.getCurrency());
    });
    document.addEventListener("keydown", arrowFunction, false);
    return () => {
      document.removeEventListener("keydown", arrowFunction, false);
    };
  }, [])

  function getWitness() {
    let wit = `0x`;
    for (var c of commands) {
      wit = wit + "0" + c.toString(16);
    };
    wit = wit +":bytes-packed";
    return wit;

  }

  function getURI() {
    let uri = `${commands.length}:i64-0x`;
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
    appendCommand([k]);
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
    if (board[index] === 0) {
      return "board-cell"
    } else {
      return `board-cell-${board[index]}`
    }
  }

  return (
    <>
      <MainNavBar></MainNavBar>
      <Container className="justify-content-center'">
        <Row className="justify-content-md-center mt-3">
          <Col lg="2">currency: {currency} </Col>
          <Col lg="2">total steps: {commands.length} </Col>
          <Col lg="1"><button onClick={() => sell()}> Sell </button></Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <div className="content">
              {[...Array(4)].map((_, r) => {
                return (<div className="board-row">
                  {[...Array(4)].map((_, c) => {
                    let index = r * 4 + c;
                    return <div className={`${cellClass(r * 4 + c)} board-cell-out`} onClick={() => toggleSelect(r * 4 + c)}>
                      {
                        index === focus && <div></div>
                      }
                    </div>
                  })}
                </div>)
              })}
            </div>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col lg="5" className="mt-3">use keyboard up, down, left, right to play and redeme your price by providing your game playing.</Col>
        </Row>
        <Row className="pt-4">
          <QRCodeSVG value={getURI()} />
        </Row>
        <Row className="justify-content-md-center">
          <Col lg="5" className="mt-3">{getURI()}</Col>
          <Col lg="1">
              <NewProveTask md5="B540BE293CE6C108BCE629BAC91625A4"
                inputs={`${commands.length}:i64`}
                witness={getWitness()}
              ></NewProveTask></Col>
        </Row>
      </Container>
      <History md5="B540BE293CE6C108BCE629BAC91625A4"></History>
    </>
  );
}

