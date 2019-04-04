const acl = require('../lib')
const roles = require('./roles')

acl.config({
    roles: roles,
    baseUrl: 'v1',
    defaultRole: 'unauthorized',
    decodedObjectName: 'user',
    roleSearchPath: 'user.role'
})

test('exact path allow', () => {
    expect(acl.evaluateRules('guest', 'v1/user/profile', 'GET')).toBe(true)
    expect(acl.evaluateRules('guest', 'v1/user/profile', 'PUT')).toBe(true)
    expect(acl.evaluateRules('guest', 'v1/user/profile', 'POST')).toBe(false)
})
test('exact path deny', () => {
    expect(acl.evaluateRules('guest', 'v1/user/summery', 'GET')).toBe(false)
    expect(acl.evaluateRules('guest', 'v1/user/summery', 'PUT')).toBe(false)
    expect(acl.evaluateRules('guest', 'v1/user/summery', 'POST')).toBe(true)
})
test('relative multi match', () => {
    expect(acl.evaluateRules('guest', 'v1/event/summery/pie', 'GET')).toBe(true)
    expect(acl.evaluateRules('guest', 'v1/event/milk/pie', 'PUT')).toBe(true)
    expect(acl.evaluateRules('guest', 'v1/event/man/pie', 'POST')).toBe(true)
    expect(acl.evaluateRules('guest', 'v1/event/man/bite', 'POST')).toBe(true)
    expect(acl.evaluateRules('guest', 'v1/event/man', 'POST')).toBe(true)
    expect(acl.evaluateRules('guest', 'v1/event/pie/man', 'POST')).toBe(true)
    expect(acl.evaluateRules('guest', 'v1/event/fyre/pie/man/mike', 'POST')).toBe(false)
})
test('# wildcard match', () => {
    expect(acl.evaluateRules('guest', 'v1/test/234', 'POST')).toBe(true)
    expect(acl.evaluateRules('guest', 'v1/test/mike', 'POST')).toBe(false)
})

