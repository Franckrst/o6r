import * as k8s from "@kubernetes/client-node";
import {EventMangager} from "./EventManager";

export class O6r{

    public static kc: k8s.KubeConfig = new k8s.KubeConfig();;
    public static event = EventMangager;

}

O6r.kc.loadFromDefault();

