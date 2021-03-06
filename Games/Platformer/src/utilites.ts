export class Vector {
    public x: number;
    public y: number;

    static readonly zero: Vector = new Vector(0, 0);
    static readonly one: Vector = new Vector(1, 1);
    static readonly half: Vector = new Vector(0.5, 0.5);

    static readonly up: Vector = new Vector(0, 1);
    static readonly right: Vector = new Vector(1, 0);
    static readonly down: Vector = new Vector(0, -1);
    static readonly left: Vector = new Vector(-1, 0);

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    // Returns the magnitude of the vector
    magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // Returns the normalized vector (direction)
    normalized(): Vector {
        const magnitude: number = this.magnitude();
        if (magnitude != 0)
            return new Vector(this.x / magnitude, this.y / magnitude);
        else return Vector.zero;
    }

    floor(): Vector {
        return new Vector(Math.floor(this.x), Math.floor(this.y));
    }

    clamp(minX: number, minY: number, maxX: number, maxY: number): Vector {
        return new Vector(Calc.clamp(this.x, minX, maxX), Calc.clamp(this.y, minY, maxY));
    }

    // Caluclates the distance from one vector to another and returns a vector
    distanceTo(target: Vector): Vector {
        return new Vector(target.x - this.x, target.y - this.y);
    }

    // Calculates the direction to another vector and returns a normalized vector
    directionTo(target: Vector): Vector {
        return this.distanceTo(target).normalized();
    }

    // Returns the distace to the target as a float (non directional)
    distance(target: Vector): number {
        return this.distanceTo(target).magnitude();
    }

    // Takes two vectors and returns their sum
    add(value: Vector): Vector {
        return new Vector(this.x + value.x, this.y + value.y);
    }

    addNum(value: number): Vector {
        return new Vector(this.x + value, this.y + value);
    }

    // Takes two vectors and subtracts one from the other
    subtract(value: Vector): Vector {
        return new Vector(this.x - value.x, this.y - value.y);
    }

    subtractNum(value: number): Vector {
        return new Vector(this.x - value, this.y - value);
    }

    // Takes two vectors and returns their product
    multiply(value: Vector): Vector {
        return new Vector(this.x * value.x, this.y * value.y);
    }

    multiplyNum(value: number): Vector {
        return new Vector(this.x * value, this.y * value);
    }

    // Divides a vetor by by another and returns a vector
    divide(value: Vector): Vector {
        if (value.x != 0 && value.y != 0)
            return new Vector(this.x / value.x, this.y / value.y);
        else
            return Vector.zero;
    }

    divideNmu(value: number): Vector {
        if (value != 0)
            return new Vector(this.x / value, this.y / value);
        else
            return Vector.zero;
    }

    static lerp(start: Vector, end: Vector, percent: number): Vector {
        return new Vector(
            Calc.lerp(start.x, end.x, percent),
            Calc.lerp(start.y, end.y, percent)
        );
    }

    // Converts an angle in radians to a vector
    static radToVector(value: number): Vector {
        return new Vector(Math.cos(value), Math.sin(value));
    }

    static toVector(object: any): Vector {
        return new Vector(object.x, object.y);
    }

    // Converts a vector to an angle in radians
    toRad(): number {
        return Math.atan2(this.x, this.y);
    }

    toLocal(appStagePivot: any): Vector {
        return this.add(new Vector(appStagePivot.x, appStagePivot.y));
    }

    rotate(radians: number): Vector {
        return new Vector(
            this.x * Math.cos(radians) - this.y * Math.sin(radians),
            this.x * Math.sin(radians) + this.y * Math.cos(radians)
        );
    }

}

export class Calc {
    static clamp(num: number, min: number, max: number): number {
        return num <= min ? min : num >= max ? max : num;
    }

    static lerp(start: number, end: number, percent: number): number {
        return (1 - percent) * start + percent * end
    }

    static loop(num: number, min: number, max: number): number {
        return num < min ? max : num > max ? min : num;
    }
}

export class Input {
    static mouse() {
        let mouse: any = {};
        mouse.screenPosition = Vector.zero;
        mouse.wheel = 0;

        window.addEventListener("mousemove", e => {
            mouse.screenPosition = new Vector(e.clientX, e.clientY);
        }, false);

        window.addEventListener("wheel", (event: any) => {
            mouse.wheel = event.deltaY;
        });

        return mouse;
    }

    static keyboard(value: any) {
        let key: any = {};
        key.value = value;
        key.isDown = false;
        key.isUp = true;
        key.press = undefined;
        key.release = undefined;

        // Key down handler
        key.downHandler = (event: any) => {
            if (event.key === key.value) {
                if (key.isUp && key.press)
                    key.press();
                key.isDown = true;
                key.isUp = false;
                event.preventDefault();
            }
        };

        // Key up handler
        key.upHandler = (event: any) => {
            if (event.key === key.value) {
                if (key.isDown && key.release)
                    key.release();
                key.isDown = false;
                key.isUp = true;
                event.preventDefault();
            }
        }

        // Attach event listeners
        const downListner = key.downHandler.bind(key);
        const upListner = key.upHandler.bind(key);

        window.addEventListener("keydown", downListner, false);
        window.addEventListener("keyup", upListner, false);

        // Detach event listners
        key.unsubscribe = () => {
            window.removeEventListener("keydown", downListner);
            window.removeEventListener("keyup", upListner);
        };

        return key;
    }

}