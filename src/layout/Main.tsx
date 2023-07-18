import 'bootswatch/dist/slate/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.scss';

import { Fragment, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { CommonButton } from '../components/CommonButton';
import { CurrencyDisplay } from '../components/Currency';
import { KeyControl } from '../components/KeyControl';
import { MainNavBar } from '../components/Nav';
import One from '../images/1.png';
import Two from '../images/2.png';
import Three from '../images/3.png';
import Four from '../images/4.png';
import initGameInstance from '../js/g1024';
import { NewProveTask } from '../modals/addNewProveTask';
import { tour } from '../utils/shepherd';

const DirectionKeys = [
  'ArrowUp',
  'ArrowLeft',
  'ArrowDown',
  'ArrowRight',
  'w',
  'a',
  's',
  'd',
];

export function Main() {
  const [board, setBoard] = useState(Array(16).fill(0));
  const [focus, setFocus] = useState(-1);
  const [currency, setCurrency] = useState(20);
  const [commands, setCommands] = useState<number[]>([]);
  const [highscore, setHighscore] = useState(currency);
  const [keyIndex, setKeyIndex] = useState(-1);
  const [showInputsAsRaw, setShowInputsAsRaw] = useState(false);
  const { lastTime } = localStorage;

  const appendCommand = (cmds: number[]) =>
    setCommands(commands => [...commands, ...cmds]);

  function arrowFunction(event: KeyboardEvent) {
    const { key } = event;
    const index = DirectionKeys.indexOf(key);

    if (index >= 0) {
      event.preventDefault();
      handleStep(index % 4);
    }
  }

  const setCurrencyAndHighscore = (ins: any) => {
    const newCurrency = ins.getCurrency();
    setCurrency(newCurrency);
    setHighscore(highscore => Math.max(newCurrency, highscore));
  };

  useEffect(() => {
    if (lastTime) tour.cancel();
    else tour.start();

    initGameInstance().then((ins: any) => {
      for (let i = 0; i < 16; i++) {
        board[i] = ins.getBoard(i);
      }
      setBoard([...board]);
      setCurrencyAndHighscore(ins);
    });
    document.addEventListener('keydown', arrowFunction, false);
    return () => document.removeEventListener('keydown', arrowFunction, false);
  }, []);

  const getWitness = () =>
    `0x${commands
      .map(command => command.toString(16).padStart(2, '0'))
      .join('')}:bytes-packed`;

  const getURI = () =>
    `${commands.length}:i64-0x${commands.map(command =>
      command.toString(16).padStart(2, '0'),
    )}:bytes-packed`;

  function displayCommandIcons() {
    let icons = [];
    for (let i = 0; i < commands.length; i++) {
      let icon = <></>;
      //Check prev is sell, display as number not arrow
      if (i > 0) {
        if (commands[i - 1] === 4 && commands[i - 3] === 4) {
          //Display cell that has been sold
          if (commands[i - 1] === 4 || commands[i - 2] !== 4) {
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

      const iconNames = [
        'arrow-up',
        'arrow-left',
        'arrow-down',
        'arrow-right',
        'cash-stack',
      ];
      const command = commands[i];

      icons.push(
        command >= 0 && command < 5 ? (
          <i
            className={`bi bi-${iconNames[command]} mx-1`}
            key={i + '-' + command}
          />
        ) : (
          <span>{command}</span>
        ),
      );
    }
    return icons;
  }

  async function handleStep(index: number) {
    const ins = await initGameInstance();
    if (!ins.getCurrency()) return alert('not enough currency to proceed!');

    setKeyIndex(index);
    setFocus(-1);
    ins.step(index);
    for (let i = 0; i < 16; i++) {
      board[i] = ins.getBoard(i);
    }
    setBoard([...board]);
    setCurrencyAndHighscore(ins);
    appendCommand([index]);
  }

  async function toggleSelect(focus: number) {
    setFocus(focus);
  }

  async function handleSell() {
    const ins = await initGameInstance();
    if (focus !== -1) {
      let focusValue = ins.getBoard(focus);
      for (let i = 0; i < 16; i++) {
        if (ins.getBoard(i) > focusValue)
          return alert('can only sell highest value block');
      }
      ins.sell(focus);
      for (let i = 0; i < 16; i++) {
        board[i] = ins.getBoard(i);
      }
      setBoard([...board]);
      setCurrencyAndHighscore(ins);

      appendCommand([4, focus]);
      setFocus(-1);
    }
  }

  function restartGame() {
    window.location.reload();
  }

  const cellClass = (index: number) =>
    board[index] ? `board-cell-${board[index]}` : 'board-cell';

  return (
    <Container className="justify-content-center mb-4">
      <MainNavBar highscore={highscore} />

      <Row className="mt-3">
        <Col xl={3} />
        <Col xl={6} xs={12}>
          <Row className="justify-content-center lead-step-2">
            <Col
              xs={12}
              className="d-flex justify-content-between align-items-center p-0 game-width"
            >
              <h2 className="fs-1 fw-bold gradient-content icon-2048">2048</h2>
              <CurrencyDisplay tag="Score" value={currency} />
            </Col>
            <Col xs={12} className="d-flex justify-content-center mt-3">
              <div className="content d-flex justify-content-center flex-column flex-shrink-0">
                {Array.from(new Array(4), (_, r) => (
                  <div className="m-0 p-0 flex-nowrap board-row" key={r}>
                    {Array.from(new Array(4), (_, c) => {
                      const index = r * 4 + c;

                      return (
                        <button
                          key={index}
                          className={`appearance-none board-cell-out ${cellClass(
                            index,
                          )}${index === focus ? ' active' : ''}`}
                          onClick={() => toggleSelect(index)}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </Col>
            <Col
              xs={12}
              className="container-max mx-auto d-flex justify-content-between my-3 lead-step-3"
            >
              <CommonButton className="w-50 me-2" border onClick={handleSell}>
                <span className="gradient-content">Sell</span>
              </CommonButton>
              <div className="w-50 ms-2">
                <NewProveTask
                  md5="63715f93c83bd315345dfde9a6e0f814"
                  inputs={`${commands.length}:i64`}
                  witness={getWitness()}
                  highscore={highscore}
                />
              </div>
            </Col>
          </Row>
        </Col>
        <Col xl={3} xs={12} className="d-flex flex-column align-items-center">
          <div className="lead-step-1 bg-gradient control rouned-pill mb-2 game-width pt-3 pb-4 px-5">
            <KeyControl value={keyIndex} onChange={handleStep} />
          </div>
          <button
            className="appearance-none mt-3 tutorial-btn fw-semibold fs-5"
            onClick={tour.start}
          >
            <i className="bi bi-tools me-2" />
            <span>Game tutorial</span>
          </button>
        </Col>
      </Row>

      <div className="game-inputs border-box rounded-4 container-max overflow-breakword my-4 mx-auto">
        <div className="border-content">
          <Row className="px-3 py-3 rounded-4">
            <Col>
              <button
                className="appearance-none ps-0 me-1"
                onClick={() => setShowInputsAsRaw(!showInputsAsRaw)}
              >
                <i className="bi bi-eye gradient-content" />
              </button>
              <span>
                {showInputsAsRaw ? 'Show Commands' : 'Show Raw Proof Inputs'}
              </span>
            </Col>
            <Col className="text-end">
              {showInputsAsRaw ? (
                <div>{getURI()}</div>
              ) : (
                <div>
                  {!commands.length && 'No inputs made yet!'}
                  {displayCommandIcons()}
                </div>
              )}
            </Col>
          </Row>
        </div>
      </div>

      <div className="rounded-4 border-box container-max mx-auto text-center">
        <div className="border-content py-3">
          <h2>HOW TO PLAY?</h2>
          <p className="px-4" style={{ fontSize: '18px' }}>
            Use your arrow keys to move the tiles. Each time you move, one
            currency unit is deducted. When two tiles with the same icon touch,
            they merge into one tile with same icon they summed to one! When you
            make the highest tile, you can sell the highest tile for currency.
          </p>
          <div className="d-flex align-items-center justify-content-center flex-wrap my-3">
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
    </Container>
  );
}
