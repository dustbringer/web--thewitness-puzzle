import Puzzle from "../classes/Puzzle";

// https://static.wikia.nocookie.net/thewitness_gamepedia/images/9/98/Entry_Area_1.jpg/revision/latest?cb=20160325102753
export default function create() {
  const p = new Puzzle(4, 4);
  p.addStart(0, 8);
  p.addEnd(8, 0);
  p.removeEdge(2, 1);
  p.removeEdge(4, 1);
  p.removeEdge(6, 1);
  p.removeEdge(8, 1);
  p.removeEdge(3, 2);
  p.removeEdge(7, 2);
  p.removeEdge(0, 3);
  p.removeEdge(7, 4);
  p.removeEdge(2, 5);
  p.removeEdge(6, 5);
  p.removeEdge(1, 6);
  p.removeEdge(0, 7);
  p.removeEdge(8, 7);
  p.removeEdge(3, 8);
  return p;
}
