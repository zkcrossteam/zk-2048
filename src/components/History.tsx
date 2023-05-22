import { useEffect } from "react";
import { Table, Image } from "react-bootstrap";
import classNames from "classnames";

import { CommonBg } from "./CommonBg";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loadStatus, selectTasks } from "../data/statusSlice";
import { selectL1Account } from "../data/accountSlice";
import { ProofInfoModal } from "../modals/proofInfo";
import { shortenString } from "../utils/string";
import User from "../images/people.svg";

export interface UserHistoryProps {
  md5: string;
}

export default function ImageDetail(props: UserHistoryProps) {
  const dispatch = useAppDispatch();
  const account = useAppSelector(selectL1Account);
  const tasks = useAppSelector(selectTasks);

  useEffect(() => {
    dispatch(
      loadStatus({
        md5: props.md5,
        user_address: account?.address || "",
        id: "",
        tasktype: "Prove",
        taskstatus: "",
      })
    );
  }, [account]);

  return (
    <CommonBg>
      <Table className="rounded">
        <thead>
          <tr>
            <th className="ps-lg-5">Task ID</th>
            <th>Submitted by</th>
            <th>Status</th>
            <th>Proof Details</th>
          </tr>
        </thead>
        <tbody>
          {tasks?.map((task) => (
            <tr key={task._id["$oid"]}>
              <td className="ps-lg-5">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://zkwasm-explorer.delphinuslab.com/image/${task._id["$oid"]}`}
                >
                  {shortenString(task._id["$oid"])}
                </a>
              </td>
              <td>
                <Image className="me-2" src={User} />
                {shortenString(task.user_address)}
              </td>
              <td
                className={classNames({
                  "text-success": task.status === "Done",
                })}
              >
                <Image
                  className="me-2"
                  src={`/${task.status.toLowerCase()}.png`}
                />
                <span>{task.status}</span>
              </td>
              <td>
                <ProofInfoModal task={task} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </CommonBg>
  );
}
