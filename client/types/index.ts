export interface Task {
  id: number;
  name: string;
  profilePic: string;
  title: string;
  time: string;
  status: 'In Progress' | 'Done' | 'Pending';
}

export interface MenuItem {
  name: string;
  icon: string;
  count?: number;
  href: string;
}

export interface Filter {
  name: string;
  value: string;
}