import React from 'react';
import { act, fireEvent, render, screen, cleanup } from '@testing-library/react';
import { GlobalDataProvider, useGlobalData } from './globaldatacontext';
import { getPeople } from './api';
jest.mock('./api', () => ({ getPeople: jest.fn(), getPersonInformation: jest.fn().mockResolvedValue({}) }));
const oldPeople = [{ full_name: 'Existing researcher' }];
const newPeople = [...oldPeople, { full_name: 'New researcher' }];
function Directory() {
  const { people, peopleLoading, error, refreshCache } = useGlobalData();
  return <><span>{people?.map(person => person.full_name).join(', ')}</span>{peopleLoading && <span>Loading</span>}{error && <span>{error}</span>}<button onClick={refreshCache}>Refresh</button></>;
}
const mount = () => render(<GlobalDataProvider><Directory /></GlobalDataProvider>);
const flush = async () => { await act(async () => {}); };
const cache = age => localStorage.setItem('people_data_cache', JSON.stringify({ timestamp: Date.now() - age, data: oldPeople }));
beforeEach(() => {
  jest.useFakeTimers(); localStorage.clear(); jest.clearAllMocks(); getPeople.mockResolvedValue(newPeople);
  jest.spyOn(console, 'log').mockImplementation(() => {});
  Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
});
afterEach(() => { cleanup(); jest.useRealTimers(); jest.restoreAllMocks(); });
test('renders cache immediately and replaces it after background fetch without a loader', async () => {
  cache(120000); let resolve;
  getPeople.mockReturnValue(new Promise(done => { resolve = done; })); mount();
  expect(screen.getByText('Existing researcher')).toBeTruthy(); expect(screen.queryByText('Loading')).toBeNull();
  await act(async () => resolve(newPeople));
  expect(screen.getByText(/New researcher/)).toBeTruthy();
  expect(JSON.parse(localStorage.getItem('people_data_cache')).data).toEqual(newPeople);
});
test('deduplicates pending requests and throttles focus events', async () => {
  cache(120000); let resolve;
  getPeople.mockReturnValue(new Promise(done => { resolve = done; })); mount();
  fireEvent.focus(window); fireEvent(document, new Event('visibilitychange'));
  expect(getPeople).toHaveBeenCalledTimes(1);
  await act(async () => resolve(newPeople)); fireEvent.focus(window);
  expect(getPeople).toHaveBeenCalledTimes(1);
  await act(async () => jest.advanceTimersByTime(60000));
  expect(getPeople).toHaveBeenCalledTimes(2);
});
test('respects recent persisted timestamps and refreshes after a minute', async () => {
  cache(10000); mount(); fireEvent.focus(window); expect(getPeople).not.toHaveBeenCalled();
  await act(async () => jest.advanceTimersByTime(60000));
  expect(getPeople).toHaveBeenCalledTimes(1); expect(screen.getByText(/New researcher/)).toBeTruthy();
});
test('retains the directory after a background failure', async () => {
  cache(120000); getPeople.mockRejectedValue(new Error('Offline')); mount(); await flush();
  expect(screen.getByText('Existing researcher')).toBeTruthy(); expect(screen.queryByText('Offline')).toBeNull();
});
test('manual refresh bypasses the throttle', async () => {
  cache(10000); mount(); fireEvent.click(screen.getByText('Refresh')); await flush();
  expect(getPeople).toHaveBeenCalledTimes(1); expect(screen.getByText(/New researcher/)).toBeTruthy();
});
test('skips hidden tabs, refreshes on return and removes listeners and timers on unmount', async () => {
  cache(10000); const view = mount();
  Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
  await act(async () => jest.advanceTimersByTime(60000)); expect(getPeople).not.toHaveBeenCalled();
  Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
  fireEvent(document, new Event('visibilitychange')); await flush(); expect(getPeople).toHaveBeenCalledTimes(1);
  view.unmount(); act(() => jest.advanceTimersByTime(120000)); fireEvent.focus(window);
  expect(getPeople).toHaveBeenCalledTimes(1);
});
test('shows initial load failure when no cache exists', async () => {
  getPeople.mockRejectedValue(new Error('Unable to load people')); mount(); expect(screen.getByText('Loading')).toBeTruthy();
  await flush(); expect(screen.getByText('Unable to load people')).toBeTruthy();
});
