export const dockerInstallSnippet = (clean = false) => {
  const command =
    'docker run -d -p 8081:1331 --env HLAMBDA_ADMIN_SECRET=demo --name hlambda-server --restart=always -v hlambda_metadata:/usr/src/app/metadata hlambda/hlambda-core:latest';
  if (clean) {
    return command;
  }
  return `To run Hlambda in docker as stand-alone server instance you can run:

  ${command}

This will:
  - Run new container named: hlambda-server
  - Run latest hlambda server on host port: 8081
  - Set hlambda server admin secret to: demo
  - Create volume for your metadata named: hlambda_metadata
`;
};

export const dockerComposeInstallSnippet = (clean = false) => {
  const command =
    'curl https://www.hlambda.io/raw/code/start/docker-compose.yaml -o docker-compose.yaml && docker compose up -d';
  if (clean) {
    return command;
  }
  return `To run Hlambda in docker stack with Postgres and Hasura(https://hasura.io) you can run:

  ${command}

This will:
  - Download the docker-compose.yaml file (Warning: please read the contents of the yaml file to understand what you are actually running)
  - Run new docker compose stack
`;
};

export const portainerInstallSnippet = (clean = false) => {
  const command =
    'docker run -d -p 9001:9000 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:2.11.1';
  if (clean) {
    return command;
  }
  return `To run Portainer for your local machine you can run:

  ${command}

This will:
  - Run portainer at port 9001
  - Add two volumes to the container, one to access docker.sock and portainer_data to save portainer data
`;
};
