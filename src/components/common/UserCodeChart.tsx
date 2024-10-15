import React from "react";
import { useSelector } from "react-redux";
import { isEmptyEntity } from "../../helpers/common/GlobalHelper";


export default function UserCodeChart({ className }: any) {
  const loginUser = useSelector((state: any) => state.user.user);
  //const isCpuser = user?.CpUser === "true";

  const hasUserCode = !isEmptyEntity(loginUser?.UserCode);

  return hasUserCode ? (
    <span className={className}>{loginUser?.UserCode}</span>
  ) : null;

}
