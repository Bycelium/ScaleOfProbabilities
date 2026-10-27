export type GestureProfile = Readonly<{
  count: number;
  momentumGain: number;
  speedLimit: number;
  lockToNext: boolean;
}>;

export type GestureSequenceConfig = Readonly<{
  repeatWindow: number;
  restSpeed: number;
  maximumSpeed: number;
  baseSpeed: number;
  speedCoefficient: number;
  baseMomentumGain: number;
  momentumGainCoefficient: number;
  maximumMomentumGain: number;
}>;

export const gestureSequenceConfig: GestureSequenceConfig = {
  repeatWindow: 450,
  restSpeed: .5,
  maximumSpeed: 120,
  baseSpeed: 1,
  speedCoefficient: 1,
  baseMomentumGain: .25,
  momentumGainCoefficient: .15,
  maximumMomentumGain: 3.5,
};

export class GestureSequence {
  private count = 0;
  private lastDirection = 0;
  private lastInputAt: number | undefined;
  private current: GestureProfile;

  constructor(private readonly config: GestureSequenceConfig) {
    this.current = this.profile(1, true);
  }

  begin(direction: number, timestamp: number, currentSpeed: number): GestureProfile {
    const continues = direction === this.lastDirection
      && (currentSpeed > this.config.restSpeed
        || (this.lastInputAt !== undefined && timestamp - this.lastInputAt <= this.config.repeatWindow));
    this.count = continues ? this.count + 1 : 1;
    this.lastDirection = direction;
    this.lastInputAt = timestamp;
    this.current = this.profile(this.count, currentSpeed <= this.config.restSpeed && !continues);
    return this.current;
  }

  noteInput(timestamp: number): GestureProfile {
    this.lastInputAt = timestamp;
    return this.current;
  }

  reset(): void {
    this.count = 0;
    this.lastDirection = 0;
    this.lastInputAt = undefined;
    this.current = this.profile(1, true);
  }

  private profile(count: number, lockToNext: boolean): GestureProfile {
    return {
      count,
      lockToNext,
      speedLimit: Math.min(this.config.maximumSpeed, this.config.baseSpeed + this.config.speedCoefficient * (count - 1) ** 3),
      momentumGain: Math.min(this.config.maximumMomentumGain, this.config.baseMomentumGain + this.config.momentumGainCoefficient * (count - 1) ** 3),
    };
  }
}

export type WheelBurstConfig = Readonly<{
  quietGap: number;
  renewedPulseRatio: number;
  priorPeakRatio: number;
  minimumRenewedMagnitude: number;
  decliningRatio: number;
}>;

export const wheelBurstConfig: WheelBurstConfig = {
  quietGap: 120,
  renewedPulseRatio: 1.8,
  priorPeakRatio: .65,
  minimumRenewedMagnitude: 12,
  decliningRatio: .6,
};

export class WheelBurst {
  private lastAt: number | undefined;
  private lastDirection = 0;
  private lastMagnitude = 0;
  private peakMagnitude = 0;
  private declining = false;

  constructor(private readonly config: WheelBurstConfig) {}

  push(direction: number, magnitude: number, timestamp: number): boolean {
    const renewedPulse = this.declining
      && magnitude >= Math.max(this.config.minimumRenewedMagnitude, this.peakMagnitude * this.config.priorPeakRatio)
      && magnitude > this.lastMagnitude * this.config.renewedPulseRatio;
    const startsNew = this.lastAt === undefined
      || timestamp - this.lastAt > this.config.quietGap
      || direction !== this.lastDirection
      || renewedPulse;
    if (startsNew) {
      this.peakMagnitude = magnitude;
      this.declining = false;
    } else {
      this.peakMagnitude = Math.max(this.peakMagnitude, magnitude);
      if (magnitude < this.peakMagnitude * this.config.decliningRatio) this.declining = true;
    }
    this.lastAt = timestamp;
    this.lastDirection = direction;
    this.lastMagnitude = magnitude;
    return startsNew;
  }

  reset(): void {
    this.lastAt = undefined;
    this.lastDirection = 0;
    this.lastMagnitude = 0;
    this.peakMagnitude = 0;
    this.declining = false;
  }
}

export class KeyBurst {
  private lastCreditAt: number | undefined;
  private lastDirection = 0;

  constructor(private readonly minimumCreditInterval: number) {}

  push(direction: number, timestamp: number, repeat: boolean): boolean {
    const startsNew = !repeat
      || this.lastCreditAt === undefined
      || timestamp - this.lastCreditAt >= this.minimumCreditInterval
      || direction !== this.lastDirection;
    if (startsNew) this.lastCreditAt = timestamp;
    this.lastDirection = direction;
    return startsNew;
  }

  reset(): void {
    this.lastCreditAt = undefined;
    this.lastDirection = 0;
  }
}

export type TravelCurve = Readonly<{
  start: number;
  target: number;
  distance: number;
  duration: number;
  startedAt: number;
  initialSlope: number;
}>;

export const travelSlopeAt = (initialSlope: number, progress: number): number => 3 * (initialSlope - 2) * progress ** 2 + 2 * (3 - 2 * initialSlope) * progress + initialSlope;

export const sampleTravel = ({ start, target, distance, duration, startedAt, initialSlope }: TravelCurve, timestamp: number) => {
  const progress = Math.min(1, Math.max(0, (timestamp - startedAt) / duration));
  const eased = (initialSlope - 2) * progress ** 3 + (3 - 2 * initialSlope) * progress ** 2 + initialSlope * progress;
  const slope = travelSlopeAt(initialSlope, progress);
  return { progress, position: start + (target - start) * eased, slope, speed: distance / (duration / 1000) * Math.max(0, slope) };
};

export const peakTravelSlope = (initialSlope: number): number => Math.max(...Array.from({ length: 33 }, (_, index) => travelSlopeAt(initialSlope, index / 32)));

export type TravelDurationConfig = Readonly<{
  minimumDuration: number;
  maximumNaturalDuration: number;
  maximumLimitedDuration: number;
  maximumDirectionalSpeed: number;
}>;

export const travelDuration = (
  distance: number,
  initialSpeed: number,
  speedLimit: number | undefined,
  config: TravelDurationConfig,
): number => {
  const natural = Math.min(config.maximumNaturalDuration, Math.max(config.minimumDuration, 140 + Math.sqrt(distance) * 180));
  const ordinary = initialSpeed > 0
    ? Math.max(config.minimumDuration, Math.min(natural, 3 * distance / initialSpeed * 1000))
    : natural;
  if (speedLimit === undefined || speedLimit <= 0) return ordinary;
  return Math.max(
    ordinary,
    Math.min(config.maximumLimitedDuration, distance * 2 / speedLimit * 1000),
    distance * 2 / config.maximumDirectionalSpeed * 1000,
  );
};

export type DirectionalPlan = Readonly<{
  target: number;
  requestedSpeed: number;
  initialSpeed: number;
  speedLimit?: number;
}>;

export type DirectionalPlanInput = Readonly<{
  center: number;
  direction: number;
  delta: number;
  velocity: number;
  momentumImpulse: number;
  carriedSpeed: number;
  earnedSpeedLimit: number;
  lockedTarget?: number;
  brakingSeconds: number;
  minimumTravelDuration: number;
  naturalGapAcceleration: boolean;
  clampPosition: (position: number) => number;
  nextLandmark: (direction: number, after: number) => number | undefined;
}>;

export const planDirectionalTravel = (input: DirectionalPlanInput): DirectionalPlan => {
  const earnedSpeedLimit = input.earnedSpeedLimit;
  const continuousSpeedLimit = Math.max(earnedSpeedLimit, input.carriedSpeed);
  const requestedSpeed = Math.min(
    continuousSpeedLimit,
    Math.abs(input.velocity),
    Math.max(8, Math.abs(input.delta) * 2000 / input.minimumTravelDuration),
  );
  const initialSpeed = input.carriedSpeed > 0
    ? Math.min(continuousSpeedLimit, input.carriedSpeed + input.momentumImpulse)
    : Math.min(continuousSpeedLimit, requestedSpeed, 8 + input.momentumImpulse);
  const requestedDistance = Math.max(
    Math.abs(input.delta),
    input.carriedSpeed > 0 ? initialSpeed * input.brakingSeconds : 0,
  );
  const intended = input.clampPosition(input.center + input.direction * requestedDistance);
  const target = input.lockedTarget ?? input.nextLandmark(input.direction, intended) ?? intended;
  return {
    target,
    requestedSpeed,
    initialSpeed,
    speedLimit: input.naturalGapAcceleration ? undefined : initialSpeed,
  };
};

export const hasSparseAdjacentGap = (
  center: number,
  direction: number,
  minimumDistance: number,
  nextLandmark: (direction: number, after: number) => number | undefined,
): boolean => {
  const immediateTarget = nextLandmark(direction, center);
  return immediateTarget !== undefined && Math.abs(immediateTarget - center) >= minimumDistance;
};
