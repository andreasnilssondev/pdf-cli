# pdf-cli
A CLI to quickly create full-page PDFs from a URL or local html files in current directory. 

Using the Headless Chrome Node API [puppeteer](https://github.com/GoogleChrome/puppeteer) for creating the PDFs. `pdf-cli` will check the height of the document and print the PDF as one page only. If you still wish to generate PDFs with multiple pages, use the `--format` option. 

# Install
`$ npm install -g pdf-cli`

# Usage
```shell
# gives a list of html files (from current directory) to quickly pick the ones you want to create PDFs from. 
$ pdf
``` 

![Example pdf](/images/example-pdf.png?raw=true "Example pdf")

```shell
# Automatically creates PDFs of all html files in the current directory.
$ pdf --all
```

![Example pdf --all](/images/example-pdf-all.png?raw=true "Example pdf --all")

# Options
- `--all`, `-a`
Creates PDFs of all html files in the current directory

- `--overwrite`, `-o`
Will overwrite any existing PDFs with the same filename. Will not add the timestamp in the filename.

- `--url=<string>`, `-u=<string>`
Create PDF from a URL, works with local paths and web URLs. 

## PDF options
Options are passed to [puppeteer](https://github.com/GoogleChrome/puppeteer) and comes from their docs at the time of writing, but please note that the defaults in `pdf-cli` might be different. 

- `--scale=<number>`, `-s=<number>`
Scale of the webpage rendering. Defaults to 1. 

- `--displayHeaderFooter=<boolean>`, `-d=<boolean>`
Display header and footer. Defaults to true.

- `--printBackground=<boolean>`, `-b=<boolean>`
Print background graphics. Defaults to true.

- `--landscape=<boolean>`, `-l=<boolean>`
Paper orientation. Defaults to false.

- `--pageRanges=<string>`, `-p=<string>`
Paper ranges to print, e.g., '1-5, 8, 11-13'. Defaults to the empty string, which means print all pages. Please note that `pdf-cli` will print one page by default. You can change this with the `--format` option.

- `--format=<string>`, `-f=<string>`
Paper format. If set, takes priority over width or height options. Defaults to false, which means default width and height will be used. Setting format will override the full-page PDF feature. (See list of format options below)

- `--width=<string>`, `-w=<string>`
Paper width, accepts values labeled with units. Defaults to 250mm. 

- `--height=<string>`, `-h=<string>`
Paper height, accepts values labeled with units. Setting height will override the full-page PDF feature. 

- `--marginTop=<string>`, `--mt=<string>` (note: 2 dashes)
Top margin, accepts values labeled with units. Defaults to 6.35mm. 

- `--marginRight=<string>`, `--mr=<string>` (note: 2 dashes)
Right margin, accepts values labeled with units. Defaults to 6.35mm. 

- `--marginBottom=<string>`, `--mb=<string>` (note: 2 dashes)
Bottom margin, accepts values labeled with units. Defaults to 14.11mm. 

- `--marginLeft=<string>`, `--ml=<string>` (note: 2 dashes)
Left margin, accepts values labeled with units. Defaults to 6.35mm. 

- `--margins=<string>`, `-m=<string>`
Shorthand margin all sides, accepts values labeled with units. You can combine this with marginTop, marginRight, marginBottom, marginLeft. `$ pdf --margin=1mm --marginLeft=5mm` will generate 5mm margin left, and 1mm margin on the other sides. Order does not matter. 

# Units
All possible units are:

- px - pixel
- in - inch
- cm - centimeter
- mm - millimeter

Note: Unlabeled units are treated as `px`

# Format options:
- Letter: 8.5in x 11in
- Legal: 8.5in x 14in
- Tabloid: 11in x 17in
- Ledger: 17in x 11in
- A0: 33.1in x 46.8in
- A1: 23.4in x 33.1in
- A2: 16.5in x 23.4in
- A3: 11.7in x 16.5in
- A4: 8.27in x 11.7in
- A5: 5.83in x 8.27in

# Commands
Boolean options without the boolean will be true. For example: `-b=true` is the same as `-b`
