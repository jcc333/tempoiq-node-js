'use strict';

function Rule(name, key, selection, conditions, actions, status) {
    this.name = name;
    this.key = key;
    this.selection = selection;
    this.conditions = conditions || [];
    this.actions = actions || [];
    this.status = status || 'active';
}

function Trigger(name, args) {
    this.name = name;
    this.args = args || [];
}

function Condition(filter, trigger) {
    this.filter = filter;
    this.trigger = trigger;
}

function AndFilter() {
    this.and = arguments;
}

function Filter(operation, type, args) {
    this.operation = operation;
    this.type = type;
    this.args = args;
}

function Webhook(url) {
    this.url = url;
}

function Email(address) {
    this.address = address;
}

function earlyAccessRule(name, sensorKey, comparator, threshold, address, deviceAttribute) {
    selection = {devices: {}, sensors: {}};
    if (typeof(deviceAttribute) === "string") {
        selection.devices.attribute_key = deviceAttribute;
    } else if (typeof(deviceAttribute) != "undefined") {
        selection.devices.attributes = deviceAttribute;
    }
    var filter = new Filter("select", "sensor_key", sensorKey);
    var trigger = new Trigger("value", ["static", comparator, threshold]);
    var conditions = [new Condition([filter], trigger)]
    var email = new Email(address)
    return new {
        search: {
            select: 'devices',
            filters: selection
        },
        rule: Rule(name, 'devices', conditions, actions = [email]),
        alerts = 'devices'
    };
}

module.exports = {
    earlyAccessRule: earlyAccessRule,
    Query: Query,
    Email: Email,
    Webhook: Webhook,
    Filter: Filter,
    AndFilter: AndFilter,
    Trigger: Trigger,
    Condition: Condition
};

