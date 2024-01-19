import { writable } from 'svelte/store';

const store_persistent = (key, startValue) => {
  const {subscribe, set} = writable(startValue);

  return {
    subscribe,
    set,
    useLocalStore: () => {
      const item = localStorage.getItem(key);

      if(session) {
        set(JSON.parse(item));
      }

      subscribe(current => {
        localStorage.setItem(key, JSON.stringify(current));
      });
    }
  }
}

export const store_keycloak = store_persistent('keycloak', null);