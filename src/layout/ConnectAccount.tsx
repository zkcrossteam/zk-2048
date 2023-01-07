import React, {createRef, useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';

import {
  selectL1Account,
  loginL1AccountAsync,
} from "../data/accountSlice";

export function Connect() {
  let account = useAppSelector(selectL1Account);
  const dispatch = useAppDispatch();
  const connect = () => {
    dispatch(loginL1AccountAsync());
  };

  if (!account) {
    return(
    <>
    <div className="connect-account">
        <div onClick={() => connect()}>connect account</div>
    </div>
    </>
    );
  } else {
    //console.log("connected", account);
    return (<></>);
  }

}
