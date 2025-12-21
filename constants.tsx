
import { Employee, Shifts } from './types';

export const INITIAL_EMPLOYEES: Employee[] = [
  // Group 1
  { id: 'MDUK0330', name: 'ROHIT KUMAR -I', phone: '6397122210', totalLeaves: 0, cOffBalance: 0, history: [], schedule: "C,R,B,B,B,B,B,B,R,A,A,A,A,A,A,R,C,C,C,C,C,C,R,B,B,B,B,B,B,R,A".split(',') },
  { id: 'MDUK0132', name: 'RAVI KUMAR', phone: '9837780045', totalLeaves: 0, cOffBalance: 0, history: [], schedule: "B,B,R,A,A,A,A,A,A,R,C,C,C,C,C,C,R,B,B,B,B,B,B,R,A,A,A,A,A,A,R".split(',') },
  { id: 'MDUK0318', name: 'SUSHEEL YADAV', phone: '6395538448', totalLeaves: 0, cOffBalance: 0, history: [], schedule: "A,A,A,R,C,C,C,C,C,C,R,B,B,B,B,B,B,R,A,A,A,A,A,A,R,C,C,C,C,C,C".split(',') },
  { id: 'MDUK0038', name: 'KAMLESH YADAV', phone: '9719712543', totalLeaves: 0, cOffBalance: 0, history: [], schedule: "C,C,C,C,R,B,B,B,B,B,B,R,A,A,A,A,A,A,R,C,C,C,C,C,C,R,B,B,B,B,B".split(',') },
  { id: 'MDUK0491', name: 'OM SHANKAR YADAV', phone: '9532434660', totalLeaves: 0, cOffBalance: 0, history: [], schedule: "B,B,B,B,B,R,A,A,A,A,A,A,R,C,C,C,C,C,C,R,B,B,B,B,B,B,R,A,A,A,A".split(',') },
  { id: 'MDUK0130', name: 'VIJENDRA SINGH', phone: '9917604501', totalLeaves: 0, cOffBalance: 0, history: [], schedule: "A,A,A,A,A,A,R,C,C,C,C,C,C,R,B,B,B,B,B,B,R,A,A,A,A,A,A,R,C,C,C".split(',') },
  { id: 'MDUK0083', name: 'KULWANT SINGH', phone: '6398696145', totalLeaves: 0, cOffBalance: 0, history: [], schedule: "R,C,C,C,C,C,C,R,B,B,B,B,B,B,R,A,A,A,A,A,A,R,C,C,C,C,C,C,R,B,B".split(',') },
  
  // Group 2
  { id: 'MDUK0146', name: 'YASH KUMAR', phone: '7505388206', totalLeaves: 0, cOffBalance: 0, history: [], schedule: "G,R,C,C,C,C,C,C,R,G,G,G,G,G,G,R,C,C,C,C,C,C,R,G,G,G,G,G,G,R,C".split(',') },
  { id: 'MDUK0475', name: 'ROHIT KUMAR -II', phone: '9675274136', totalLeaves: 0, cOffBalance: 0, history: [], schedule: "C,C,R,G,G,G,G,G,G,R,C,C,C,C,C,C,R,G,G,G,G,G,G,R,C,C,C,C,C,C,R".split(',') },
  
  // Group 3
  { id: 'MDUK0178', name: 'LAKHVINDER SINGH', phone: '9927514936', totalLeaves: 0, cOffBalance: 0, history: [], schedule: "R,C,C,C,C,C,C,R,B,B,B,B,B,B,R,A,A,A,A,A,A,R,C,C,C,C,C,C,R,B,B".split(',') },
  { id: 'MDUK0207', name: 'PRATEEK YADAV', phone: '7251805982', totalLeaves: 0, cOffBalance: 0, history: [], schedule: "C,R,B,B,B,B,B,B,R,A,A,A,A,A,A,R,C,C,C,C,C,C,R,B,B,B,B,B,B,R,A".split(',') },
  { id: 'MDUK0357', name: 'PRADEEP SHUKLA', phone: '9027905286', totalLeaves: 0, cOffBalance: 0, history: [], schedule: "B,B,R,A,A,A,A,A,A,R,C,C,C,C,C,C,R,B,B,B,B,B,B,R,A,A,A,A,A,A,R".split(',') },
  { id: 'MDUK0492', name: 'AMIT NAGARALE', phone: '9359238097', totalLeaves: 0, cOffBalance: 0, history: [], schedule: "C,C,C,R,G,G,G,C,C,C,R,G,G,G,B,B,B,R,G,G,G,A,A,A,R,C,C,C,C,C,C".split(',') },
  
  // Group 4
  { id: 'MDUK0069', name: 'BHUPENDRA KUMAR', phone: '7830830564', totalLeaves: 5, cOffBalance: 2, history: [], schedule: "G,R,C,C,C,C,C,C,R,G,G,G,G,G,G,R,C,C,C,C,C,C,R,G,G,G,G,G,G,R,C".split(',') },
];

export const INITIAL_SHIFTS: Shifts = {
  A: { supervisor: 'BHUPENDRA KUMAR', chipper1: 'ROHIT KUMAR -I', chipper2: 'RAVI KUMAR' },
  B: { supervisor: 'SUSHEEL YADAV', chipper1: 'KAMLESH YADAV', chipper2: 'OM SHANKAR YADAV' },
  C: { supervisor: 'VIJENDRA SINGH', chipper1: 'KULWANT SINGH', chipper2: 'YASH KUMAR' },
  General: { supervisor: 'PRATEEK YADAV', chipper1: 'LAKHVINDER SINGH', chipper2: 'AMIT NAGARALE' },
};
