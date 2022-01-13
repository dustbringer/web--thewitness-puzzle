import { isVertex, isSpace, isEdge } from "../util/puzzleGridUtil";
import { VtxSym, SpcSym, EdgSym } from "../enums/Sym";
import Orientation from "../enums/Orientation";

class Puzzle {
  constructor(width, height) {
    if (height <= 0 || width <= 0)
      throw new Error("Puzzle Error: Size invalid");

    this.width = width;
    this.height = height;
    this.gridw = 2 * width + 1;
    this.gridh = 2 * height + 1;
    this.grid = [...Array(this.gridw)].map(() =>
      [...Array(this.gridh)].map(() => ({}))
    );

    this.start = [];
    this.end = [];
  }

  // Util
  isInGrid(x, y) {
    return x >= 0 && x < this.gridw && y >= 0 && y < this.gridh;
  }
  isEmpty(x, y) {
    return !this.isInGrid(x, y) || this.grid[x][y] === null;
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
  isCornerOfGrid(x, y) {
    return (
      (x === 0 && y === 0) ||
      (x === this.gridw - 1 && y === 0) ||
      (x === 0 && y === this.gridh - 1) ||
      (x === this.gridw - 1 && y === this.gridh - 1)
    );
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
      (!this.isVertexInGrid(x, y) && !this.isEdgeInGrid(x, y)) ||
      (this.grid[x][y] &&
        this.grid[x][y].hasOwnProperty("isEnd") &&
        this.grid[x][y].isEnd)
    ) {
      throw new Error("Puzzle Error: Failed to add start");
    }
    this.start.push({ x, y });

    if (this.grid[x][y]) this.grid[x][y].isStart = true;
    else this.grid[x][y] = { isStart: true };
  }

  removeStart(x, y) {
    if (!this.isStart(x, y)) {
      throw new Error("Puzzle Error: Failed to remove start");
    }

    this.grid[x][y].isStart = false;
  }

  addEnd(x, y) {
    if (
      !this.isInGrid(x, y) ||
      !this.isSideOfGrid(x, y) ||
      (this.grid[x][y] &&
        this.grid[x][y].hasOwnProperty("isStart") &&
        this.grid[x][y].isStart) ||
      (this.grid[x][y] && this.grid[x][y].sym === EdgSym.BREAK) // Block END on BREAK
    ) {
      throw new Error("Puzzle Error: Failed to add end");
    }
    this.end.push({ x, y });

    if (this.grid[x][y]) {
      this.grid[x][y].isEnd = true;
    } else {
      this.grid[x][y] = { isEnd: true };
    }
    if (this.isCornerOfGrid(x, y))
      this.grid[x][y].endOrientation = Orientation.VERTICAL;
  }

  removeEnd(x, y) {
    if (!this.isEnd(x, y)) {
      throw new Error("Puzzle Error: Failed to remove end");
    }

    this.grid[x][y].isEnd = false;
  }

  getEndOrientation(x, y) {
    if (
      !this.isEnd(x, y) ||
      !this.isCornerOfGrid(x, y) ||
      !this.grid[x][y].hasOwnProperty("endOrientation") ||
      !(this.grid[x][y].endOrientation in Object.values(Orientation))
    ) {
      return null;
    }
    return this.grid[x][y].endOrientation;
  }

  setEndOrientation(x, y, o) {
    if (
      !this.isEnd(x, y) ||
      !this.isCornerOfGrid(x, y) ||
      !(o in Object.values(Orientation))
    ) {
      throw new Error("Puzzle Error: Failed to set end orientation");
    }

    this.grid[x][y].endOrientation = o;
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
      (sym === EdgSym.BREAK && this.grid[x][y] && this.grid[x][y].isEnd) // Block BREAK on END
    ) {
      throw new Error("Puzzle Error: Failed to add symbol to edge");
    }

    if (this.grid[x][y]) this.grid[x][y].sym = sym;
    else this.grid[x][y] = { sym };
  }

  removeSym(x, y) {
    if (!this.isInGrid(x, y)) {
      throw new Error("Puzzle Error: Failed to remove symbol");
    }

    if (this.grid[x][y]) delete this.grid[x][y].sym;
  }

  removeEdge(x, y) {
    if (!this.isEdgeInGrid(x, y)) {
      throw new Error("Puzzle Error: Failed to remove edge");
    }

    this.grid[x][y] = null;
  }

  removeVertex(x, y) {
    // Not sure if we should allow this
    return 0;
  }
}

export default Puzzle;
