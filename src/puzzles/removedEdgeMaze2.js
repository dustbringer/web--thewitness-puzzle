import Puzzle from "../classes/Puzzle";

// https://static.wikia.nocookie.net/thewitness_gamepedia/images/1/12/Entry_Area_2.jpg/revision/latest?cb=20160325114418
export default function create() {
  const p = new Puzzle(6, 6);
  p.addStart(8, 8);
  p.addEnd(4, 0);
  p.removeEdge(5, 0);
  p.removeEdge(9, 0);
  p.removeEdge(2, 1);
  p.removeEdge(1, 2);
  p.removeEdge(3, 2);
  p.removeEdge(7, 2);
  p.removeEdge(11, 2);
  p.removeEdge(4, 3);
  p.removeEdge(6, 3);
  p.removeEdge(8, 3);
  p.removeEdge(10, 3);
  p.removeEdge(1, 4);
  p.removeEdge(5, 4);
  p.removeEdge(6, 5);
  p.removeEdge(10, 5);
  p.removeEdge(1, 6);
  p.removeEdge(3, 6);
  p.removeEdge(9, 6);
  p.removeEdge(11, 6);
  p.removeEdge(0, 7);
  p.removeEdge(6, 7);
  p.removeEdge(8, 7);
  p.removeEdge(3, 8);
  p.removeEdge(11, 8);
  p.removeEdge(0, 9);
  p.removeEdge(4, 9);
  p.removeEdge(12, 9);
  p.removeEdge(1, 10);
  p.removeEdge(3, 10);
  p.removeEdge(5, 10);
  p.removeEdge(9, 10);
  p.removeEdge(2, 11);
  p.removeEdge(6, 11);
  p.removeEdge(8, 11);
  p.removeEdge(10, 11);
  return p;
}
