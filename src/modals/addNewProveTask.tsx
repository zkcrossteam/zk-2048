import './style.scss';

import { FC, useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { DelphinusWeb3, withBrowerWeb3 } from 'web3subscriber/src/client';
import {
  ProvingParams,
  WithSignature,
  ZkWasmUtil,
} from 'zkwasm-service-helper';

import GameSoulbound from '../abi/GameSoulbound.json';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { CommonBg } from '../components/CommonBg';
import { CommonButton } from '../components/CommonButton';
import { selectL1Account } from '../data/accountSlice';
import { addProvingTask, loadStatus } from '../data/statusSlice';
import { ModalCommon, ModalCommonProps, ModalStatus } from './base';

type NewWASMImageProps = Record<'md5' | 'inputs' | 'witness', string>;

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

export function NewProveTask({ md5, inputs, witness }: NewWASMImageProps) {
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
      setMessage('Waiting for signature...');
      signature = await signMessage(msgString);
      setMessage('Submitting new prove task...');
    } catch (e: unknown) {
      console.log('error signing message', e);
      setStatus(ModalStatus.PreConfirm);
      setMessage('Error signing message');
      throw Error('Unsigned Transaction');
    }

    const task: WithSignature<ProvingParams> = {
      ...info,
      signature,
    };

    return task;
  };

  const addNewProveTask = async function () {
    const task = await prepareNewProveTask();

    try {
      const contract = await withBrowerWeb3(async web3 =>
        web3.getContract(
          GameSoulbound,
          '0x4edf97c6F25Af40EE924940eD55f9786283121a9',
          task.user_address,
        ),
      );

      contract.getWeb3Contract().methods?.verify(0, 100);

      setMessage('');
      setStatus(ModalStatus.PostConfirm);
    } catch (error) {
      console.log('new prove task error', error);
      setMessage('Error creating new prove task.');
      setStatus(ModalStatus.PreConfirm);
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
        <div className="p-3">{value}</div>
      </CommonBg>
    </Form.Group>
  );

  const content = (
    <>
      <Container>
        <FormGroup label="Image ID (MD5):" value={md5} />
        <FormGroup label="Public Inputs:" value={inputs} />
        <FormGroup label="Witness Inputs:" value={witness} />
      </Container>
    </>
  );

  const modalprops: ModalCommonProps = {
    buttonLabel: <CommonButton className="w-100">Submit ZK Proof</CommonButton>,
    title: ['Submit ', 'Your Game Play'],
    childrenClass: '',
    onConfirm: addNewProveTask,
    onClose: () => setStatus(ModalStatus.PreConfirm),
    children: content,
    valid: true,
    message: message,
    status: status,
    confirmLabel: 'Confirm',
  };

  return ModalCommon(modalprops);
}
