
import { Employee, Shifts } from './types';

const JAN_2026_KEY = "2026-0";

export const INITIAL_EMPLOYEES: Employee[] = [
  { 
    id: 'MDUK0069', 
    name: 'Bhupendra Kumar', 
    role: 'INCHARGE', 
    phone: '7830830564', 
    totalLeaves: 5, 
    cOffBalance: 2, 
    history: [], 
    schedules: { [JAN_2026_KEY]: "G,R,C,C,C,C,C,C,R,G,G,G,G,G,G,R,C,C,C,C,C,C,R,G,G,G,G,G,G,R,C".split(',') }
  },
  { 
    id: 'MDUK0178', 
    name: 'Lakhvinder Singh', 
    role: 'SUPERVISOR', 
    phone: '9927514936', 
    totalLeaves: 0, 
    cOffBalance: 0, 
    history: [], 
    schedules: { [JAN_2026_KEY]: "R,C,C,C,C,C,C,R,B,B,B,B,B,B,R,A,A,A,A,A,A,R,C,C,C,C,C,C,R,B,B".split(',') }
  },
  { 
    id: 'MDUK0207', 
    name: 'Prateek Yadav', 
    role: 'SUPERVISOR', 
    phone: '7251805982', 
    totalLeaves: 0, 
    cOffBalance: 0, 
    history: [], 
    schedules: { [JAN_2026_KEY]: "C,R,B,B,B,B,B,B,R,A,A,A,A,A,A,R,C,C,C,C,C,C,R,B,B,B,B,B,B,R,A".split(',') }
  },
  { 
    id: 'MDUK0357', 
    name: 'Pradeep Shukla', 
    role: 'SUPERVISOR', 
    phone: '9027905286', 
    totalLeaves: 0, 
    cOffBalance: 0, 
    history: [], 
    schedules: { [JAN_2026_KEY]: "B,B,R,A,A,A,A,A,A,R,C,C,C,C,C,C,R,B,B,B,B,B,B,R,A,A,A,A,A,A,R".split(',') }
  },
  { 
    id: 'MDUK0492', 
    name: 'Amit Nagarale', 
    role: 'SUPERVISOR', 
    phone: '9359238097', 
    totalLeaves: 0, 
    cOffBalance: 0, 
    history: [], 
    schedules: { [JAN_2026_KEY]: "C,C,C,R,G,G,G,C,C,C,R,G,G,G,B,B,B,R,G,G,G,A,A,A,R,C,C,C,C,C,C".split(',') }
  },
  { 
    id: 'MDUK0330', 
    name: 'Rohit Kumar-I', 
    role: 'OPERATOR', 
    phone: '6397122210', 
    totalLeaves: 0, 
    cOffBalance: 0, 
    history: [], 
    schedules: { [JAN_2026_KEY]: "C,R,B,B,B,B,B,B,R,A,A,A,A,A,A,R,C,C,C,C,C,C,R,B,B,B,B,B,B,R,A".split(',') }
  },
  { 
    id: 'MDUK0132', 
    name: 'Ravi Kumar', 
    role: 'OPERATOR', 
    phone: '9837780045', 
    totalLeaves: 0, 
    cOffBalance: 0, 
    history: [], 
    schedules: { [JAN_2026_KEY]: "B,B,R,A,A,A,A,A,A,R,C,C,C,C,C,C,R,B,B,B,B,B,B,R,A,A,A,A,A,A,R".split(',') }
  },
  { 
    id: 'MDUK0318', 
    name: 'Susheel Yadav', 
    role: 'OPERATOR', 
    phone: '6395538448', 
    totalLeaves: 0, 
    cOffBalance: 0, 
    history: [], 
    schedules: { [JAN_2026_KEY]: "A,A,A,R,C,C,C,C,C,C,R,B,B,B,B,B,B,R,A,A,A,A,A,A,R,C,C,C,C,C,C".split(',') }
  },
  { 
    id: 'MDUK0038', 
    name: 'Kamlesh Yadav', 
    role: 'OPERATOR', 
    phone: '9719712543', 
    totalLeaves: 0, 
    cOffBalance: 0, 
    history: [], 
    schedules: { [JAN_2026_KEY]: "C,C,C,C,R,B,B,B,B,B,B,R,A,A,A,A,A,A,R,C,C,C,C,C,C,R,B,B,B,B,B".split(',') }
  },
  { 
    id: 'MDUK0491', 
    name: 'Om Shankar Yadav', 
    role: 'OPERATOR', 
    phone: '9532434660', 
    totalLeaves: 0, 
    cOffBalance: 0, 
    history: [], 
    schedules: { [JAN_2026_KEY]: "B,B,B,B,B,R,A,A,A,A,A,A,R,C,C,C,C,C,C,R,B,B,B,B,B,B,R,A,A,A,A".split(',') }
  },
  { 
    id: 'MDUK0130', 
    name: 'Vijendra Singh', 
    role: 'OPERATOR', 
    phone: '9917604501', 
    totalLeaves: 0, 
    cOffBalance: 0, 
    history: [], 
    schedules: { [JAN_2026_KEY]: "A,A,A,A,A,A,R,C,C,C,C,C,C,R,B,B,B,B,B,B,R,A,A,A,A,A,A,R,C,C,C".split(',') }
  },
  { 
    id: 'MDUK0083', 
    name: 'Kulwant Singh', 
    role: 'OPERATOR', 
    phone: '6398696145', 
    totalLeaves: 0, 
    cOffBalance: 0, 
    history: [], 
    schedules: { [JAN_2026_KEY]: "R,C,C,C,C,C,C,R,B,B,B,B,B,B,R,A,A,A,A,A,A,R,C,C,C,C,C,C,R,B,B".split(',') }
  },
  { 
    id: 'MDUK0146', 
    name: 'Yash Kumar', 
    role: 'OPERATOR', 
    phone: '7505388206', 
    totalLeaves: 0, 
    cOffBalance: 0, 
    history: [], 
    schedules: { [JAN_2026_KEY]: "G,R,C,C,C,C,C,C,R,G,G,G,G,G,G,R,C,C,C,C,C,C,R,G,G,G,G,G,G,R,C".split(',') }
  },
  { 
    id: 'MDUK0475', 
    name: 'Rohit Kumar-II', 
    role: 'OPERATOR', 
    phone: '9675274136', 
    totalLeaves: 0, 
    cOffBalance: 0, 
    history: [], 
    schedules: { [JAN_2026_KEY]: "C,C,R,G,G,G,G,G,G,R,C,C,C,C,C,C,R,G,G,G,G,G,G,R,C,C,C,C,C,C,R".split(',') }
  },
];

export const INITIAL_SHIFTS: Shifts = {
  A: { supervisor: '', chipper1: '', chipper2: '' },
  B: { supervisor: '', chipper1: '', chipper2: '' },
  C: { supervisor: '', chipper1: '', chipper2: '' },
  General: { supervisor: '', chipper1: '', chipper2: '' },
};
