/*
defaultBusinessAccountSettings.ts
Description: Contains the default data that dynamodb will use for business account settings models.
Use cases: default values upon initializing business account settings, unit testing default init
*/

const defaultWeekDayHours = {
    isOperatingThisDay: true,
    openHour: 0,
    openMinutes: 0,
    closeHour: 23,
    closeMinutes: 59
};

const defaultWeeklyHours = {
    sunday: defaultWeekDayHours,
    monday: defaultWeekDayHours,
    tuesday: defaultWeekDayHours,
    wednesday: defaultWeekDayHours,
    thursday: defaultWeekDayHours,
    friday: defaultWeekDayHours,
    saturday: defaultWeekDayHours
};

const defaultSupportedOrderFulfillmentOptions = {
    mayPickup: true,
    mayDeliver: false,
    mayDineIn: false
};

export { defaultWeekDayHours, defaultWeeklyHours, defaultSupportedOrderFulfillmentOptions };