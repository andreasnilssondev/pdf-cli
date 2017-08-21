#!/usr/bin/env node

const fs = require('fs');
const puppeteer = require('puppeteer');
const fileUrl = require('file-url');
const inquirer = require('inquirer');
const dateFormat = require('dateformat');
const ProgressBars = require('multi-progress')(process.stderr);
const options = require('yargs-parser')(process.argv.slice(2));

const pdfOptions = {
  path: options.url || options.u || false,
  scale: options.scale || options.s || 1,
  displayHeaderFooter: options.displayHeaderFooter || options.d || true,
  printBackground: options.printBackground || options.b || true,
  landscape: options.landscape || options.l || false,
  pageRanges: options.pageRanges || options.p || '',
  format: options.format || options.f || false,
  width: options.width || options.w || '250mm',
  height: options.height || options.h || false,
  marginTop: options.marginTop || options.mt || options.margin || options.m || '6.35mm',
  marginRight: options.marginRight || options.mr || options.margin || options.m || '6.35mm',
  marginBottom: options.marginBottom || options.mb || options.margin || options.m || '14.11mm',
  marginLeft: options.marginLeft || options.ml || options.margin || options.m || '6.35mm',
};

function isHtml(filename) {
  return filename.includes('.html');
}

function isLocalFile() {
  return !(pdfOptions.path && pdfOptions.path.match(/https?:\/\//g));
}

function createFilename({ filename }) {
  if (pdfOptions.path) {
    return `${dateFormat(new Date(), 'yyyy-mm-dd_HH-MM-ss')}.pdf`;
  }

  if (options.overwrite || options.o) {
    return filename;
  }

  const timestamp = dateFormat(new Date(), 'yyyy-mm-dd_HH-MM-ss');
  return filename.replace('.html', `_${timestamp}.pdf`);
}

function mergeOptions({ path, height }) {
  return Object.assign({}, pdfOptions, {
    path,
    height: pdfOptions.height || height,
  });
}

async function createPdf({ filename, browser }) {
  const filenamePdf = createFilename({ filename });
  const bar = ProgressBars.newBar(`[:bar] :percent ${filenamePdf}`, { total: 20 });
  const url = isLocalFile() ? fileUrl(filename) : pdfOptions.path;

  const page = await browser.newPage();
  bar.tick(5);

  // TODO:
  // await page.emulateMedia('screen'); // Available next puppeteer release
  // bar.tick(4); // change all others to 4 as well

  await page.goto(url, { waitUntil: 'networkidle' });
  bar.tick(5);

  const height = await page.evaluate(() => Math.ceil(document.body.getBoundingClientRect().height));
  bar.tick(5);

  await page.pdf(mergeOptions({ path: filenamePdf, height }));
  bar.tick(5);
}

async function selectFiles({ filenames }) {
  const inquirerData = [
    {
      type: 'checkbox',
      name: 'fileList',
      message: 'Choose which files to create PDFs from',
      choices: filenames,
    },
  ];

  const answers = await inquirer.prompt(inquirerData);
  return answers.fileList;
}

async function init() {
  const browser = await puppeteer.launch();
  let filenames = fs.readdirSync(process.cwd()).filter(isHtml);

  if (!options.all && !options.a && !pdfOptions.path) {
    filenames = await selectFiles({ filenames });
  }

  if (pdfOptions.path) {
    filenames = [pdfOptions.path];
  }

  if (!filenames.length) {
    console.log('No html files found/selected');
    process.exit();
  }

  console.log('Creating PDFs...');
  await Promise.all(filenames.map(filename => createPdf({ filename, browser })));
  browser.close();
}

init();
