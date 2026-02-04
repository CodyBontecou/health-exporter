function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import CircularBuffer from './CircularBuffer';
import LeastSquareSolver from './LeastSquareSolver';
export default class VelocityTracker {
  constructor() {
    _defineProperty(this, "assumePointerMoveStoppedMilliseconds", 40);

    _defineProperty(this, "historySize", 20);

    _defineProperty(this, "horizonMilliseconds", 300);

    _defineProperty(this, "minSampleSize", 3);

    _defineProperty(this, "samples", void 0);

    this.samples = new CircularBuffer(this.historySize);
  }

  add(event) {
    this.samples.push(event);
  } // Returns an estimate of the velocity of the object being tracked by the
  // tracker given the current information available to the tracker.
  //
  // Information is added using [addPosition].
  //
  // Returns null if there is no data on which to base an estimate.


  getVelocityEstimate() {
    const x = [];
    const y = [];
    const w = [];
    const time = [];
    let sampleCount = 0;
    let index = this.samples.size - 1;
    const newestSample = this.samples.get(index);

    if (!newestSample) {
      return null;
    }

    let previousSample = newestSample; // Starting with the most recent PointAtTime sample, iterate backwards while
    // the samples represent continuous motion.

    while (sampleCount < this.samples.size) {
      const sample = this.samples.get(index);
      const age = newestSample.time - sample.time;
      const delta = Math.abs(sample.time - previousSample.time);
      previousSample = sample;

      if (age > this.horizonMilliseconds || delta > this.assumePointerMoveStoppedMilliseconds) {
        break;
      }

      x.push(sample.x);
      y.push(sample.y);
      w.push(1);
      time.push(-age);
      sampleCount++;
      index--;
    }

    if (sampleCount >= this.minSampleSize) {
      const xSolver = new LeastSquareSolver(time, x, w);
      const xFit = xSolver.solve(2);

      if (xFit !== null) {
        const ySolver = new LeastSquareSolver(time, y, w);
        const yFit = ySolver.solve(2);

        if (yFit !== null) {
          const xVelocity = xFit.coefficients[1] * 1000;
          const yVelocity = yFit.coefficients[1] * 1000;
          return [xVelocity, yVelocity];
        }
      }
    }

    return null;
  }

  getVelocity() {
    const estimate = this.getVelocityEstimate();

    if (estimate !== null) {
      return estimate;
    }

    return [0, 0];
  }

  reset() {
    this.samples.clear();
  }

}
//# sourceMappingURL=VelocityTracker.js.map