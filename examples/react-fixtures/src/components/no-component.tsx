export function add(a: number, b: number): number {
  return a + b;
}

export class Example {}

export class Child extends Example {}

export const assignment = Object.assign(add, {
  value: 3,
});
