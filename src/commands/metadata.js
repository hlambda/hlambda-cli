import path from 'path';
// import { readFile } from 'fs/promises';
// import YAML from 'yaml';
import fetch from 'node-fetch';
// import FormData from 'form-data';
import { FormData, File } from 'formdata-node';
import AdmZip from 'adm-zip';
import rimraf from 'rimraf';

import { errors } from './../errors/index.js';

import CLIErrorHandler from './../utils/CLIErrorHandler.js';
import { loadConfigFromYAML } from './../utils/loadConfigFromYAML.js';

export const serverReload = async (options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:'.green, `${cwd}`.yellow);

    // Load yaml configuration
    const configuration = await loadConfigFromYAML(options);

    const endpoint = configuration?.endpoint ?? 'http://localhost:8081';
    const adminSecret = options?.adminSecret ?? configuration?.admin_secret ?? '';

    const headers = {
      'x-hlambda-admin-secret': adminSecret,
    };
    const response = await fetch(`${endpoint}/console/api/v1/trigger-restart`, {
      method: 'GET',
      // body: formData,
      headers,
    });

    if (response.status === 200) {
      console.log('Metadata reloaded!'.green);
    }
    console.log(response.status);
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export const serverClearMetadata = async (options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:'.green, `${cwd}`.yellow);

    // Load yaml configuration
    const configuration = await loadConfigFromYAML(options);

    const endpoint = configuration?.endpoint ?? 'http://localhost:8081';
    const adminSecret = options?.adminSecret ?? configuration?.admin_secret ?? '';

    const headers = {
      'x-hlambda-admin-secret': adminSecret,
    };
    const response = await fetch(`${endpoint}/console/api/v1/metadata/clear`, {
      method: 'GET',
      // body: formData,
      headers,
    });

    if (response.status === 200) {
      console.log('Metadata cleared!'.green);
    }
    console.log(response.status);

    if (response.status !== 200) {
      throw new Error(errors.ERROR_INVALID_HLAMBDA_ADMIN_SECRET);
    }

    // This is magic from commander, the real flag was --no-auto-reload but we get positive logic transformation to autoReload
    if (options?.autoReload) {
      const responseRestart = await fetch(`${endpoint}/console/api/v1/trigger-restart`, {
        method: 'GET',
        // body: formData,
        headers,
      });
      if (responseRestart.status === 200) {
        console.log('Metadata reloaded after clearing!'.green);
      }
      console.log(responseRestart.status);
    }
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export const metadataApply = async (options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:'.green, `${cwd}`.yellow);

    // console.log(options);

    // Load yaml configuration
    const configuration = await loadConfigFromYAML(options);

    const endpoint = configuration?.endpoint ?? 'http://localhost:8081';
    const adminSecret = options?.adminSecret ?? configuration?.admin_secret ?? '';
    const metadataDirectory = configuration?.metadata_directory ?? 'metadata';

    // ZIP the metadata
    const zip = new AdmZip();
    zip.addLocalFolder(path.resolve(cwd, options.config, metadataDirectory));
    console.log('Creating zip from the metadata'.yellow);

    // POST metadata to the API
    const payloadAsBuffer = zip.toBuffer();

    const formData = new FormData();

    const file = new File([payloadAsBuffer], 'metadata.zip'); // It is important that payload buffer is in array (lost an hour to this quirk :D)
    formData.append('metadata', file);

    // formData.append('metadata', payloadAsBuffer, {
    //   contentType: 'application/x-zip-compressed',
    //   name: 'file',
    //   filename: 'metadata.zip',
    // });
    // formData.append('name', 'Metadata');
    // formData.append('description', 'Metadata Payload');

    // console.log(adminSecret);

    const headers = {
      'x-hlambda-admin-secret': adminSecret,
    };

    // console.log(headers);

    const response = await fetch(`${endpoint}/console/api/v1/metadata/import`, {
      method: 'POST',
      body: formData,
      headers,
    });

    if (response.status === 200) {
      console.log('Metadata applied!'.green);
    }
    console.log(response.status);

    // This is magic from commander, the real flag was --no-auto-reload but we get positive logic transformation to autoReload
    if (options?.autoReload) {
      const responseRestart = await fetch(`${endpoint}/console/api/v1/trigger-restart`, {
        method: 'GET',
        // body: formData,
        headers,
      });
      console.log('Metadata reloaded!'.green);
      console.log(responseRestart.status);
    }
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export const metadataExport = async (options, program) => {
  (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:'.green, `${cwd}`.yellow);

    // console.log(options);

    // Load yaml configuration
    const configuration = await loadConfigFromYAML(options);

    const endpoint = configuration?.endpoint ?? 'http://localhost:8081';
    const adminSecret = options?.adminSecret ?? configuration?.admin_secret ?? '';
    const metadataDirectory = configuration?.metadata_directory ?? 'metadata';

    const headers = {
      'x-hlambda-admin-secret': adminSecret,
    };

    const response = await fetch(`${endpoint}/console/api/v1/metadata/export`, {
      method: 'POST',
      headers,
    });

    if (response.status !== 200) {
      throw new Error(errors.ERROR_INVALID_HLAMBDA_ADMIN_SECRET);
    }

    // console.log(response.headers);

    const bufferPayload = Buffer.from(await response.arrayBuffer());

    const zip = new AdmZip(bufferPayload);

    // const zipEntries = zip.getEntries(); // an array of ZipEntry records
    // console.log(zipEntries);

    const metadataFilePath = path.resolve(cwd, options.config, metadataDirectory);

    // Dangerous when you think about it... small mistake here and it can delete a lot of things, please be careful!
    if (
      typeof metadataFilePath === 'string' &&
      metadataFilePath !== '' &&
      metadataFilePath !== '/' &&
      metadataFilePath !== '/*'
    ) {
      // Sanity check !!!
      console.log(`Removing all the local metadata... ${metadataFilePath}`.yellow);
      rimraf.sync(metadataFilePath); // Please be careful...
    } else {
      throw new Error(errors.ERROR_DANGEROUS_SANITY_CHECK_DID_NOT_PASS);
    }

    zip.extractAllTo(metadataFilePath, true);

    if (response.status === 200) {
      console.log('Metadata exported!'.green);
    }
    console.log(response.status);
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};
