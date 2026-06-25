import { useState, useMemo, useCallback } from 'react';
import { debounce, filterNotes, sortNotes } from '../utils/helpers';
import { SORT_OPTIONS } from '../utils/constants';

/**
 * Encapsulates search query state, sort preference, and the derived filtered+sorted list.
 *
 * @param {Array}  notes        full notes array from context
 * @param {string} activeFolder currently selected folder id
 * @returns {{ query, setQuery, sortOption, setSortOption, results }}
 */
export function useSearch(notes, activeFolder) {
  const [query, setQueryRaw] = useState('');
  const [sortOption, setSortOption] = useState(SORT_OPTIONS.UPDATED_DESC);

  // Debounce user keystrokes by 300 ms before updating the query state
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setQuery = useCallback(debounce((val) => setQueryRaw(val), 300), []);

  const results = useMemo(() => {
    const filtered = filterNotes(notes, activeFolder, query);
    return sortNotes(filtered, sortOption);
  }, [notes, activeFolder, query, sortOption]);

  return { query, setQuery, sortOption, setSortOption, results };
}
