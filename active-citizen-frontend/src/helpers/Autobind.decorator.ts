export function Autobind<T extends Function>(target: any, key: string, descriptor: TypedPropertyDescriptor<T>): any {
  const fn: any = descriptor.value;

  let defining: boolean = false;

  return {
    configurable: true,

    get(): any {
      if (defining || (fn && this === fn.prototype) || this.hasOwnProperty(key)) {
        return fn;
      }

      const fnBound: any = fn && fn.bind(this);

      defining = true;
      Object.defineProperty(this, key, {
        configurable: true,
        writable: true,
        enumerable: true,
        value: fnBound
      });
      defining = false;

      return fnBound;
    },

    set(newValue: any): void {
      Object.defineProperty(this, key, {
        configurable: true,
        writable: true,
        enumerable: true,
        value: newValue
      });
    }
  };
}