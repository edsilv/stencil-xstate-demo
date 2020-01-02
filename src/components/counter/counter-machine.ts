import { Machine, assign, State } from "xstate";

export enum Events {
  START = "START",
  INCREMENT = "INCREMENT",
  DECREMENT = "DECREMENT"
}

// The hierarchical (recursive) schema for the states
export interface CounterStateSchema {
  current: State<CounterContext, CounterEvent, CounterStateSchema>,
  states?: {
    ready: {},
    active: {}
  }
}

// The events that the machine handles
export type CounterEvent =
  | { type: Events.START }
  | { type: Events.INCREMENT }
  | { type: Events.DECREMENT };

// The context (extended state) of the machine
export interface CounterContext {
  count: number;
  min: number;
  max: number;
}

// Actions
// couldn't get any combination of outside functions to work...
// const increment = context => context.count + 1;
// const decrement = context => context.count - 1;
// const increment = assign({ count: context => context.count + 1 });
// const decrement = assign({ count: context => context.count - 1 });

// Guards
const isMax = ctx => ctx.count === ctx.max;
const isNotMax = ctx => ctx.count < ctx.max;
const isMin = ctx => ctx.count === ctx.min;
const isNotMin = ctx => ctx.count > ctx.min;

export const counterMachine = Machine<CounterContext, CounterStateSchema, CounterEvent>({
  id: "count",
  initial: "ready",
  context: {
    count: 0,
    min: 0,
    max: Number.MAX_VALUE
  },
  states: {
    "ready": {
      on: {
        // checks the initial context and transitions to the corresponding state
        [Events.START]: [
          { target: "active" }
        ]
      }
    },
    "active": {
      on: {
        [Events.INCREMENT]: [
          {
            actions: assign({count: ctx => ctx.count + 1}),
            cond: isNotMax
          },
          {
            target: ".max",
            cond: isMax
          },
          {
            target: ".mid",
            cond: () => !isMin && !isMax
          }
        ],
        [Events.DECREMENT]: [
          {
            actions: assign({count: ctx => ctx.count - 1}),
            cond: isNotMin
          },
          {
            target: ".min",
            cond: isMin
          },
          {
            target: ".mid",
            cond: () => !isMin && !isMax
          }
        ]
      },
      states: {
        "min": {},
        "mid": {},
        "max": {}
      }
    }
  }
});
