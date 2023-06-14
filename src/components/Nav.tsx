import { useEffect, useMemo, useRef } from 'react';
import { Container, Dropdown, Nav, Navbar } from 'react-bootstrap';
import { Web3BrowsersMode, withBrowerWeb3 } from 'web3subscriber/src/client';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  loginL1AccountAsync,
  selectL1Account,
  selectLocalStorageAccount,
  setL1Account,
} from '../data/accountSlice';
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
  const localStorageAccount = useAppSelector(selectLocalStorageAccount);

  const isLogin = useMemo(
    () =>
      !!account?.address &&
      account.address.toLocaleLowerCase() ===
        localStorageAccount?.toLocaleLowerCase(),
    [account, localStorageAccount],
  );

  const disconnect = () => {
    localStorage.account = '';
    window.location.reload();
  };

  const runTime = useRef(0);
  useEffect(() => {
    if (runTime.current < 1) {
      runTime.current++;

      withBrowerWeb3(async web3 => {
        (web3 as Web3BrowsersMode).provider.on('accountsChanged', accounts => {
          localStorage.account = (accounts as string[])[0] || '';

          dispatch(setL1Account(localStorage.account));
        });

        const accounts = await (web3 as Web3BrowsersMode).provider.request<
          string[]
        >({ method: 'eth_accounts' });

        if (!accounts?.[0]) return (localStorage.account = '');

        dispatch(
          setL1Account(
            accounts &&
              accounts[0]?.toLocaleLowerCase() ===
                localStorage.account?.toLocaleLowerCase()
              ? accounts[0]
              : '',
          ),
        );
      });
    }
  }, []);

  return (
    <Navbar variant="dark" expand="lg" style={{ zIndex: 1000 }}>
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
            {isLogin ? (
              <Dropdown className="ms-4 my-2 dropdown-user">
                <Dropdown.Toggle as={CommonButton} className="connect">
                  {addressAbbreviation(account!.address, 4)}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    className="fs-5 fw-semibold"
                    onClick={disconnect}
                  >
                    Disconnect
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
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
