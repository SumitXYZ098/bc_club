/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ListingsApiResponse {
  success: boolean;
  status: number;
  bundle: PropertyListing[];
}
export interface PropertyListing {
  ListingKey: string;
  ListingId: string;

  PropertyType: string;
  PropertySubType?: string;

  MlsStatus: string;
  StandardStatus: string;

  ListPrice: number;
  OriginalListPrice?: number;
  PreviousListPrice?: number;

  DaysOnMarket?: number;

  StreetNumber?: string;
  StreetName?: string;
  UnitNumber?: string;

  City?: string;
  StateOrProvince?: string;
  PostalCode?: string;

  UnparsedAddress?: string;

  Latitude?: number;
  Longitude?: number;

  BedroomsTotal?: number;
  BathroomsFull?: number;
  BathroomsHalf?: number;
  BathroomsTotalInteger?: number;

  LivingArea?: number;
  LotSizeAcres?: number;
  LotSizeSquareFeet?: number;

  YearBuilt?: number;

  GarageSpaces?: number;
  ParkingTotal?: number;

  AssociationFee?: number;

  TaxAnnualAmount?: number;
  TaxYear?: number;

  ListAgentFullName?: string;
  ListAgentFirstName?: string;
  ListAgentLastName?: string;

  ListOfficeName?: string;

  PublicRemarks?: string;
  PrivateRemarks?: string;

  Media?: Media[];

  Coordinates?: number[];

  url?: string;

  // allow other Bridge fields without typing everything
  [key: string]: any;
}

export interface Media {
  MediaURL: string;
  MediaObjectID: string;
  Order: number;
  MimeType: string;
  ShortDescription?: string;
  MediaCategory: string;
  ResourceRecordKey: string;
  ResourceName: string;
  ClassName: string;
}
