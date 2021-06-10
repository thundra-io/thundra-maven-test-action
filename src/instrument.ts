import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'
import { resolve } from 'path'

const THUNDRA_AGENT_REPOSITORY =
    'https://thundra-release-lab.s3-us-west-2.amazonaws.com/thundra-agent/thundra-agent-bootstrap.jar'

const MAVEN_INSTRUMENTATION_SCRIPT =
    'https://repo1.maven.org/maven2/io/thundra/agent/thundra-agent-maven-test-instrumentation/0.0.2/thundra-agent-maven-test-instrumentation-0.0.2.jar'

export async function instrument(command: string): Promise<void> {
    if (command === null) {
        throw new Error('Command must be present')
    }

    core.info('> Downloading the agent...')
    const agentPath = await tc.downloadTool(THUNDRA_AGENT_REPOSITORY)
    core.info(`> Successfully downloaded the agent to ${agentPath}`)

    core.info('> Downloading the maven instrumentator')
    const mvnInstrumentatorPath = await tc.downloadTool(
        MAVEN_INSTRUMENTATION_SCRIPT
    )
    core.info(
        `> Successfully downloaded the maven instrumentator to ${mvnInstrumentatorPath}`
    )

    core.info('> Updating pom.xml...')
    await exec.exec(
        `sh -c "find ${process.cwd()} -name \\"pom.xml\\" -exec java -jar ${mvnInstrumentatorPath} ${agentPath} {} \\;"`
    )
    core.info('> Update to pom.xml is done')

    resolve('Done!')
}
