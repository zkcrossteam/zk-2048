import './style.scss';

import { BN } from 'bn.js';
import { FC, useState } from 'react';
import { Container, Form, Image } from 'react-bootstrap';
import { DelphinusWeb3, withBrowerWeb3 } from 'web3subscriber/src/client';
import {
  ProvingParams,
  WithSignature,
  ZkWasmUtil,
} from 'zkwasm-service-helper';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { CommonBg } from '../components/CommonBg';
import { CommonButton } from '../components/CommonButton';
import { abiAndAddress } from '../data/abiAndAddress';
import { selectL1Account } from '../data/accountSlice';
import { switchNet } from '../data/chainNet';
import { loadStatus } from '../data/statusSlice';
import Failed from '../images/failed.png';
import Success from '../images/success.png';
import { ModalCommon, ModalCommonProps, ModalStatus } from './base';

type NewWASMImageProps = Record<'md5' | 'inputs' | 'witness', string> &
  Record<'highscore', number>;

export function signMessage(message: string) {
  return withBrowerWeb3(
    async ({
      web3Instance: { currentProvider, eth, utils },
    }: DelphinusWeb3) => {
      if (!currentProvider) {
        throw new Error('No provider found!');
      }

      const [account] = await eth.getAccounts();
      const msg = utils.utf8ToHex(message);

      return (currentProvider as any).request({
        method: 'personal_sign',
        params: [msg, account],
      });
    },
  );
}

export function NewProveTask({
  md5,
  inputs,
  witness,
  highscore,
}: NewWASMImageProps) {
  const dispatch = useAppDispatch();
  const account = useAppSelector(selectL1Account);
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<ModalStatus>(ModalStatus.PreConfirm);

  const prepareNewProveTask = async function () {
    const info: ProvingParams = {
      user_address: account!.address.toLowerCase(),
      md5,
      public_inputs: [inputs],
      private_inputs: [witness],
    };

    const msgString = ZkWasmUtil.createProvingSignMessage(info);

    let signature: string;
    try {
      setStatus(ModalStatus.Loading);
      signature = await signMessage(msgString);
    } catch (e: unknown) {
      console.log('error signing message', e);
      setStatus(ModalStatus.Error);
      setMessage('Oops! Something went wrong, please try again.');
      throw Error('Unsigned Transaction');
    }

    const task: WithSignature<ProvingParams> = {
      ...info,
      signature,
    };

    return task;
  };

  const addNewProveTask = async function () {
    await withBrowerWeb3(web3 => switchNet(web3));

    const task = await prepareNewProveTask();

    try {
      const contract = await withBrowerWeb3(async web3 =>
        web3.getContract(
          abiAndAddress.gameSoulbound.abi,
          abiAndAddress.gameSoulbound.address,
          task.user_address,
        ),
      );

      const verify = await contract
        .getWeb3Contract()
        .methods?.verify(new BN(0), new BN(highscore))
        .send();
      console.log('verify', verify);

      setMessage('');
      setStatus(ModalStatus.PostConfirm);
    } catch (error) {
      console.log('new prove task error', error);
      setMessage('Oops! Something went wrong, please try again.');
      setStatus(ModalStatus.Error);
    }

    dispatch(
      loadStatus({
        user_address: account!.address,
        md5,
        id: '',
        tasktype: 'Prove',
        taskstatus: '',
      }),
    );
  };

  const FormGroup: FC<Record<'label' | 'value', string>> = ({
    label,
    value,
  }) => (
    <Form.Group className="mb-3">
      <Form.Label variant="dark">{label}</Form.Label>
      <CommonBg>
        <div className="p-3 text-break">{value}</div>
      </CommonBg>
    </Form.Group>
  );

  const isLoading = status === ModalStatus.Loading;

  const content = (
    <Container>
      {(status === ModalStatus.PreConfirm || isLoading) && (
        <>
          <FormGroup label="Image ID (MD5):" value={md5} />
          <FormGroup label="Public Inputs:" value={inputs} />
          <FormGroup label="Witness Inputs:" value={witness} />
        </>
      )}

      {status === ModalStatus.PostConfirm && (
        <>
          <div className="d-flex justify-content-center">
            <Image src={Success} />
          </div>
          <div className="d-flex justify-content-center">
            <CommonButton
              className="px-4"
              border
              href="https://www.larona.io/profile"
              target="_blank"
            >
              <span className="gradient-content">View on your Profile</span>
            </CommonButton>
          </div>
        </>
      )}

      {status === ModalStatus.Error && (
        <div className="d-flex justify-content-center">
          <Image src={Failed} />
        </div>
      )}
    </Container>
  );

  const title = (
    <>
      {(status === ModalStatus.PreConfirm || isLoading) && (
        <>
          <span className="gradient-content">Submit </span>
          <span>Your Game Play</span>
        </>
      )}
      {status === ModalStatus.PostConfirm && (
        <>
          <span className="gradient-content">Successfully </span>
          <span>submitted</span>
        </>
      )}

      {status === ModalStatus.Error && (
        <>
          <span>Submit </span>
          <span className="text-danger">failed</span>
        </>
      )}
    </>
  );

  const onClose = () => {
    setStatus(ModalStatus.PreConfirm);
    setMessage('');
  };

  const modalprops: ModalCommonProps = {
    buttonLabel: <CommonButton className="w-100">Submit ZK Proof</CommonButton>,
    title,
    childrenClass: '',
    onConfirm: addNewProveTask,
    onClose,
    children: content,
    valid: true,
    message,
    status,
    confirmLabel: isLoading ? 'Confirming' : 'Confirm',
  };

  return ModalCommon(modalprops);
}
