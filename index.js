'use strict';
const path = require('path')

let options = {
    roles: {test},
    decodedObjectName: 'user',
    roleSearchPath: 'user.role'
}

function config(conf) {
    options = Object.assign({}, options, conf);
}

function evaluateRules(roleName, resource, method) {
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
        let resourceMatch = matchResource(permission.resource, resource)
        if (resourceMatch !== ReturnValues.NoMatch) {
            isAllowed = permission.action === 'allow' ? true : false 
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
    if (resourceArray.length < ruleArray.length) {
        return ReturnValues.NoMatch
    }
    for (let i = 0; i < resourceArray.length; i++) {
        let rule = ruleArray[i]
        let resource = resourceArray[i]

        if (rule === '*') {
            return ReturnValues.RelativeMatch
        }

        if (rule !== resource) {
            return ReturnValues.NoMatch
        }

    }
    return ReturnValues.ExactMatch
}

function authorize(req, res, next) {
    let role = req[options.decodedObjectName]
    if (evaluateRules(dot.pick(options.roleSearchPath, role), req.path.replace('/', ''),req.method)) {
        
    }
}