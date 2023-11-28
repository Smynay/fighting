import { prompt } from "enquirer";

export class IO {
  static async prompt(text: string): Promise<string> {
    const { result } = await prompt<{ result: string }>({
      type: "input",
      name: "result",
      message: text,
    });

    return result;
  }

  static async confirm(text: string): Promise<boolean> {
    const { result } = await prompt<{ result: boolean }>({
      type: "confirm",
      name: "result",
      message: text,
    });

    return result;
  }

  static async select<T extends string>(
    text: string,
    options: T[],
  ): Promise<T> {
    const { result } = await prompt<{ result: T }>({
      type: "select",
      name: "result",
      message: text,
      choices: options,
    });

    return result;
  }

  static write(text: string): void {
    console.log(text);
  }

  static async scale<T extends Record<string, number>>(
    text: string,
    params: T,
    scale: { name: number; message: string; value?: number }[],
  ): Promise<T> {
    const { result } = await prompt<{ result: typeof params }>({
      type: "scale",
      name: "result",
      message: text,
      // @ts-ignore
      scale,
      choices: Object.keys(params).map((value) => ({
        name: value,
        message: value.toLocaleUpperCase(),
        initial: params[value],
      })),
    });

    Object.keys(params).reduce(
      (acc, key) =>
        Object.assign(acc, {
          [key]: scale[result[key]].value || scale[result[key]].name,
        }),
      {},
    );

    return Object.keys(params).reduce(
      (acc, key) =>
        Object.assign(acc, {
          [key]: scale[result[key]].value || scale[result[key]].name,
        }),
      {},
    ) as typeof params;
  }
}
