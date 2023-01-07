
import React, { createRef, useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { loadStatus, selectTasks, tasksLoaded, addProvingTask, addNewWasmImage } from "../data/statusSlice";
import "./style.scss";
import "bootswatch/dist/slate/bootstrap.min.css";
//import { step } from "../js/g1024.js";

/* eslint import/no-webpack-loader-syntax: off */
import initGameInstance from "../js/g1024";

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
  let ready = useAppSelector(tasksLoaded);

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
    console.log(event.key);
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

  async function step(k:number) {

    let ins = await initGameInstance();
    if (ins.getCurrency() == 0) {
      alert("not enough current to proceed!")
      return;
    }
    setFocus(-1);
    ins.step(k);

    ins.randomFill();
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
        return "board-cell-value"
      }
    }
  }

  return (<Container className="d-flex justify-content-center'">
    <div className="content">
    <div> currency: {currency} </div>
    <button onClick={()=>sell()}> Sell </button>
    {[...Array(4)].map((_, r) => {
      return (<div className="board-row">
        {[...Array(4)].map((_, c) => {
          return <div className={cellClass(r*4+c)} onClick={() => toggleSelect(r*4+c)}>{board[r*4+c]}</div>
        })}
      </div>)
    })}

    <div>
      use keyboard up, down, left, right to play
    </div>

    </div>
  </Container>);
}

