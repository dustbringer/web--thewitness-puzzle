import {
  isVertex,
  isSpace,
  isEdge,
  verticesOfEdge,
} from "../util/puzzleGridUtil";
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
  isEdgeInGrid(x, y) {
    return this.isInGrid(x, y) && isEdge(x, y);
  }
  isSpaceInGrid(x, y) {
    return this.isInGrid(x, y) && isSpace(x, y);
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
  countEdges(x, y) {
    if (!this.isVertexInGrid(x, y)) return 0;

    const exists = (x, y) => (this.isInGrid(x, y) && this.grid[x][y] ? 1 : 0);
    return (
      exists(x + 1, y) + exists(x - 1, y) + exists(x, y + 1) + exists(x, y - 1)
    );
  }
  gridPoint(x, y) {
    return this.isInGrid(x, y) ? this.grid[x][y] : null;
  }

  // Methods
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

    return this;
  }

  removeStart(x, y) {
    if (!this.isStart(x, y)) {
      throw new Error("Puzzle Error: Failed to remove start");
    }
    this.grid[x][y].isStart = false;
    this.start = this.start.filter((e) => !(e.x === x && e.y === y));

    return this;
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

    return this;
  }

  removeEnd(x, y) {
    if (!this.isEnd(x, y)) {
      throw new Error("Puzzle Error: Failed to remove end");
    }
    this.grid[x][y].isEnd = false;
    this.end = this.end.filter((e) => !(e.x === x && e.y === y));

    return this;
  }

  getEndOrientation(x, y) {
    if (!this.isEnd(x, y)) {
      return;
    } else if (!this.isCornerOfGrid(x, y)) {
      if (x === 0 || x === this.gridw - 1) return Orientation.HORIZONTAL;
      else if (y === 0 || y === this.gridh - 1) return Orientation.VERTICAL;
    } else if (
      !this.grid[x][y].hasOwnProperty("endOrientation") ||
      !(this.grid[x][y].endOrientation in Object.values(Orientation))
    ) {
      return Orientation.VERTICAL;
    }
    return this.grid[x][y].endOrientation;
  }

  setEndOrientation(x, y, o) {
    if (
      !this.isEnd(x, y) ||
      !this.isCornerOfGrid(x, y) ||
      !(o in Object.values(Orientation)) ||
      o === Orientation.DIAGONAL
    ) {
      throw new Error("Puzzle Error: Failed to set end orientation");
    }

    this.grid[x][y].endOrientation = o;

    return this;
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

    return this;
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

    return this;
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

    return this;
  }

  removeSym(x, y) {
    if (!this.isInGrid(x, y)) {
      throw new Error("Puzzle Error: Failed to remove symbol");
    }

    if (this.grid[x][y]) delete this.grid[x][y].sym;

    return this;
  }

  addEdge(x, y) {
    if (!this.isEdgeInGrid(x, y)) {
      throw new Error("Puzzle Error: Failed to add edge");
    }
    if (!this.grid[x][y]) this.grid[x][y] = {};

    // Add surrounding vertices
    verticesOfEdge(x, y).forEach((v) => {
      if (!this.isVertexInGrid(v.x, v.y)) return;
      if (!this.grid[v.x][v.y]) this.grid[v.x][v.y] = {};
    });

    return this;
  }

  removeEdge(x, y) {
    if (!this.isEdgeInGrid(x, y)) {
      throw new Error("Puzzle Error: Failed to remove edge");
    }
    this.grid[x][y] = null;
    this.end = this.end.filter((e) => !(e.x === x && e.y === y));
    this.start = this.start.filter((e) => !(e.x === x && e.y === y));

    // Remove surrounding vertices
    verticesOfEdge(x, y).forEach((v) => {
      if (!this.isVertexInGrid(v.x, v.y)) return;
      if (this.grid[v.x][v.y] !== null && this.countEdges(v.x, v.y) === 0) {
        this.grid[v.x][v.y] = null;
        this.end = this.end.filter((e) => !(e.x === v.x && e.y === v.y));
        this.start = this.start.filter((e) => !(e.x === v.x && e.y === v.y));
      }
    });

    return this;
  }

  // Not needed: Included automatically when add/remove edges
  // removeVertex(x, y) {
  //   // Not sure if we should allow this
  //   return 0;
  // }

  // TODO: Figure out if squares should be removed when edges are removed
}

export default Puzzle;
