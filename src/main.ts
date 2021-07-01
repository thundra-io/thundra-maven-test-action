import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as semver from 'semver'

import { instrument } from './instrument'

const apikey: string = core.getInput('apikey', { required: true })
const project_id: string = core.getInput('project_id')
const command: string = core.getInput('command')
const instrumenter_version: string = core.getInput('instrumenter_version')
const agent_version: string = core.getInput('agent_version')

// Setting environment variables programmatically
core.exportVariable('THUNDRA_APIKEY', apikey)

if (project_id) {
    core.exportVariable('THUNDRA_AGENT_TEST_PROJECT_ID', project_id)
}

if (agent_version && semver.lt(agent_version, '2.7.0')) {
    core.setFailed(`Thundra Java Agent prior to 2.7.0 doesn't work with this action`)
}

async function run(): Promise<void> {
    try {
        core.info(`[Thundra] Initializing the Thundra Action...`)

        core.startGroup('[Thundra] Instrumentation')
        core.info(`> Instrumenting the application`)
        await instrument(instrumenter_version, agent_version)
        core.endGroup()

        if (command) {
            core.info(`[Thundra] Executing the command`)
            await exec.exec(`sh -c "${command}"`)
        }
    } catch (error) {
        core.setFailed(error.message)
    }
}

run()
