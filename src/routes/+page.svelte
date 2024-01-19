<script>
  import { onMount } from 'svelte';
  import Keycloak from 'keycloak-js';
  import { store_keycloak } from '../stores.js';

  // on mount, run fetch test
  onMount(async () => {
    console.log('mounted!');

    await fetchTest();
  });

  const uri_server = 'http://localhost:3000';

  // tests that front-end can make basic get request to server
  async function fetchTest() {
    const response = await fetch(`${uri_server}/test`);

    const display_fetchTest = document.getElementById('fetchTest');

    if(response.ok) {
      display_fetchTest.textContent = await response.text();
    } else {
      display_fetchTest.textContent = 'fetch failed!';
    }
  };

  let keycloak = $store_keycloak;

  // login for user, redirects to keycloak login form
  // keycloak info is saved to store so it persists in session
  async function login() {
    keycloak = new Keycloak({
      url: 'http://localhost:8080',
      realm: 'myrealm',
      clientId: 'myclient'
    });

    $store_keycloak = keycloak;

    try {
      const authenticated = await keycloak.init({
        onLoad: 'login-required'
      });

      console.log(`User is ${authenticated ? 'authenticated' : 'not authenticated'}`);
    } catch (error) {
      console.error('Failed to initialize adapter:', error);
    }
  }

  // tests a keycloak.protect based endpoint to see if authentication is working
  async function authTest() {
    const display_authTest = document.getElementById('authTest');

    console.log(keycloak);

    if(keycloak) {
      console.log(keycloak.token);
  
      const response = await fetch(`${uri_server}/protected`, {
        headers: {
          Authorization: `Bearer: ${keycloak.token}`
        }
      });
    
      if(response.ok) {
        display_authTest.textContent = await response.text();
      } else {
        display_authTest.textContent = 'fetch failed!';
      }
    } else {
      display_authTest.textContent = 'Not logged in!';
    }
  }

  // retrieves token from store
  function getToken() {
    const display_keycloakToken = document.getElementById('keycloakToken');

    if(keycloak) {
      display_keycloakToken.textContent = keycloak.token;
    } else {
      display_keycloakToken.textContent = 'null';
    }
  }
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<div>
  <span>fetch test: </span>
  <span id='fetchTest'>waiting...</span>
</div>

<button on:click={login}>Login</button>

<div>
  <div>
    <span>auth test: </span>
    <span id=authTest>waiting...</span>
  </div>

  <button on:click={authTest}>Run</button>
</div>

<div>
  <div>
    <span>token: </span>
    <span id=keycloakToken>waiting...</span>
  </div>

  <button on:click={getToken}>Get token</button>
</div>

