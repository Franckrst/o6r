<div align='center'>

# 🪛 o6r

**Simple framework for create Operator**

</div>

## Exemple

```typescript
import {O6r,apply} from "./framework/main";
import * as k8s from "@kubernetes/client-node";

class MyOperator {

    public static GROUP = "myoperator.me.fr";
    public static VERSION = "v1";
    public static KIND_PLURAL = "MyOperators";

    public constructor() {
    }

    @O6r.event.update(B2rLocal.GROUP,B2rLocal.VERSION,B2rLocal.KIND_PLURAL,'spec')
    @O6r.event.create(B2rLocal.GROUP,B2rLocal.VERSION,B2rLocal.KIND_PLURAL)
    public async onCreate(watcherEvent: WatchEventModel<B2rKindInterface>,kc: k8s.KubeConfig): Promise<void>{
        console.log(`Create or update ${watcherEvent.resource.metadata.name}`);
        console.log(`Sepc :  ${watcherEvent.resource.metadata.spec}`);
        // apply is tool function for
        apply( `Apply kind`,kc);
    }

    @O6r.event.remove(B2rLocal.GROUP,B2rLocal.VERSION,B2rLocal.KIND_PLURAL)
    public onRemove(watcherEvent: WatchEventModel<B2rKindInterface>,kc: k8s.KubeConfig){
        console.log(`Delete ${watcherEvent.resource.metadata.name}`);
    }

}
```

## OLM


## TODO

- [ ] Clear log
- [ ] Add log level
- [ ] Add TU
