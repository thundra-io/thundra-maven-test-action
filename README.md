# thundra-maven-test-action

A GitHub Action to instrument your Maven with Thundra Agent.

## Usage

Information about available parameters is listed [below](#parameters). **Make sure to check out the [Known Issues](#known-issues)**.

The required parameters are the Thundra API Key and the Thundra Project ID, which can be obtained from [foresight.thundra.io](https://foresight.thundra.io/).

You can learn more about Thundra at [thundra.io](https://thundra.io)

Once you get the Thundra API Key, make sure to set it as a secret. A sample Github Action workflow would look like this:

```yaml
# ...

jobs:
  build-and-test:
    runs-on: ubuntu-latest      
    steps:
      - uses: actions/checkout@v2
      - name: Set up JDK 1.8
      - uses: actions/setup-java@v2
        with:
          distribution: 'adopt'
          java-version: '8'
      - name: Thundra Maven Test Instrumentation
        uses: thundra-io/thundra-maven-test-action@v1
        with:
          apikey: ${{ secrets.THUNDRA_APIKEY }}
          project_id: ${{ secrets.THUNDRA_PROJECT_ID }}
          command: mvn clean verify
```

### Running the Command Separately

```yaml
# ...

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up JDK 1.8
      - uses: actions/setup-java@v2
        with:
          distribution: 'adopt'
          java-version: '8'
      - name: Thundra Maven Test Instrumentation
        uses: thundra-io/thundra-maven-test-action@v1
        with:
          apikey: ${{ secrets.THUNDRA_APIKEY }}
          project_id: ${{ secrets.THUNDRA_PROJECT_ID }}
      - name: Run mvn command
        run: mvn clean verify
```

## Known Issues

### Using It with Build Matrix

If you are using a build matrix in your workflow, each run in your build matrix will show up like it's a different testrun on Thundra Foresight where in fact they belong to the same build.

With the current GitHub Action context, it's not possible to understand that those runs belogs to the same run. So, the obvious solution is to set a unique testrun ID for these runs before the matrix starts.

To solve this problem and other issues if we need to, we've written the [Thundra Test Init Action](https://github.com/thundra-io/thundra-test-init-action).

Make sure to follow the instruction in the repository.

## Parameters

| Name                  | Requirement       | Description
| ---                   | ---               | ---
| apikey                | Required          | Thundra API Key
| project_id            | Required          | Your project id from Thundra. Will be used to filter and classify your testruns.
| command               | Optional          | The Maven command you want to run. The given command will be executed right after the instrumentation. However, if it's not present, the action will end once the instrumentation is finished. This is optional in case you want to do more before you actually run your tests.
| instrumenter_version  | Optional          | In the action itself, we use a Java script to manipulate pom.xml files. This script is released and versioned separately from the action. Hence, if there is some breaking change or specific version you want to use, you can use it by defining this parameter. You can see all the available version of our instrumenter [here](https://search.maven.org/artifact/io.thundra.agent/thundra-agent-maven-test-instrumentation).
| agent_version         | Optional          | A specific version Thundra Java Agent you want to use should be defined here. Similar to `instrumenter_version` parameter. You can see all the available version of our agent [here](https://repo.thundra.io/service/local/repositories/thundra-releases/content/io/thundra/agent/thundra-agent-bootstrap/maven-metadata.xml).
