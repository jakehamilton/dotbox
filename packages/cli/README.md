# @dotbox/cli

> A tool for compiling and formatting DotBox files.

## Installation

```bash
# Using npm.
npm install --global @dotbox/cli

# Using yarn.
yarn add --global @dotbox/cli

# Or run directly with npx.
npx @dotbox/cli
```

## Usage

```bash
# Print the help message
dotbox --help
```

```
DESCRIPTION

    A tool for compiling and formatting DotBox files.

USAGE

    $ dotbox <command> [options]

COMMANDS

    fmt, format               Format one or more files
    cmp, compile              Compile a file to JSON

OPTIONS

    --help, -h                Show this help message
    --verbose, -v             Set logging verbosity

EXAMPLE

    $ # Get help for commands.
    $ dotbox format --help
    $ dotbox compile --help

    $ # Run DotBox with verbose logging.
    $ dotbox -v
    $ dotbox -vv

    $ # Run DotBox with no logging.
    $ LOG_LEVEL=SILENT dotbox

    $ # Run DotBox with timestamps.
    $ LOG_TIMESTAMP=TRUE dotbox

    $ # Filter logs from DotBox (based on log prefix).
    $ DEBUG="^some-regex$" dotbox
```

## Logging

DotBox makes use of [@littlethings/log](https://npm.im/@littlethings/log)
to implement its logging functionality. `@littlethings/log`
which can be configured with environment variables like `DEBUG`
to modify how DotBox logs things.

## Formatting

DotBox comes with a formatter to keep your code easily readable.

```bash
# For help with the `format` command.
dotbox format --help
```

```
DESCRIPTION

    Format DotBox files.

USAGE

    $ dotbox format [options] <files>

OPTIONS

    --help, -h                Show this help message

EXAMPLE

    $ # Format a single file.
    $ dotbox format ./my.box

    $ # Format multiple files.
    $ dotbox format ./my.box ./my_other.box
```

## Compiling

DotBox can compile a `.box` file to `.json`.

```bash
# For help with the `compile` command.
dotbox compile --help
```

```
DESCRIPTION

    Compile DotBox files to JSON.

USAGE

    $ dotbox compile <file> [options]

OPTIONS

    --help, -h                Show this help message
    --output, -o              Write the resulting JSON to a file

EXAMPLE

    $ # Compile a file and print the resulting JSON.
    $ dotbox compile ./my.box

    $ # Compile a file and write the resulting JSON to a file.
    $ dotbox compile ./my.box --output ./my.json
```
