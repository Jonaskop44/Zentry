import { Helper } from "./helper";
import { Statistics } from "./statistics";

export class Activity {
  helper: Helper;
  statistics: Statistics;
  constructor() {
    this.helper = new Helper();
    this.statistics = new Statistics();
  }
}
