'use strict';
const path = require('path')
const dot = require('dot-object')

var options = {
    roles: {},
    decodedObjectName: 'user',
    roleSearchPath: 'user.role',
    baseUrl: '',
    defaultRole: 'unauthorized',
    inclusiveMatching: false
}

var isNumber = /^([0-9])+$/;

function config(conf) {
    Object.assign(options, conf);
    if (options.baseUrl[0] === '/') {
        options.baseUrl = options.baseUrl.replace('/', '')
    }
}

function evaluateRules(roleName, resource, method, params = {}) {
    let isAllowed = false
    let role = options.roles[roleName]
    for (let i = 0; i < role.permissions.length; i++) {
        let permission = role.permissions[i]
        if ((permission.methods instanceof Array) && !permission.methods.includes(method)) {
            continue;
        }
        else if (!(permission.methods instanceof Array) && (permission.methods !== '*' && permission.methods !== method)) {
            continue;
        }
        let resourceMatch = matchResource(path.join(options.baseUrl, permission.resource), resource)
        if (resourceMatch !== ReturnValues.NoMatch) {
            isAllowed = (permission.action === 'allow') ? true : false
            if (resourceMatch === ReturnValues.ExactMatch) {
                break;
            }
        }
    }
    return isAllowed
}

const ReturnValues = {
    NoMatch: 0,
    ExactMatch: 1,
    RelativeMatch: 2
}
function matchResource(resourceRule, incomingResource) {
    let resourceArray = incomingResource.split('/')
    let ruleArray = resourceRule.split('/')
    if (resourceArray.length < ruleArray.length && !options.inclusiveMatching) {
        return ReturnValues.NoMatch
    }
    let forceRelative = false
    for (let i = 0; i < resourceArray.length; i++) {
        let rule = ruleArray[i]
        let resource = resourceArray[i]

        if (rule === '*') {
            if (i === ruleArray.length - 1) {
                return ReturnValues.RelativeMatch
            } else {
                forceRelative = true
                continue;
            }
        } else if (rule === '#') {
            if (!resource.match(isNumber)) {
                return ReturnValues.NoMatch
            }
            if (i === ruleArray.length - 1) {
                return ReturnValues.RelativeMatch
            } else {
                forceRelative = true
                continue;
            }
        }

        if (rule !== resource) {
            return ReturnValues.NoMatch
        }

    }
    if (forceRelative) {
        return ReturnValues.RelativeMatch
    }
    return ReturnValues.ExactMatch
}

function authorize(req, res, next) {
    let decodedObject = req[options.decodedObjectName]
    let role = dot.pick(options.roleSearchPath, decodedObject)
    if (!role) {
        role = options.defaultRole
    }
    let route = req.path.replace('/', '')
    if (route[route.length-1] === '/') {
        route = route.slice(0, -1)
    }
    if (evaluateRules(role, route, req.method, req.params)) {
        next()
    } else {
        res.status(403).json({
            message: 'Forbidden'
        })
    }
}

module.exports = {
    authorize,
    config,
    options,
    evaluateRules
}