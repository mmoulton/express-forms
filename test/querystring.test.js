
/**
 * Module dependencies.
 */

var qs = require('../lib/querystring'),
    should = require('should');

module.exports = {
  'test basics': function(){
    qs.parse('0=foo').should.eql({ '0': 'foo' });

    qs.parse('foo=c++')
      .should.eql({ foo: 'c  ' });

    qs.parse('a.>==23')
      .should.eql({ a: { '>': '=23' }});

    qs.parse('a.<=>==23')
      .should.eql({ a: { '<': '>==23' }});

    qs.parse('a.>===23')
      .should.eql({ a: { '>': '==23' }});

    qs.parse('foo')
      .should.eql({ foo: '' });

    qs.parse('foo=bar')
      .should.eql({ foo: 'bar' });

    qs.parse('foo%3Dbar=baz')
      .should.eql({ foo: 'bar=baz' });

    qs.parse(' foo = bar = baz ')
      .should.eql({ ' foo ': ' bar = baz ' });

    qs.parse('foo=bar=baz')
      .should.eql({ foo: 'bar=baz' });

    qs.parse('foo=bar&bar=baz')
      .should.eql({ foo: 'bar', bar: 'baz' });

    qs.parse('foo=bar&baz')
      .should.eql({ foo: 'bar', baz: '' });

    qs.parse('cht=p3&chd=t:60,40&chs=250x100&chl=Hello|World')
      .should.eql({
          cht: 'p3'
        , chd: 't:60,40'
        , chs: '250x100'
        , chl: 'Hello|World'
      });
  },
  
  'test nesting': function(){
//    qs.parse('ops.>==25')
//      .should.eql({ ops: { '>=': '25' }});

    qs.parse('user.name=tj')
      .should.eql({ user: { name: 'tj' }});

    qs.parse('user.name.first=tj&user.name.last=holowaychuk')
      .should.eql({ user: { name: { first: 'tj', last: 'holowaychuk' }}});
  },
  
  'test escaping': function(){
    qs.parse('foo=foo%20bar')
      .should.eql({ foo: 'foo bar' });
  },
  
  'test arrays': function(){
    qs.parse('images[]')
      .should.eql({ images: [] });

    qs.parse('user[]=tj')
      .should.eql({ user: ['tj'] });

    qs.parse('user[]=tj&user[]=tobi&user[]=jane')
      .should.eql({ user: ['tj', 'tobi', 'jane'] });

    qs.parse('user.names[]=tj&user.names[]=tyler')
      .should.eql({ user: { names: ['tj', 'tyler'] }});

    qs.parse('user.names[]=tj&user.names[]=tyler&user.email=tj@vision-media.ca')
      .should.eql({ user: { names: ['tj', 'tyler'], email: 'tj@vision-media.ca' }});
  },

  'test duplicates': function(){
    qs.parse('items=bar&items=baz&items=raz')
      .should.eql({ items: ['bar', 'baz', 'raz'] });
  },

  'test empty': function(){
    qs.parse('').should.eql({});
    qs.parse(undefined).should.eql({});
    qs.parse(null).should.eql({});
  },

  'test arrays': function(){
    qs.parse('people.users[]=Mike')
      .should.eql({
        people: { users: [ 'Mike' ] }
      });

    qs.parse('people.users[0]=Mike')
      .should.eql({
        people: { users: [ 'Mike' ] }
      });

    qs.parse('people.users[]=Mike&people.users[]=Nick')
      .should.eql({
        people: { users: [ 'Mike', 'Nick' ] }
      });

    qs.parse('people.users[0]=Mike&people.users[1]=Nick')
      .should.eql({
        people: { users: [ 'Mike', 'Nick' ] }
      });

    qs.parse('people.users[0]=Mike&people.users[2]=Nick')
      .should.eql({
        people: { users: [ 'Mike',, 'Nick' ] }
      });
  },
  
  'test complex': function(){
    qs.parse('users[0].name=tj&users[0].email=test@test.com')
      .should.eql({
        users: [ { name: 'tj', email: 'test@test.com' }]
      });

    qs.parse('users[0].name=tj&users[0].email=test@test.com&users[1].name=mike')
      .should.eql({
        users: [ { name: 'tj', email: 'test@test.com' }, { name: 'mike'} ]
      });

    qs.parse('users[0].name=tj&users[0].email=test@test.com&users[2].name=mike')
      .should.eql({
        users: [ { name: 'tj', email: 'test@test.com' },, { name: 'mike'} ]
      });

    qs.parse('users[].name.first=tj&users[].name.first=tobi')
      .should.eql({
        users: [ { name: { first: 'tj' } }, { name: { first: 'tobi' }}]
      });
  }
};
