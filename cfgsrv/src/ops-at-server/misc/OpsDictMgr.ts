import { OpsMgr as PickoneMgr } from "../operators/pickone/OpsMgr";
import { OpsMgr as PickmanyMgr } from "../operators/pickmany/OpsMgr";
import { OpsMgr as LiteralMgr } from "../operators/literal/OpsMgr";
import { OpsMgr as TextMgr } from "../operators/text/OpsMgr";
import { OpsMgr as IntMgr } from "../operators/int/OpsMgr";
import { OpsMgr as DecMgr } from "../operators/dec/OpsMgr";
import { OpsMgr as BoolMgr } from "../operators/bool/OpsMgr";
import { OpsMgr as ObjMgr } from "../operators/obj/OpsMgr";
import { OpsMgr as RepeatMgr } from "../operators/repeat/OpsMgr";
import { OpsServerType } from "./OpsServerType";

export function OpsDictMgr() {
  // create a dictionary of operators
  type OpsMgrDictionary<K extends string> = {
    [key in K]: OpsServerType;
  };

  const dict: OpsMgrDictionary<string> = {
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

  function fnGetOpsMgr(kind: string): OpsServerType | null {
    const key = kind as keyof typeof dict;
    if (key in dict) {
      return dict[key];
    }
    return null;
  }

  return { fnGetOpsMgr };
}
