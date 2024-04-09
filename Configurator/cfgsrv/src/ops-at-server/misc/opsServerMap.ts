import { opsServer as pickoneSrv } from "../operators/pickone/opsServer";
import { opsServer as pickmanySrv } from "../operators/pickmany/opsServer";
import { opsServer as literalSrv } from "../operators/literal/opsServer";
import { opsServer as textSrv } from "../operators/text/opsServer";
import { opsServer as intSrv } from "../operators/int/opsServer";
import { opsServer as decSrv } from "../operators/dec/opsServer";
import { opsServer as boolSrv } from "../operators/bool/opsServer";
import { opsServer as objSrv } from "../operators/obj/opsServer";
import { opsServer as repeatSrv } from "../operators/repeat/opsServer";
import { opsServer as zzzSrv } from "../operators/zzz/opsServer";
import { OpsServer } from "../../defs/types/OpsServer";

export function opsServerMap() {
  // create a dictionary of operators
  type OpsMgrDictionary<K extends string> = {
    [key in K]: OpsServer;
  };

  const dict: OpsMgrDictionary<string> = {
    pickone: pickoneSrv,
    pickmany: pickmanySrv,
    literal: literalSrv,
    text: textSrv,
    int: intSrv,
    dec: decSrv,
    bool: boolSrv,
    obj: objSrv,
    repeat: repeatSrv,
    zzz: zzzSrv,
  };

  function fnGetOpsMgr(kind: string): OpsServer | null {
    const key = kind as keyof typeof dict;
    if (key in dict) {
      return dict[key];
    }
    return null;
  }

  return { fnGetOpsMgr };
}
