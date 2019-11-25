# google-spreadsheet-ui-extension
A Contentful UI Extension that populates a dropdown from a google spreadsheet.
It was developed using the Contentful [create-contentful-extension](https://github.com/contentful/create-contentful-extension)

You will need to have the following completed to use this UI extension.

### Contentful

- A space to use the widget and the space id.
- An google spreadsheet ID - the spreadsheet needs to be either public or you need to add authentication with Google Sheets API https://developers.google.com/sheets/api/guides/concepts

### Local machine

- The [contentful cli](https://github.com/contentful/contentful-cli) for uploading extensions to Contentful.
- [npm](https://www.npmjs.com/) installed and configured for dependencies management.
- [gulp](http://gulpjs.com/) for building some samples.

## Preparation steps

You can manage your extensions using the [Contentful CLI](https://github.com/contentful/contentful-cli):

```bash
contentful login
```

## Debugging on your local environment

As the Contentful web app is served over HTTPS but your local machine is likely HTTP, you will need to enable access to insecure content.

Read how to do that in [Firefox][ff-mixed] and [Chrome][chrome-mixed].

[chrome-mixed]: https://support.google.com/chrome/answer/1342714
[ff-mixed]: https://support.mozilla.org/en-US/kb/mixed-content-blocking-firefox
