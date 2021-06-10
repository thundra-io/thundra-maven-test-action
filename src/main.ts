import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as github from '@actions/github'

import { instrument } from './instrument'

const apikey: string = core.getInput('apikey')
const project_id: string = core.getInput('project_id')
const command: string = core.getInput('command')
const github_token: string = core.getInput('github_token')
const message: string = core.getInput('message')

// Setting environment variables programmatically
core.exportVariable('THUNDRA_APIKEY', apikey)
core.exportVariable('THUNDRA_AGENT_TEST_PROJECT_ID', project_id)

async function run(): Promise<void> {
    try {
        core.info(`[Thundra] Initializing the Thundra Action...`)

        // Command Execution
        core.startGroup('[Thundra] Execute the given command...')
        core.info(`> Instrumenting the application`)
        await instrument(command)
        core.endGroup()

        core.info(`[Thundra] Executing the command`)
        await exec.exec(`sh -c "${command}"`)

        // Comment to PR
        if (github.context.payload.pull_request && github_token && message) {
            github.getOctokit(github_token).rest.issues.createComment({
                ...github.context.repo,
                issue_number: github.context.payload.pull_request.number,
                body: message
            })
        } else {
            core.warning('[Thundra] Run is not linked to a pull request!')
            core.warning('[Thundra] Skipping commenting...')
        }
    } catch (error) {
        core.setFailed(error.message)
    }
}

run()
