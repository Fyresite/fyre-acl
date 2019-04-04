module.exports = {
    group: 'guest',
    permissions: [
      {
        resource: 'user/profile',
        methods: ['GET','PUT'],
        action: 'allow'
      },
      {
        resource: 'user/summery',
        methods: ['GET','PUT'],
        action: 'deny'
      },
      {
        resource: 'user/summery',
        methods: ['POST'],
        action: 'allow'
      },
      {
        resource: 'event/*',
        methods: '*',
        action: 'allow',
      },
      {
        resource: 'event/*/pie/*/mike',
        methods: '*',
        action: 'deny'
      },
      {
        resource: 'test/#',
        methods: '*',
        action: 'allow'
      },
    ]
  }