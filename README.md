# thundra-maven-test-action

A GitHub Action to instrument your Maven with Thundra Agent.

## Usage

Information about available parameters is listed [below](#parameters). The only required parameter is the Thundra API Key, which can be obtained from [here]().

You can learn more about Thundra at [thundra.io](https://thundra.io)

Once you get the Thundra API Key, make sure to set it as a secret. A sample Github Action workflow would look like this:

```yaml
# ...

steps:
  - uses: actions/checkout@v2
  - name: Set up JDK 1.8
    uses: actions/setup-java@v1
    with:
      java-version: 1.8
  - name: Thundra Maven Test Instrumentation
    uses: thundra-io/thundra-maven-test-action@v1
    with:
      apikey: ${{ secrets.THUNDRA_APIKEY }}
  - name: Run mvn command
    run: mvn clean install
```

## Parameters

| Name                  | Requirement       | Description
| ---                   | ---               | ---
| apikey                | Required          | Thundra API Key
| command               | Optional          | The Maven command you want to run. The given command will be executed right after the instrumentation. However, if it's not present, the action will end once the instrumentation is finished. This is optional in case you want to do more before you actually run your tests.
| project_id            | Optional          | Your project id from Thundra. Will be used to filter and classify your testruns.
| instrumenter_version  | Optional          | In the action itself, we use a Java script to manipulate pom.xml files. This script is released and versioned separately from the action. Hence, if there is some breaking change or specific version you want to use, you can use it by defining this parameter. You can see all the available version of our instrumenter [here](https://search.maven.org/artifact/io.thundra.agent/thundra-agent-maven-test-instrumentation).
| agent_version         | Optional          | A specific version Thundra Java Agent you want to use should be defined here. Similar to `instrumenter_version` parameter. You can see all the available version of our agent [here](https://repo.thundra.io/service/local/repositories/thundra-releases/content/io/thundra/agent/thundra-agent-bootstrap/maven-metadata.xml).
