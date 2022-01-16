import Puzzle from "../classes/Puzzle";

// https://static.wikia.nocookie.net/thewitness_gamepedia/images/1/12/Entry_Area_2.jpg/revision/latest?cb=20160325114418
export default function create() {
  const p = new Puzzle(10, 10);
  p.addStart(0, 10);
  p.addEnd(10, 0);
  return p;
}
