import { isVertex, isSpace, isEdge } from "../util/puzzle_grid_util";
import { VtxSym, SpcSym, EdgSym } from "../enums/Sym";

class Puzzle {
  constructor(width, height) {
    if (height <= 0 || width <= 0)
      throw new Error("Puzzle Error: Size invalid");

    this.width = width;
    this.height = height;
    this.gridw = 2 * width + 1;
    this.gridh = 2 * height + 1;
    this.grid = [...Array(this.gridw)].map((e) => Array(this.gridh).fill(null));

    this.start = [];
    this.end = [];

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
  isSpaceInGrid(x, y) {
    return this.isInGrid(x, y) && isSpace(x, y);
  }
  isEdgeInGrid(x, y) {
    return this.isInGrid(x, y) && isEdge(x, y);
  }
  isSideOfGrid(x, y) {
    return x === 0 || x === this.gridw - 1 || y === 0 || y === this.gridh - 1;
  }
  isStart(x, y) {
    return this.isInGrid(x, y) && this.grid[x][y] && this.grid[x][y].isStart;
  }
  isEnd(x, y) {
    return this.isInGrid(x, y) && this.grid[x][y] && this.grid[x][y].isEnd;
  }
  checkSymbol(x, y, sym) {
    return (
      this.isInGrid(x, y) && this.grid[x][y] && this.grid[x][y].sym === sym
    );
  }

  // Method
  addStart(x, y) {
    if (
      !this.isVertexInGrid(x, y) ||
      (this.grid[x][y] &&
        this.grid[x][y].hasOwnProperty("isEnd") &&
        this.grid[x][y].isEnd)
    ) {
      throw new Error("Puzzle Error: Failed to set start");
    }
    this.start.push({ x, y });

    if (this.grid[x][y]) this.grid[x][y].isStart = true;
    else this.grid[x][y] = { isStart: true };
  }

  addEnd(x, y) {
    // TODO: Check if END overlaps with a BREAK, shouldnt happen
    if (
      !this.isInGrid(x, y) ||
      !this.isSideOfGrid(x, y) ||
      (this.grid[x][y] &&
        this.grid[x][y].hasOwnProperty("isStart") &&
        this.grid[x][y].isStart) ||
      (this.grid[x][y] && this.grid[x][y].sym === EdgSym.break) // Block END on BREAK
    ) {
      throw new Error("Puzzle Error: Failed to set end");
    }
    this.end.push({ x, y });

    if (this.grid[x][y]) this.grid[x][y].isEnd = true;
    else this.grid[x][y] = { isEnd: true };
  }

  addVtxSym(x, y, sym) {
    if (
      !this.isVertexInGrid(x, y) ||
      sym === undefined ||
      !(sym in Object.values(VtxSym))
    ) {
      throw new Error("Puzzle Error: Failed to add symbol to vertex");
    }

    if (this.grid[x][y]) this.grid[x][y].sym = sym;
    else this.grid[x][y] = { sym };
  }

  addSpcSym(x, y, sym) {
    if (
      !this.isSpaceInGrid(x, y) ||
      sym === undefined ||
      !(sym in Object.values(SpcSym))
    ) {
      throw new Error("Puzzle Error: Failed to add symbol to space");
    }

    if (this.grid[x][y]) this.grid[x][y].sym = sym;
    else this.grid[x][y] = { sym };
  }

  addEdgSym(x, y, sym) {
    if (
      !this.isEdgeInGrid(x, y) ||
      sym === undefined ||
      !(sym in Object.values(EdgSym)) ||
      (sym === EdgSym.break && this.grid[x][y] && this.grid[x][y].isEnd) // Block BREAK on END
    ) {
      throw new Error("Puzzle Error: Failed to add symbol to edge");
    }
    // TODO: Check if BREAK overlaps with an END, shouldnt happen

    if (this.grid[x][y]) this.grid[x][y].sym = sym;
    else this.grid[x][y] = { sym };
  }

  removeEdge(x, y) {
    return 0;
  }

  removeVertex(x, y) {
    return 0;
  }
}

export default Puzzle;
