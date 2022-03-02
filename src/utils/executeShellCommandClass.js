import fetch from 'node-fetch';

export const executeShellCommandClass =
  (adminSecret, endpoint, silent = false) =>
  async (command, cwd) => {
    const headers = {
      'x-hlambda-admin-secret': adminSecret,
      Accept: 'application/json',
      'Content-Type': 'application/json', // Important
    };
    const response = await fetch(`${endpoint}/console/api/v1/command-request`, {
      method: 'POST',
      // Important
      body: JSON.stringify({
        command,
        cwd,
      }),
      headers,
    });

    if (!silent) {
      if (response.status === 200) {
        console.log(`Shell command`.green, `${command}`.red, `executed!`.green);
      }
      console.log(response.status);
    }

    return response;
  };

export default executeShellCommandClass;
