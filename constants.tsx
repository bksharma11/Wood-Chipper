
import { Employee, Shifts } from './types';

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'MDUK0330', name: 'Rohit Kumar-I', totalLeaves: 0, cOffBalance: 0, history: [] },
  { id: 'MDUK0132', name: 'Ravi Kumar', totalLeaves: 0, cOffBalance: 0, history: [] },
  { id: 'MDUK0318', name: 'Susheel Yadav', totalLeaves: 0, cOffBalance: 0, history: [] },
  { id: 'MDUK0038', name: 'Kamlesh Yadav', totalLeaves: 0, cOffBalance: 0, history: [] },
  { id: 'MDUK0491', name: 'Om Shankar Yadav', totalLeaves: 0, cOffBalance: 0, history: [] },
  { id: 'MDUK0130', name: 'Vijendra Singh', totalLeaves: 0, cOffBalance: 0, history: [] },
  { id: 'MDUK0083', name: 'Kulwant Singh', totalLeaves: 0, cOffBalance: 0, history: [] },
  { id: 'MDUK0146', name: 'Yash Kumar', totalLeaves: 0, cOffBalance: 0, history: [] },
  { id: 'MDUK0475', name: 'Rohit Kumar-II', totalLeaves: 0, cOffBalance: 0, history: [] },
  { id: 'MDUK0178', name: 'Lakhvinder Singh', totalLeaves: 0, cOffBalance: 0, history: [] },
  { id: 'MDUK0207', name: 'Prateek Yadav', totalLeaves: 0, cOffBalance: 0, history: [] },
  { id: 'MDUK0357', name: 'Pradeep Shukla', totalLeaves: 0, cOffBalance: 0, history: [] },
  { id: 'MDUK0492', name: 'Amit Nagarale', totalLeaves: 0, cOffBalance: 0, history: [] },
  { id: 'MDUK0069', name: 'Bhupendra Kumar', totalLeaves: 5, cOffBalance: 2, history: [] },
];

export const INITIAL_SHIFTS: Shifts = {
  A: { supervisor: 'Bhupendra Kumar', chipper1: 'Rohit Kumar-I', chipper2: 'Ravi Kumar' },
  B: { supervisor: 'Susheel Yadav', chipper1: 'Kamlesh Yadav', chipper2: 'Om Shankar Yadav' },
  C: { supervisor: 'Vijendra Singh', chipper1: 'Kulwant Singh', chipper2: 'Yash Kumar' },
  General: { supervisor: 'Prateek Yadav', chipper1: 'Lakhvinder Singh', chipper2: 'Amit Nagarale' },
};
