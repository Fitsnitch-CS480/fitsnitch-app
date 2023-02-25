
export class SafeMath {
    private static getDecimalPrecision(numString: string) {
        let decimalIdx: number = numString.indexOf('.');
        if (decimalIdx === -1)
            return 0;
        return Math.max(numString.length - decimalIdx);
    }

    private static safeMagnify(num: number, magnitude: number): number {
        return parseFloat(num + "e" + magnitude);
    }

    private static performSafeOperation(a: number, b: number, operation: (a: number, b: number) => number): number {
        let aString: string = a.toString();
        let bString: string = b.toString();
        let safePower = Math.max(this.getDecimalPrecision(aString), this.getDecimalPrecision(bString)) + 1;
        let factor = Math.pow(10, safePower);
        return operation(this.safeMagnify(a, safePower), this.safeMagnify(b, safePower)) / factor;
    }

    public static add(a: number, b: number): number {
        return this.performSafeOperation(a, b, (a, b) => a + b);
    }

    public static subtract(a: number, b: number): number {
        return this.performSafeOperation(a, b, (a, b) => a - b);
    }

    public static multiply(a: number, b: number): number {
        return this.performSafeOperation(a, b, (a, b) => a * b);
    }

    public static divide(a: number, b: number): number {
        return this.performSafeOperation(a, b, (a, b) => a / b);
    }

    public static modulo(a: number, b: number): number {
        return this.performSafeOperation(a, b, (a, b) => a % b);
    }
}
