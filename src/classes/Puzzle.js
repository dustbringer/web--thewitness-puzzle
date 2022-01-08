import { isVertex, isSquare, isEdge } from "../util/puzzle_grid_util"

class Puzzle {
  constructor(width, height) {
    if (height <= 0 || width <= 0)
      throw new Error("Puzzle Error: Size invalid");

    this.width = width;
    this.height = height;
    this.gridw = 2 * width + 1;
    this.gridh = 2 * height + 1;
    this.grid = [...Array(this.gridw)].map((e) =>
      Array(this.gridh).fill(null)
    );
    console.log(this.grid);

    // Set this whenever
    this.type = {
      dots: false,
    };
  }

  // Getter
  getGrid() {
    return this.grid;
  }
  getWidth() {
    return this.width;
  }
  getHeight() {
    return this.height;
  }
  getType() {
    return this.type;
  }

  // Util
  isInGrid(x, y) {
    return x >= 0 && x < this.gridw && y >= 0 && y < this.gridh;
  }
  isVertexInGrid(x, y) {
    return this.isInGrid(x, y) && isVertex(x, y);
  }
  isSquareInGrid(x, y) {
    return this.isInGrid(x, y) && isSquare(x, y);
  }
  isEdgeInGrid(x, y){
    return this.isInGrid(x, y) && isEdge(x,y);
  }

  // Method
  setStart(x, y) {
    return 0;
  }
}

export default Puzzle;
