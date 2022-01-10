/*
IBusinessAccountSettings.ts
Description: Interfaces for the BusinessAccountSettings dynamodb model are declared to enforce types on the data passed to it.
Use Cases: BusinessAccountSettings property type-checking
*/

interface IWeekDayBusinessHours {
    isOperatingThisDay?: boolean;
    openHour: number;
    openMinutes: number;
    closeHour: number;
    closeMinutes: number;
}

/**
 * IBusinessAccountSettings defines the structure of the database schema for
 * business account settings
 */
export default interface IBusinessAccountSettings {
    supportedOrderFulfillmentOptions?: {
        pickup?: boolean,
        delivery?: boolean,
        dineIn?: boolean
    };
    weeklyHours?: {
        sunday?: IWeekDayBusinessHours,
        monday?: IWeekDayBusinessHours,
        tuesday?: IWeekDayBusinessHours,
        wednesday?: IWeekDayBusinessHours,
        thursday?: IWeekDayBusinessHours,
        friday?: IWeekDayBusinessHours,
        saturday?: IWeekDayBusinessHours
    };
    isOpenForBusiness?: boolean;
}