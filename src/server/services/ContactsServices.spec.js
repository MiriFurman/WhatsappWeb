import {expect} from 'chai';
import {contactsService} from './ContactsService';

describe('Contacts Service', () => {
  beforeEach(() => {
    contactsService.reset();
  });

  describe('basic usage', () => {
    it('should list empty contacts', () => {
      const contactList = contactsService.list();
      expect(contactList).to.eql([]);
    });

    it('should allow to create a contact', () => {
      const contact = contactsService.create({name: 'Bob'});
      const contactList = contactsService.list();

      expect(contactList.length).to.eql(1);
      expect(contact.name).to.equal('Bob');
    });

    it('should reset contacts', () => {
      contactsService.create({name: 'Bob'});
      contactsService.reset();
      const contactList = contactsService.list();

      expect(contactList).to.eql([]);
    });
  });

  describe('creating contacts', () => {
    it('should create an id to a new contact', () => {
      contactsService.create({name: 'Bob'});
      const contactList = contactsService.list();

      expect(contactList[0].name).to.eql('Bob');
      expect(contactList[0]).to.include.all.keys('id', 'name');
    });

    it('should create a unique id to each contact', () => {
      contactsService.create({name: 'Bob'});
      contactsService.create({name: 'Marley'});
      const contactList = contactsService.list();

      expect(contactList.length).to.equal(2);
      expect(contactList[0].id).to.not.equal(contactList[1].id);
    });

    it('should not create a contact with an empty name', () => {
      let thrown = false;
      try {
        contactsService.create({name: ''});
      } catch (e) {
        thrown = true;
      }

      const contactList = contactsService.list();
      expect(contactList.length).to.equal(0);
      expect(thrown).to.equal(true);
    });

    it('should not create a contact with an existing name', () => {
      contactsService.create({name: 'Bob'});
      contactsService.create({name: 'Bob'});
      const contactList = contactsService.list();

      expect(contactList.length).to.equal(1);
    });

    it('should not create a contact with an existing name case insensitive', () => {
      contactsService.create({name: 'Bob'});
      contactsService.create({name: 'bob'});
      const contactList = contactsService.list();

      expect(contactList.length).to.equal(1);
    });
  });

  describe('ContactDTO', () => {
    it('should get only id, name, imageUrl & status when creating a contact', () => {
      const contact = contactsService.create({name: 'Ernie', status: 'alive', password: '12345'});

      expect(contact).to.have.all.keys('name', 'id', 'imageUrl', 'status');
      expect(contact).to.not.include.all.keys('password');
    });

    it('should get only id, name, imageUrl & status when listing contacts', () => {
      contactsService.create({name: 'Ernie', status: 'alive', password: '12345'});
      const contactList = contactsService.list();

      expect(contactList[0]).to.have.all.keys('name', 'id', 'imageUrl', 'status');
      expect(contactList[0]).to.not.include.all.keys('password');
    });
  });

  it('should get undefined by id when user does not exist', () => {
    expect(contactsService.getById('1234')).to.be.undefined;
  });

  it('should get contact by id', () => {
    const contact = contactsService.create({name: 'Bob'});
    expect(contactsService.getById(contact.id)).to.eql({name: 'Bob', id: contact.id});
  });
});
