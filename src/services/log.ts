
export const PRIORITY_INFO = 1;

export class log {

  fifoTrace: {level: number, message: string }[];

  constructor(private maxsize: number) {
    this.fifoTrace = new Array(maxsize);
    this.fifoTrace.fill({level: PRIORITY_INFO, message: '' });
  }

  log(msg: {level: number, message: string }) {
    this.fifoTrace.shift();
    this.fifoTrace.push(msg);
    console.log(msg);
  }

}
