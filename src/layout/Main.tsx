import "bootswatch/dist/slate/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./style.scss";

import { Fragment, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

import { CurrencyDisplay } from "../components/Currency";
import initGameInstance from "../js/g1024";
import History from "../components/History";
import { NewProveTask } from "../modals/addNewProveTask";
import { MainNavBar } from "../components/Nav";
import { CommonButton } from "../components/CommonButton";
import One from "../images/1.png";
import Two from "../images/2.png";
import Three from "../images/3.png";
import Four from "../images/4.png";
import Control from "../images/control.svg";

const DirectionKeys = [
  "ArrowUp",
  "ArrowLeft",
  "ArrowDown",
  "ArrowRight",
  "w",
  "a",
  "s",
  "d",
];

export function Main() {
  const [board, setBoard] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [focus, setFocus] = useState(-1);
  const [currency, setCurrency] = useState(20);
  const [commands, setCommands] = useState<Array<number>>([]);
  const [highscore, setHighscore] = useState(20);

  const [showInputsAsRaw, setShowInputsAsRaw] = useState(false);

  function appendCommand(cmds: Array<number>) {
    setCommands((commands) => {
      return [...commands.concat(cmds)];
    });
  }

  function arrowFunction(event: KeyboardEvent) {
    const { key } = event;
    const index = DirectionKeys.indexOf(key);

    if (index >= 0) {
      event.preventDefault();
      step(index % 4);
    }
  }

  useEffect(() => {
    initGameInstance().then((ins: any) => {
      for (var i = 0; i < 16; i++) {
        board[i] = ins.getBoard(i);
      }
      setBoard([...board]);
      setCurrency(ins.getCurrency());
    });
    document.addEventListener("keydown", arrowFunction, false);
    return () => {
      document.removeEventListener("keydown", arrowFunction, false);
    };
  }, []);

  useEffect(() => {
    if (currency > highscore) setHighscore(currency);
  }, [currency]);

  function getWitness() {
    let wit = `0x`;
    for (var c of commands) {
      wit = wit + "0" + c.toString(16);
    }
    wit = wit + ":bytes-packed";
    return wit;
  }

  function getURI() {
    let uri = `${commands.length}:i64-0x`;
    for (var c of commands) {
      uri = uri + "0" + c.toString(16);
    }
    uri = uri + ":bytes-packed";
    return uri;
  }

  function displayCommandIcons() {
    let icons = [];
    for (var i = 0; i < commands.length; i++) {
      let icon = <></>;
      //Check prev is sell, display as number not arrow
      if (i > 0) {
        if (commands[i - 1] === 4 && commands[i - 3] === 4) {
          //Display cell that has been sold
          if (commands[i - 1] === 4 || commands[i - 2] != 4) {
            icon = <span>{commands[i]}</span>;
            icons.push(icon);
            continue;
          }
        } else if (commands[i - 1] === 4 && commands[i - 2] === 4) {
          //continue to next to display cell as action (arrow or sell)
        } else if (commands[i - 1] === 4) {
          //Display the cell that has been sold
          icon = <span>{commands[i]}</span>;
          icons.push(icon);
          continue;
        }
      }

      switch (commands[i]) {
        case 0:
          icon = <i className="bi bi-arrow-up mx-1"></i>;
          break;
        case 1:
          icon = <i className="bi bi-arrow-left mx-1"></i>;
          break;
        case 2:
          icon = <i className="bi bi-arrow-down mx-1"></i>;
          break;
        case 3:
          icon = <i className="bi bi-arrow-right mx-1"></i>;
          break;
        case 4:
          icon = <i className="bi bi-cash-stack mx-1"></i>;
          break;

        default:
          icon = <span>{commands[i]}</span>;
      }
      icons.push(icon);
    }
    return icons;
  }

  async function step(k: number) {
    let ins = await initGameInstance();
    if (ins.getCurrency() === 0) {
      alert("not enough currency to proceed!");
      return;
    }
    setFocus(-1);
    ins.step(k);
    for (var i = 0; i < 16; i++) {
      board[i] = ins.getBoard(i);
    }
    setBoard([...board]);
    setCurrency(ins.getCurrency());
    appendCommand([k]);
  }

  async function toggleSelect(focus: number) {
    setFocus(focus);
  }

  async function sell() {
    let ins = await initGameInstance();
    if (focus !== -1) {
      let focusValue = ins.getBoard(focus);
      for (var i = 0; i < 16; i++) {
        let compare = ins.getBoard(i);
        if (compare > focusValue) {
          alert("can only sell highest value block");
          return;
        }
      }
      ins.sell(focus);
      for (let i = 0; i < 16; i++) {
        board[i] = ins.getBoard(i);
      }
      setBoard([...board]);
      setCurrency(ins.getCurrency());

      appendCommand([4, focus]);
      setFocus(-1);
    }
  }

  function restartGame() {
    window.location.reload();
  }

  function cellClass(index: number) {
    if (board[index] === 0) {
      return "board-cell";
    } else {
      return `board-cell-${board[index]}`;
    }
  }

  return (
    <>
      <MainNavBar currency={currency} handleRestart={restartGame}></MainNavBar>
      <Container className="justify-content-center mb-4">
        <Row className="justify-content-md-center m-auto mt-3">
          <Col className="d-flex justify-content-between align-items-center p-0 game-width">
            <h2 className="fs-1 fw-bold gradient-content icon-2048">2048</h2>
            <CurrencyDisplay
              className="high-score mx-2"
              tag="Score"
              value={highscore}
            />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <div className="content">
              {[...Array(4)].map((_, r) => {
                return (
                  <div className="board-row" key={r}>
                    {[...Array(4)].map((_, c) => {
                      let index = r * 4 + c;
                      return (
                        <div
                          className={`${cellClass(r * 4 + c)} board-cell-out`}
                          onClick={() => toggleSelect(index)}
                          key={index}
                        >
                          {index === focus && <div></div>}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>

        <div className="container-max mx-auto d-flex justify-content-between my-3">
          <CommonButton className="w-50 me-2" border onClick={sell}>
            Sell
          </CommonButton>
          <div className="w-50 ms-2">
            <NewProveTask
              md5="77DA9B5A42FABD295FD67CCDBDF2E348"
              inputs={`${commands.length}:i64`}
              witness={getWitness()}
            />
          </div>
        </div>

        <div className="text-center">
          <img src={Control} alt="#" />
        </div>

        <Row className="justify-content-center overflow-breakword my-4">
          <Col lg={6} xs={12} className="game-inputs border-box rounded-4">
            <Row className="py-3 border-content rounded-4">
              <Col>
                <div>
                  <button
                    className="appearance-none ps-0 me-1"
                    onClick={() => setShowInputsAsRaw(!showInputsAsRaw)}
                  >
                    <i className="bi bi-eye" />
                  </button>
                  <span>
                    {showInputsAsRaw
                      ? "Show Commands"
                      : "Show Raw Proof Inputs"}
                  </span>
                </div>
              </Col>
              <Col className="text-end">
                {showInputsAsRaw ? (
                  <div>{getURI()}</div>
                ) : (
                  <div>
                    {!commands.length && "No inputs made yet!"}
                    {displayCommandIcons()}
                  </div>
                )}
              </Col>
            </Row>
          </Col>
        </Row>

        <div className="rounded-4 border-box container-max mx-auto text-center">
          <div className="border-content py-3">
            <h2>HOW TO PLAY?</h2>
            <p className="px-4" style={{ fontSize: "18px" }}>
              Use your arrow keys to move the tiles. Each time you move, one
              currency unit is deducted. When two tiles with the same icon
              touch, they merge into one tile with same icon they summed to one!
              When you make the highest tile, you can sell the highest tile for
              currency.
            </p>
            <div className="d-flex align-items-center justify-content-center my-3">
              {[One, Two, Three, Four].map((src, index, { length }) => (
                <Fragment key={src}>
                  <img src={src} alt="#" className="game-icon" />
                  {index + 1 < length && (
                    <>
                      <span className="mx-2">+</span>
                      <img src={src} alt="#" className="game-icon" />
                      <span className="mx-2">=</span>
                    </>
                  )}
                </Fragment>
              ))}
              <span className="ms-2">...</span>
            </div>
          </div>
        </div>

        <History md5="77DA9B5A42FABD295FD67CCDBDF2E348" />
      </Container>
    </>
  );
}
