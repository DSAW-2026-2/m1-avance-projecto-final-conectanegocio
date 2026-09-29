import { useContext } from 'react';
import { DataContext } from './DataContext.js';

export function useData() {
  const data = useContext(DataContext);
  if (!data) throw new Error('useData requires DataProvider');
  return data;
}
