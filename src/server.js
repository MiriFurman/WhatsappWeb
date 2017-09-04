import 'babel-polyfill';
import wixRenderer from 'wix-renderer';
import wixRunMode from 'wix-run-mode';
import wixExpressRenderingModel from 'wix-express-rendering-model';
import wixExpressCsrf from 'wix-express-csrf';
import wixExpressRequireHttps from 'wix-express-require-https';
import {contactsService} from './server/services/ContactsService';
import {conversationsService} from './server/services/ConversationsService';
import bodyParser from 'body-parser';
import {
  GET_RELATIONS, SEND_MESSAGE, GET_CONVERSATION_BY_ID, FLUSH,
  CONTACTS, LOGIN, SIGNUP, CREATE_GROUP
} from './common/endpoints';

module.exports = (app, context) => {
  const config = context.config.load('shilo-miri-salaverry-sms');

  app.use(wixExpressCsrf());
  app.use(wixExpressRequireHttps);
  app.use(bodyParser.json());

  app.get('/', wrapAsync(async (req, res) => {
    const templatePath = './src/index.ejs';
    const data = {title: 'Wazzap Chat'};
    const renderModel = await wixExpressRenderingModel.generate(req, config);
    const html = await wixRenderer.render(templatePath, renderModel, data, wixRunMode.isProduction());
    res.send(html);
  }));

  app.post(LOGIN, wrapAsync(async (req, res) => {
    const {user} = req.body;
    res.json(contactsService.authenticate(user));
  }));

  app.get(CONTACTS, wrapAsync(async (req, res) => {
    res.json(contactsService.list());
  }));

  app.post(FLUSH, wrapAsync(async (req, res) => {
    contactsService.reset();
    conversationsService.reset();
    res.end();
  }));

  app.post(SEND_MESSAGE, wrapAsync(async (req, res) => {
    const {from, members, messageBody} = req.body;
    const conversationId = conversationsService.addMessage({from, members, messageBody});
    res.json(conversationId);
  }));

  app.get(GET_RELATIONS, wrapAsync(async (req, res) => {
    const {userId} = req.query;
    const relations = {
      conversations: conversationsService.listConversationsByContactId(userId),
      contacts: contactsService.list()
    };
    res.json(relations);
  }));

  app.get(GET_CONVERSATION_BY_ID, wrapAsync(async (req, res) => {
    const {conversationId} = req.query;
    const conversation = conversationsService.getMessagesById(conversationId);
    res.json(conversation);
  }));

  app.post(SIGNUP, wrapAsync(async (req, res) => {
    const {user} = req.body;
    await contactsService.create({name: user.username, password: user.password, imgUrl: user.imgUrl});
    res.end();
  }));

  app.post(CREATE_GROUP, wrapAsync(async (req, res) => {
    const {members, displayName, imgUrl} = req.body;
    const conversationId = conversationsService.createGroup({members, displayName, imgUrl});
    res.json(conversationId);
  }));

  app.get('*', wrapAsync(async (req, res) => {
    const templatePath = './src/index.ejs';
    const data = {title: 'Wazzap Chat'};
    const renderModel = await wixExpressRenderingModel.generate(req, config);
    const html = await wixRenderer.render(templatePath, renderModel, data, wixRunMode.isProduction());
    res.send(html);
  }));

  return app;
};

function wrapAsync(asyncFn) {
  return (req, res, next) => asyncFn(req, res, next).catch(next);
}
