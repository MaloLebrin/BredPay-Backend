export enum Role {
    Admin = "Admin",
    User = "User",
    Company = "Company",
}
export interface Roles {
    [Role.Admin] : string;
    [Role.User] : string;
    [Role.Company]: string;
}
