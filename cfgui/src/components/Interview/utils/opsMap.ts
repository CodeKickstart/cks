import { opsClient as PickoneMgr } from "../ops-at-client/operators/pickone/opsClient";
import { opsClient as PickmanyMgr } from "../ops-at-client/operators/pickmany/opsClient";
import { opsClient as LiteralMgr } from "../ops-at-client/operators/literal/opsClient";
import { opsClient as TextMgr } from "../ops-at-client/operators/text/opsClient";
import { opsClient as IntMgr } from "../ops-at-client/operators/int/opsClient";
import { opsClient as DecMgr } from "../ops-at-client/operators/dec/opsClient";
import { opsClient as BoolMgr } from "../ops-at-client/operators/bool/opsClient";
import { opsClient as ObjMgr } from "../ops-at-client/operators/obj/opsClient";
import { opsClient as RepeatMgr } from "../ops-at-client/operators/repeat/opsClient";
import { opsClient as ZsysMgr } from "../ops-at-client/operators/zsys/opsClient";
import { OpsClient, OpsDictionary } from "../defs/types/OpClientTypes";

export function opsMap() {
  // create a dictionary of operators

  const opsDict: OpsDictionary<string> = {
    pickone: PickoneMgr,
    pickmany: PickmanyMgr,
    literal: LiteralMgr,
    text: TextMgr,
    int: IntMgr,
    dec: DecMgr,
    bool: BoolMgr,
    obj: ObjMgr,
    repeat: RepeatMgr,
    zsys: ZsysMgr,
  };

  function fnGetOpsMgr(kind: string): OpsClient | null {
    const key = kind as keyof typeof opsDict;
    if (key in opsDict) {
      return opsDict[key];
    }
    return null;
  }

  return { fnGetOpsMgr };
}
