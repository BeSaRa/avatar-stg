const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const readline = require('readline-sync')

// Load Angular configuration file
const angularConfigPath = path.join(__dirname, '..', 'angular.json')

if (!fs.existsSync(angularConfigPath)) {
  console.error('❌ angular.json file not found!')
  process.exit(1)
}

// Parse angular.json to get project configuration
const angularConfig = JSON.parse(fs.readFileSync(angularConfigPath, 'utf8'))
const projects = Object.keys(angularConfig.projects)

if (projects.length === 0) {
  console.error('❌ No projects found in angular.json!')
  process.exit(1)
}

// Ask the user to select a project if multiple exist
let selectedProject
if (projects.length === 1) {
  selectedProject = projects[0] // Use the only available project
} else {
  console.log('\nAvailable Angular projects:')
  projects.forEach((proj, index) => console.log(`${index + 1}) ${proj}`))

  const projChoice = readline.question('Select a project (number): ').trim()
  const projIndex = parseInt(projChoice, 10) - 1

  if (projIndex < 0 || projIndex >= projects.length) {
    console.error('❌ Invalid selection! Please restart the script.')
    process.exit(1)
  }

  selectedProject = projects[projIndex]
}

const outputPath = angularConfig.projects[selectedProject].architect.build.options.outputPath

if (!outputPath) {
  console.error(`❌ Could not find outputPath for project: ${selectedProject}`)
  process.exit(1)
}

console.log(`📁 Using outputPath from angular.json: ${outputPath}`)

// Load environment configuration
const envFilePath = path.join(__dirname, '..', 'src', 'resources', 'environment.json')

if (!fs.existsSync(envFilePath)) {
  console.error('❌ environment.json file not found at:', envFilePath)
  process.exit(1)
}

// Read environment settings
const envData = JSON.parse(fs.readFileSync(envFilePath, 'utf8'))
const envKeys = Object.keys(envData.ENVIRONMENTS_URLS)

if (envKeys.length === 0) {
  console.error('❌ No environments found in ENVIRONMENTS_URLS!')
  process.exit(1)
}

// Read package version
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'))
const version = packageJson.version

/**
 * Function to get the last directory name in the output path.
 * Example:
 * - `dist/avatar` → `avatar`
 * - `dist/x/y/h` → `h`
 * - `dist` → `dist`
 */
function getLastFolderName(outputPath) {
  const normalizedPath = path.normalize(outputPath)
  return path.basename(normalizedPath) // Returns only the last directory name
}

/**
 * Prompts the user whether the selected environment should use OCP.
 * Updates envData.IS_OCP based on user input.
 *
 * @param selectedEnv - The environment name
 */
function isOcp(selectedEnv) {
  const question = `Should the environment "${selectedEnv}" use OCP? (y/n): `

  while (true) {
    const input = readline.question(question).trim().toLowerCase()

    if (input === 'y' || input === 'yes') {
      envData.IS_OCP = true
      console.log('✅ OCP mode enabled.')
      break
    } else if (input === 'n' || input === 'no') {
      envData.IS_OCP = false
      console.log('ℹ️ OCP mode disabled.')
      break
    } else {
      console.log('❌ Invalid input. Please enter "y" or "n".')
    }
  }
}

/**
 * Function to update `BASE_ENVIRONMENT` in environment.json.
 */
function updateEnvironment(selectedEnv) {
  console.log(`🔄 Updating BASE_ENVIRONMENT to: ${selectedEnv}`)
  envData.BASE_ENVIRONMENT = selectedEnv
  fs.writeFileSync(envFilePath, JSON.stringify(envData, null, 4))
}

/**
 * Function to build, compress, and organize files.
 */
function buildAndCompress(selectedEnv) {
  console.log(`🚀 Building Angular Project in production mode...`)
  execSync('ng build --configuration=production', { stdio: 'inherit' })

  const lastFolder = getLastFolderName(outputPath)
  const parentPath = path.join(__dirname, '..', path.dirname(outputPath)) // Get parent directory

  if (!fs.existsSync(path.join(parentPath, lastFolder))) {
    console.error(`❌ Error: The folder "${lastFolder}" does not exist in "${parentPath}"`)
    process.exit(1)
  }

  const archiveName = `dist_${version}.rar`
  const targetFolder = path.join(__dirname, '..', 'dist', selectedEnv)

  console.log(`📦 Compressing folder: ${lastFolder} from ${parentPath}`)

  // Run WinRAR in the correct directory (parentPath) to compress only the folder
  const isWindows = process.platform === 'win32'
  const rarCommand = isWindows
    ? `"C:\\Program Files\\WinRAR\\rar.exe" a -ep1 ${archiveName} ${lastFolder}`
    : `rar a -ep1 ${archiveName} ${lastFolder}`

  execSync(rarCommand, { cwd: parentPath, stdio: 'inherit' })

  // Create the environment folder if it doesn't exist
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true })
  }

  // Move compressed file to the environment folder
  const archiveSourcePath = path.join(parentPath, archiveName)
  const targetPath = path.join(targetFolder, archiveName)
  fs.renameSync(archiveSourcePath, targetPath)
  console.log(`📂 Moved compressed file to: ${targetPath}`)

  console.log('✅ Process completed successfully!')
}

// Main execution loop
while (true) {
  console.log('\nSelect build mode:')
  console.log('1) One Build')
  console.log("2) Multiple Builds (Enter comma-separated numbers, e.g., '1,3,5')")
  console.log("Press 'q' to quit")

  const buildMode = readline.question('Enter choice: ').trim()

  if (buildMode.toLowerCase() === 'q') {
    console.log('👋 Exiting...')
    break
  }

  console.log('\nAvailable environments:')
  envKeys.forEach((key, index) => {
    console.log(`${index + 1}) ${key}`)
  })

  const envChoice = readline.question('Select environment(s) (comma-separated numbers): ').trim()
  const envIndexes = envChoice.split(',').map(num => parseInt(num.trim(), 10) - 1)

  const selectedEnvs = envIndexes.filter(index => index >= 0 && index < envKeys.length).map(index => envKeys[index])

  if (selectedEnvs.length === 0) {
    console.error('❌ Invalid selection! Please try again.')
    continue
  }

  console.log(`🔄 Selected environments: ${selectedEnvs.join(', ')}`)

  // Loop through each selected environment and perform the process
  for (const selectedEnv of selectedEnvs) {
    isOcp(selectedEnv)
    updateEnvironment(selectedEnv)
    buildAndCompress(selectedEnv)
  }

  console.log('✅ All selected builds completed!')

  if (buildMode === '1') {
    break
  }
}

console.log('🎉 Process finished!')
