export interface User {
    id: string;
    username?: string;
    preferred_username?: string;
    email: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    email_verified?: boolean;
    idps?: string[];
}

export interface ClientSession {
    clientId: string;
    clientName: string;
    userConsentRequired: boolean;
    inUse: boolean;
    offlineAccess: boolean;
}

export interface Session {
    id: string;
    ipAddress: string;
    started: number;
    lastAccess: number;
    expires: number;
    clients: ClientSession[];
    browser: string;
    current: boolean;
}

export interface DeviceSession {
    os: string;
    osVersion: string;
    device: string;
    lastAccess: number;
    current: boolean;
    sessions: Session[];
    mobile: boolean;
}

export interface LinkedAccount {
    connected: boolean;
    providerAlias: string;
    displayName: string;
    social: boolean;
    providerName: string;
}

export interface CredentialMetadata {
    credential: {
        id: string;
        type: string;
        createdDate: number;
        userLabel?: string;
    };
}

export interface CredentialCategory {
    type: string;
    category: string;
    displayName: string;
    helptext: string;
    iconCssClass: string;
    createAction?: string;
    updateAction?: string;
    removeable: boolean;
    userCredentialMetadatas: CredentialMetadata[];
}
