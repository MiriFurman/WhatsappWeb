import uuid from 'uuid';
import gravatar from 'gravatar';

let contacts = {};

const toContactDto = ({id, name, imageUrl, status}) => ({id, name, imageUrl, status});
const findByName = name => Object.values(contacts).find(contact => contact.name.toLowerCase() === name.toLowerCase());
const reset = () => contacts = {};
const list = () => Object.values(contacts).map(toContactDto);
const create = ({name, ...rest}) => {
  if (!name) {
    throw new Error('A girl has no name');
  }
  const existingContact = findByName(name);
  if (existingContact) {
    return existingContact;
  }

  let imageUrl = 'https://placeimg.com/60/60/animals';

  if (name.includes('@')) {
    imageUrl = gravatar.url(name);
  }

  const newContact = {
    name,
    ...rest,
    imageUrl,
    id: uuid.v4()
  };

  contacts[newContact.id] = newContact;
  return toContactDto(newContact);
};

const getById = contactId => contacts[contactId];
const authenticate = user => {
  const contactDTO = findByName(user.username);
  if (!contactDTO) {
    return null;
  }
  const contact = getById(contactDTO.id);
  if (!contact) {
    return null;
  }
  return contact.password === user.password ? contactDTO : null;

};

export const contactsService = {
  list,
  create,
  getById,
  reset,
  authenticate
};
