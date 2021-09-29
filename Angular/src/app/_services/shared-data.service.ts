import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";

@Injectable()
export class SharedDataService {
    obsCollection: {key: string, obs: Subject<any>} | {} = {};
    
    addObs(id: string) {
        this.obsCollection[id] = new BehaviorSubject(false);
        return this.obsCollection[id];
    }

    getObs(id: string) {
        return this.obsCollection[id];
    }

    emitChange(id: string, isCollapse: boolean) {
        const obs: Subject<boolean> = this.getObs(id);
        if (!!obs) {
            obs.next(isCollapse);
        }
    }
}