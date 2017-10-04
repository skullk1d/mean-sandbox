// this should match the model of our backend service's list model
export interface List {
    _id?: string;
    description?: string;
    ownerId: string;
    coffees: string[]
};
