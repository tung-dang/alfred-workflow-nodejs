## Features

Quick access list of bookmarks that are pre-defined in a simple text file `go_list.txt`;

## Installation

[import-workflow-source-to-alfred.md](https://github.com/tung-dang/alfred-workflow-nodejs-next/blob/master/docs/import-workflow-source-to-alfred.md)

## Usage in Alfred workflow

### Commands

- `go`: Search bookmark links in `go_list.txt` file.
- `go_clear_cache`: clear all local cache. After you change the `go_list.txt` file, you should run this command to clear local cache.
- `go_edit_list_links`: open `go_list.txt` file to add/update/delete bookmark links.

### Link format in `go_list.txt`

- Each line is a link.
- A comment line begins with `#`. Here is an example:
- Link format 1: `URL | description`

```bash
# AUI
https://docs.atlassian.com/aui/latest/docs/icons.html | AUI Icons
https://design.atlassian.com/2.1/product/foundations/colors/ | AUI Color - Design Guideline
```

- Link format 2 - a Go link: `go/alias-link | description`. An example:

```bash
go/helpdesk | Go Helpdesk page
```

- Link format 3 - link has a parameter: `https://abc.com/browse/{0} | description...`. An example:

```bash
https://abc.com/browse/{0} | Search...
```

- Link format 4 - A absolute path of a folder so we can open it quickly

```bash
~/Google Drive | Google Drive
```

- For more other format, please create a request ticket.

## Development

- `yarn run export-wf`: zip entire project and export to `exported-workflow-file/Go.alfredworklow` file