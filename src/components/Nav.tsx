import { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";

import { useAppSelector, useAppDispatch } from "../app/hooks";
import { loginL1AccountAsync, selectL1Account } from "../data/accountSlice";
import { addressAbbreviation } from "../utils/address";
import { CurrencyDisplay } from "./Currency";
import logo from "../images/logo.svg";

interface IProps {
  currency: number;
  handleRestart: () => void;
}

export function MainNavBar(props: IProps) {
  const dispatch = useAppDispatch();

  let account = useAppSelector(selectL1Account);

  const [maxScore, setmaxScore] = useState(6889);

  useEffect(() => {
    dispatch(loginL1AccountAsync());
  }, []);

  return (
    <Navbar expand="lg" style={{ zIndex: "1000" }}>
      <Container className="justify-content-md-between">
        <Navbar.Brand href="http://www.delphinuslab.com">
          <img src={logo} height="30" alt="logo"></img>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <CurrencyDisplay tag="Best Score" value={maxScore} />
            {account && (
              <>
                <Navbar.Text>
                  <div>Account</div>
                  <div>{addressAbbreviation(account.address, 4)}</div>
                </Navbar.Text>
              </>
            )}
            {!account && (
              <>
                <button
                  className="appearance-none rounded-pill border-0 fs-5 fw-semibold ms-4 ms-xl-0 text-black connect"
                  onClick={() => dispatch(loginL1AccountAsync())}
                >
                  Connect Wallet
                </button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
