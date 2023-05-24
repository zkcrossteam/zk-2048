import { useEffect, useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loginL1AccountAsync, selectL1Account } from '../data/accountSlice';
import logo from '../images/logo.svg';
import { addressAbbreviation } from '../utils/address';
import { CurrencyDisplay } from './Currency';

interface IProps {
  currency: number;
  handleRestart: () => void;
}

export function MainNavBar(props: IProps) {
  const dispatch = useAppDispatch();
  const account = useAppSelector(selectL1Account);
  const [maxScore, setMaxScore] = useState(6889);

  useEffect(() => {
    dispatch(loginL1AccountAsync());
  }, []);

  return (
    <Navbar expand="lg" style={{ zIndex: 1000 }}>
      <Container className="justify-content-md-between">
        <Navbar.Brand href="http://www.delphinuslab.com">
          <img src={logo} height="30" alt="logo"></img>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto mt-2">
            <CurrencyDisplay tag="Best Score" value={maxScore} />
            {account ? (
              <div className="d-flex align-items-center ms-4">
                {addressAbbreviation(account.address, 4)}
              </div>
            ) : (
              <button
                className="appearance-none rounded-pill fs-5 fw-semibold ms-4 text-black connect"
                onClick={() => dispatch(loginL1AccountAsync())}
              >
                Connect Wallet
              </button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
