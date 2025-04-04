import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const cloneGitRepo = async (
  url: string,
  projectName: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const command = `git clone ${url} ${projectName}`;

    const child = spawn(command, {
      shell: true,
      stdio: 'inherit',
    });

    child.on('error', (error) => {
      console.error(`Error: ${error.message}`);
      reject(error);
    });

    child.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Error: Process exited with code ${code}`);
        reject(new Error(`Process exited with code ${code}`));
      } else {
        console.log(`Repository cloned into ${projectName}`);
        resolve();
      }
    });
  });
};

const deleteGitFolder = async (projectName: string): Promise<void> => {
  const gitFolderPath = path.join(projectName, '.git');

  try {
    if (fs.existsSync(gitFolderPath)) {
      fs.rmSync(gitFolderPath, { recursive: true, force: true });
      console.log(`Deleted .git folder from ${projectName}`);
    } else {
      console.log(`No .git folder found in ${projectName}`);
    }
  } catch (error) {
    console.error(`Error deleting .git folder: ${(error as Error).message}`);
    throw error;
  }
};

export default async function init(projectName: string): Promise<void> {
  if (!projectName || typeof projectName !== 'string') {
    console.error(
      'Error: Project name is required and must be a valid string.'
    );
    return;
  }

  const url = 'https://github.com/nonqme/kickstart-nodejs.git';

  try {
    console.log(`Cloning repository from ${url}...`);
    await cloneGitRepo(url, projectName);

    console.log('Removing .git folder...');
    await deleteGitFolder(projectName);

    console.log(`Project ${projectName} initialized successfully.`);
    console.log(`Navigate to the project directory: cd ${projectName}`);
    console.log('Install dependencies: npm install');
    console.log('Prepare husky: npm run prepare');
  } catch (error) {
    console.error(`Failed to initialize project: ${(error as Error).message}`);
  }
}
