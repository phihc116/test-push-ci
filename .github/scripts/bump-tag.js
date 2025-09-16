const { execSync } = require("child_process");

const service = process.env.SERVICE;
const env = process.env.ENVIRONMENT;
const updateLevel = process.env.UPDATE_LEVEL;

function getLatestTag() {
  try {
    const tag = execSync(
      `git tag --list "${service}-${env}:*" --sort=-version:refname | head -n 1`,
      { encoding: "utf-8" }
    ).trim();
    return tag || null;
  } catch {
    return null;
  }
}

function bumpVersion(version, level) {
  let [major, minor, patch] = version.split(".").map(Number);
  if (level === "major") { major++; minor = 0; patch = 0; }
  else if (level === "minor") { minor++; patch = 0; }
  else { patch++; }
  return `${major}.${minor}.${patch}`;
}

function run() {
  const latestTag = getLatestTag();
  let newVersion;

  if (latestTag) {
    const version = latestTag.split(":")[1];
    newVersion = bumpVersion(version, updateLevel);
  } else {
    newVersion = "1.0.0";
  }

  const newTag = `${service}-${env}:${newVersion}`;
  console.log(`Latest tag: ${latestTag || "none"}`);
  console.log(`New tag: ${newTag}`);

//   execSync(`git tag ${newTag}`);
//   execSync(`git push origin ${newTag}`);
}

run();
