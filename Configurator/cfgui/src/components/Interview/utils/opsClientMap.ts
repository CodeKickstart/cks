import { opsClient as pickoneClient } from "../ops-at-client/operators/pickone/opsClient";
import { opsClient as pickmanyClient } from "../ops-at-client/operators/pickmany/opsClient";
import { opsClient as literalClient } from "../ops-at-client/operators/literal/opsClient";
import { opsClient as textClient } from "../ops-at-client/operators/text/opsClient";
import { opsClient as intClient } from "../ops-at-client/operators/int/opsClient";
import { opsClient as decClient } from "../ops-at-client/operators/dec/opsClient";
import { opsClient as boolClient } from "../ops-at-client/operators/bool/opsClient";
import { opsClient as objClient } from "../ops-at-client/operators/obj/opsClient";
import { opsClient as repeatClient } from "../ops-at-client/operators/repeat/opsClient";
import { opsClient as zzzClient } from "../ops-at-client/operators/zzz/opsClient";
import { OpsClient, OpsDictionary } from "../defs/types/OpClientTypes";

export function opsClientMap() {
  // create a dictionary of operators

  const opsDict: OpsDictionary<string> = {
    pickone: pickoneClient,
    pickmany: pickmanyClient,
    literal: literalClient,
    text: textClient,
    int: intClient,
    dec: decClient,
    bool: boolClient,
    obj: objClient,
    repeat: repeatClient,
    zzz: zzzClient,
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
