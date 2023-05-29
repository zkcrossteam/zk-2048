import { useEffect } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loginL1AccountAsync, selectL1Account } from '../data/accountSlice';
import logo from '../images/logo.svg';
import { addressAbbreviation } from '../utils/address';
import { CommonButton } from './CommonButton';
import { CurrencyDisplay } from './Currency';

interface IProps {
  highscore: number;
}

export function MainNavBar({ highscore }: IProps) {
  const dispatch = useAppDispatch();
  const account = useAppSelector(selectL1Account);

  useEffect(() => {
    dispatch(loginL1AccountAsync());
  }, []);

  return (
    <Navbar expand="lg" style={{ zIndex: 1000 }}>
      <Container className="justify-content-md-between">
        <Navbar.Brand href="https://www.larona.io" target="_blank">
          <img src={logo} height="30" alt="logo"></img>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto my-2 align-items-center">
            <CurrencyDisplay
              className="my-2"
              tag="Best Score"
              value={highscore}
            />
            {account ? (
              <CommonButton className="ms-4 connect my-2">
                {addressAbbreviation(account.address, 4)}
              </CommonButton>
            ) : (
              <CommonButton
                className="appearance-none ms-4 connect my-2"
                onClick={() => dispatch(loginL1AccountAsync())}
              >
                Connect Wallet
              </CommonButton>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
