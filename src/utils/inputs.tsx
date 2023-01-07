import React from "react";
interface Prop {
  inputs: Array<string>;
}
export function Inputs(prop: Prop) {
  return (
    <>{
    prop.inputs.map((input:string) => {
      return (<span className="badge bg-primary rounded-pill">{input}</span>);
    })
    }</>
  );
}
