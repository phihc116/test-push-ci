function bumpVersion(version, level) {
  let [major, minor, patch] = version.split(".").map(Number);
  if (level === "major") { major++; minor = 0; patch = 0; }
  else if (level === "minor") { minor++; patch = 0; }
  else { patch++; }
  return `${major}.${minor}.${patch}`;
}

export async function bumpTag({ github, context, service, env, updateLevel }) {
  const { data: tags } = await github.rest.repos.listTags({
    owner: context.repo.owner,
    repo: context.repo.repo,
    per_page: 100,
  });

  const filtered = tags
    .map(t => t.name)
    .filter(name => name.startsWith(`${service}-${env}:`))
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

  const latestTag = filtered.length > 0 ? filtered[0] : null;
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

  await github.rest.git.createRef({
    owner: context.repo.owner,
    repo: context.repo.repo,
    ref: `refs/tags/${newTag}`,
    sha: context.sha,
  });

  return { latestTag, newTag };
}
  