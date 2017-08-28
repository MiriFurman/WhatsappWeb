import 'babel-polyfill';
import wixRenderer from 'wix-renderer';
import wixRunMode from 'wix-run-mode';
import wixExpressRenderingModel from 'wix-express-rendering-model';
import wixExpressCsrf from 'wix-express-csrf';
import wixExpressRequireHttps from 'wix-express-require-https';
import {contactsService} from './server/services/ContactsService';
import bodyParser from 'body-parser';

module.exports = (app, context) => {
  const config = context.config.load('shilo-miri-salaverry-sms');

  app.use(wixExpressCsrf());
  app.use(wixExpressRequireHttps);
  app.use(bodyParser.json());

  app.get('/', wrapAsync(async (req, res) => {
    const templatePath = './src/index.ejs';
    const data = {title: 'Wix Full Stack Project Boilerplate'};

    const renderModel = await wixExpressRenderingModel.generate(req, config);
    const html = await wixRenderer.render(templatePath, renderModel, data, wixRunMode.isProduction());

    res.send(html);
  }));

  app.post('/api/login', wrapAsync(async (req, res) => {
    contactsService.create({name: req.body.username});
    res.end();
  }));

  app.get('/api/contacts', wrapAsync(async (req, res) => {
    res.json(contactsService.list());
  }));

  app.post('/api/flush', wrapAsync(async (req, res) => {
    contactsService.reset();
    res.end();
  }));

  return app;
};

function wrapAsync(asyncFn) {
  return (req, res, next) => asyncFn(req, res, next).catch(next);
}
