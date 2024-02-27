import { opsClient as PickoneMgr } from "../operators/pickone/opsClient";
import { opsClient as PickmanyMgr } from "../operators/pickmany/opsClient";
import { opsClient as LiteralMgr } from "../operators/literal/opsClient";
import { opsClient as TextMgr } from "../operators/text/opsClient";
import { opsClient as IntMgr } from "../operators/int/opsClient";
import { opsClient as DecMgr } from "../operators/dec/opsClient";
import { opsClient as BoolMgr } from "../operators/bool/opsClient";
import { opsClient as ObjMgr } from "../operators/obj/opsClient";
import { opsClient as RepeatMgr } from "../operators/repeat/opsClient";
import { OpsClient, OpsDictionary } from "../../defs/types/OpClientTypes";

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
