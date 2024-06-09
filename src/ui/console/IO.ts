import { prompt } from "enquirer";

export class IO {
  static LINE_SIZE = 32;
  static BORDER_SYMBOL_VERTICAL = "┆";
  static BORDER_SYMBOL_HORIZONTAL = "─";
  static CORNER_SYMBOL = "★";

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

  static write(text: string | [string, string], center = true): void {
    if (text.length > IO.LINE_SIZE - 4) {
      throw new Error(`Text length is larger then ${IO.LINE_SIZE - 4}`);
    }

    const output = Array.from({ length: IO.LINE_SIZE }, () => " ");

    let startIndex = 3;

    if (typeof text === "string") {
      if (center) {
        startIndex = Math.floor((IO.LINE_SIZE - text.length) / 2);
      }

      output.splice(startIndex, text.length, text);
    } else {
      if (center) {
        const lengthWithSeparator = text.join("").length + 3;
        startIndex = Math.floor((IO.LINE_SIZE - lengthWithSeparator) / 2);
      }

      const joinedText = text.join("  " + IO.BORDER_SYMBOL_VERTICAL + "  ");

      output.splice(startIndex, joinedText.length, joinedText);
    }

    output[0] = IO.BORDER_SYMBOL_VERTICAL;
    output[output.length - 1] = IO.BORDER_SYMBOL_VERTICAL;

    console.log(output.join(""));
  }

  static writeDivider(bordered = false): void {
    const output = Array.from(
      { length: IO.LINE_SIZE },
      () => IO.BORDER_SYMBOL_HORIZONTAL,
    );

    const symbol = bordered ? IO.BORDER_SYMBOL_VERTICAL : IO.CORNER_SYMBOL;
    output[0] = symbol;
    output[output.length - 1] = symbol;

    console.log(output.join(""));
  }

  static writeEmpty(): void {
    const output = Array.from({ length: IO.LINE_SIZE }, () => " ");
    output[0] = IO.BORDER_SYMBOL_VERTICAL;
    output[output.length - 1] = IO.BORDER_SYMBOL_VERTICAL;

    console.log(output.join(""));
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
