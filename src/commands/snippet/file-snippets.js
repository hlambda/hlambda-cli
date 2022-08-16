export const newCodeFileJavascriptRouter = (name, path, type) => {
  return `import express from "express";
import asyncHandler from "express-async-handler";

import { executeWithAdminRights, getEnvValue, isEnvTrue } from "hlambda";

// // Define constants & errors
// import constants from "./../../constants/constants.index.js";
// import errors from "./../../errors/errors.index.js";

// Create express router
const router = express.Router();

router.${type}(
  "/${path}",
  asyncHandler(async (req, res) => {
    console.log(
      "[${path}] ${type.toUpperCase()} | Hit!"
    );
    // --------------------------------------------------------------------------------
    return res.status(200).send("OK");
  })
);

export default router;
`;
};

export const newCodeFileJavascriptEntrypoint = (name) => {
  return `import { executeWithAdminRights, getEnvValue, isEnvTrue } from "hlambda";

// // Define constants & errors
// import constants from "./../../constants/constants.index.js";
// import errors from "./../../errors/errors.index.js";

// Create entrypoint function
const entrypoint = async () => {
  // Do it at startup
  console.log(\`[${name}] Entrypoint started!\`);
  // Do it multiple times...
  const timer = setInterval(() => {
    console.log(\`[${name}] Tick!\`);
  }, 1000 * 10); // Every 10 sec.
};

export default entrypoint;
`;
};
