import { describe, expect, it } from "vitest";
import {
  GestureSequence,
  KeyBurst,
  WheelBurst,
  gestureSequenceConfig,
  hasSparseAdjacentGap,
  planDirectionalTravel,
  sampleTravel,
  travelDuration,
  wheelBurstConfig,
} from "../src/navigation";

describe("shared navigation policy", () => {
  it("locks the first gesture and applies the cubic shared-input crescendo", () => {
    const sequence = new GestureSequence(gestureSequenceConfig);
    const positions = [.2, 1, 8];
    const plan = (profile: ReturnType<GestureSequence["begin"]>, lockedTarget?: number) => planDirectionalTravel({
      center: 0,
      direction: 1,
      delta: 7.5,
      velocity: 375,
      momentumImpulse: 7.5 * profile.momentumGain,
      carriedSpeed: lockedTarget === undefined ? 2 : 0,
      earnedSpeedLimit: profile.speedLimit,
      lockedTarget,
      brakingSeconds: .58,
      minimumTravelDuration: 220,
      naturalGapAcceleration: false,
      clampPosition: position => Math.min(8, Math.max(0, position)),
      nextLandmark: (_direction, after) => positions.find(position => position > after + 1e-9),
    });

    const first = sequence.begin(1, 0, 0);
    expect(first).toEqual({ count: 1, lockToNext: true, speedLimit: 1, momentumGain: .25 });
    expect(plan(first, .2)).toMatchObject({ target: .2, initialSpeed: 1, speedLimit: 1 });
    sequence.noteInput(20);
    const second = sequence.begin(1, 140, 1);
    expect(second).toMatchObject({ count: 2, lockToNext: false, speedLimit: 2, momentumGain: .4 });
    const third = sequence.begin(1, 280, 2);
    expect(third).toMatchObject({ count: 3, lockToNext: false, momentumGain: 1.45 });
    expect(third.speedLimit).toBeCloseTo(9);
    const fourth = sequence.begin(1, 420, 3);
    expect(fourth.count).toBe(4);
    expect(fourth).toMatchObject({ speedLimit: 28, momentumGain: 3.5 });
    [second, third, fourth].forEach((profile, index) => {
      expect(plan(profile).initialSpeed).toBeCloseTo([2, 9, 28][index]);
    });
    expect(sequence.begin(1, 560, 4)).toMatchObject({ count: 5, speedLimit: 65, momentumGain: 3.5 });
    expect(sequence.begin(1, 700, 5)).toMatchObject({ count: 6, speedLimit: 120, momentumGain: 3.5 });
    expect(sequence.begin(-1, 840, 3)).toMatchObject({ count: 1, lockToNext: false, speedLimit: 1 });
    expect(sequence.begin(-1, 1400, 0)).toMatchObject({ count: 1, lockToNext: true, speedLimit: 1 });

    sequence.reset();
    expect(sequence.begin(1, 1210, 0)).toMatchObject({ count: 1, lockToNext: true });
  });

  it("recognizes one inertial wheel envelope and a renewed pulse", () => {
    const burst = new WheelBurst(wheelBurstConfig);

    expect(burst.push(1, 8, 0)).toBe(true);
    expect(burst.push(1, 32, 16)).toBe(false);
    expect(burst.push(1, 80, 32)).toBe(false);
    expect(burst.push(1, 40, 48)).toBe(false);
    expect(burst.push(1, 16, 64)).toBe(false);
    expect(burst.push(1, 80, 80)).toBe(true);
    expect(burst.push(-1, 40, 96)).toBe(true);
    expect(burst.push(-1, 20, 240)).toBe(true);

    burst.reset();
    expect(burst.push(1, 20, 250)).toBe(true);
  });

  it("throttles held keys while crediting deliberate presses", () => {
    const burst = new KeyBurst(120);

    expect(burst.push(1, 0, false)).toBe(true);
    expect(burst.push(1, 30, true)).toBe(false);
    expect(burst.push(1, 119, true)).toBe(false);
    expect(burst.push(1, 120, true)).toBe(true);
    expect(burst.push(1, 130, false)).toBe(true);
    expect(burst.push(-1, 140, true)).toBe(true);
    burst.reset();
    expect(burst.push(1, 150, true)).toBe(true);
  });

  it("keeps dense gestures capped while allowing natural acceleration across a true empty gap", () => {
    const positions = [.1, 1, 30];
    const nextLandmark = (direction: number, after: number) => direction > 0
      ? positions.find(position => position > after + 1e-9)
      : [...positions].reverse().find(position => position < after - 1e-9);
    const common = {
      direction: 1,
      delta: 1,
      velocity: 40,
      momentumImpulse: 5,
      carriedSpeed: 0,
      earnedSpeedLimit: 1,
      brakingSeconds: .58,
      minimumTravelDuration: 220,
      clampPosition: (position: number) => Math.min(30, Math.max(.1, position)),
      nextLandmark,
    } as const;

    expect(hasSparseAdjacentGap(0, 1, 15, nextLandmark)).toBe(false);
    expect(hasSparseAdjacentGap(1, 1, 15, nextLandmark)).toBe(true);

    const dense = planDirectionalTravel({ ...common, center: 0, lockedTarget: .1, naturalGapAcceleration: false });
    expect(dense).toEqual({ target: .1, requestedSpeed: 1, initialSpeed: 1, speedLimit: 1 });

    const sparse = planDirectionalTravel({ ...common, center: 1, lockedTarget: 30, naturalGapAcceleration: true });
    expect(sparse.target).toBe(30);
    expect(sparse.initialSpeed).toBe(1);
    expect(sparse.speedLimit).toBeUndefined();

    const continuous = planDirectionalTravel({ ...common, center: 10, carriedSpeed: 24, naturalGapAcceleration: true });
    expect(continuous.initialSpeed).toBe(24);
    expect(continuous.speedLimit).toBeUndefined();
  });

  it("samples finite cubic travel and enforces an earned dense speed limit", () => {
    const config = { minimumDuration: 220, maximumNaturalDuration: 3800, maximumLimitedDuration: 12000, maximumDirectionalSpeed: 120 };
    expect(travelDuration(1, 1, 1, config)).toBe(2000);
    const curve = { start: 0, target: 1, distance: 1, duration: 2000, startedAt: 0, initialSlope: 2 };
    expect(sampleTravel(curve, 0)).toMatchObject({ progress: 0, position: 0, speed: 1 });
    expect(sampleTravel(curve, 1000).position).toBeCloseTo(.75);
    expect(sampleTravel(curve, 2000)).toMatchObject({ progress: 1, position: 1, speed: 0 });
  });
});
