class Puzzle {
  constructor(height, width) {
    if (height <= 0 || width <= 0)
      throw new Error("Puzzle Error: Size invalid");

    this.height = height;
    this.width = width;
    this.grid = [...Array(2 * width + 1)].map((e) =>
      Array(2 * height + 1).fill(null)
    );
    console.log(this.grid);

    // Set this whenever
    this.type = {
      dots: false,
    };
  }

  // Getter
  get area() {
    return this.calcArea();
  }

  // Method
  calcArea() {
    return this.height * this.width;
  }
}

export default Puzzle;
