declare const _module: {
    SyntaxError: {
        (message: any, expected: any, found: any, location: any): void;
        buildMessage(expected: any, found: any): string;
    };
    parse: (input: any, options: any) => {};
};
